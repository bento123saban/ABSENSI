import {ApexAlert, ApexHttp} from "../bendhard16";

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


export class WorkFormController {
    constructor() {
        // 1. Kumpulkan semua elemen DOM yang dibutuhkan (Nodes)
        this.nodes = {
            workForm: document.querySelector("#work-form"), // Sesuaikan ID form utama lu
            formClose: document.querySelector("#close-work-form"),
            btnSave: document.querySelector("#btn-save"),   // Sesuaikan ID tombol simpan
            
            dateText: document.querySelector("#form-date-slider .align-center"),
            jenisWork: document.querySelector("#jenis-value"),
            moreInput: document.querySelector("#header-more"),
            lanjutContent: document.querySelector("#lanjutan-content")
            
        };

        // 2. Inisialisasi Modul/Class Pendukung (Sesuaikan dengan nama class lu)
        this.selectorBuruh = new AdvancedWorkerSelector(); // Contoh pemanggilan class buruh
        this.photoManager = new AdvancedPhotoManager();    // Contoh pemanggilan class foto
        new RobustLocationDatalist()

        // 3. Panggil fungsi Custom UI bawaan lu secara langsung (Pastikan script-nya udah ter-load)
        if (typeof CustomSelect === "function") {
            CustomSelect('.custom-select-container');
        }
        
        if (typeof CustomMore === "function") {
            CustomMore({ elms: ".more-box" });
        }

        // 4. Pasang semua event listener
        this._bindEvents();
    }

    _bindEvents() {
        // 1. Tombol Buka Form Utama (Updated pakai add-work)
        const btnOpenForm = document.querySelector("#add-work"); // Ganti pakai ".add-work" kalau di HTML lu itu class
        
        if (btnOpenForm && this.nodes.workForm) {
            btnOpenForm.addEventListener("click", () => {
                this.nodes.workForm.classList.add("active");
                document.body.style.overflow = "hidden"; // Kunci scroll background
            });
        }

        // 2. Tombol Tutup Form
        const btnCloseForm = document.querySelector(".btn-close");
        if (btnCloseForm && this.nodes.workForm) {
            btnCloseForm.addEventListener("click", () => {
                this.nodes.workForm.classList.remove("active");
                document.body.style.overflow = "auto"; // Kembalikan scroll
            });
        }

        // 3. Tombol Simpan -> Panggil _handleSave
        if (this.nodes.btnSave) {
            this.nodes.btnSave.addEventListener("click", () => {
                this._handleSave();
            });
        }

        // 4. Deteksi Perubahan Jenis Kerja untuk Menampilkan Konten Lanjutan
        const inputJenis = document.querySelector("#jenis-value");
        const lanjutContent = document.querySelector("#lanjutan-content");

        if (inputJenis && lanjutContent) {
            inputJenis.addEventListener("change", (e) => {
                const val = e.target.value.toLowerCase();
                if (val === "lanjutan") lanjutContent.classList.add("active");
                else lanjutContent.classList.remove("active");
            });
        }

        this.nodes.formClose.onclick = () => this.nodes.workForm.classList.remove("active")

        const lanjutDateInput   = document.querySelector("#lanjut-date-search")
        const lanjutDateIcon    = document.querySelector("#lanjut-date-icon")
        if (lanjutDateIcon && lanjutDateInput) lanjutDateIcon.onclick = () => lanjutDateInput.click()
    }

    _changeDate(delta) {
        if (!this.nodes.dateText) return;
        this.dummyDate.setDate(this.dummyDate.getDate() + delta);
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        this.nodes.dateText.textContent = `${this.dummyDate.getDate().toString().padStart(2, "0")} ${months[this.dummyDate.getMonth()]} ${this.dummyDate.getFullYear()}`;
    }

