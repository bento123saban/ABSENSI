// import { ApexDB } from './bendhard16.js';
// import { baseURL } from './config.js'; // Pastikan base URL lu sama

const baseURL = "https://maku.dlhpambon2025.workers.dev"
const syncChannel = new BroadcastChannel('apex_sync_channel');

// 1. Menerima request "darurat" dari UI
syncChannel.onmessage = async (event) => {
    if (event.data.type === 'QUEUE_REQUEST') {
        const { payload } = event.data;
        // Simpan ke DB dengan status 'pending'
        await ApexDB.set('offline_requests', { ...payload, status: 'pending' });
        
        // Daftarkan ke sistem Background Sync OS
        try {
            await self.registration.sync.register('apex-sync-task');
            console.log("[SW] Task berhasil didaftarkan ke OS sync");
        } catch (err) {
            console.error("[SW] Gagal daftar sync:", err);
        }
    }
};

// 2. Logic "Auto-Drain" (Dipanggil oleh OS saat sinyal stabil)
self.addEventListener('sync', (event) => {
    if (event.tag === 'apex-sync-task') {
        event.waitUntil(processQueue());
    }
});

async function processQueue() {
    const queue = await ApexDB.getAll('offline_requests');
    const pendingTasks = queue.filter(t => t.status === 'pending');

    for (const task of pendingTasks) {
        try {
            const response = await fetch(`${baseURL}${task.url}`, {
                method: task.method,
                headers: { 
                    ...task.options.headers, 
                    'Idempotency-Key': task.requestId 
                },
                body: JSON.stringify(task.data)
            });

            if (response.ok) {
                // Sukses! Hapus dari DB
                await ApexDB.delete('offline_requests', task.id);
                // Teriak ke UI kalau sukses
                syncChannel.postMessage({ type: 'TASK_SUCCESS', id: task.id });
            } else {
                throw new Error("Server menolak");
            }
        } catch (err) {
            console.warn("[SW] Gagal sync, OS akan retry nanti...");
            throw err; // Lempar error biar OS tahu harus retry di lain waktu
        }
    }
}

export class ApexDB {
    static dbName = "DLHP_Ambon_LocalData";
    static dbVersion = 1;
    static dbInstance = null;

