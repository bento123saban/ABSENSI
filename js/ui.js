import { ApexAlert, ApexHttp} from "../bendhard16.min";


export function CustomMore ({elms, callback} = {}) {
    const selector  = elms || ".more-box"
    const allMore   = document.querySelectorAll(selector);
    if (allMore.length === 0) return;

    allMore.forEach(more => {
        const icon  = more.querySelector(".more-icon");
        const list  = more.querySelector(".more-list");
        const spans = list.querySelectorAll("span");
        const hiden = more.querySelector(".more-input")

        // Handle Klik Item
        spans.forEach(span => {
            span.addEventListener("click", () => {
                if (span.classList.contains("blue")) return;

                // UI Update
                spans.forEach(sp => sp.classList.remove("blue"));
                span.classList.add("blue");
                
                // Close List
                list.classList.add("dis-none");

                hiden.value = span.textContent.trim()
                hiden.dispatchEvent(new Event('change', { bubbles: true }));


                // EXECUTE CALLBACK: Kirim value dan elemennya
                if (typeof callback === "function") callback({value : span.textContent.trim(), elm : span, box : more});
            });
        });
    });

    // Menutup menu jika klik di luar area menu mana pun
    document.addEventListener('click', (e) => {
        const elm = e.target
        let param = true
        if (elm.closest(".more-icon")) {
            const more = elm.closest(".more-box")
            const list = more.querySelector(".more-list")
            if (list.classList.contains("dis-none")) list.classList.remove("dis-none")
            else param = false
        }
        else param = false
        if (!param) allMore.forEach(more => more.querySelector(".more-list").classList.add("dis-none"));
    }, true);
}

export function CustomSelect (selector = '.custom-select-container', callback = null) {
    const allSelects = document.querySelectorAll(selector);
    if (allSelects.length === 0) return;

    allSelects.forEach(container => {
        // Mencari elemen pendukung di dalam container ini
        const trigger = container.querySelector('.select-trigger');
        const triggerSpan = trigger?.querySelector('span');
        const options = container.querySelectorAll('.option');
        const hiddenInput = container.querySelector('.select-input');
        
        // MENCARI PARENT: Mencari container .select-custom terdekat dari elemen ini
        const parentWrapper = container.closest('.select-custom');

        // --- FUNGSI UPDATE CLR (Hanya untuk parent terkait) ---
        const updateParentColor = (newClrClass) => {
            if (!parentWrapper || !newClrClass) return;
            // Tambahkan class warna yang baru
            parentWrapper.dataset.background = newClrClass;
        };

        // --- FUNGSI UPDATE UI ---
        const updateSelection = (option) => {
            if (!option) return;

            const val = option.getAttribute('data-value') || '';
            const text = option.innerHTML;
            const clrClass = option.getAttribute('data-clr');
            hiddenInput.dataset.clr = clrClass

            // 1. Update Span & Simpan data-value asli
            if (triggerSpan) {
                triggerSpan.innerHTML = text;
                triggerSpan.setAttribute('data-value', val);
                triggerSpan.className = triggerSpan.dataset.class
            }

            // 2. Update Hidden Input (untuk form submit)
            if (hiddenInput) {
                hiddenInput.value = val;
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
                hiddenInput.dataset.clr = clrClass
            }

            // 3. Update Visual Active State pada Opsi
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            // 4. Update Warna pada container utama (.select-custom)
            updateParentColor(clrClass);
        };

        // --- INISIALISASI ---
        if (!trigger) return;

        // Set Default Value jika ada
        const defaultValue = container.getAttribute('data-default') || hiddenInput?.value;
        if (defaultValue) {
            const defaultOpt = Array.from(options).find(opt => opt.getAttribute('data-value') === defaultValue);
            if (defaultOpt) updateSelection(defaultOpt);
        }


        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                updateSelection(option);
                container.classList.remove('open');
            });
        });
        // UI_log("Custom Select ✅")
    });

    // Klik di luar area select mana pun akan menutup semua dropdown
    document.addEventListener('click', (e) => {
        const elm = e.target
        let param = true
        if (elm.closest(".select-trigger")) {
            const container = elm.closest(".custom-select-container")
            if (container.classList.contains("open")) param = false
            else container.classList.add("open")
        }
        else param = false 
        if (!param) allSelects.forEach(select => select.classList.remove('open'));
    }, true);
}

export function updateLoader () {
    return document.querySelectorAll(".shimmer").forEach(elm => elm.classList.remove("dis-none"))
}

export function dashboardToggle() {
    const absenHead = document.querySelector("#absen-box-head");
    const absenList = document.querySelector("#dash-absen-list");
    const workHead = document.querySelector("#work-box-head");
    const workList = document.querySelector("#dash-work-list");

    if (absenHead && absenList) {
        absenHead.addEventListener("click", () => {
            absenList.classList.toggle("dis-none");
        });
    }

    if (workHead && workList) {
        workHead.addEventListener("click", () => {
            workList.classList.toggle("dis-none");
        });
    }
}


/**
 * 🚀 SUPER ADVANCE PHOTO UPLOADER MANAGER
 * Class ini diletakkan di luar agar tidak didefinisikan berulang kali 
 * saat workFormLogic dipanggil berkali-kali.
 */
class AdvancedPhotoManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Ambil semua elemen photo-input yang ada di awal
        const allBoxes = Array.from(this.container.querySelectorAll('.photo-input'));
        
        this.plusBox = allBoxes.find(box => box.querySelector('.fa-plus'));
        this.blueprint = allBoxes.find(box => box.querySelector('.fa-camera'));

        if (!this.plusBox || !this.blueprint) return;

        // Siapkan Template Bersih di dalam Memori
        this.template = this.blueprint.cloneNode(true);
        this.template.querySelector('input[type="file"]').value = '';
        this.template.style.backgroundImage = '';
        this.template.querySelector('i').className = 'fas fa-camera fz-24';

        this.init();
    }

    init() {
        // 🔥 MAGIC TRICK: DOM CLEANSING 🔥
        // Kloning tombol Plus dan timpa yang lama untuk menghapus SEMUA event liar 
        // yang menumpuk akibat workFormLogic dipanggil berkali-kali.
        const cleanPlusBox = this.plusBox.cloneNode(true);
        this.plusBox.replaceWith(cleanPlusBox);
        this.plusBox = cleanPlusBox;

        // Pasang Event secara Eksklusif ke tombol Plus yang sudah bersih
        this.plusBox.onclick = (e) => this.handlePlusClick(e);

        // Inisialisasi box kamera pertama
        this.bindBoxEvents(this.blueprint);
        this.updateState();
        this.updatePhotoBadge();
    }

    handlePlusClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const newBox = this.template.cloneNode(true);
        this.bindBoxEvents(newBox);
        
        this.container.insertBefore(newBox, this.plusBox);
        this.updateState();

        // Gunakan requestAnimationFrame agar UI stabil sebelum membuka file picker
        requestAnimationFrame(() => {
            newBox.querySelector('input[type="file"]').click();
        });
    }

    bindBoxEvents(box) {
        const input = box.querySelector('input[type="file"]');
        const icon = box.querySelector('i:not(.fa-close):not(.fa-times)');

        // Amankan input dari event bubbling menggunakan onclick
        input.onclick = (e) => e.stopPropagation();

        // Gunakan onclick langsung pada box (Menghapus penumpukan event gaib)
        box.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.target.classList.contains('fa-close') || e.target.classList.contains('fa-times')) {
                this.removeBox(box);
                this.updatePhotoBadge();
                return;
            }

            input.click(); // Dijamin hanya terpanggil 1 kali sekarang!
        };

        // Gunakan onchange langsung pada input file
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                // Tampilkan spinner
                if (icon) icon.className = 'fas fa-spinner fa-spin fz-24';
                
                // 1. Kompres (Maksimal 2MB)
                const compressedFile = await this.compressImage(file, 2);
                
                // 2. Timpa file lama dengan file kompresi
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(compressedFile);
                input.files = dataTransfer.files;

                // 3. Preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    box.style.backgroundImage = `url(${event.target.result})`;
                    box.style.backgroundSize = "cover";
                    box.style.backgroundPosition = "center";
                    if (icon) icon.className = '';
                    this.updateIndividualBoxSize(box, compressedFile.size);
                    this.updatePhotoBadge();
                };
                reader.readAsDataURL(compressedFile);
            } else {
                box.style.backgroundImage = '';
                if (icon) icon.className = 'fas fa-camera fz-24';
                this.updateIndividualBoxSize(box, compressedFile.size);
                this.updatePhotoBadge();
            }
        };
    }

    removeBox(box) {
        box.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        box.style.opacity = '0';
        box.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            box.remove();
            this.updateState();
            this.updatePhotoBadge();
        }, 250);
    }

    updateState() {
        const boxes = Array.from(this.container.querySelectorAll('.photo-input')).filter(box => !box.querySelector('.fa-plus'));
        const totalBoxes = boxes.length;

        boxes.forEach(box => {
            let closeBtn = box.querySelector('.fa-close, .fa-times');
            
            if (totalBoxes > 1) {
                if (!closeBtn) {
                    closeBtn = document.createElement('i');
                    closeBtn.className = 'fas fa-close absolute top-5 right-5 pointer-events-auto clr-red';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.style.zIndex = '10';
                    box.appendChild(closeBtn);
                }
            } else {
                if (closeBtn) closeBtn.remove();
            }
        });
    }

    getAllFiles() {
        const inputs = Array.from(this.container.querySelectorAll('.photo-input input[type="file"]'));
        const validFiles = [];
        inputs.forEach(input => {
            if (input.files && input.files.length > 0) {
                validFiles.push(input.files[0]);
            }
        });
        return validFiles;
    }

    hasFiles() {
        return this.getAllFiles().length > 0;
    }

    // =========================================
    // FITUR BARU 1: UPDATE TEKS JUMLAH & UKURAN
    // =========================================
    updatePhotoBadge() {
        const badgeSpan = document.querySelector('#open-foto-box span.w-100');
        const headerHead = document.getElementById('foto-form-head'); // Ambil element header

        const files = this.getAllFiles();
        
        // Skenario jika KOSONG (Kembalikan ke teks asli)
        if (files.length === 0) {
            if (badgeSpan) badgeSpan.innerHTML = "Photo";
            if (headerHead) headerHead.innerHTML = "";
            return;
        }

        // Hitung total ukuran (dalam Byte)
        const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
        
        // Konversi ke MB atau KB
        let sizeText = "";
        if (totalBytes < 1024 * 1024) {
            sizeText = (totalBytes / 1024).toFixed(1) + " KB";
        } else {
            sizeText = (totalBytes / (1024 * 1024)).toFixed(2) + " MB";
        }

        const infoBadge = `${files.length} file &bull; ${sizeText}`;

        // 1. Update Teks di Tombol Box Foto
        if (badgeSpan) {
            badgeSpan.innerHTML = `Photo <span style="font-size: 0.85em; opacity: 0.8; margin-left: 5px;">${infoBadge}</span>`;
        }

        // 2. Update Teks di Sticky Header Form
        if (headerHead) {
            headerHead.innerHTML = `<span style="font-size: 0.7em; font-weight: normal; opacity: 0.85; margin-left: 8px; vertical-align: middle;">${infoBadge}</span>`;
        }
    }

    // =========================================
    // FITUR BARU: UPDATE UKURAN TIAP BOX FOTO
    // =========================================
    updateIndividualBoxSize(box, bytes) {
        let sizeBadge = box.querySelector('.photo-size-badge');
        
        // Jika foto dihapus/kosong, hilangkan badge ukuran
        if (bytes === 0) {
            if (sizeBadge) sizeBadge.remove();
            return;
        }

        // Jika badge belum ada, buat baru dengan styling stylish & aman di atas gambar
        if (!sizeBadge) {
            sizeBadge = document.createElement('span');
            sizeBadge.className = 'photo-size-badge';
            sizeBadge.style.position = 'absolute';
            sizeBadge.style.bottom = '6px';
            sizeBadge.style.left = '50%';
            sizeBadge.style.transform = 'translateX(-50%)';
            sizeBadge.style.fontSize = '10px';
            sizeBadge.style.fontWeight = 'bold';
            sizeBadge.style.background = 'rgba(0, 0, 0, 0.65)'; // Background semi-transparan biar kelihatan di foto gelap/terang
            sizeBadge.style.color = '#fff';
            sizeBadge.style.padding = '2px 6px';
            sizeBadge.style.borderRadius = '4px';
            sizeBadge.style.whiteSpace = 'nowrap';
            sizeBadge.style.pointerEvents = 'none'; // Biar tidak mengganggu klik pada box
            sizeBadge.style.zIndex = '5';
            box.appendChild(sizeBadge);
        }

        // Format ukuran ke KB / MB
        let sizeText = "";
        if (bytes < 1024 * 1024) {
            sizeText = (bytes / 1024).toFixed(1) + " KB";
        } else {
            sizeText = (bytes / (1024 * 1024)).toFixed(2) + " MB";
        }

        sizeBadge.innerText = sizeText;
    }

    // =========================================
    // FITUR BARU 2: AUTO COMPRESSOR ENGINE
    // =========================================
    async compressImage(file, maxSizeMB) {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        
        if (file.size <= maxSizeBytes) return file;

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_DIMENSION = 1920;
                    if (width > height && width > MAX_DIMENSION) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    } else if (height > MAX_DIMENSION) {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    let quality = 0.8;
                    const tryCompress = () => {
                        canvas.toBlob((blob) => {
                            if (blob.size > maxSizeBytes && quality > 0.1) {
                                quality -= 0.1;
                                tryCompress(); 
                            } else {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                });
                                resolve(compressedFile);
                            }
                        }, 'image/jpeg', quality);
                    };
                    tryCompress();
                };
            };
        });
    }
}
class AdvancedWorkerSelector {
    constructor() {
        // Ambil element berdasarkan ID murni dari HTML lu
        this.mainContainer = document.getElementById('worker-list-render');
        this.searchInput = document.getElementById('search-worker');
        this.filterStarBtn = document.getElementById('btn-filter-starred');
        this.countBadge = document.getElementById('selected-worker-count');
        this.filterWrapper = document.querySelector('.selector-filter-wrapper');

        this.workers = [];
        this.selectedIds = new Set();
        this.searchQuery = "";
        this.onlyShowStarred = false; // State untuk tombol filter bintang utama
        
        // Element yang di-inject dinamis
        this.starredZoneWrapper = null; 
        this.starredContainer = null; 
        this.selectAllBtn = null;

        // Data Dummy Otomatis jika localStorage masih kosong
        this.dummyData = [
            { id: "B001", name: "Ahmad Fauzi", role: "Supir Truk", isStarred: true },
            { id: "B002", name: "Budi Santoso", role: "Petugas Lapangan", isStarred: true },
            { id: "B003", name: "Chris Pattinama", role: "Kolektor Sampah", isStarred: false },
            { id: "B004", name: "Dedi Wijaya", role: "Petugas Lapangan", isStarred: true },
            { id: "B005", name: "Eko Prasetyo", role: "Sapu Jalanan", isStarred: false },
            { id: "B006", name: "Fandi Ahmad", role: "Kernit Truk", isStarred: false }
        ];

        if (this.mainContainer) this.init();
    }