    async _handleSave() {
        // 1. Validasi buruh (Minimal 1 buruh harus dipilih)
        const buruhIds = this.selectorBuruh ? this.selectorBuruh.getSelectedWorkerIds() : [];
        
        if (buruhIds.length === 0) {
            await ApexAlert.error('Error', 'Pilih minimal 1 buruh!');
            return;
        }

        // --- TAMBAHAN: Validasi Lokasi ---
        const inputLokasi = document.querySelector("#lokasi");
        const lokasiValue = inputLokasi ? inputLokasi.value.trim() : "";
        
        if (lokasiValue === "") {
            await ApexAlert.error('Error', 'Lokasi kerja wajib diisi!');
            if (inputLokasi) inputLokasi.focus();
            return;
        }
        // ---------------------------------

        // 2. Konfirmasi sebelum menyimpan
        const yakin = await ApexAlert.confirm('Simpan Laporan?', 'Data akan masuk antrean.');
        if (!yakin) return;

        try {
            // 3. Animasi Loading pada Tombol Simpan
            if (this.nodes.btnSave) {
                this.nodes.btnSave.disabled = true;
                this.nodes.btnSave.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
            }

            // 4. AMBIL VALUE LANGSUNG DARI DOM SAAT KLIK SAVE
            const jenisKerjaValue = document.querySelector("#jenis-value")?.value || ""; 
            const tipeKerjaValue  = document.querySelector("#header-more")?.value || "";  

            // 5. Susun Payload Data
            const payload = {
                tanggal: this.nodes.dateText ? this.nodes.dateText.textContent : '',
                jenisKerja: jenisKerjaValue, 
                tipeKerja: tipeKerjaValue,
                lokasi: lokasiValue, // <--- LOKASI DIMASUKKAN KE PAYLOAD
                buruh: this.selectorBuruh ? this.selectorBuruh.getSelectedWorkersData() : [],
                foto: this.photoManager ? this.photoManager.getAllFiles() : [],
                keterangan: document.querySelector("#keterangan")?.value || ""
            };

            // 6. Eksekusi pengiriman data
            await forceQueueData(payload);
            
            // 7. Reset Form dan UI setelah sukses
            if (this.selectorBuruh) this.selectorBuruh.clearSelection();
            if (this.nodes.workForm) this.nodes.workForm.classList.remove("active");
            
            // --- TAMBAHAN: Reset input lokasi biar kosong pas form dibuka lagi ---
            if (inputLokasi) {
                inputLokasi.value = "";
                document.querySelector("#lokasi-box")?.classList.remove("blue");
                document.querySelector("#lokasi-box")?.classList.add("white");
                document.querySelector("#clear-lokasi")?.classList.add("dis-none");
            }
            // ---------------------------------------------------------------------

            // Mengembalikan scroll body yang disembunyikan saat form terbuka
            document.body.style.overflow = "auto";

            await ApexAlert.success("Tersimpan", "Data masuk antrean pengiriman.");

        } catch (e) {
            console.error("Gagal menyimpan data:", e);
            await ApexAlert.error("Gagal", e.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            // 8. Kembalikan state tombol ke semula apapun hasilnya (sukses/gagal)
            if (this.nodes.btnSave) {
                this.nodes.btnSave.disabled = false;
                this.nodes.btnSave.innerHTML = `SIMPAN DATA`;
            }
        }
    }
}

class AdvancedPhotoManager {
    constructor(containerId) {
        this.container = document.querySelector("#form-photos-box");
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

        const formSlide = document.querySelector("#form-slide")
        const openFoto  = document.querySelector("#open-foto-box")

        const fotoBox   = document.querySelector("#foto-box")
        const buruhBox  = document.querySelector("#buruh-box")

        if (openFoto && fotoBox && buruhBox) openFoto.onclick = () => {
            fotoBox.classList.remove("not-visible")
            buruhBox.classList.add("not-visible")
            formSlide.scrollTo({
                behavior: "smooth",
                left: 10000,
                top: 0
            })
        }
        const fotoClose = document.querySelector("#foto-close")
        if (fotoClose) fotoClose.onclick = () => formSlide.scrollTo({
                behavior: "smooth",
                left: 0,
                top: 0
            })
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
        this.mainContainer = document.getElementById('worker-list-render');
        this.searchInput = document.getElementById('search-worker');
        this.filterStarBtn = document.getElementById('btn-filter-starred');
        this.countBadge = document.getElementById('selected-worker-count');
        this.filterWrapper = document.querySelector('#buruh-list');

        this.workers = [];
        this.selectedIds = new Set();
        
        // ─── STATE FILTER BARU (ROBUST ENGINE) ───
        this.searchQuery = "";
        this.onlyShowStarred = false; 
        this.selectedRoles = new Set(); // Menyimpan banyak role sekaligus

        // ─── STATE TAMBAHAN UNTUK ENTERPRISE FILTER ───
        this.statusFilter = "all";       // Kontrol kurasi status: 'all' | 'selected' | 'unselected'
        this.activeFilters = {};         // Wadah penampung multi-select properti secara dinamis
        this.filterMatchMode = "AND";
        this.advancedFilterPanel = null; // Referensi elemen panel
        
        this.starredZoneWrapper = null; 
        this.starredContainer = null; 
        this.selectAllBtn = null;
        
        // Element Filter Baru
        this.advancedFilterPanel = null;

        this.dummyData = [
            { id: "B001", name: "Ahmad Fauzi", role: "Supir Truk", isStarred: true },
            { id: "B002", name: "Budi Santoso", role: "Petugas Lapangan", isStarred: true },
            { id: "B003", name: "Chris Pattinama", role: "Kolektor Sampah", isStarred: false },
            { id: "B004", name: "Dedi Wijaya", role: "Petugas Lapangan", isStarred: true },
            { id: "B005", name: "Eko Prasetyo", role: "Sapu Jalanan", isStarred: false },
            { id: "B006", name: "Fandi Ahmad", role: "Kernit Truk", isStarred: false },
            { id: "B007", name: "Gatot Kaca", role: "Supir Truk", isStarred: false },
            { id: "B008", name: "Hadi Pranoto", role: "Petugas Lapangan", isStarred: true },
            { id: "B009", name: "Iwan Fals", role: "Kolektor Sampah", isStarred: true },
            { id: "B010", name: "Joko Anwar", role: "Sapu Jalanan", isStarred: false }
        ];

        if (this.mainContainer) this.init();

        const openBuruh = document.querySelector("#open-buruh-box");
        const buruhBox  = document.querySelector("#buruh-box");
        
        const formSlide = document.querySelector("#form-slide")
        const fotoBox   = document.querySelector("#foto-box")

        if (openBuruh && buruhBox && formSlide) openBuruh.onclick = () => {
            fotoBox.classList.add("not-visible")
            buruhBox.classList.remove("not-visible")
            formSlide.scrollTo({
                behavior: "smooth",
                left: 10000,
                top: 0
            })
        }

        const buruhNext = document.querySelector("#buruh-next");
        if (buruhNext) buruhNext.onclick = () => formSlide.scrollTo({
            behavior: "smooth",
            left: 0,
            top: 0
        })

        const buruhBack = document.querySelector("#buruh-back");
        if (buruhBack) buruhBack.onclick = () => formSlide.scrollTo({
            behavior: "smooth",
            left: 0,
            top: 0
        })

        const buruhReset = document.querySelector("#buruh-reset")
        if(buruhReset) buruhReset.onclick = () => this.uncheckAll()
    }

