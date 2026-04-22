

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
                if (span.classList.contains("grey")) return;

                // UI Update
                spans.forEach(sp => sp.classList.remove("grey"));
                span.classList.add("grey");
                
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
            workHead.classList.toggle("pt-1");
        });
    }
}

export function absensiList () {
    
}

export function workFormLogic() {
    const addWorkBtn = document.querySelector("#add-work");
    const workForm = document.querySelector("#work-form");
    const closeFormBtn = document.querySelector("#close-work-form");
    const content = document.querySelector("#content");
    
    if (addWorkBtn && workForm) {
        addWorkBtn.onclick = () => {
            workForm.classList.remove("dis-none");
            if (content) content.classList.add("dis-none");
            document.body.style.overflow = "hidden"; // Prevent background scroll
        };
    }

    if (closeFormBtn && workForm) {
        closeFormBtn.onclick = () => {
            workForm.classList.add("dis-none");
            if (content) content.classList.remove("dis-none");
            document.body.style.overflow = "auto";
        };
    }

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

    // Location Select Logic
    const locationSelect = document.querySelector("#location-select");
    const customLocation = document.querySelector("#custom-location");
    if (locationSelect && customLocation) {
        locationSelect.onchange = () => {
            if (locationSelect.value === "other") {
                customLocation.classList.remove("dis-none");
            } else {
                customLocation.classList.add("dis-none");
            }
        };
    }

    // Continuation Logic
    const isContinuation = document.querySelector("#is-continuation");
    const continuationId = document.querySelector("#continuation-id");
    if (isContinuation && continuationId) {
        isContinuation.onchange = () => {
            if (isContinuation.checked) {
                continuationId.classList.remove("dis-none");
            } else {
                continuationId.classList.add("dis-none");
            }
        };
    }

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