    clearSelection() {
        this.selectedIds.clear(); 
        localStorage.removeItem('selected_worker_ids'); 
        this.render(); 
    }

    init() {
        this.injectStarredZone();
        this.loadData();
        this.bindEvents(); // Sekarang aman karena metodenya sudah ada di bawah
        this.render();
    }

    // 🔥 JALUR VIP: Suntik Zona Bintang + Tombol "Centang Semua" secara Dinamis
    injectStarredZone() {
        if (this.filterWrapper) {
            // 1. Buat pembungkus utama area favorit
            const zoneWrapper = document.createElement('div');
            zoneWrapper.id = 'dynamic-starred-zone-wrapper';
            zoneWrapper.style.marginTop = '15px';
            zoneWrapper.style.display = 'none';

            // 2. Buat Row Header (Judul + Tombol Kanan)
            const headerRow = document.createElement('div');
            headerRow.style.display = 'flex';
            headerRow.style.justifyContent = 'space-between';
            headerRow.style.alignItems = 'center';
            headerRow.style.marginBottom = '8px';
            headerRow.style.padding = '0 5px';
            headerRow.innerHTML = `
                <span style="font-size: 13px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                    <i class="fas fa-star" style="color: #f59e0b;"></i> Akses Cepat
                </span>
                <button type="button" id="btn-select-all-starred" class="transparent br-none font-bold" style="font-size: 13px; color: #0284c7; cursor: pointer; outline: none;">
                    Centang Semua
                </button>
            `;

            // 3. Buat tempat nampung Chips Buruhnya
            const chipsContainer = document.createElement('div');
            chipsContainer.id = 'dynamic-starred-chips';
            chipsContainer.className = 'starred-zone-chips';

            zoneWrapper.appendChild(headerRow);
            zoneWrapper.appendChild(chipsContainer);

            // Sisipkan ke HTML (di bawah search filter wrapper)
            this.filterWrapper.parentNode.insertBefore(zoneWrapper, this.mainContainer);
            
            // Simpan referensi ke properti class
            this.starredZoneWrapper = zoneWrapper;
            this.starredContainer = chipsContainer;
            this.selectAllBtn = zoneWrapper.querySelector('#btn-select-all-starred');
        }
    }

