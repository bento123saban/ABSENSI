

export function CustomMore ({elms, callback} = {}) {
    const selector  = elms || ".more-box"
    const allMore   = document.querySelectorAll(selector);
    if (allMore.length === 0) return;

    const startYear = 2026;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    const closeAll = (exceptThisOne = null) => {
        allMore.forEach(more => {
            const list = more.querySelector(".more-list");
            if (list && list !== exceptThisOne) {
                list.classList.add('dis-none');
            }
        });
    };

    allMore.forEach(more => {
        const icon  = more.querySelector(".more-icon");
        const list  = more.querySelector(".more-list");
        const spans = list.querySelectorAll("span");
        const hiden = more.querySelector(".more-input")

        // Toggle Menu
        icon.addEventListener("click", (e) => {
            e.stopPropagation(); // Mencegah bubble ke document
            const isHidden = list.classList.contains("dis-none");
            closeAll(); // Tutup semua yang lain dulu
            
            if (isHidden) {
                list.classList.remove("dis-none");
            }
        });

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
    document.addEventListener('click', () => closeAll());
    
    // UI_log("Custom More ✅")
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

export function absensiList () {
    
}

export function CustomSelect (selector = '.custom-select-container', callback = null) {
    const allSelects = document.querySelectorAll(selector);
    if (allSelects.length === 0) return;

    const closeAllSelects = (exceptThisOne = null) => {
    allSelects.forEach(select => {
        if (select !== exceptThisOne) select.classList.remove('open');
    });
    };

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

        // --- EVENT LISTENERS ---
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllSelects(container);
            container.classList.toggle('open');
        });

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
    document.addEventListener('click', () => closeAllSelects());
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
    const lanjut    = document.querySelector("#lanjutan-ctrl")

    jenisWork.addEventListener("change", function () {
        const value = this.value
        console.log(this.value)
        if (this.value.toUpperCase() == "LANJUTAN") lanjut.classList.remove("dis-none")
        else lanjut.classList.add("dis-none")
    })

    const lanjutaDateIcon = document.querySelector("#lanjut-date-icon")
    const lanjutaDateInput = document.querySelector("#lanjut-date-search")

    lanjutaDateIcon.onclick = () => {
        lanjutaDateIcon.classList.toggle("on")
        if (lanjutaDateIcon.classList.contains("on")) lanjutaDateInput.showPicker()
    }
    lanjutaDateInput.onchange = function () {
        if (this.value == "") return ""
        return new Date(this.value).toLocaleDateString("id-ID", {date : "number", month : "long", year : "number"})
    }
    
    const lanjutaTextIcon = document.querySelector("#lanjut-text-icon")
    const lanjutaTextInput = document.querySelector("#lanjut-text-search")

    // Photo Input Logic
    const photoInputs = document.querySelectorAll(".photo-input");
    photoInputs.forEach(div => {
        const input = div.querySelector("input");
        div.onclick = () => input.click();
        input.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    div.style.backgroundImage = `url(${event.target.result})`;
                    div.style.backgroundSize = "cover";
                    div.style.backgroundPosition = "center";
                    div.querySelector("i").classList.add("dis-none");
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        };
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

    // Lokasi Custom Datalist Logic
    const lokasiInput = document.querySelector("#lokasi");
    const lokasiDatalist = document.querySelector("#lokasi-datalist");
    const clearLokasi = document.querySelector("#clear-lokasi");
    const lokasiStarsBtn = document.querySelector("#lokasi-stars");

    // 1. Configuration & Data
    const CONFIG = {
        data: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Yogyakarta", "Bali"],
        activeClass: 'bg-light-grey', // Ganti sesuai class hover CSS-mu
        hideClass: 'dis-none'
    };

    // 2. Elements Selection
    const nodes = {
        input: document.querySelector("#lokasi"),
        list: document.querySelector("#lokasi-datalist"),
        clear: document.querySelector("#clear-lokasi"),
        star: document.querySelector("#lokasi-stars"),
        wrapper: document.querySelector("#lokasi-wrapper")
    };

    let currentIndex = -1;

    // --- Helper Functions ---

    const toggleList = (show) => {
        nodes.list.classList.toggle(CONFIG.hideClass, !show);
        if (!show) currentIndex = -1;
    };

    const renderList = (searchTerm = "") => {
        const filtered = CONFIG.data.filter(item => 
            item.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length > 0) {
            nodes.list.innerHTML = filtered.map((item, idx) => `
                <div class="p-10 pointer list-item border-bottom-grey" data-value="${item}">
                    ${highlightMatch(item, searchTerm)}
                </div>
            `).join('');
            toggleList(true);
        } else {
            nodes.list.innerHTML = `<div class="p-10 clr-grey fz-14">Tidak ada hasil ditemukan</div>`;
            toggleList(searchTerm.length > 0);
        }
    };

    const highlightMatch = (text, term) => {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, `<strong class="clr-primary">$1</strong>`);
    };

    // --- Core Logic ---

    // Input Interaction
    nodes.input.addEventListener('input', (e) => {
        const val = e.target.value;
        nodes.clear.classList.toggle(CONFIG.hideClass, val.length === 0);
        renderList(val);
    });

    // Focus & Click
    nodes.input.addEventListener('focus', () => {
        if (nodes.input.value.length > 0) renderList(nodes.input.value);
    });

    // Keyboard Navigation (Robust System)
    nodes.input.addEventListener('keydown', (e) => {
        const items = nodes.list.querySelectorAll('.list-item');
        
        if (e.key === 'ArrowDown') {
            currentIndex = (currentIndex + 1) % items.length;
            updateSelection(items);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateSelection(items);
            e.preventDefault();
        } else if (e.key === 'Enter') {
            if (currentIndex > -1) {
                selectItem(items[currentIndex].dataset.value);
            }
            toggleList(false);
        } else if (e.key === 'Escape') {
            toggleList(false);
        }
    });

    const updateSelection = (items) => {
        items.forEach((el, idx) => {
            el.classList.toggle('bg-light-grey', idx === currentIndex);
            if(idx === currentIndex) el.scrollIntoView({ block: 'nearest' });
        });
    };

    const selectItem = (val) => {
        nodes.input.value = val;
        nodes.clear.classList.remove(CONFIG.hideClass);
        toggleList(false);
        // Dispatch event custom jika dibutuhkan oleh sistem lain
        nodes.input.dispatchEvent(new Event('change'));
    };

    // Event Delegation untuk List Item
    nodes.list.addEventListener('click', (e) => {
        const item = e.target.closest('.list-item');
        if (item) selectItem(item.dataset.value);
    });

    // Clear Button
    nodes.clear.addEventListener('click', () => {
        nodes.input.value = "";
        nodes.input.focus();
        nodes.clear.classList.add(CONFIG.hideClass);
        toggleList(false);
    });

    // Star Button (Toggle Favorite Logic)
    nodes.star.addEventListener('click', () => {
        nodes.star.classList.toggle('yellow');
        nodes.star.classList.toggle('clr-grey');
        // Logic tambahan untuk simpan favorite bisa di sini
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!nodes.wrapper.contains(e.target) && !nodes.list.contains(e.target)) {
            toggleList(false);
        }
    });
    
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