    init() {
        this.loadData();
        this.injectAdvancedFilterPanel(); // 1. Suntik Panel Filter Baru
        this.injectStarredZone();         // 2. Pakai Zona Bintang Lama Lu
        this.bindEvents();                // 3. Ikat Event Listener
        this.render();                    // 4. Jalankan Render Live
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

    injectAdvancedFilterPanel() {
        if (!this.filterWrapper) return;

        const panel = document.createElement('div');
        panel.id = 'advanced-filter-panel';
        panel.classList.add("dis-none")
        
        // Premium Enterprise Container Styling
        panel.style.cssText = `
            background: #ffffff; 
            padding: 18px; 
            border-radius: 14px; 
            margin-top: 12px; 
            margin-bottom: 18px;
            border: 1px solid #e2e8f0; 
            box-shadow: 0 10px 25px -5px rgba(0, 123, 255, 0.05), 0 4px 12px -2px rgba(0, 123, 255, 0.03);
            font-family: system-ui, -apple-system, sans-serif;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="background: rgba(0, 123, 255, 0.1); color: #007bff; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <span style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Advanced Filter Engine</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="display: flex; background: #f1f5f9; padding: 3px; border-radius: 8px; align-items: center; border: 1px solid #e2e8f0;">
                        <button type="button" id="btn-match-and" class="match-mode-btn active" style="padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; background: #007bff; color: #fff;">AND</button>
                        <button type="button" id="btn-match-or" class="match-mode-btn" style="padding: 4px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b;">OR</button>
                    </div>
                    
                    <button type="button" id="btn-reset-filter" style="font-size: 11px; color: #dc3545; background: #fdf2f2; border: 1px solid #fde2e2; padding: 5px 12px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 5px; transition: all 0.2s;">
                        <i class="fas fa-sync-alt"></i> Reset All
                    </button>
                </div>
            </div>

            <div class="dis-none " style="margin-bottom: 16px; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #f1f5f9;">
                <div style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.3px; display: flex; justify-content: space-between;">
                    <span>Status Kelulusan / Seleksi</span>
                </div>
                <div id="status-filter-group" style="display: flex; gap: 6px;">
                    <button type="button" data-status="all" class="filter-status-btn active" style="padding: 6px 14px; font-size: 11px; border-radius: 6px; border: 1px solid #007bff; background: #007bff; color: #ffffff; cursor: pointer; font-weight: 600; transition: all 0.15s;">Semua Data</button>
                    <button type="button" data-status="selected" class="filter-status-btn" style="padding: 6px 14px; font-size: 11px; border-radius: 6px; border: 1px solid #cbd5e1; background: #fff; color: #475569; cursor: pointer; font-weight: 500; transition: all 0.15s;">Sudah Terpilih</button>
                    <button type="button" data-status="unselected" class="filter-status-btn" style="padding: 6px 14px; font-size: 11px; border-radius: 6px; border: 1px solid #cbd5e1; background: #fff; color: #475569; cursor: pointer; font-weight: 500; transition: all 0.15s;">Belum Terpilih</button>
                </div>
            </div>

            <div id="dynamic-properties-filter-container" style="display: flex; flex-direction: column; gap: 14px;"></div>
        `;

        this.filterWrapper.prepend(panel);
        this.advancedFilterPanel = panel;
        const filterOpen = document.querySelector("#btn-advance-filter")
        if (filterOpen) filterOpen.onclick = () => {
            panel.classList.toggle("dis-none")
            filterOpen.classList.toggle("blue")
        }
    }

    /**
     * Master Uncheck Engine (Enterprise Grade)
     * Mengosongkan semua centang/pilihan buruh sekaligus tanpa sisa.
     */
    uncheckAll() {
        // 1. Bersihkan semua ID yang tersimpan di dalam Set seleksi
        this.selectedIds.clear();

        // 2. Reset teks tombol "Centang Semua" balik ke kondisi awal jika elemennya ada
        if (this.selectAllBtn) {
            this.selectAllBtn.innerText = "Centang Favorit";
        }

        // 3. LIVE RE-RENDER UI
        // Detik ini juga semua checkbox di card list lama lo bakal kosong,
        // dan badge counter otomatis balik ke "0 Terpilih"
        this.render();
    }

    /**
     * Enterprise Bulk Selection Processor
     * Bertugas mencentang/memilih banyak buruh sekaligus secara otomatis berdasarkan Array ID.
     * @param {Array} idList - Array berisi kumpulan ID buruh (contoh: [1, 5, 12] atau ["id-1", "id-2"])
     * @param {Object} options - Konfigurasi tambahan { replace: false }
     * - replace: true -> Menghapus centang lama dan diganti dengan list baru ini.
     * - replace: false -> (Default) Menambahkan list baru ini tanpa menghapus yang sudah dicentang sebelumnya.
     */
    bulkSelectWorkersByIds(idList, options = { replace: true }) {
        // Validasi awal untuk memastikan input benar-benar berbentuk array
        if (!Array.isArray(idList)) {
            console.error("Gagal eksekusi: Argumen harus berupa Array ID.");
            return;
        }

        // 1. Jika mode REPLACE aktif, bersihkan dulu semua centang yang ada saat ini
        if (options.replace) {
            this.selectedIds.clear();
        }

        // 2. Lakukan perulangan untuk memasukkan ID ke dalam database seleksi (Set)
        idList.forEach(id => {
            // Samakan tipe data (biasanya di JS database lokal tipenya string atau number)
            // Kita pastikan id dimurnikan sesuai format data asli lo (di sini kita samakan dengan tipe data di data workers)
            const targetWorker = this.workers.find(w => String(w.id) === String(id));
            
            // Hanya masukkan jika ID buruh tersebut memang valid & terdaftar di data internal kita
            if (targetWorker) {
                this.selectedIds.add(targetWorker.id);
            }
        });

        // 3. RE-RENDER LIVE UI
        // Otomatis mengupdate checkbox, card list lama lu, dan angka badge total terpilih secara real-time
        this.render();
    }

    /**
     * Enterprise Bulk Star/Favorite Processor
     * Bertugas membintangi (favorit) banyak buruh sekaligus secara otomatis berdasarkan Array ID.
     * @param {Array} idList - Array berisi kumpulan ID buruh (contoh: [2, 4, 8])
     * @param {Object} options - Konfigurasi tambahan { replace: false }
     * - replace: true -> Menghapus semua bintang lama dan diganti hanya dengan list baru ini.
     * - replace: false -> (Default) Menambahkan bintang ke list baru ini tanpa menghapus buruh yang sudah berbintang sebelumnya.
     */
    bulkStarWorkersByIds(idList, options = { replace: true }) {
        // Validasi awal untuk memastikan input benar-benar berbentuk array
        if (!Array.isArray(idList)) {
            console.error("Gagal eksekusi: Argumen harus berupa Array ID.");
            return;
        }

        // 1. Jika mode REPLACE aktif, matikan semua status bintang (isStarred = false) pada seluruh buruh terlebih dahulu
        if (options.replace) {
            this.workers.forEach(worker => {
                worker.isStarred = false;
            });
        }

        // 2. Konversi idList ke Set String untuk memastikan pencocokan tipe data yang super cepat & robust
        const targetIds = new Set(idList.map(id => String(id)));

        // 3. Lakukan pemindaian data dan nyalakan bintang jika ID cocok
        this.workers.forEach(worker => {
            if (targetIds.has(String(worker.id))) {
                worker.isStarred = true;
            }
        });

        // 4. PERSISTENCE STORAGE & RE-RENDER LIVE UI
        // Wajib simpan perubahan status bintang ke local storage/IndexedDB bawaan lu
        if (typeof this.saveData === 'function') {
            this.saveData();
        }
        
        // Otomatis update zona bintang lama lu dan ikon bintang di list card secara real-time
        this.render();
    }

    injectStarredZone() {
        if (!this.filterWrapper) return;
        
        const zoneWrapper = document.createElement('div');
        zoneWrapper.id = 'dynamic-starred-zone-wrapper';
        zoneWrapper.style.marginTop = '15px';
        zoneWrapper.style.display = 'none';

        // Di sini langsung dibungkus di dalam innerHTML, baris headerRow yang bikin error sudah dibuang
        zoneWrapper.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 0 5px;">
                <span style="font-size: 13px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                    <i class="fas fa-star" style="color: #f59e0b;"></i> Akses Cepat
                </span>
                <button type="button" id="btn-select-all-starred" class="transparent br-none font-bold" style="font-size: 13px; color: #0284c7; cursor: pointer; outline: none;">
                    Centang Favorit
                </button>
            </div>
            <div id="dynamic-starred-chips" class="starred-zone-chips"></div>
        `;

        // Disisipkan di bawah panel filter advance
        this.advancedFilterPanel.after(zoneWrapper);
        
        this.starredZoneWrapper = zoneWrapper;
        this.starredContainer = zoneWrapper.querySelector('#dynamic-starred-chips');
        this.selectAllBtn = zoneWrapper.querySelector('#btn-select-all-starred');
    }

    bindEvents() {
        // 1. Live Search (Multi-Keyword Input)
        if (this.searchInput) {
            this.searchInput.oninput = (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.render();
            };
        }

        // 2. Klik Bintang Utama Bawaan HTML
        if (this.filterStarBtn) {
            this.filterStarBtn.onclick = () => {
                this.onlyShowStarred = !this.onlyShowStarred;
                this.filterStarBtn.classList.toggle('active', this.onlyShowStarred);
                this.render();
            };
        }

        // 3. Centang Massal Zona Favorit
        if (this.selectAllBtn) {
            this.selectAllBtn.onclick = () => {
                const starredWorkers = this.workers.filter(w => w.isStarred);
                if (starredWorkers.length === 0) return;
                const starredIds = starredWorkers.map(w => w.id);
                const isAllStarredSelected = starredIds.every(id => this.selectedIds.has(id));

                starredIds.forEach(id => isAllStarredSelected ? this.selectedIds.delete(id) : this.selectedIds.add(id));
                this.render();
            };
        }

        // 4. Event Status Filter (Semua, Terpilih, Belum Terpilih)
        if (this.advancedFilterPanel) {
            // A. Handler untuk Logic Switch (AND vs OR)
            const btnAnd = this.advancedFilterPanel.querySelector('#btn-match-and');
            const btnOr = this.advancedFilterPanel.querySelector('#btn-match-or');
            
            const applyMatchStyle = (activeBtn, inactiveBtn) => {
                activeBtn.style.background = '#007bff';
                activeBtn.style.color = '#ffffff';
                activeBtn.style.fontWeight = '700';
                
                inactiveBtn.style.background = 'transparent';
                inactiveBtn.style.color = '#64748b';
                inactiveBtn.style.fontWeight = '600';
            };

            btnAnd.onclick = () => {
                this.filterMatchMode = "AND";
                applyMatchStyle(btnAnd, btnOr);
                this.render();
            };

            btnOr.onclick = () => {
                this.filterMatchMode = "OR";
                applyMatchStyle(btnOr, btnAnd);
                this.render();
            };

            // B. Handler untuk Tombol Filter Status Seleksi
            const statusBtns = this.advancedFilterPanel.querySelectorAll('.filter-status-btn');
            statusBtns.forEach(btn => {
                btn.onclick = (e) => {
                    statusBtns.forEach(b => {
                        b.style.background = '#ffffff';
                        b.style.color = '#475569';
                        b.style.borderColor = '#cbd5e1';
                        b.style.fontWeight = '500';
                    });
                    
                    e.target.style.background = '#007bff';
                    e.target.style.color = '#ffffff';
                    e.target.style.borderColor = '#007bff';
                    e.target.style.fontWeight = '600';

                    this.statusFilter = e.target.getAttribute('data-status');
                    this.render();
                };
            });

            // C. Master Reset Action
            this.advancedFilterPanel.querySelector('#btn-reset-filter').onclick = () => {
                this.searchQuery = "";
                if (this.searchInput) this.searchInput.value = "";
                this.onlyShowStarred = false;
                if (this.filterStarBtn) this.filterStarBtn.classList.remove('active');
                this.statusFilter = "all";
                this.filterMatchMode = "AND";
                
                applyMatchStyle(btnAnd, btnOr);
                Object.keys(this.activeFilters).forEach(prop => this.activeFilters[prop].clear());
                
                statusBtns.forEach(b => {
                    b.style.background = '#ffffff';
                    b.style.color = '#475569';
                    b.style.borderColor = '#cbd5e1';
                    b.style.fontWeight = '500';
                });
                
                const defBtn = this.advancedFilterPanel.querySelector('[data-status="all"]');
                defBtn.style.background = '#007bff';
                defBtn.style.color = '#ffffff';
                defBtn.style.borderColor = '#007bff';

                this.render();
            };
        }
    }

    toggleSelection(workerId) {
        this.selectedIds.has(workerId) ? this.selectedIds.delete(workerId) : this.selectedIds.add(workerId);
        this.render();
    }

    // Mendapatkan list role unik dari master data untuk filter chips
    getUniqueRoles() {
        return [...new Set(this.workers.map(w => w.role))];
    }

    render() {
        // =========================================================================
        // ─── 1. RENDER PANEL CHIPS PROPERTI OTOMATIS (ENTERPRISE UI #007bff) ───
        // =========================================================================
        const propContainer = document.getElementById('dynamic-properties-filter-container');
        if (propContainer && this.workers.length > 0) {
            propContainer.innerHTML = '';
            
            // Auto-detect properti bertipe string dari objek data buruh (kecuali id & name)
            const sample = this.workers[0];
            const targetProperties = Object.keys(sample).filter(key => 
                typeof sample[key] === 'string' && key !== 'id' && key !== 'name' && key !== 'isStarred'
            );

            targetProperties.forEach(prop => {
                if (!this.activeFilters[prop]) this.activeFilters[prop] = new Set();
                
                const activeCount = this.activeFilters[prop].size;
                const uniqueValues = [...new Set(this.workers.map(w => w[prop]).filter(Boolean))];
                const labelTitle = prop === 'role' ? 'Peran / Jabatan' : prop.toUpperCase();

                const propBlock = document.createElement('div');
                propBlock.style.cssText = 'border-bottom: 1px dashed #f1f5f9; padding-bottom: 12px;';
                
                // Render Header Kategori + Counter Badge + Bulk Actions (All/Clear)
                propBlock.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; display: flex; align-items: center; gap: 5px;">
                            <span>${labelTitle}</span>
                            ${activeCount > 0 ? `<span style="background: #007bff; color: white; font-size: 9px; padding: 1px 6px; border-radius: 20px; font-weight: bold;">${activeCount}</span>` : ''}
                        </div>
                        <div style="display: flex; gap: 8px; font-size: 10px; font-weight: 700;">
                            <span class="action-all-btn" style="color: #007bff; cursor: pointer; user-select: none;">All</span>
                            <span style="color: #cbd5e1;">|</span>
                            <span class="action-none-btn" style="color: #64748b; cursor: pointer; user-select: none;">Clear</span>
                        </div>
                    </div>
                    <div class="chips-group" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
                `;

                // Handler Aksi Massal (All / Clear) per Kategori Properti
                propBlock.querySelector('.action-all-btn').onclick = () => {
                    uniqueValues.forEach(val => this.activeFilters[prop].add(val));
                    this.render();
                };
                propBlock.querySelector('.action-none-btn').onclick = () => {
                    this.activeFilters[prop].clear();
                    this.render();
                };

                // Menghidupkan tombol Chips Filter dengan warna #007bff
                const groupContainer = propBlock.querySelector('.chips-group');
                uniqueValues.forEach(value => {
                    const isSelected = this.activeFilters[prop].has(value);
                    const chip = document.createElement('button');
                    chip.type = 'button';
                    chip.style.cssText = `
                        padding: 5px 12px; font-size: 11px; border-radius: 6px; font-weight: 600; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.15s ease;
                        ${isSelected ? 'background: #007bff; color: white; border-color: #007bff; box-shadow: 0 2px 4px rgba(0, 123, 255, 0.15);' : 'background: #f8fafc; color: #475569;'}
                    `;
                    chip.innerText = value;
                    
                    chip.onclick = () => {
                        this.activeFilters[prop].has(value) ? this.activeFilters[prop].delete(value) : this.activeFilters[prop].add(value);
                        this.render();
                    };
                    groupContainer.appendChild(chip);
                });

                propContainer.appendChild(propBlock);
            });
        }