    loadData() {
        const localData = localStorage.getItem('master_workers');
        if (localData) {
            this.workers = JSON.parse(localData);
        } else {
            this.workers = this.dummyData;
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('master_workers', JSON.stringify(this.workers));
    }

    // 🌟 SEBELUMNYA HILANG: Tempat Manajemen Event Listener di Lapangan
    bindEvents() {
        // 1. Event filter input ketikan pencarian text live
        if (this.searchInput) {
            this.searchInput.oninput = (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.render();
            };
        }

        // 2. Event tombol filter bintang utama bawaan HTML lu
        if (this.filterStarBtn) {
            this.filterStarBtn.onclick = () => {
                this.onlyShowStarred = !this.onlyShowStarred;
                this.filterStarBtn.classList.toggle('active', this.onlyShowStarred);
                this.render();
            };
        }

        // 3. Event handler tombol "Centang Semua" khusus baris favorit
        if (this.selectAllBtn) {
            this.selectAllBtn.onclick = () => {
                const starredWorkers = this.workers.filter(w => w.isStarred);
                if (starredWorkers.length === 0) return;

                const starredIds = starredWorkers.map(w => w.id);
                // Cek apakah semua buruh bintang saat ini sudah masuk centangan
                const isAllStarredSelected = starredIds.every(id => this.selectedIds.has(id));

                if (isAllStarredSelected) {
                    // Jika semua sudah dicentang -> Hapus centang massal favorit
                    starredIds.forEach(id => this.selectedIds.delete(id));
                } else {
                    // Jika ada yang belum dicentang -> Centang semuanya massal
                    starredIds.forEach(id => this.selectedIds.add(id));
                }

                this.render(); // Sinkronisasi UI instan
            };
        }
    }

    toggleSelection(workerId) {
        if (this.selectedIds.has(workerId)) {
            this.selectedIds.delete(workerId);
        } else {
            this.selectedIds.add(workerId);
        }
        this.render();
    }

    render() {
        // Clear isi view lama
        if (this.starredContainer) this.starredContainer.innerHTML = '';
        this.mainContainer.innerHTML = '';

        // 1. RENDER ZONA AKSES CEPAT (CHIPS BINTANG)
        const starredWorkers = this.workers.filter(w => w.isStarred);
        if (starredWorkers.length > 0 && this.starredContainer) {
            this.starredZoneWrapper.style.display = 'block'; // Tampilkan container area

            // Biar teks tombol berubah dinamis (Centang Semua / Batal Centang Semua)
            const starredIds = starredWorkers.map(w => w.id);
            const isAllStarredSelected = starredIds.every(id => this.selectedIds.has(id));
            this.selectAllBtn.innerText = isAllStarredSelected ? "Batal Centang Semua" : "Centang Semua";
            
            starredWorkers.forEach(worker => {
                const isSelected = this.selectedIds.has(worker.id);
                const chip = document.createElement('div');
                chip.className = `chip-worker-star ${isSelected ? 'selected' : ''}`;
                chip.innerHTML = `<i class="fas fa-star"></i> <span>${worker.name}</span>`;
                
                chip.onclick = () => this.toggleSelection(worker.id);
                this.starredContainer.appendChild(chip);
            });
        } else if (this.starredZoneWrapper) {
            this.starredZoneWrapper.style.display = 'none'; // Sembunyikan jika kosong
        }

        // 2. RENDER LIST DAFTAR UTAMA
        let mainList = [...this.workers];

        // Filter Berdasarkan Klik Tombol Bintang Utama
        if (this.onlyShowStarred) {
            mainList = mainList.filter(w => w.isStarred);
        }

        // Filter Berdasarkan Ketikan Kolom Search
        if (this.searchQuery) {
            mainList = mainList.filter(w => 
                w.name.toLowerCase().includes(this.searchQuery) || 
                w.role.toLowerCase().includes(this.searchQuery)
            );
        }

        if (mainList.length === 0) {
            this.mainContainer.innerHTML = `<div style="padding:20px; text-align:center; color:#64748b; font-size:14px;">Data buruh tidak ditemukan</div>`;
        } else {
            mainList.forEach(worker => {
                const isSelected = this.selectedIds.has(worker.id);
                const card = document.createElement('div');
                card.className = `worker-item-card ${isSelected ? 'selected' : ''}`;
                card.innerHTML = `
                    <div class="worker-info">
                        <input type="checkbox" class="worker-checkbox" ${isSelected ? 'checked' : ''}>
                        <div class="worker-meta">
                            <span class="name">${worker.name}</span>
                            <span class="role">${worker.role}</span>
                        </div>
                    </div>
                    <div class="worker-actions">
                        <i class="${worker.isStarred ? 'fas starred' : 'far'} fa-star icon-star-toggle"></i>
                    </div>
                `;

                // Klik card / centang
                card.onclick = (e) => {
                    if (e.target.classList.contains('icon-star-toggle')) return;
                    this.toggleSelection(worker.id);
                };

                // Klik ganti status bintang
                const starIcon = card.querySelector('.icon-star-toggle');
                starIcon.onclick = (e) => {
                    e.stopPropagation();
                    worker.isStarred = !worker.isStarred;
                    this.saveData();
                    this.render(); // Sinkronisasi ulang posisi kedua zona secara live
                };

                this.mainContainer.appendChild(card);
            });
        }

        // Update Counter Terpilih di HTML Lu
        if (this.countBadge) {
            this.countBadge.innerText = `${this.selectedIds.size} Terpilih`;
        }
    }

    // PUBLIC DATA API FOR EXTRACTION
    getSelectedWorkerIds() { return Array.from(this.selectedIds); }
    getSelectedWorkersData() { return this.workers.filter(w => this.selectedIds.has(w.id)); }
}


document.addEventListener('DOMContentLoaded', () => {
    // 1. Jalankan engine selector buruh
    const selectorBuruh = new AdvancedWorkerSelector();

    // 2. Tangkap tombol simpan dari HTML lu
    const btnSave = document.getElementById('btn-save-report');
    
    if (btnSave) {
        // Munculkan tombol (hapus class display none)
        btnSave.classList.remove('dis-none'); 

        btnSave.onclick = async () => {
            const buruhIds = selectorBuruh.getSelectedWorkerIds();
            const buruhLengkap = selectorBuruh.getSelectedWorkersData();

            // 🛑 VALIDASI 1: Cek apakah pengawas belum memilih buruh sama sekali
            if (buruhIds.length === 0) {
                await ApexAlert.error(
                    'Error', 
                    'Silakan pilih minimal 1 buruh sebelum menyimpan laporan!'
                );
                return;
            }

            // ⚠️ VALIDASI 2: Berikan Alert Konfirmasi biar gak sengaja tersimpan/salah klik
            const yakinSimpan = await ApexAlert.confirm(
                'Simpan Laporan?',
                `Anda akan mencatat ${buruhIds.length} buruh untuk dokumentasi ini. Pastikan data lapangan sudah benar.`,
                'Ya, Kirim Data',
                'Cek Kembali'
            );

            // Jika pengawas klik "Cek Kembali" atau menutup modal, batalkan eksekusi di bawahnya
            if (!yakinSimpan) return; 

            // 🚀 PROSES KIRIM DATA (AJAX / FETCH API)
            try {
                console.log("Mengirim ID Buruh:", buruhIds);
                console.log("Detail Objek Buruh:", buruhLengkap);

                
                selectorBuruh.clearSelection();

            } catch (error) {
                // ❌ STEP 5: Handling jika koneksi putus / server crash di jalan
                console.error("Gagal mengirim laporan:", error);
                await ApexAlert.error(
                    'Gangguan Sinkronisasi', 
                    `Data gagal dikirim: ${error.message || 'Periksa koneksi internet di lokasi.'}`
                );
            }
        };
    }
});
// ==========================================
// EXPORT FUNCTION UTAMA ANDA
// ==========================================
export function workFormLogic() {
    const addWorkBtn = document.querySelector("#add-work");
    const workForm = document.querySelector("#work-form");
    const closeFormBtn = document.querySelector("#close-work-form");
    const content = document.querySelector("#content");

    
    
    // --- 1. Form Toggle Logic ---
    if (addWorkBtn && workForm) {
        // Menggunakan properti onclick lebih aman dari penumpukan event
        addWorkBtn.onclick = () => {
            workForm.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scroll
        };
    }

    if (closeFormBtn && workForm) {
        closeFormBtn.onclick = () => {
            workForm.classList.remove("active");
            document.body.style.overflow = "auto";
        };
    }

    // --- 2. Lanjutan Logic ---
    const jenisWork = document.querySelector("#jenis-value")
    const lanjut    = document.querySelector("#lanjutan-content")
    const lanjutTextSearch  = document.querySelector("#lanjut-date-search")

    // Pastikan event tidak menumpuk dengan menghapus clone lama jika perlu,
    // tapi onchange/onclick biasanya aman jika ditulis seperti di bawah.
    if (jenisWork) {
        jenisWork.onchange = function () {
            const value = this.value;
            console.log(this.value);
            if (this.value.toUpperCase() == "LANJUTAN") lanjut.classList.remove("dis-none");
            else lanjut.classList.add("dis-none");
        };
    }

    const lanjutaDateIcon   = document.querySelector("#lanjut-date-icon")
    const lanjutaDateInput  = document.querySelector("#lanjut-date-search")
    const lanjutaTextIcon   = document.querySelector("#lanjut-text-icon")
    const lanjutaTextInput  = document.querySelector("#lanjut-text-search")
    const lanjutTextClose   = document.querySelector("#clear-lanjut")

    if (lanjutaDateIcon && lanjutaDateInput) {
        lanjutaDateIcon.onclick = () => {
            lanjutaDateIcon.classList.toggle("on")
            if (lanjutaDateIcon.classList.contains("on")) lanjutaDateInput.showPicker()
        }
        lanjutaDateInput.onchange = function () {
            if (this.value == "") return ""
            const date  = new Date(this.value).getDate()
            const month = new Date(this.value).toLocaleDateString("id-ID", {month : "long"})
            const year  = new Date(this.value).getFullYear()
            lanjutaTextInput.value = date.toString().padStart(2, "0") + " " + month + " " + year
        }
    }

    if (lanjutaTextInput && lanjutTextClose) {
        lanjutaTextInput.onkeyup = function (e) {
            if (this.value == "") lanjutTextClose.classList.add("dis-none")
            else lanjutTextClose.classList.remove("dis-none")
        }

        lanjutTextClose.onclick = function () {
            this.classList.add("dis-none")
            lanjutTextSearch.value = ""
        }
    }

    // --- 3. SUPER ROBUST PHOTO CONTROL ---
    const photoBox = document.getElementById('form-photos-box');
    if (photoBox) {
        // Cegah inisialisasi ganda jika workFormLogic terpanggil lebih dari sekali
        if (!window.formPhotoManager) {
            window.formPhotoManager = new AdvancedPhotoManager('form-photos-box');
            
            // Registrasi fungsi global untuk keperluan submit form
            window.getAllUploadedPhotos = () => window.formPhotoManager ? window.formPhotoManager.getAllFiles() : [];
            window.hasUploadedPhotos = () => window.formPhotoManager ? window.formPhotoManager.hasFiles() : false;
        } else {
            // Jika manager sudah ada, panggil ulang init() untuk membersihkan ulang DOM 
            // jika seandainya HTML-nya baru saja di-render ulang
            window.formPhotoManager.init();
        }
        const openFoto = document.querySelector("#open-foto-box")
        openFoto.onclick = () => document.querySelector("#foto-box").classList.remove("dis-none")
        const closeFoto = document.querySelector("#foto-close")
        closeFoto.onclick = () => document.querySelector("#foto-box").classList.add("dis-none")
    }

    // --- 4. Form Date Slider Dummy Logic ---
    const formDatePrev = document.querySelector("#form-date-slider i:first-child");
    const formDateNext = document.querySelector("#form-date-slider i:last-child");
    const formDateText = document.querySelector("#form-date-slider .align-center");

    if (formDateText) {
        let dummyDate = new Date(2026, 3, 22); // April 22, 2026
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        const updateFormDate = () => {
            formDateText.textContent = `${dummyDate.getDate().toString().padStart(2, "0")} ${months[dummyDate.getMonth()]} ${dummyDate.getFullYear()}`;
        };

        if (formDatePrev) {
            formDatePrev.onclick = () => {
                dummyDate.setDate(dummyDate.getDate() - 1);
                updateFormDate();
            };
        }

        if (formDateNext) {
            formDateNext.onclick = () => {
                dummyDate.setDate(dummyDate.getDate() + 1);
                updateFormDate();
            };
        }
    }
}



window.addEventListener("change", function(e) {
    const elm = e.target
    if (elm.id == "header-more") {
        const value = elm.value
        const box   = elm.closest(".more-box")
        if (value == "Update") {
            document.querySelector("#spinner-loader").classList.remove("dis-none")
            box.classList.add("dis-none")
            updateLoader()
        }
    }
})



/**
 * Advanced Custom Datalist with Favorite System & Accessibility
 * Features: OOP, Debouncing, XSS Protection, A11y, State Management, LocalStorage
 */
export class RobustLocationDatalist {
    constructor() {
        // 1. Data Source (Data Riil Administratif & Taman Kota Ambon)
        this.ALL_LOCATIONS = [
            // === TAMAN & RUANG PUBLIK KOTA AMBON ===
            "Taman Pattimura",
            "Taman Gong Perdamaian Dunia",
            "Taman Victoria",
            "Taman Karang Panjang",
            "Taman Makam Pahlawan Kapaha",
            "Taman I Love Ambon",
            "Taman Wisata Karang Panjang",
            "Taman Makmur",
            "Taman Marthafons",
            "Taman Halong",
            "Lapangan Merdeka",
            "Taman Ambon City of Music",
            "Taman Ambon City of Peace",
            "Taman Reklame (Depan Lapmer)",
            "Taman Segitiga (Tanjakan Karpan)",
            "Gong Perdamaian Dunia",
            "Taman Transit (Negri Passo)",
            "Taman Galala",
            "Taman Belakang Soya (Taman Jerman)",
            "Taman Gardu",
            "Taman Nusa Apono",
            "Bundaran Leimena",
            "Taman Batu Merah",
            "Taman Wainitu",


            // === KECAMATAN SIRIMAU ===
            "Kelurahan Ahusen",
            "Kelurahan Amantelu",
            "Kelurahan Batu Gajah",
            "Kelurahan Batu Meja",
            "Kelurahan Honipopu",
            "Kelurahan Karang Panjang",
            "Kelurahan Pandan Kasturi",
            "Kelurahan Rijali",
            "Kelurahan Silale",
            "Kelurahan Uritetu",
            "Kelurahan Waihoka",
            "Desa Batu Merah",
            "Desa Galala",
            "Negeri Hative Kecil",
            "Negeri Soya",

            // === KECAMATAN NUSANIWE ===
            "Kelurahan Benteng",
            "Kelurahan Kudamati",
            "Kelurahan Mangga Dua",
            "Kelurahan Nusaniwe",
            "Kelurahan Urimessing",
            "Kelurahan Waihaong",
            "Kelurahan Wainitu",
            "Negeri Amahusu",
            "Negeri Latuhalat",
            "Negeri Nusaniwe",
            "Negeri Seilale",
            "Negeri Urimessing",

            // === KECAMATAN BAGUALA ===
            "Kelurahan Lateri",
            "Desa Latta",
            "Desa Nania",
            "Desa Negeri Lama",
            "Desa Waiheru",
            "Negeri Halong",
            "Negeri Passo",

            // === KECAMATAN TELUK AMBON (Lokasi Anda) ===
            "Kelurahan Tihu",
            "Desa Hunuth/Durian Patah",
            "Desa Poka",
            "Desa Wayame",
            "Negeri Hative Besar",
            "Negeri Laha",
            "Negeri Rumah Tiga",
            "Negeri Tawiri",

            // === KECAMATAN LEITIMUR SELATAN ===
            "Negeri Ema",
            "Negeri Hatalai",
            "Negeri Hutumuri",
            "Negeri Kilang",
            "Negeri Leahari",
            "Negeri Naku",
            "Negeri Rutong"
        ].sort(); // .sort() akan mengurutkan daftar ini secara alfabetis (A-Z) di UI nanti.

        // 2. DOM Elements Selection
        this.nodes = {
            input: document.querySelector("#lokasi"),
            list: document.querySelector("#lokasi-datalist"),
            clear: document.querySelector("#clear-lokasi"),
            starBtn: document.querySelector("#lokasi-stars"),
            wrapper: document.querySelector("#lokasi-wrapper"),
            box: document.querySelector("#lokasi-box")
        };

        // Guard clause: Pastikan semua elemen ada di DOM
        if (!this.nodes.input || !this.nodes.list) {
            console.error("RobustDatalist: Required DOM elements missing.");
            return;
        }

        // 3. State Management
        this.state = {
            favorites: JSON.parse(localStorage.getItem('fav_locations_v1')) || [],
            isFavFilterActive: false,
            focusedIndex: -1,
            isOpen: false,
            query: ""
        };

        // 4. Initialization
        this.init();
    }