    static get migrations() {
        return {
            // VERSI 1: Fondasi Awal Aplikasi Diluncurkan
            1: (db, tx) => {
                if (!db.objectStoreNames.contains('reports')) {
                    db.createObjectStore('reports', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('workers')) {
                    db.createObjectStore('workers', { keyPath: 'id' });
                }
                console.log("Migration V1: Jalur database awal berhasil diinstansiasi.");
            },

            // VERSI 2: Tambah Tabel Baru, Tambah Indeks Pencarian Baru, Hapus Tabel Usang
            2: (db, tx) => {
                // A. Membuat Object Store Baru (Misal untuk sistem inventaris MAKU)
                if (!db.objectStoreNames.contains('inventory')) {
                    db.createObjectStore('inventory', { keyPath: 'itemId', autoIncrement: true });
                }

                // B. Menyuntikkan Indeks Pencarian Baru ke Tabel Lama ('reports')
                const reportStore = tx.objectStore('reports');
                if (!reportStore.indexNames.contains('idx_status_wilayah')) {
                    // Membuat gabungan indeks (Compound Index) untuk filter super cepat
                    reportStore.createIndex('idx_status_wilayah', ['status', 'wilayahTugas'], { unique: false });
                }

                // C. Menghapus tabel lama yang sudah tidak terpakai secara aman
                if (db.objectStoreNames.contains('temporary_logs')) {
                    db.deleteObjectStore('temporary_logs');
                }
                console.log("Migration V2: Perubahan skema, tabel, dan indeks sukses.");
            },

            // VERSI 3: 🔥 SUPER ADVANCED - REFACTORING & TRANSFORMATION PROPERTI DATA LIVE
            // Kasus: Kolom 'namaLengkap' buruh mau dipecah jadi 'namaDepan' & 'namaBelakang' untuk semua data yang ada di HP
            3: (db, tx) => {
                const workerStore = tx.objectStore('workers');

                // Buka database live di background menggunakan Cursor saat proses upgrade berjalan
                workerStore.openCursor().onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const record = cursor.value;

                        // Transformasi Properti Object Secara Agresif:
                        if (record.namaLengkap && !record.namaDepan) {
                            const namaPotongan = record.namaLengkap.trim().split(/\s+/);
                            
                            record.namaDepan = namaPotongan[0];
                            record.namaBelakang = namaPotongan.slice(1).join(' ') || '';
                            
                            // Hapus properti lama agar storage bersih dan hemat ruang
                            delete record.namaLengkap; 

                            // Suntik balik data yang sudah bermigrasi ke dalam IndexedDB
                            cursor.update(record);
                        }
                        cursor.continue(); // Lanjutkan ke baris data berikutnya
                    }
                };
                console.log("Migration V3: Transformasi struktur properti internal objek berhasil diproses.");
            }
        };
    }

    // =========================================================================
    // 🔒 CORE CONNECTION ENGINE (Aman dari Race-Condition & Gagal Upgrade)
    // =========================================================================
    static async connect() {
        if (this.dbInstance) return this.dbInstance;

        return new Promise((resolve, reject) => {
            console.log(`Membuka koneksi database... Target Versi Sistem: ${this.dbVersion}`);
            const request = indexedDB.open(this.dbName, this.dbVersion);

            // Dipicu OTOMATIS oleh browser jika versi lokal lebih rendah dari static dbVersion
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                const transaction = request.transaction; // Transaksi 'versionchange' bawaan browser
                const oldVersion = e.oldVersion;
                const newVersion = e.newVersion;

                console.warn(`[DATABASE UPGRADE DETECTED] Mengupgrade dari V${oldVersion} menuju V${newVersion}`);

                // Pipa Eksekusi Berantai (Incremental Pipeline Execution)
                for (let v = oldVersion + 1; v <= newVersion; v++) {
                    if (typeof this.migrations[v] === 'function') {
                        try {
                            // Jalankan skrip spesifik versi tersebut
                            this.migrations[v](db, transaction);
                        } catch (migrationError) {
                            console.error(`Kritis! Migrasi gagal dieksekusi pada Versi ${v}:`, migrationError);
                            transaction.abort(); // Batalkan semua perubahan, kembalikan ke kondisi semula (Rollback)
                            reject(newError(`Migration pipeline crashed at V${v}`));
                            return;
                        }
                    }
                }
            };

            request.onsuccess = (e) => {
                this.dbInstance = e.target.result;

                // Proteksi Tambahan
                this.dbInstance.onversionchange = () => {
                    this.dbInstance.close();
                    
                    // Cek apakah kita punya akses ke 'window' (artinya kita di UI)
                    if (typeof window !== 'undefined') {
                        alert("Aplikasi diperbarui di tab lain. Halaman ini akan memuat ulang secara otomatis.");
                        window.location.reload();
                    } else {
                        // Jika di Service Worker, kita diamkan saja atau log ke console
                        console.warn("[SW] Database versi berubah, menutup koneksi...");
                    }
                };

                resolve(this.dbInstance);
            };

            request.onerror = (e) => {
                console.error("Gagal total menginisialisasi database:", e.target.error);
                reject(e.target.error);
            };
        });
    }

    // 🛠️ Helper Internal untuk mempersingkat pembuatan Transaksi Store
    static async getStore(storeName, mode = 'readonly') {
        const db = await this.connect(); // Otomatis nunggu koneksi siap
        const transaction = db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }

    // ==========================================
    // 🔥 PUBLIC API - TINGGAL PAKAI DI MANA SAJA
    // ==========================================

    // 1. Simpan atau Update Data (Upsert)
    static async set(storeName, data) {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    // 2. Ambil 1 Data berdasarkan ID
    static async get(storeName, id) {
        const store = await this.getStore(storeName, 'readonly');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    // 3. Ambil Semua Data di dalam satu Store (Tabel)
    static async getAll(storeName) {
        const store = await this.getStore(storeName, 'readonly');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    // 4. Hapus 1 Data berdasarkan ID
    static async delete(storeName, id) {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    // 5. Bersihkan seluruh isi satu Store (Kosongkan Tabel)
    static async clear(storeName) {
        const store = await this.getStore(storeName, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Advanced Enterprise Streaming Query Engine - Premium Plus Ultra Edition
     * Proteksi RAM: Menggunakan Cursor (Streaming Row-by-Row) untuk data skala besar
     * Mendukung: Deep-Nested Property Filter & Comma-Delimited Phrase Search
     */
    static async query(storeName, options = {}) {
        return new Promise((resolve, reject) => {
            const { filters = [], search = null, sortBy = null, order = 'asc' } = options;
            
            // Buffer Array: Tempat menampung data yang HANYA lolos sensor (Hemat RAM)
            const matchedRecords = [];

            // Pre-processing untuk search agar tidak dijalankan berulang-ulang di dalam loop kursor
            let queryPhrases = [];
            let searchFields = [];
            if (search && search.query) {
                queryPhrases = search.query.toLowerCase()
                    .split(',')
                    .map(phrase => phrase.trim())
                    .filter(phrase => phrase.length > 0);
                searchFields = search.fields || [];
            }

            // Buka koneksi database lokal secara asinkronus
            this.connect().then(db => {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                const cursorRequest = store.openCursor(); // Aktifkan Kursor Aliran Data

                cursorRequest.onsuccess = (event) => {
                    const cursor = event.target.result;

                    // 🔄 JIKA DATA DITEMUKAN (Kursor menunjuk ke satu baris data aktif)
                    if (cursor) {
                        const item = cursor.value;
                        let isMatch = true;

                        // 1. FILTER ENGINE EVALUATION (Aritmatika + Custom Function + Deep Path)
                        if (filters && filters.length > 0) {
                            isMatch = filters.reduce((accumulatedMatch, criterion, index) => {
                                const { field, operator, value, fn, logic = 'AND' } = criterion;
                                
                                // Gunakan evaluator sakti yang sudah diupdate di Part 1
                                const currentConditionMatch = this._evaluateCondition(item, field, operator, value, fn);

                                if (index === 0) return currentConditionMatch;

                                if (logic.toUpperCase() === 'OR') {
                                    return accumulatedMatch || currentConditionMatch;
                                } else {
                                    return accumulatedMatch && currentConditionMatch;
                                }
                            }, true);
                        }

                        // 2. SEARCH ENGINE EVALUATION (Comma-Delimited Phrase Search + Deep Path)
                        if (isMatch && queryPhrases.length > 0) {
                            isMatch = queryPhrases.every(phrase => {
                                return searchFields.some(field => {
                                    // UPDATE: Menggunakan helper _getNestedValue agar kolom pencarian bisa nested object!
                                    const fieldValue = this._getNestedValue(item, field);
                                    if (!fieldValue) return false;
                                    return String(fieldValue).toLowerCase().includes(phrase);
                                });
                            });
                        }

                        // 3. KEPUTUSAN GERBANG: Jika lolos semua sensor, masukkan ke buffer RAM
                        if (isMatch) {
                            matchedRecords.push(item);
                        }

                        // Perintahkan kursor maju 1 langkah ke baris berikutnya di disk
                        cursor.continue();
                    } 
                    // 🏁 JIKA KURSOR SUDAH MENCAPAI UJUNG DATA (Proses Aliran Selesai)
                    else {
                        // JALANKAN ENGINE SORTING (Hanya menyortir data yang berhasil lolos saja)
                        if (sortBy && matchedRecords.length > 0) {
                            matchedRecords.sort((a, b) => {
                                let valA = this._getNestedValue(a, sortBy);
                                let valB = this._getNestedValue(b, sortBy);

                                if (!(valA instanceof Date) && !isNaN(Date.parse(valA)) && isNaN(valA)) valA = new Date(valA).getTime();
                                if (!(valB instanceof Date) && !isNaN(Date.parse(valB)) && isNaN(valB)) valB = new Date(valB).getTime();

                                if (valA < valB) return order === 'asc' ? -1 : 1;
                                if (valA > valB) return order === 'asc' ? 1 : -1;
                                return 0;
                            });
                        }

                        // Kembalikan hasil akhir yang bersih dan siap saji ke UI
                        resolve(matchedRecords);
                    }
                };

                cursorRequest.onerror = (event) => {
                    console.error("Streaming cursor query error:", event.target.error);
                    reject(event.target.error);
                };

            }).catch(err => reject(err));
        });
    }

    /**
     * 🔒 PRIVATE HELPER ENGINE: Evaluator Kondisi Data Segala Medan
     * Memproses komparasi data berdasarkan simbol aritmatika dan tipe data asli
     */
    static _evaluateCondition(item, field, operator, value, fn) {
        // 🔥 Pintu Jalur Khusus: Jika user ingin menggunakan CUSTOM FILTER FUNCTION
        if (operator === 'custom' || typeof fn === 'function') {
            if (typeof fn === 'function') return fn(item);
            return true; 
        }

        // 🔄 UPDATE UTAMA: Mengambil nilai menggunakan Deep Path Resolver
        const targetValue = this._getNestedValue(item, field);
        
        // Katup pengaman jika properti memang tidak eksis di data tersebut
        if (targetValue === undefined || targetValue === null) return false;

        switch (operator) {
            case '=':
            case '==':
                return String(targetValue).toLowerCase() === String(value).toLowerCase();
            
            case '!=':
                return String(targetValue).toLowerCase() !== String(value).toLowerCase();
            
            case '>':
                return targetValue > value;
            
            case '>=':
                return targetValue >= value;
            
            case '<':
                return targetValue < value;
            
            case '<=':
                return targetValue <= value;

            case 'between':
                if (!Array.isArray(value) || value.length !== 2) return false;
                const [min, max] = value;
                if (targetValue instanceof Date || !isNaN(Date.parse(targetValue)) && isNaN(targetValue)) {
                    const targetTime = new Date(targetValue).getTime();
                    return targetTime >= new Date(min).getTime() && targetTime <= new Date(max).getTime();
                }
                return targetValue >= min && targetValue <= max;

            case 'in':
                if (!Array.isArray(value)) return false;
                return value.map(v => String(v).toLowerCase()).includes(String(targetValue).toLowerCase());

            case 'contains':
                if (!Array.isArray(targetValue)) return false;
                return targetValue.some(v => String(v).toLowerCase().includes(String(value).toLowerCase()));

            default:
                return true;
        }
    }

    /**
     * 🔒 PRIVATE HELPER: Safe Deep-Property Path Resolver
     * Membaca nilai dari objek bersarang menggunakan dot-notation (misal: 'wilayah.kecamatan')
     */
    static _getNestedValue(item, field) {
        if (!item || !field) return undefined;
        
        // Jika tidak ada dot-notation, langsung kembalikan properti secara instan
        if (!field.includes('.')) return item[field];
        
        // Telusuri lapisan objek satu per satu secara sekuensial
        return field.split('.').reduce((currentObj, key) => {
            // Katup pengaman: jika di tengah jalan objek bernilai null/undefined, langsung stop (Anti-Crash)
            if (currentObj === null || currentObj === undefined) return undefined;
            return currentObj[key];
        }, item);
    }
}