        // =========================================================================
        // ─── 2. RENDER ZONA AKSES CEPAT / FAVORIT (STRUKTUR LAMA LU) ───
        // =========================================================================
        if (this.starredContainer) this.starredContainer.innerHTML = '';
        const starredWorkers = this.workers.filter(w => w.isStarred);
        
        if (starredWorkers.length > 0 && this.starredContainer) {
            this.starredZoneWrapper.style.display = 'block';
            const starredIds = starredWorkers.map(w => w.id);
            const isAllStarredSelected = starredIds.every(id => this.selectedIds.has(id));
            this.selectAllBtn.innerText = isAllStarredSelected ? "Batal Centang Favorit" : "Centang Favorit";
            
            starredWorkers.forEach(worker => {
                const isSelected = this.selectedIds.has(worker.id);
                const chip = document.createElement('div');
                chip.className = `chip-worker-star ${isSelected ? 'selected' : ''}`;
                chip.innerHTML = `<i class="fas fa-star"></i> <span>${worker.name}</span>`;
                chip.onclick = () => this.toggleSelection(worker.id);
                this.starredContainer.appendChild(chip);
            });
        } else if (this.starredZoneWrapper) {
            this.starredZoneWrapper.style.display = 'none';
        }

        // =========================================================================
        // ─── 3. MULTI-DIMENSIONAL FILTER LOGIC ENGINE (SUPER ADVANCE) ───
        // =========================================================================
        this.mainContainer.innerHTML = '';
        let mainList = [...this.workers];