    init() {
        this.setupAccessibility();
        this.bindEvents();
    }

    // --- Core Logic & Rendering ---

    render(param = false) {
        let dataSource = param ? this.ALL_LOCATIONS : this.state.isFavFilterActive ? this.state.favorites :  this.ALL_LOCATIONS /* this.nodes.input.value == "" ? this.state.favorites : this.state.isFavFilterActive ? this.state.favorites : */ 
        dataSource = dataSource.length === 0 ? this.ALL_LOCATIONS : dataSource
        console.log(dataSource)
        // Filter Data
        const filtered = dataSource.filter(item => 
            item.toLowerCase().includes(this.state.query)
        );

        // Update UI State
        this.nodes.clear.classList.toggle('dis-none', this.nodes.input.value.length === 0);
        this.nodes.starBtn.classList.toggle('clr-yellow', this.state.isFavFilterActive);
        this.nodes.starBtn.classList.toggle('clr-grey', !this.state.isFavFilterActive);

        if (filtered.length > 0) {
            this.nodes.list.innerHTML = filtered.map((item, index) => {
                const isFav = this.state.favorites.includes(item);
                const safeItem = this.escapeHTML(item);
                const highlighted = this.highlightMatch(safeItem, this.escapeHTML(this.state.query));
                
                return `
                <div class="flex-beetwen items-center p-10 pointer list-item border-bottom-grey ${index === this.state.focusedIndex ? 'lightgrey' : ''}" 
                     data-value="${safeItem}" 
                     data-index="${index}"
                     role="option" 
                     aria-selected="${index === this.state.focusedIndex}">
                    <span class="location-text">${highlighted}</span>
                    <i class="fas fa-star fav-toggle ${isFav ? 'clr-yellow' : 'clr-grey'}" data-location="${safeItem}" title="Toggle Favorite"></i>
                </div>`;
            }).join('');
            this.toggleList(true);
        } else {
            this.nodes.list.innerHTML = "" //`<div class="p-15 clr-grey fz-14 text-center">Tidak ada lokasi ${this.state.isFavFilterActive ? 'favorit ' : ''}ditemukan</div>`;
            this.toggleList(true);
        }
    }

