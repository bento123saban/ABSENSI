
import Calendar from "./js/calendar";
import { CustomMore, CustomSelect, dashboardToggle, WorkFormController } from "./js/ui";
import request from "./js/request";
window.Request = new request();

// Inisialisasi kalender sebagai acuan program
const appCalendar = new Calendar();


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js', { type: 'module' })
            .then((registration) => {
                console.log("[SW] Registrasi sukses! Scope:", registration.scope);
                
                // Cek apakah ada update baru
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log("[SW] Konten baru tersedia, silakan refresh.");
                            } else {
                                console.log("[SW] Konten sudah ter-cache secara offline.");
                            }
                        }
                    };
                };
            })
            .catch((error) => {
                console.error("[SW] Registrasi gagal:", error);
            });
    });
} else {
    console.warn("[SW] Browser tidak mendukung Service Worker.");
}

/**
 * Inisialisasi UI Kalender menggunakan class Calendar
 */
function initCalendarUI() {
    const nextBtn = document.querySelector("#calendar-next");
    const prevBtn = document.querySelector("#calendar-prev");
    const calendarMonth = document.querySelector("#calendar-month");
    const calendarDates = document.querySelector("#calendar-dates");

    // Elemen Navigasi Tanggal di Header
    const boxDateNext = document.querySelector("#box-date-next");
    const boxDatePrev = document.querySelector("#box-date-prev");

    if (!calendarDates) return;

    const dateOn = document.querySelector("#date-controller");

    const render = () => {
        const info = appCalendar.getCalendarInfo();
        const days = appCalendar.getDaysArray();
        
        // Update Label Bulan di Kalender
        if (calendarMonth) calendarMonth.textContent = `${info.monthName} ${info.year}`;
        
        // Update Display Tanggal di Header (Acuan Program)
        if (dateOn) {
            const spans = dateOn.querySelectorAll("span");
            if (spans.length >= 3) {
                spans[0].textContent = info.currentDay.toString().padStart(2, "0");
                spans[1].textContent = info.monthName;
                spans[2].textContent = info.year;
            }
        }

        // Render Grid Tanggal
        let html = "";
        days.forEach(date => {
            if (date === null) {
                html += "<div></div>";
            } else {
                const isToday = new Date().toDateString() === date.toDateString();
                html += `
                    <div class="date-box ${isToday ? "blue" : ""} grid-center borad-10">
                        <span>${date.getDate().toString().padStart(2, "0")}</span>
                    </div>
                `;
            }
        });
        calendarDates.innerHTML = html;
    };

    if (nextBtn) nextBtn.onclick = () => {
        appCalendar.nextMonth();
        render();
    };

    if (prevBtn) prevBtn.onclick = () => {
        appCalendar.prevMonth();
        render();
    };

    // Handler Navigasi Hari di Header
    if (boxDateNext) boxDateNext.onclick = () => {
        appCalendar.nextDay();
        render();
    };

    if (boxDatePrev) boxDatePrev.onclick = () => {
        appCalendar.prevDay();
        render();
    };

    render();
}

// Inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    initCalendarUI();
    // new RobustLocationDatalist();
    // Inisialisasi Otomatis saat DOM siap
    window.mainFormLogic = new WorkFormController(); 
});


setTimeout(() => document.querySelectorAll(".shimmer").forEach(elm => elm.classList.add("dis-none")), 1500)