

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

export function absensiList () {
    
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