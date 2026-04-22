
import Calendar from "./js/calendar";
import { CustomMore, dashboardToggle, workFormLogic } from "./js/ui";

import request from "./js/request";
window.Request = new request();

// Inisialisasi kalender sebagai acuan program
const appCalendar = new Calendar();

CustomMore();
dashboardToggle();
workFormLogic();

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

initCalendarUI();

setTimeout(() => document.querySelectorAll(".shimmer").forEach(elm => elm.classList.add("dis-none")), 1500)