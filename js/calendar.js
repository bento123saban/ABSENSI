// Variabel untuk menyimpan instance tunggal (Singleton)
let instance = null;

/**
 * Class Calendar
 * Mengatur logika kalender dan menjadi acuan waktu/tanggal utama program.
 * Menerapkan pola Singleton: memanggil 'new Calendar()' akan selalu mengembalikan instance yang sama.
 */
export default class Calendar {
    /**
     * @param {Date|string|number} initialDate - Tanggal awal acuan (hanya digunakan saat pembuatan instance pertama)
     */
    constructor(initialDate = new Date()) {
        // Jika instance sudah ada, kembalikan instance yang sudah ada
        if (instance) {
            return instance;
        }

        this.currentDate = new Date(initialDate);
        
        // Simpan instance ke variabel static
        instance = this;

        // Pasang ke window agar bisa diakses global dari file mana pun tanpa import jika perlu
        window.calendarApp = this;
    }

    /**
     * Mendapatkan objek Date saat ini yang menjadi acuan
     * @returns {Date}
     */
    get date() {
        return new Date(this.currentDate);
    }

    /**
     * Mengatur tanggal acuan baru
     * @param {Date|string|number} newDate 
     */
    setDate(newDate) {
        this.currentDate = new Date(newDate);
        return this.date;
    }

    /**
     * Navigasi ke bulan berikutnya
     * @returns {Date}
     */
    nextMonth() {
        const currentDay = this.currentDate.getDate();
        // Set ke tanggal 1 dulu untuk menghindari overflow (misal: 31 Jan -> 31 Feb jadi Maret)
        this.currentDate.setDate(1);
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        
        // Cari hari terakhir di bulan baru
        const lastDayOfNewMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        // Kembalikan ke tanggal asal atau hari terakhir bulan tersebut
        this.currentDate.setDate(Math.min(currentDay, lastDayOfNewMonth));
        
        return this.date;
    }

    /**
     * Navigasi ke bulan sebelumnya
     * @returns {Date}
     */
    prevMonth() {
        const currentDay = this.currentDate.getDate();
        // Set ke tanggal 1
        this.currentDate.setDate(1);
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        
        // Cari hari terakhir di bulan baru
        const lastDayOfNewMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        // Kembalikan ke tanggal asal atau hari terakhir bulan tersebut
        this.currentDate.setDate(Math.min(currentDay, lastDayOfNewMonth));
        
        return this.date;
    }

    /**
     * Navigasi ke hari berikutnya
     * @returns {Date}
     */
    nextDay() {
        const next = new Date(this.currentDate);
        next.setDate(next.getDate() + 1);
        this.currentDate = next;
        return this.date;
    }

    /**
     * Navigasi ke hari sebelumnya
     * @returns {Date}
     */
    prevDay() {
        const prev = new Date(this.currentDate);
        prev.setDate(prev.getDate() - 1);
        this.currentDate = prev;
        return this.date;
    }

    /**
     * Mendapatkan informasi detail tentang bulan saat ini
     * @returns {Object}
     */
    getCalendarInfo() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        return {
            year,
            month,
            monthName: this.currentDate.toLocaleDateString("id-ID", { month: "long" }),
            daysInMonth: new Date(year, month + 1, 0).getDate(),
            firstDay: new Date(year, month, 1).getDay(),
            currentDay: this.currentDate.getDate(),
            fullDateString: this.currentDate.toLocaleDateString("id-ID", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };
    }

    /**
     * Mendapatkan array tanggal untuk tampilan grid kalender
     * Termasuk null untuk padding di awal minggu.
     * @returns {Array<Date|null>}
     */
    getDaysArray() {
        const info = this.getCalendarInfo();
        const days = [];

        // Menambahkan padding di awal minggu (0 = Minggu, 1 = Senin, dst)
        for (let i = 0; i < info.firstDay; i++) {
            days.push(null);
        }

        // Menambahkan objek Date untuk setiap hari di bulan ini
        for (let i = 1; i <= info.daysInMonth; i++) {
            days.push(new Date(info.year, info.month, i));
        }

        return days;
    }
}
 