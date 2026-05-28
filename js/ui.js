

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


export function workFormLogic() {
    const addWorkBtn = document.querySelector("#add-work");
    const workForm = document.querySelector("#work-form");
    const closeFormBtn = document.querySelector("#close-work-form");
    const content = document.querySelector("#content");
    
    if (addWorkBtn && workForm) {
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

    const jenisWork = document.querySelector("#jenis-value")
    const lanjut    = document.querySelector("#lanjutan-content")
    const lanjutTextSearch  = document.querySelector("#lanjut-date-search")

    jenisWork.addEventListener("change", function () {
        const value = this.value
        console.log(this.value)
        if (this.value.toUpperCase() == "LANJUTAN") lanjut.classList.add("active")
        else lanjut.classList.remove("active")
    })

    const lanjutaDateIcon   = document.querySelector("#lanjut-date-icon")
    const lanjutaDateInput  = document.querySelector("#lanjut-date-search")
    
    const lanjutaTextIcon   = document.querySelector("#lanjut-text-icon")
    const lanjutaTextInput  = document.querySelector("#lanjut-text-search")
    const lanjutTextClose   = document.querySelector("#clear-lanjut")

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

    lanjutaTextInput.onkeyup = function (e) {
        if (this.value == "") lanjutTextClose.classList.add("dis-none")
        else lanjutTextClose.classList.remove("dis-none")
    }

    lanjutTextClose.onclick = function () {
        this.classList.add("dis-none")
        lanjutTextSearch.value = ""
    }

    // Photo Input Logic
    const photoInputs = document.querySelectorAll(".photo-input");
    photoInputs.forEach(div => {
        const input = div.querySelector("input");
        div.onclick = (e) => {
            if (e.target.classList.contains("fa-trash")) {
            console.log(e.target)

                const i = e.target
                input.files = null
                div.style.backgroundImage = "";
                div.style.backgroundSize = "";
                div.style.backgroundPosition = "";
                i.classList.remove("fa-trash")
                i.classList.add("fa-camera")
            }
            else {
                input.click();
                input.onchange = (e) => {
                    if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            div.style.backgroundImage = `url(${event.target.result})`;
                            div.style.backgroundSize = "cover";
                            div.style.backgroundPosition = "center";
                            div.querySelector("i").classList.add("fa-trash");
                            div.querySelector("i").classList.remove("fa-camera");
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }
                };
            }
        }
    });

    // Form Date Slider Dummy Logic
    const formDatePrev = document.querySelector("#form-date-slider i:first-child");
    const formDateNext = document.querySelector("#form-date-slider i:last-child");
    const formDateText = document.querySelector("#form-date-slider .align-center");

    // Select All Buruh Logic
    const checkAllBuruh = document.querySelector("#check-all-buruh");
    const buruhCheckboxes = document.querySelectorAll('input[name="buruh"]');

    if (checkAllBuruh) {
        checkAllBuruh.onchange = () => {
            buruhCheckboxes.forEach(cb => {
                cb.checked = checkAllBuruh.checked;
            });
        };

        buruhCheckboxes.forEach(cb => {
            cb.onchange = () => {
                const allChecked = Array.from(buruhCheckboxes).every(c => c.checked);
                checkAllBuruh.checked = allChecked;
            };
        });
    }

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

// Inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    new RobustLocationDatalist();
});