        // Saringan A: Filter Bintang Utama (Lama)
        if (this.onlyShowStarred) {
            mainList = mainList.filter(w => w.isStarred);
        }

        // Saringan B: Filter Kurasi Status Seleksi (Semua, Terpilih, Belum)
        if (this.statusFilter === 'selected') {
            mainList = mainList.filter(w => this.selectedIds.has(w.id));
        } else if (this.statusFilter === 'unselected') {
            mainList = mainList.filter(w => !this.selectedIds.has(w.id));
        }

        // Saringan C: Filter Logika Kompleks Atribut Dinamis (Kombinasi AND / OR)
        const activePropKeys = Object.keys(this.activeFilters).filter(k => this.activeFilters[k] && this.activeFilters[k].size > 0);
        if (activePropKeys.length > 0) {
            if (this.filterMatchMode === "AND") {
                // Evaluasi Ketat: Semua kategori filter aktif wajib terpenuhi bersilangan
                mainList = mainList.filter(worker => 
                    activePropKeys.every(prop => this.activeFilters[prop].has(worker[prop]))
                );
            } else {
                // Evaluasi Longgar: Salah satu kategori filter aktif cocok langsung lolos
                mainList = mainList.filter(worker => 
                    activePropKeys.some(prop => this.activeFilters[prop].has(worker[prop]))
                );
            }
        }