    toggleList(show) {
        this.state.isOpen = show;
        this.nodes.list.classList.toggle('dis-none', !show);
        this.nodes.input.setAttribute('aria-expanded', show);
        if (!show) this.state.focusedIndex = -1;
    }

    selectItem(value) {
        this.nodes.box.classList.add("blue")
        this.nodes.box.classList.remove("white")
        this.nodes.input.value = value;
        this.state.query = value.toLowerCase();
        this.toggleList(false);
        this.nodes.clear.classList.remove('dis-none');
        this.nodes.input.dispatchEvent(new Event('change', { bubbles: true }));
        // this.nodes.input.focus();
    }

    toggleFavoriteItem(locationStr, event) {
        event.stopPropagation(); // Cegah trigger selectItem
        
        if (this.state.favorites.includes(locationStr)) {
            this.state.favorites = this.state.favorites.filter(fav => fav !== locationStr);
        } else {
            this.state.favorites.push(locationStr);
        }
        
        localStorage.setItem('fav_locations_v1', JSON.stringify(this.state.favorites));
        
        // Jika sedang mode filter favorit dan item dihapus dari favorit, reset ke awal jika kosong
        if (this.state.isFavFilterActive && this.state.favorites.length === 0) {
            this.state.isFavFilterActive = false;
        }
        
        this.render();
    }