        // Saringan D: Filter Pencarian Kolom Input Text Multi-Keyword (Robust Search)
        if (this.searchQuery) {
            const keywords = this.searchQuery.split(' ').filter(k => k);
            mainList = mainList.filter(w => 
                keywords.every(kw => 
                    w.name.toLowerCase().includes(kw) || 
                    (w.role && w.role.toLowerCase().includes(kw))
                )
            );
        }

        // =========================================================================
        // ─── 4. RENDER LIST CARD UTAMA (STRUKTUR ORIGINAL ASLI BAWAAN LU) ───
        // =========================================================================
        if (mainList.length === 0) {
            this.mainContainer.innerHTML = `<div style="padding:20px; text-align:center; color:#64748b; font-size:14px;">Data buruh tidak ditemukan</div>`;
        } else {
            mainList.forEach(worker => {
                const isSelected = this.selectedIds.has(worker.id);
                const card = document.createElement('div');
                card.className = `worker-item-card ${isSelected ? 'selected' : ''}`;
                
                // Memasang kembali struktur markup HTML andalan lo tanpa modifikasi
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

                // Event handler klik area card (kecuali tombol star & checkbox)
                card.onclick = (e) => {
                    if (e.target.classList.contains('icon-star-toggle') || e.target.type === 'checkbox') return;
                    this.toggleSelection(worker.id);
                };

                // Event handler pada elemen checkbox bawan
                const chk = card.querySelector('.worker-checkbox');
                if (chk) {
                    chk.onchange = () => this.toggleSelection(worker.id);
                }

                // Event handler bintang status favorit data
                const starIcon = card.querySelector('.icon-star-toggle');
                if (starIcon) {
                    starIcon.onclick = (e) => {
                        e.stopPropagation();
                        worker.isStarred = !worker.isStarred;
                        this.saveData();
                        this.render(); 
                    };
                }

                this.mainContainer.appendChild(card);
            });
        }