    // --- Event Bindings ---

    bindEvents() {
        // 1. Input dengan Debouncing ringan untuk performa
        let timeout;
        this.nodes.input.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.state.query = e.target.value.toLowerCase();
                this.state.focusedIndex = -1; // Reset focus keyboard
                this.render(true);
            }, 150);
        });

        this.nodes.input.addEventListener("keyup", (e) => {
            if (e.target.value == "") {
                this.nodes.box.classList.remove("blue")
                this.nodes.box.classList.add("white")
                this.render()
            } else {
                this.nodes.box.classList.add("blue")
                this.nodes.box.classList.remove("white")
            }
        })

        // 2. Clear Button
        this.nodes.clear.addEventListener('click', () => {
            this.nodes.input.value = "";
            this.state.query = "";
            this.state.focusedIndex = -1;
            this.render(true);
            this.nodes.input.focus();
            this.nodes.box.classList.remove("blue")
            this.nodes.box.classList.add("white")
        });

        // 3. Main Star Button (Mode Filter Favorit)
        this.nodes.starBtn.addEventListener('click', () => {
            this.state.isFavFilterActive = !this.state.isFavFilterActive;
            this.state.focusedIndex = -1;
            this.render();
            
            // Jika mematikan filter dan input kosong, tutup list
            if (!this.state.isFavFilterActive && this.state.query === "") {
                this.toggleList(false);
            } else {
                this.nodes.input.focus();
            }
        });

        // 4. Focus & Click Outside
        this.nodes.input.addEventListener('focus', () => this.render())

        // Ultra Bulletproof Click Outside (Capture Phase)
        document.addEventListener('click', (e) => {
            if (!this.state.isOpen) return;

            // Gunakan e.target.closest untuk melihat apakah klik berada di dalam wilayah id="komponen-lokasi"
            const isInsideComponent = e.target.closest('#komponen-lokasi');

            // Jika isInsideComponent adalah null, berarti klik murni terjadi di luar
            if (!isInsideComponent) {
                this.toggleList(false);
            }
        }, true); // <--- Parameter 'true' ini adalah kuncinya!

        // 5. Event Delegation untuk List Item & Star Toggle
        this.nodes.list.addEventListener('click', (e) => {
            const favIcon = e.target.closest('.fav-toggle');
            if (favIcon) {
                this.toggleFavoriteItem(favIcon.dataset.location, e);
                return;
            }

            const listItem = e.target.closest('.list-item');
            if (listItem) {
                this.selectItem(listItem.dataset.value);
            }
        });

        // 6. Keyboard Navigation (Arrow Keys, Enter, Esc)
        this.nodes.input.addEventListener('keydown', (e) => {
            if (!this.state.isOpen) return;

            const items = this.nodes.list.querySelectorAll('.list-item');
            if (items.length === 0) return;

            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.state.focusedIndex = (this.state.focusedIndex + 1) % items.length;
                    this.render();
                    this.scrollToFocus(items);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.state.focusedIndex = (this.state.focusedIndex - 1 + items.length) % items.length;
                    this.render();
                    this.scrollToFocus(items);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.state.focusedIndex > -1) {
                        this.selectItem(items[this.state.focusedIndex].dataset.value);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.toggleList(false);
                    break;
            }
        });

        // SISIPKAN DI BAGIAN PALING BAWAH DI DALAM FUNGSI bindEvents() :
        if (this.selectAllBtn) {
            this.selectAllBtn.onclick = () => {
                const starredWorkers = this.workers.filter(w => w.isStarred);
                if (starredWorkers.length === 0) return;

                const starredIds = starredWorkers.map(w => w.id);
                // Cek apakah semua buruh bintang sudah dicentang
                const isAllStarredSelected = starredIds.every(id => this.selectedIds.has(id));

                if (isAllStarredSelected) {
                    // Jika sudah penuh tercentang -> Hapus centang massal
                    starredIds.forEach(id => this.selectedIds.delete(id));
                } else {
                    // Jika belum penuh -> Centang semuanya massal
                    starredIds.forEach(id => this.selectedIds.add(id));
                }

                this.render(); // Refresh UI
            };
        }
    }

    // --- Utilities & Security ---

    scrollToFocus(items) {
        if (this.state.focusedIndex > -1 && items[this.state.focusedIndex]) {
            items[this.state.focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    escapeHTML(str) {
        // Proteksi XSS Dasar
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    highlightMatch(text, term) {
        if (!term) return text;
        // Escape karakter spesial regex agar tidak error jika user mengetik karakter aneh
        const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${safeTerm})`, 'gi');
        return text.replace(regex, `<strong class="clr-primary">$1</strong>`);
    }

    setupAccessibility() {
        this.nodes.input.setAttribute('role', 'combobox');
        this.nodes.input.setAttribute('aria-autocomplete', 'list');
        this.nodes.input.setAttribute('aria-expanded', 'false');
        this.nodes.input.setAttribute('aria-controls', 'lokasi-datalist');
        this.nodes.list.setAttribute('role', 'listbox');
    }
}

ApexHttp._getTimeoutForNetwork()