        // Sinkronisasi badge total pilihan di counter global
        if (this.countBadge) this.countBadge.innerText = `${this.selectedIds.size} Terpilih`;
    }

    clearSelection() {
        this.selectedIds.clear(); 
        this.render(); 
    }

    /**
     * Advanced External Filter Engine (Enterprise Grade)
     * Bertugas memproses nilai dari input luar secara otomatis & dinamis.
     * Mendukung Multi-Keyword Biasa + Tokenized Filtering (contoh input: "Ahmad role:supir shift:pagi")
     * * @param {string} inputValue - Nilai mentah dari input teks luar form
     */
    executeEnterpriseExternalFilter(inputValue) {
        if (typeof inputValue !== 'string') return;
        
        const rawQuery = inputValue.trim().toLowerCase();
        
        // 1. RESET STATE FILTER SEBELUMNYA (Agar tidak tabrakan)
        this.searchQuery = "";
        if (this.activeFilters) {
            Object.keys(this.activeFilters).forEach(prop => this.activeFilters[prop].clear());
        } else {
            this.activeFilters = {};
        }

        // Jika input kosong, langsung bersihkan layar dan render data awal
        if (!rawQuery) {
            this.render();
            return;
        }

        // 2. PARSING ENGINE: Memecah input berdasarkan spasi menjadi token-token pintar
        const tokens = rawQuery.split(/\s+/);
        const plainTextKeywords = [];

        tokens.forEach(token => {
            // Deteksi jika token bertipe pencarian properti spesifik (mengandung karakter ':')
            if (token.includes(':') && token.indexOf(':') > 0) {
                const [targetKey, targetValue] = token.split(':');
                
                if (this.workers.length > 0 && targetValue) {
                    // Auto-detect properti di data buruh secara case-insensitive
                    const sampleWorker = this.workers[0];
                    const actualPropKey = Object.keys(sampleWorker).find(key => 
                        key.toLowerCase() === targetKey && typeof sampleWorker[key] === 'string'
                    );
                    
                    if (actualPropKey) {
                        if (!this.activeFilters[actualPropKey]) {
                            this.activeFilters[actualPropKey] = new Set();
                        }
                        
                        // Ambil semua opsi unik yang tersedia pada properti tersebut
                        const uniqueValues = [...new Set(this.workers.map(w => w[actualPropKey]).filter(Boolean))];
                        
                        // Cari opsi yang mengandung nilai dari token (Fuzzy Match)
                        uniqueValues.forEach(val => {
                            if (val.toLowerCase().includes(targetValue)) {
                                this.activeFilters[actualPropKey].add(val);
                            }
                        });
                    } else {
                        // Jika properti tidak terdaftar di objek buruh, anggap sebagai teks pencarian biasa
                        plainTextKeywords.push(token);
                    }
                }
            } else {
                // Jika token teks biasa, kumpulkan untuk pencarian Nama / Peran global
                plainTextKeywords.push(token);
            }
        });

        // 3. ASSIGN HASIL PARSING KE SEARCH QUERY UTAMA
        this.searchQuery = plainTextKeywords.join(" ");

        // 4. LIVE TRIGGER RE-RENDER UI
        // Menjalankan full method render() secara otomatis dengan filter baru yang super akurat
        this.render();
    }

    getSelectedWorkerIds() { return Array.from(this.selectedIds); }
    getSelectedWorkersData() { return this.workers.filter(w => this.selectedIds.has(w.id)); }
}
class RobustLocationDatalist {
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
