export class ApexAlert {
    static isCssInjected = false;

    // 🔥 Inject CSS Modern secara Otomatis (Hanya Sekali)
    static injectCSS() {
        if (this.isCssInjected) return;
        const css = `
            :root {
                --apex-bg: rgba(255, 255, 255, 0.85);
                --apex-overlay: rgba(15, 23, 42, 0.4);
                --apex-text: #0f172a;
                --apex-subtext: #475569;
                --apex-success: #10b981;
                --apex-error: #f43f5e;
                --apex-warning: #f59e0b;
                --apex-info: #0ea5e9;
                --apex-radius: 16px;
            }

            .apex-wrapper {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                z-index: 999999999999999999999999; opacity: 0; pointer-events: none;
                transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: system-ui, -apple-system, sans-serif;
                padding: 20px; box-sizing: border-box;
            }

            .apex-wrapper.apex-show { opacity: 1; pointer-events: auto; }

            .apex-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: var(--apex-overlay);
                backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            }

            .apex-modal {
                position: relative; background: var(--apex-bg);
                backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.4);
                width: 100%; max-width: 440px;
                border-radius: var(--apex-radius);
                padding: 28px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                transform: scale(0.9) translateY(10px);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-sizing: border-box; text-align: center;
            }

            .apex-wrapper.apex-show .apex-modal { transform: scale(1) translateY(0); }

            .apex-icon-box {
                width: 64px; height: 64px; margin: 0 auto 18px;
                display: flex; align-items: center; justify-content: center;
                border-radius: 50%; animation: apex-pulse 2s infinite;
            }

            .apex-title {
                font-size: 20px; font-weight: 700; color: var(--apex-text);
                margin: 0 0 10px 0; line-height: 1.4;
            }

            .apex-content {
                font-size: 14px; color: var(--apex-subtext);
                margin: 0 0 20px 0; line-height: 1.6; word-break: break-word;
            }

            .apex-input-wrapper { margin-bottom: 20px; text-align: left; }
            .apex-input {
                width: 100%; padding: 12px 14px; border: 1.5px solid #e2e8f0;
                border-radius: 10px; font-size: 14px; background: #fff;
                color: var(--apex-text); outline: none; box-sizing: border-box;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .apex-input:focus {
                border-color: var(--apex-info);
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
            }

            .apex-actions { display: flex; gap: 12px; justify-content: center; }

            .apex-btn {
                padding: 11px 22px; border: none; border-radius: 10px;
                font-size: 14px; font-weight: 600; cursor: pointer;
                transition: all 0.2s ease; display: inline-flex;
                align-items: center; justify-content: center; flex: 1;
            }
            .apex-btn:active { transform: scale(0.97); }

            .apex-btn-confirm { color: #fff; background: var(--apex-info); }
            .apex-btn-confirm:hover { filter: brightness(1.08); }

            .apex-btn-cancel { color: #64748b; background: #f1f5f9; }
            .apex-btn-cancel:hover { background: #e2e8f0; }

            /* Jenis Icon SVG */
            .apex-success .apex-icon-box { background: rgba(16, 185, 129, 0.1); color: var(--apex-success); }
            .apex-error .apex-icon-box { background: rgba(244, 63, 94, 0.1); color: var(--apex-error); }
            .apex-warning .apex-icon-box { background: rgba(245, 158, 11, 0.1); color: var(--apex-warning); }
            .apex-info .apex-icon-box { background: rgba(14, 165, 233, 0.1); color: var(--apex-info); }

            @keyframes apex-pulse {
                0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.1); }
                70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
                100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
            }
            /* ==========================================
            ⏳ POIN 4 UPDATE 1: CSS SPINNER LOADING (FIXED)
            ========================================== */
            .apex-btn-loading {
                position: relative;
                /* Gunakan cara ini untuk menyembunyikan teks tanpa merusak warna dasar */
                color: transparent !important; 
                pointer-events: none; /* Cegah klik ganda */
            }

            /* Membuat lingkaran spinner tepat di tengah tombol */
            .apex-btn-loading::after {
                content: "";
                position: absolute;
                width: 18px;
                height: 18px;
                top: 0; left: 0; right: 0; bottom: 0;
                margin: auto;
                
                /* FIX: Set warna border dasar transparan, dan ujungnya warna PUTIH solid */
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-top-color: #ffffff; 
                
                border-radius: 50%;
                animation: apex-spin 0.6s linear infinite;
                box-sizing: border-box;
            }

            /* Jika yang loading adalah tombol confirm, spinner warna putih */
            .apex-btn-confirm.apex-btn-loading::after {
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-top-color: #ffffff;
            }

            /* Jika yang loading adalah tombol cancel, spinner warna abu-abu gelap */
            .apex-btn-cancel.apex-btn-loading::after {
                border: 2px solid rgba(0, 0, 0, 0.1);
                border-top-color: #64748b;
            }

            @keyframes apex-spin {
                to { transform: rotate(360deg); }
            }
            body.apex-locked { overflow: hidden; }

            /* ==========================================
            📳 POIN 5 UPDATE 1: CSS TOAST LAYOUT ENGINE
            ========================================== */
            /* Mengatur wrapper agar berada di pojok kanan atas dan klik bisa tembus ke belakang */
            .apex-wrapper.apex-mode-toast {
                align-items: flex-start;
                justify-content: flex-end;
                pointer-events: none; /* Clicks tembus ke elemen di belakangnya */
                padding: 20px;
            }

            /* Sembunyikan backdrop overlay jika dalam mode toast */
            .apex-wrapper.apex-mode-toast .apex-overlay {
                display: none !important;
            }

            /* Mengubah bentuk modal menjadi horizontal strip kecil ala toast */
            .apex-wrapper.apex-mode-toast .apex-modal {
                pointer-events: auto; /* Tombol di dalam toast tetap bisa diklik */
                max-width: 360px;
                padding: 14px 18px;
                text-align: left;
                display: flex;
                align-items: center;
                gap: 14px;
                box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);
                transform: translateY(-20px) scale(0.95); /* Animasi muncul dari atas */
            }

            /* Reset animasi transform khusus mode toast */
            .apex-wrapper.apex-show.apex-mode-toast .apex-modal {
                transform: translateY(0) scale(1);
            }

            /* Perkecil ukuran box icon untuk toast agar proporsional */
            .apex-wrapper.apex-mode-toast .apex-icon-box {
                width: 36px;
                height: 36px;
                margin: 0;
                flex-shrink: 0;
            }
            .apex-wrapper.apex-mode-toast .apex-icon-box svg {
                width: 20px;
                height: 20px;
            }

            /* Bungkus teks agar menumpuk vertikal ke bawah */
            .apex-toast-body {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            /* Perkecil tipografi teks dalam toast */
            .apex-wrapper.apex-mode-toast .apex-title {
                font-size: 15px;
                margin: 0 0 2px 0;
            }
            .apex-wrapper.apex-mode-toast .apex-content {
                font-size: 13px;
                margin: 0;
            }

            /* Sembunyikan tombol aksi default pada toast agar bersih (autoClose yang bekerja) */
            .apex-wrapper.apex-mode-toast .apex-actions {
                display: none !important;
            }

            /* ==========================================
            📋 POIN 6 UPDATE 1: CSS MULTI-FORM SCHEMA
            ========================================== */
            .apex-form-group {
                margin-bottom: 14px;
                text-align: left;
            }

            .apex-form-label {
                display: block;
                font-size: 13px;
                font-weight: 600;
                color: var(--apex-subtext);
                margin-bottom: 6px;
            }

            /* Biar tampilan select/dropdown konsisten dengan input biasa */
            select.apex-input {
                appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 14px center;
                background-size: 16px;
                padding-right: 40px;
            }

            textarea.apex-input {
                resize: vertical;
                min-height: 80px;
            }
            /* ==========================================
            💥 POIN 6 ULTRA UPDATE: INLINE VALIDATION UI
            ========================================== */
            /* Border merah menyala dan efek shadow halus saat input eror */
            .apex-input-error {
                border-color: #ef4444 !important;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
            }

            /* Desain teks eror di bawah input */
            .apex-error-text {
                display: block;
                color: #ef4444;
                font-size: 12px;
                font-weight: 500;
                margin-top: 5px;
                text-align: left;
                animation: apex-fade-in 0.2s ease-out forwards;
            }

            /* Efek Getar (Shake Animation) kelas enterprise jika validasi gagal */
            .apex-shake {
                animation: apex-shake 0.4s ease-in-out;
            }

            @keyframes apex-shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-6px); }
                40%, 80% { transform: translateX(6px); }
            }

            @keyframes apex-fade-in {
                from { opacity: 0; transform: translateY(-4px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
        this.isCssInjected = true;
    }

    // Array kosong untuk menampung paket modal [{ options, resolve }, ...]
    static queue = [];       
    
    // Boolean untuk penanda: true jika ada modal di layar, false jika layar kosong
    static isShowing = false;

    // Menyimpan elemen DOM yang aktif sebelum modal muncul, biar bisa dikembalikan nanti
    static previousActiveElement = null;

    static fire(options = {}) {
        // Pastikan CSS disuntikkan di awal (hanya sekali)
        this.injectCSS();

        // Kembalikan Promise agar di script utama lu tetap bisa pakai 'await'
        return new Promise((resolve) => {
            // Bungkus konfigurasi (options) dan fungsi penyelesai (resolve) jadi 1 paket tugas
            const modalTask = { options, resolve };
            
            // Dorong paket tugas ke dalam antrean (paling belakang)
            this.queue.push(modalTask);
            
            // KONDISI: Jika tidak ada modal yang sedang tampil di layar,
            // langsung eksekusi tugas pertama sekarang juga!
            if (!this.isShowing) {
                this._processQueue();
            }
        });
    }

    static _processQueue() {
        // 1. KATUP PENGAMAN: Jika antrean di memori sudah kosong total,
        // matikan status tayang (isShowing = false) dan hentikan mesin.
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        // 2. Jika masih ada antrean, kunci status layar menjadi TRUE
        this.isShowing = true;

        // 3. Ambil paket tugas paling depan (Metode Antrean FIFO: First-In, First-Out)
        const { options, resolve } = this.queue.shift();

        // Catat elemen (misal: tombol "Hapus") yang memicu modal ini
        this.previousActiveElement = document.activeElement;
        
        // 4. Kompilasi konfigurasi default (Sama seperti logika awal kode lama lu)
        const settings = {
            title: options.title || 'Pemberitahuan',
            text: options.text || '',
            html: options.html || '',
            type: options.type || 'info',
            showCancel: options.showCancel || false,
            confirmText: options.confirmText || 'OK',
            cancelText: options.cancelText || 'Batal',
            placeholder: options.placeholder || '',
            inputValue: options.inputValue || '',
            isPrompt: options.isPrompt || false,
            inputType: options.inputType || 'text',
            allowOutsideClick: options.allowOutsideClick !== false,
            autoClose: options.autoClose || null,
            preConfirm: options.preConfirm || null,
            // ==========================================
            // 📳 POIN 5 UPDATE 2: DEFAULT LAYOUT MODE
            // ==========================================
            mode: options.mode || 'modal', // Bisa berisi 'modal' atau 'toast'
            // Jika mode-nya TOAST dan user lupa set durasi, otomatis kita pasang 3000ms (3 detik)
            autoClose: options.autoClose || (options.mode === 'toast' ? 3000 : null),
            schema: options.schema || null, // Menampung array of object form field
            ...options // Timpa dengan option kustom dari user
        };

        // ==========================================
        // 📳 POIN 5 UPDATE 3: CONDITIONAL BLOCK, ICONS & HTML (FIXED VERSION)
        // ==========================================
        
        // 1. Cek mode: Hanya kunci scroll body JIKA mode yang digunakan adalah MODAL biasa
        if (settings.mode === 'modal') {
            document.body.classList.add('apex-locked');
        }

        // 2. Deklarasi ulang object ICONS yang sempat hilang kemakan snippet
        const icons = {
            success: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11"></polyline></svg>`,
            error: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            warning: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            info: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
        };

        // 3. Buat element wrapper dengan class mode dinamis
        const wrapper = document.createElement('div');
        wrapper.className = `apex-wrapper apex-${settings.type} apex-mode-${settings.mode}`;
        
        // ==========================================
        // 📋 POIN 6 UPDATE 3: DYNAMIC FORM BUILDER ENGINE
        // ==========================================
        let inputHtml = '';

        // JIKA DEVELOPER MENYEDIAKAN SCHEMA (FORM MULTI-FIELD)
        if (settings.schema && Array.isArray(settings.schema)) {
            inputHtml = `<div class="apex-dynamic-form">`;
            
            settings.schema.forEach((field, index) => {
                const fieldId = field.id || `apex-field-${field.name || index}`;
                const labelHtml = field.label ? `<label class="apex-form-label" for="${fieldId}">${field.label}</label>` : '';
                const placeholder = field.placeholder || '';
                const value = field.value !== undefined ? field.value : '';
                const type = field.type || 'text';

                inputHtml += `<div class="apex-form-group"> ${labelHtml}`;

                if (type === 'select') {
                    // Generator Elemen Dropdown (Select)
                    inputHtml += `<select class="apex-input data-apex-field" id="${fieldId}" name="${field.name || fieldId}">`;
                    if (field.options && Array.isArray(field.options)) {
                        field.options.forEach(opt => {
                            const optVal = typeof opt === 'object' ? opt.value : opt;
                            const optText = typeof opt === 'object' ? opt.text : opt;
                            const selected = optVal == value ? 'selected' : '';
                            inputHtml += `<option value="${optVal}" ${selected}>${optText}</option>`;
                        });
                    }
                    inputHtml += `</select>`;
                } else if (type === 'textarea') {
                    // Generator Elemen Textarea (Catatan panjang)
                    inputHtml += `<textarea class="apex-input data-apex-field" id="${fieldId}" name="${field.name || fieldId}" placeholder="${placeholder}">${value}</textarea>`;
                } else {
                    // Generator Elemen Input Standar (text, number, date, password, dll)
                    inputHtml += `<input type="${type}" class="apex-input data-apex-field" id="${fieldId}" name="${field.name || fieldId}" placeholder="${placeholder}" value="${value}">`;
                }

                inputHtml += `</div>`;
            });

            inputHtml += `</div>`;

        // FALLBACK: Jika tidak ada schema tapi isPrompt bernilai true (Gunakan input tunggal bawaan lama)
        } else if (settings.isPrompt) {
            inputHtml = `<div class="apex-input-wrapper"><input type="${settings.inputType}" class="apex-input" id="apex-prompt-field" placeholder="${settings.placeholder}" value="${settings.inputValue}"></div>`;
        }

        let contentHtml = settings.html ? `<div class="apex-content">${settings.html}</div>` : `<div class="apex-content">${settings.text}</div>`;

        // 4. Kondisikan struktur layout teks berdasarkan modenya
        const bodyHtml = settings.mode === 'toast' 
            ? `<div class="apex-toast-body">
                <h3 class="apex-title">${settings.title}</h3>
                ${contentHtml}
               </div>`
            : `<h3 class="apex-title">${settings.title}</h3>
               ${contentHtml}`;

        // 5. Suntik struktur ke DOM wrapper
        wrapper.innerHTML = `
            <div class="apex-overlay"></div>
            <div class="apex-modal">
                <div class="apex-icon-box">${icons[settings.type]}</div>
                ${bodyHtml}
                ${inputHtml}
                <div class="apex-actions">
                    ${settings.showCancel ? `<button type="button" class="apex-btn apex-btn-cancel" id="apex-btn-cancel">${settings.cancelText}</button>` : ''}
                    <button type="button" class="apex-btn apex-btn-confirm" id="apex-btn-confirm">${settings.confirmText}</button>
                </div>
            </div>
        `;

        const confirmBtn = wrapper.querySelector('#apex-btn-confirm');
        if (settings.type === 'success') confirmBtn.style.setProperty('--apex-info', 'var(--apex-success)');
        if (settings.type === 'error') confirmBtn.style.setProperty('--apex-info', 'var(--apex-error)');
        if (settings.type === 'warning') confirmBtn.style.setProperty('--apex-info', 'var(--apex-warning)');

        document.body.appendChild(wrapper);
        setTimeout(() => wrapper.classList.add('apex-show'), 10);

        document.body.appendChild(wrapper);
        setTimeout(() => wrapper.classList.add('apex-show'), 10);


        // Ambil semua elemen di dalam modal yang bisa menerima fokus input/klik
        const focusableSelectors = 'button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
        const focusableElements = wrapper.querySelectorAll(focusableSelectors);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Otomatis arahkan fokus utama saat modal terbuka
        if (settings.isPrompt) {
            // Jika prompt, utamakan langsung fokus ke kotak input
            const inputField = wrapper.querySelector('#apex-prompt-field');
            setTimeout(() => inputField ? inputField.focus() : null, 150);
        } else if (firstFocusable) {
            // Jika alert biasa, fokuskan ke tombol pertama (Cancel / Confirm)
            setTimeout(() => firstFocusable.focus(), 150);
        }

        // Handler fungsi keyboard khusus tombol TAB
        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return; // Cuekin jika yang ditekan bukan tombol Tab

            if (e.shiftKey) { 
                // Kondisi: SHIFT + TAB (Navigasi Mundur)
                // Jika posisi fokus ada di elemen Paling Pertama, banting fokus ke Paling Akhir
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault(); // Batalkan aksi tab bawaan browser
                }
            } else { 
                // Kondisi: TAB Saja (Navigasi Maju)
                // Jika posisi fokus ada di elemen Paling Akhir, balikin fokus ke Paling Pertama
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault(); // Batalkan aksi tab bawaan browser
                }
            }
        };

        // Pasang pendengar event keyboard ke dalam wrapper modal
        wrapper.addEventListener('keydown', handleKeyDown);

        // 🔄 TEARDOWN PIPELINE: Fungsi Penutup yang Sekarang Menggerakkan Antrean
        const closePopup = (outputValue) => {
            wrapper.classList.remove('apex-show');
            // ==========================================
            // 📳 POIN 5 UPDATE 4: SAFE UNLOCK
            // ==========================================
            if (settings.mode === 'modal') {
                document.body.classList.remove('apex-locked');
            }
            // 1. Cabut event listener keyboard agar tidak terjadi kebocoran memori (memory leak)
            wrapper.removeEventListener('keydown', handleKeyDown);
            
            setTimeout(() => {
                wrapper.remove();

                // 2. Kembalikan fokus ke tombol pemicu awal di halaman web sebelum modal merusak fokus
                if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
                    this.previousActiveElement.focus();
                }
                
                // 1. Resolve pemicu awal terlebih dahulu agar alur kode asinkronus lu berjalan normal
                resolve(outputValue);
                
                // 2. TRIGGER ANTREAN BERIKUTNYA: Panggil fungsi pemroses untuk menarik data selanjutnya
                this._processQueue();
            }, 250);
        };

        // Event Listeners (Tetap mengarah ke fungsi closePopup baru yang cerdas)
        // ==========================================
        // ⏳ POIN 4 UPDATE 3: ASYNC INTERCEPTOR ON CLICK
        // ==========================================
        confirmBtn.onclick = async () => {
            // ==========================================
            // 🛡️ 1. RESET STATE EROR SEBELUMNYA (CLEANING)
            // ==========================================
            wrapper.querySelectorAll('.apex-error-text').forEach(el => el.remove());
            wrapper.querySelectorAll('.apex-input-error').forEach(el => el.classList.remove('apex-input-error'));
            wrapper.querySelectorAll('.apex-shake').forEach(el => el.classList.remove('apex-shake'));

            // ==========================================
            // 🛡️ 2. DECLARATIVE VALIDATION ENGINE CORE
            // ==========================================
            let hasError = false;

            if (settings.schema && Array.isArray(settings.schema)) {
                // Iterasi setiap field yang ada di schema untuk dicek rule-nya
                for (const field of settings.schema) {
                    const fieldId = field.id || `apex-field-${field.name}`;
                    const inputEl = wrapper.querySelector(`#${fieldId}`);
                    
                    // Lewati jika element input tidak ditemukan di DOM
                    if (!inputEl) continue;

                    const formGroup = inputEl.closest('.apex-form-group');
                    const value = inputEl.value.trim();
                    let errorMessage = '';

                    // Jika field memiliki aturan (rules) validasi
                    if (field.rules) {
                        const rules = field.rules;

                        // Rule A: Required (Wajib Diisi)
                        if (rules.required && !value) {
                            errorMessage = typeof rules.required === 'string' ? rules.required : 'Kolom ini wajib diisi, bro!';
                        }
                        // Rule B: MinLength (Minimal Karakter)
                        else if (rules.minLength && value.length < rules.minLength.value) {
                            errorMessage = rules.minLength.message || `Minimal harus ${rules.minLength.value} karakter!`;
                        }
                        // Rule C: Custom Function Validator (Fungsi Logika Bebas dari Developer)
                        else if (typeof rules.custom === 'function') {
                            const customValidationResult = rules.custom(value);
                            if (customValidationResult !== true) {
                                errorMessage = typeof customValidationResult === 'string' ? customValidationResult : 'Format data salah!';
                            }
                        }
                    }

                    // JIKA INPUTAN BERMASALAH (ERROR TRIPPED)
                    if (errorMessage) {
                        hasError = true;

                        // Aplikasikan class error visual dan trigger efek getar (shake)
                        inputEl.classList.add('apex-input-error');
                        if (formGroup) formGroup.classList.add('apex-shake');

                        // Buat teks pesan eror di bawah elemen
                        const errorSpan = document.createElement('span');
                        errorSpan.className = 'apex-error-text';
                        errorSpan.innerText = errorMessage;
                        if (formGroup) formGroup.appendChild(errorSpan);

                        // 🔥 ADVANCE UX: REAL-TIME REACTIVE LISTENER
                        // Begitu user mulai mengetik/mengubah isi input, langsung hapus eror secara real-time!
                        const clearErrorRealtime = () => {
                            inputEl.classList.remove('apex-input-error');
                            errorSpan.remove();
                            inputEl.removeEventListener('input', clearErrorRealtime);
                            inputEl.removeEventListener('change', clearErrorRealtime);
                        };
                        inputEl.addEventListener('input', clearErrorRealtime);
                        inputEl.addEventListener('change', clearErrorRealtime);
                    }
                }
            }

            // HENTIKAN PROSES EKSEKUSI JIKA ADA VALIDASI YANG GAGAL
            // Tombol loading tidak akan jalan, modal tidak akan menutup, data user aman aman saja.
            if (hasError) return;


            // ==========================================
            // 📋 3. HARVESTER DATA FORM (JIKA LOLOS VALIDASI)
            // ==========================================
            let inputValue;

            if (settings.schema && Array.isArray(settings.schema)) {
                inputValue = {};
                const fields = wrapper.querySelectorAll('.data-apex-field');
                fields.forEach(field => {
                    const name = field.getAttribute('name');
                    if (name) {
                        inputValue[name] = field.value;
                    }
                });
            } else {
                inputValue = settings.isPrompt 
                    ? wrapper.querySelector('#apex-prompt-field').value 
                    : true;
            }


            // ==========================================
            // ⏳ 4. ASYNC INTERCEPTOR PROCESSOR
            // ==========================================
            if (typeof settings.preConfirm === 'function') {
                try {
                    confirmBtn.classList.add('apex-btn-loading');
                    confirmBtn.disabled = true;
                    
                    const cancelBtn = wrapper.querySelector('#apex-btn-cancel');
                    if (cancelBtn) cancelBtn.disabled = true;

                    const result = await settings.preConfirm(inputValue);

                    if (result === false) {
                        throw new Error('Validasi eksternal preConfirm gagal.');
                    }

                    closePopup(result !== undefined && result !== true ? result : inputValue);

                } catch (error) {
                    confirmBtn.classList.remove('apex-btn-loading');
                    confirmBtn.disabled = false;
                    
                    const cancelBtn = wrapper.querySelector('#apex-btn-cancel');
                    if (cancelBtn) cancelBtn.disabled = false;
                    
                    console.warn('ApexAlert Async Interceptor Catch:', error);
                }
            } else {
                closePopup(inputValue);
            }
        };

        const cancelBtn = wrapper.querySelector('#apex-btn-cancel');
        if (cancelBtn) {
            cancelBtn.onclick = () => closePopup(settings.isPrompt ? null : false);
        }

        if (settings.allowOutsideClick) {
            wrapper.querySelector('.apex-overlay').onclick = () => {
                closePopup(settings.isPrompt ? null : false);
            };
        }

        if (settings.autoClose && typeof settings.autoClose === 'number') {
            setTimeout(() => {
                closePopup(settings.isPrompt ? null : false);
            }, settings.autoClose);
        }
    }

    // 🚀 SHORTCUT CEPAT VIP API
    static success(title, text) {
        return this.fire({ type: 'success', title, text });
    }

    static error(title, text) {
        return this.fire({ type: 'error', title, text });
    }

    static warning(title, text) {
        return this.fire({ type: 'warning', title, text });
    }

    static info(title, text) {
        return this.fire({ type: 'info', title, text });
    }

    static confirm(title, text, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal') {
        return this.fire({
            type: 'warning',
            title,
            text,
            showCancel: true,
            confirmText,
            cancelText
        });
    }

    static prompt(title, placeholder = '', inputValue = '', inputType = 'text') {
        return this.fire({
            type: 'info',
            title,
            isPrompt: true,
            placeholder,
            inputValue,
            inputType,
            showCancel: true,
            confirmText: 'Kirim',
            cancelText: 'Batal'
        });
    }
}
/*
// // 1. Queue System (Sistem Antrean Berlapis)
// // Kasus: Menampilkan rangkaian notifikasi atau wizard berurutan (misal: pengenalan fitur baru atau proses validasi data bertahap). Tanpa sistem antrean, modal kedua akan menimpa modal pertama secara paksa.
// // Kita panggil 3 ApexAlert sekaligus secara bersamaan.
// // Sistem antrean internal akan menahan modal ke-2 dan ke-3, lalu memunculkannya bergantian.

// // Modal Pertama dalam antrean
// ApexAlert.fire({
//     type: 'info',
//     title: 'Langkah 1: Cek Koneksi',
//     text: 'Sistem sedang memverifikasi GPS dan jaringan lokal Ambon.',
//     confirmText: 'Lanjut'
// }).then(() => {
//     console.log('User menyelesaikan Langkah 1');
// });

// // Modal Kedua (Otomatis antre, muncul setelah Modal Pertama di-klik OK)
// ApexAlert.fire({
//     type: 'warning',
//     title: 'Langkah 2: Sinkronisasi Data',
//     text: 'Pastikan data sampah harian di lokal sudah lu backup sebelum upload.',
//     confirmText: 'Saya Mengerti'
// });

// // Modal Ketiga (Otomatis antre paling belakang)
// ApexAlert.fire({
//     type: 'success',
//     title: 'Langkah 3: Selesai',
//     text: 'Semua antrean inisialisasi sistem berhasil dieksekusi!',
//     confirmText: 'Buka Aplikasi'
// });


// // 2. Accessibility & Outside Click Preventer
// // Kasus: Menampilkan modal krusial yang tidak boleh dilewati begitu saja oleh user. Kita mengunci navigasi keyboard (Tab, Enter, Esc) dan mencegah modal menutup jika user tidak sengaja mengklik area luar (overlay kosong).
// ApexAlert.fire({
//     type: 'warning',
//     title: 'Hapus Data Permanen?',
//     text: 'Data laporan ini akan hilang dari sistem dan tidak bisa dikembalikan!',
//     showCancel: true,
//     confirmText: 'Ya, Hapus!',
//     cancelText: 'Batal',

//     // 🔥 FITUR 3: Mencegah user menutup modal saat klik sembarang di luar kotak dialog
//     allowOutsideClick: false, 

//     // Poin Aksesibilitas (Internal Engine):
//     // - Jika user tekan 'Escape', modal tidak akan menutup (karena dilindungi overlay).
//     // - Jika user tekan 'Tab', fokus pointer hanya akan berputar di antara tombol "Batal" dan "Ya, Hapus!".
//     // - Teks tidak sengaja terpilih atau klik tembus ke belakang akan diblokir total.
// });

// // 3. Dynamic Async Loading State (Anti Double-Submit)
// // Kasus: Menembak API server untuk menyimpan data. Ketika user klik "Simpan", tombol langsung berubah jadi loading spinner, tombol batal dikunci, dan modal tertahan sampai proses server selesai.
// ApexAlert.fire({
//     type: 'info',
//     title: 'Kirim Data Sampah',
//     text: 'Kirim estimasi volume sampah hari ini ke server pusat?',
//     showCancel: true,
//     confirmText: 'Kirim',
    
//     // 🔥 FITUR 4: Interceptor Asinkronus
//     preConfirm: async (value) => {
//         try {
//             // 1. Simulasi proses nembak API menggunakan fetch (delay 2.5 detik)
//             await new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     // Anggap saja server berhasil merespons dengan sukses
//                     resolve(true); 
//                 }, 2500);
//             });

//             // Catatan: Jika di sini lu ingin membatalkan penutupan modal karena validasi gagal,
//             // lu tinggal ketik: return false;
            
//         } catch (error) {
//             // Jika network error atau server down, lempar error agar UI pulih kembali
//             alert('Koneksi internet bermasalah, silakan coba lagi.');
//             throw error; 
//         }
//     }
// }).then((result) => {
//     // Blok ini HANYA AKAN JALAN setelah fungsi preConfirm di atas selesai (resolve)
//     if (result) {
//         ApexAlert.fire({ type: 'success', title: 'Terpuji!', text: 'Laporan sukses terkirim.' });
//     }
// });

// // 4. Multi-Layout Engine (Toast Mode Switcher)
// // Kasus: Menampilkan notifikasi non-interuptif (tidak mengganggu). Muncul di pojok kanan atas, otomatis hilang sendiri, tidak mengunci layar, dan klik user bisa menembus latar belakang.
// // Contoh 1: Toast Sukses Standar (Otomatis close dalam 3 detik bawaan engine)
// ApexAlert.fire({
//     mode: 'toast',      // 🔥 Ubah layout jadi mode toast melayang di pojok kanan atas
//     type: 'success',    // Warna tema hijau sukses
//     title: 'Tersimpan',
//     text: 'Profil berhasil diperbarui.'
// });
// // Contoh 2: Toast Peringatan Custom Durasi (Hilang dalam 5 detik)
// ApexAlert.fire({
//     mode: 'toast',
//     type: 'warning',
//     title: 'Koneksi Lemah',
//     text: 'Sistem mendeteksi fluktuasi jaringan.',
//     autoClose: 5000     // Ditahan selama 5000ms (5 detik) sebelum hancur otomatis
// });

// 5. Dynamic Form Schema Binder (Advanced Prompt)
// Kasus: Mengganti form HTML manual yang ribet. Cukup lempar array skema, ApexAlert akan menggambar inputan berupa Text, Select (Dropdown), dan Textarea, lalu memanen hasilnya dalam bentuk satu objek utuh.
// ApexAlert.fire({
//     type: 'info',
//     title: 'Input Data Sampah Lapangan',
//     showCancel: true,
//     confirmText: 'Simpan',
//     schema: [
//         {
//             type: 'text',
//             name: 'nama_petugas',
//             label: 'Nama Petugas Lapangan',
//             placeholder: 'Masukkan nama lengkap',
//             // 🔥 ATURAN VALIDASI: Cukup tulis deklaratif gini!
//             rules: {
//                 required: 'Nama petugas gak boleh kosong, bro!' // Pesan kustom
//             }
//         },
//         {
//             type: 'number',
//             name: 'volume',
//             label: 'Volume Sampah Masuk (Kg)',
//             placeholder: 'Contoh: 80',
//             rules: {
//                 required: 'Volume harus diisi!',
//                 // Kustom validator: misal volume sampah gak masuk akal kalau di bawah 10Kg
//                 custom: (val) => {
//                     if (Number(val) < 10) return 'Volume sampah terlalu sedikit, minimal 10 Kg!';
//                     if (Number(val) > 5000) return 'Volume overload! Maksimal data input 5000 Kg.';
//                     return true; // Kembalikan true jika lolos validasi
//                 }
//             }
//         }
//     ],
//     preConfirm: async (formData) => {
//         // Blok ini HANYA AKAN JALAN kalau lolos validasi ketat di atas!
//         // Di sini tinggal fokus nembak API server dengan tenang tanpa takut data corrupt/kosong
//         await new Promise(resolve => setTimeout(resolve, 2000));
//     }
// });
*/
// --


// ---------------------------------------------------------------------------


/**
 * ApexDB - Super Advanced Static IndexedDB Wrapper
 * Aman dari Race-Condition, Berbasis Promise & Auto-Connect
 */
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
/*
// =========================================================================
// DATA MOCK UNTUK ACUAN UJI COBA (PASTIKAN SUDAH MASUK KEDALAM STORE 'reports')
// =========================================================================
const mockData = [
    { id: "R-01", lokasi: "Batu Merah, Sirimau Ambon", petugas: { nama: "Benhard Sabandar", role: "PNS" }, limbah: { volume: 15, tipe: "Organik" }, status: "Pending", tags: ["Darurat", "Banjir"] },
    { id: "R-02", lokasi: "Honipopu, Nusaniwe", petugas: { nama: "Siti Aminah", role: "Kontraktor" }, limbah: { volume: 5, tipe: "Anorganik" }, status: "Selesai", tags: ["Rutin"] },
    { id: "R-03", lokasi: "Galala, Sirimau Ambon", petugas: { nama: "Benhard Sabandar" }, limbah: { volume: 22 }, status: "Pending", tags: ["Darurat"] }, // ⚠️ Kunci 'role' & 'tipe' absen
    { id: "R-04", lokasi: "Passo, Baguala", status: "Selesai" } // ⚠️ Object 'petugas' & 'limbah' bolong total!
];
// =========================================================================
// RUNNER UNTUK JALANKAN SEMUA KASUS UJI (TEST CASES)
// =========================================================================
async function jalankanSemuaUjiCoba() {
    console.log("🚀 MEMULAI PENGUJIAN ENTERPRISE APEXDB QUERY ENGINE...\n");

    // ---------------------------------------------------------------------
    // KASUS 1: Pencarian Multi-Frasa Berbasis Koma (All-to-All Cross Matching)
    // ---------------------------------------------------------------------
    try {
        const hasilCase1 = await ApexDB.query('reports', {
            search: {
                query: "Sirimau Ambon, Pending", // Multi-phrase pencarian bebas spasi di dalam frasa
                fields: ["lokasi", "status"]    // Scan di dua kolom ini secara silang
            }
        });
        // EKSPEKTASI OUTPUT: Data R-01 dan R-03 (R-04 diabaikan karena tidak cocok)
        console.log("✅ Kasus 1 - Multi-Frasa Koma Berhasil:", hasilCase1);
    } catch (error) {
        console.error("❌ Kasus 1 Gagal:", error);
    }

    // ---------------------------------------------------------------------
    // KASUS 2: Filter Nilai pada Objek Bersarang (Deep-Nested Filter)
    // ---------------------------------------------------------------------
    try {
        const hasilCase2 = await ApexDB.query('reports', {
            filters: [
                { 
                    field: "petugas.role", // Menembus object bersarang memakai dot-notation
                    operator: "==", 
                    value: "Kontraktor" 
                }
            ]
        });
        // EKSPEKTASI OUTPUT: Mengembalikan data R-02 (Siti Aminah adalah Kontraktor)
        console.log("✅ Kasus 2 - Deep Nested Filter Berhasil:", hasilCase2);
    } catch (error) {
        console.error("❌ Kasus 2 Gagal:", error);
    }

    // ---------------------------------------------------------------------
    // KASUS 3: Penanganan Katup Pengaman (Handling Data Bolong / Missing Fields)
    // ---------------------------------------------------------------------
    try {
        const hasilCase3 = await ApexDB.query('reports', {
            filters: [
                { 
                    field: "limbah.volume", // R-04 bolong total di properti ini
                    operator: ">", 
                    value: 10 
                }
            ]
        });
        // EKSPEKTASI OUTPUT: Hanya R-01 (15) dan R-03 (22). R-04 skip aman tanpa crash!
        console.log("✅ Kasus 3 - Safe Missing Field Guard Berhasil:", hasilCase3);
    } catch (error) {
        console.error("❌ Kasus 3 Gagal:", error);
    }

    // ---------------------------------------------------------------------
    // KASUS 4: Logika Kombinasi Kompleks Bersyarat (AND + OR Matrix)
    // ---------------------------------------------------------------------
    try {
        const hasilCase4 = await ApexDB.query('reports', {
            filters: [
                { field: "status", operator: "==", value: "Pending" },
                { field: "limbah.volume", operator: ">", value: 10, logic: "AND" }, // DAN Volume > 10
                { field: "lokasi", operator: "contains", value: "Nusaniwe", logic: "OR" } // ATAU lokasinya di Nusaniwe
            ]
        });
        // EKSPEKTASI OUTPUT: Mengembalikan R-01 & R-03 (Lolos jalur AND), serta R-02 (Lolos jalur OR)
        console.log("✅ Kasus 4 - Kombinasi Matrix Logika Berhasil:", hasilCase4);
    } catch (error) {
        console.error("❌ Kasus 4 Gagal:", error);
    }

    // ---------------------------------------------------------------------
    // KASUS 5: Filter Kalkulasi Kustom (Custom Lambda Function)
    // ---------------------------------------------------------------------
    try {
        const hasilCase5 = await ApexDB.query('reports', {
            filters: [
                {
                    operator: "custom",
                    fn: (item) => {
                        // Proteksi data internal secara manual di dalam fungsi kustom
                        if (!item.petugas || !item.limbah || !item.limbah.volume) return false;
                        
                        const panjangNama = item.petugas.nama.length;
                        const totalKalkulasi = panjangNama + item.limbah.volume;
                        
                        // Kembalikan true jika hasil penjumlahan bernilai GENAP
                        return totalKalkulasi % 2 === 0;
                    }
                }
            ]
        });
        console.log("✅ Kasus 5 - Custom Lambda Engine Berhasil:", hasilCase5);
    } catch (error) {
        console.error("❌ Kasus 5 Gagal:", error);
    }

    // ---------------------------------------------------------------------
    // KASUS 6: Pengurutan Tingkat Tinggi Lintas Objek Bersarang (Deep-Nested Sorting)
    // ---------------------------------------------------------------------
    try {
        const hasilCase6 = await ApexDB.query('reports', {
            sortBy: "limbah.volume", // Mengurutkan berdasarkan kunci di dalam nested object
            order: "desc"            // Terbesar menuju terkecil
        });
        // EKSPEKTASI URUTAN: R-03 (22) -> R-01 (15) -> R-02 (5) -> R-04 (Tanpa nilai berada paling bawah)
        console.log("✅ Kasus 6 - Deep Nested Sorting Berhasil:", hasilCase6);
    } catch (error) {
        console.error("❌ Kasus 6 Gagal:", error);
    }

    // ---------------------------------------------------------------------
    // KASUS 7: Total Blind Spot (Pencarian Kolom Hantu / Not Existing Field)
    // ---------------------------------------------------------------------
    try {
        const hasilCase7 = await ApexDB.query('reports', {
            search: {
                query: "Ambon",
                fields: ["lokasi_palsu.nama_hantu"] // Kolom ini fiktif dan tidak pernah ada di data manapun
            }
        });
        // EKSPEKTASI OUTPUT: [] (Array kosong bersih, zero crash, aplikasi tetap jalan)
        console.log("✅ Kasus 7 - Blind Spot Filter Safe Return (Harus Kosong):", hasilCase7);
    } catch (error) {
        console.error("❌ Kasus 7 Gagal:", error);
    }

    console.log("\n🏁 SEMUA PENGUJIAN SELESAI DIEKSEKUSI.");
}
*/
// --


// ----------------------------------------------------------------------------


/**
 * ====================================================================
 * 🚀 APEXHTTP - ENTERPRISE OFFLINE-FIRST (PENGAMAN BAGIAN 1)
 * ====================================================================
 * Fokus: Integrasi Idempotency-Key UUID & Fingerprint Anti-Barbar
 */
export class ApexRequest {
    static baseURL = 'https://maku.dlhpambon2025.workers.dev'; // Base URL Proyek MAKU Lu
    static timeoutMs = 10000;    
           
    static maxConcurrentRequests = 3;   
    
    static globalHeaders = {
        'Accept': 'application/json, text/plain;q=0.9, */*;q=0.8',
        'Content-Type': 'application/json'
    };

    static pendingRequests = new Map(); 
    static activeConnections = 0;       
    static requestQueue = [];           
    static storeName = 'offline_requests';

    /**
     * 🆔 UTILS: Generator UUID Paten untuk Idempotency Key
     */
    static _makeUUID() {
        try {
            return (typeof crypto !== "undefined" && crypto.randomUUID) 
                ? crypto.randomUUID() 
                : (Date.now() + "-" + Math.random().toString(16).slice(2));
        } catch(_) {
            return (Date.now() + "-" + Math.random().toString(16).slice(2));
        }
    }

    /**
     * ⏱️ BACKOFF CALCULATOR: Eksponensial + Jitter + Patuh Header Server
     * @param {number} attempt - Urutan percobaan (1, 2, dst)
     * @param {Response} [response] - Object response fetch jika ada
     */
    static _computeBackoff(attempt, response) {
        const baseDelay = 1000; // Jeda dasar 1 detik
        
        // 1. Cek apakah server Workers mengirimkan instruksi "Retry-After" (dalam detik)
        let retryAfterMs = 0;
        if (response && response.headers) {
            const ra = response.headers.get("Retry-After");
            if (ra) {
                // Jika angkanya valid, ubah ke milidetik, jika teks/corrupt set default 5 detik
                retryAfterMs = isNaN(ra) ? 5000 : parseInt(ra, 10) * 1000;
            }
        }

        // 2. Hitung rumus eksponensial: 1s -> 2s -> 4s -> maks 10s
        const expo = Math.min(10000, baseDelay * Math.pow(2, attempt - 1));
        
        // 3. Tambahkan Jitter (Angka acak 0 - 500ms) agar antar HP tidak tabrakan timing-nya
        const jitter = Math.random() * 500;
        
        // Ambil durasi terlama antara instruksi server vs hitungan lokal + jitter
        return Math.max(retryAfterMs, expo + jitter);
    }

    /**
     * 🖥️ CLIENT LOCK: Generator Sidik Jari untuk Blokir Klik Barbar di Layar
     */
    static _generateFingerprint(method, url, data) {
        const bodyString = data ? (typeof data === 'object' ? JSON.stringify(data) : String(data)) : '';
        return `${method}:${url}:${bodyString}`;
    }

    static _enqueueRequest(requestExecutor) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ requestExecutor, resolve, reject });
            this._processQueuePool();
        });
    }

    static _processQueuePool() {
        if (this.activeConnections >= this.maxConcurrentRequests || this.requestQueue.length === 0) return;
        const { requestExecutor, resolve, reject } = this.requestQueue.shift();
        this.activeConnections++;
        requestExecutor().then(resolve).catch(reject).finally(() => {
            this.activeConnections--;
            this._processQueuePool();
        });
    }

    /**
     * ⚙️ CORE REQUEST PROCESSOR
     */
    static async _execute(method, url, data = null, options = {}, retryCount = 0) {
        const reUpload = options.reUpload || false;
        
        // Cek koneksi awal (Jika offline langsung amankan ke DB)
        if (typeof navigator !== "undefined" && !navigator.onLine && reUpload) {
            return this._saveToOfflineDB(method, url, data, options);
        }

        let config = {
            method: method.toUpperCase(),
            headers: { ...this.globalHeaders, ...options.headers },
            ...options
        };

        // 🛡️ SUNTIK IDEMPOTENCY KEY (Dibuat baru jika belum ada di options)
        // Jika request ini adalah hasil re-upload dari IndexedDB, dia akan memakai UUID lama yang tersimpan!
        if (!config.headers['Idempotency-Key'] && method.toUpperCase() !== 'GET') {
            config.headers['Idempotency-Key'] = options._requestId || this._makeUUID();
        }

        // Handle Body payload
        if (data) {
            if (typeof FormData !== "undefined" && data instanceof FormData) {
                config.body = data;
                delete config.headers['Content-Type'];
            } else {
                config.body = typeof data === 'object' ? JSON.stringify(data) : data;
            }
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
        config.signal = controller.signal;

        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

        return this._enqueueRequest(async () => {
            try {
                const response = await fetch(fullUrl, config);
                clearTimeout(timeoutId);

                // 🔥 YANG BARU: Bongkar respons secara cerdas terlebih dahulu (JSON/Text/Blob)
                const parsed = await this._smartParseResponse(response);

                // Jika dapet status sukses (2xx)
                if (response.ok) {
                    return { success: true, status: response.status, data: parsed.data };
                }

                // Tangani Error HTTP yang layak di-retry (408, 429, 5xx)
                const retryableStatuses = [408, 425, 429, 500, 502, 503, 504];
                if (retryableStatuses.includes(response.status) && retryCount < 3) {
                    // Hitung jeda cerdas menggunakan helper backoff + jitter
                    const delay = this._computeBackoff(retryCount + 1, response);
                    console.warn(`[ApexHttp] Server sibuk (${response.status}). Retry ke-${retryCount + 1} dalam ${Math.round(delay)}ms...`);
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this._execute(method, url, data, options, retryCount + 1);
                }

                // 🔥 YANG BARU: Jika error HTTP tidak perlu di-retry (misal 400 / 401), 
                // lempar error kustom bawa pesan asli hasil parsing kustom Workers/GAS
                const httpError = new Error(parsed.errorMessage || `HTTP_ERROR_${response.status}`);
                httpError.status = response.status;
                httpError.code = parsed.errorCode;
                httpError.data = parsed.data; 
                throw httpError;

            } catch (error) {
                clearTimeout(timeoutId);

                // Tangani error jaringan fisik / timeout fetch lokal (bukan dari respon status server)
                if ((error.name === 'AbortError' || error.message.includes('Failed to fetch')) && retryCount < 3) {
                    const delay = this._computeBackoff(retryCount + 1); // Tanpa response object
                    console.warn(`[ApexHttp] Masalah jaringan/timeout. Retry ke-${retryCount + 1} dalam ${Math.round(delay)}ms...`);
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this._execute(method, url, data, options, retryCount + 1);
                }

                // Jika sudah 3x coba tetap gagal total & opsi reUpload aktif ➡️ Lempar ke IndexedDB beserta error detailnya
                if (reUpload) {
                    console.error(`[ApexHttp] Siklus retry habis atau error fatal. Menyelamatkan data ke IndexedDB...`);
                    return this._saveToOfflineDB(method, url, data, { 
                        ...options, 
                        _requestId: config.headers['Idempotency-Key'] 
                    });
                }
                throw error;
            }
        });
    }

    /**
     * 🔒 SECURE POST MANAGER (Kombinasi Proteksi Hulu-Hilir)
     */
    static async post(url, data = null, options = {}) {
        // 1. Kunci di Hulu (Client-side Fingerprint)
        const fingerprint = this._generateFingerprint('POST', url, data);
        if (this.pendingRequests.has(fingerprint)) {
            return Promise.reject({ success: false, message: 'Sabar bro, request yang sama sedang diproses!' });
        }
        
        this.pendingRequests.set(fingerprint, true);

        try {
            // 2. Kirim ke Hilir (Server-side Idempotency via _execute)
            return await this._execute('POST', url, data, options);
        } finally {
            // Lepas kunci fingerprint setelah selesai
            this.pendingRequests.delete(fingerprint);
        }
    }

    /**
    * 🔍 SMART PARSER: Ekstraksi Data & Eror Berlapis dari Server (JSON/Text/Blob)
    * @param {Response} response - Object response native fetch
    */
    static async _smartParseResponse(response) {
        const contentType = (response.headers.get("Content-Type") || "").toLowerCase();
        const result = { data: null, errorMessage: null, errorCode: null };

        try {
            if (contentType.includes("application/json")) {
                result.data = await response.json();
                if (!response.ok) {
                    // Menyisir struktur eror kustom Workers/GAS secara berlapis
                    result.errorMessage = result.data?.message || result.data?.error || result.data?.msg || `Gagal (Status ${response.status})`;
                    result.errorCode = result.data?.code || result.data?.errorCode || `HTTP_${response.status}`;
                }
            } else if (contentType.includes("text/")) {
                const textData = await response.text();
                result.data = textData;
                if (!response.ok) result.errorMessage = textData.slice(0, 300); // Batasi 300 karakter pertama
            } else {
                // Pengaman untuk file biner / Blob (misal PDF laporan/SPPL)
                result.data = await response.blob().catch(() => null);
                if (!response.ok) result.errorMessage = `Error format biner (Status ${response.status})`;
            }
        } catch (_) {
            result.errorMessage = "Gagal mem-parse respons dari server pusat.";
            result.errorCode = "PARSE_ERROR";
        }
        return result;
    }

    /**
     * 💾 METHOD SIMPAN KE INDEXEDDB (Menjaga keaslian UUID)
     */
    static async _saveToOfflineDB(method, url, data, options) {
        try {
            // Gunakan UUID yang sudah ada atau buat baru jika bypass offline di awal
            const finalRequestId = options._requestId || this._makeUUID();
            
            const offlinePayload = {
                id: 'req_' + Date.now(),
                method: method,
                url: url,
                data: data,
                options: { ...options, _requestId: finalRequestId, reUpload: true }
            };

            // Simpan ke skema database lu
            await ApexDB.set(this.storeName, offlinePayload);

            return {
                success: false,
                status: 'SAVED_TO_OFFLINE_DB',
                message: 'Data aman di lokal storage dengan kunci idempotency.',
                idempotencyKey: finalRequestId
            };
        } catch (dbErr) {
            console.error('ApexDB Error:', dbErr);
            throw dbErr;
        }
    }
}


export class ApexHttp {
    static baseURL = 'https://maku.dlhpambon2025.workers.dev';
    static maxConcurrentRequests = 3;
    static storeName = 'offline_requests';

    static globalHeaders = {
        'Accept': 'application/json, text/plain;q=0.9, */*;q=0.8',
        'Content-Type': 'application/json'
    };

    static pendingRequests = new Map();
    static activeConnections = 0;
    static requestQueue = [];

    /**
     * 🧠 SENSOR SINYAL ADAPTIF (TAHAP 1)
     * Mengatur timeout berdasarkan kualitas sinyal user
     */
    static _getTimeoutForNetwork() {
        const { effectiveType } = ApexUtils.getNetworkStatus();
        const timeoutMap = { 
            '4g': 5000,   // 5 detik untuk sinyal lancar
            '3g': 20000,  // 20 detik untuk sinyal sedang
            '2g': 45000   // 45 detik untuk sinyal parah
        };
        const timeout = timeoutMap[effectiveType] || 10000;
        console.log(`[Sensor Sinyal] Tipe: ${effectiveType}, Timeout disetel: ${timeout}ms`);
        return timeout;
    }

    /**
     * 🌉 HANDOVER KE SERVICE WORKER (TAHAP 2)
     * Mengoper paket ke "Kantor Pos" jika jaringan mati/gagal
     */
    static _handoverToSW(method, url, data, options) {
        // console.log("[ApexHttp] Mengoper data ke BroadcastChannel (Antrean Offline)...");
        
        // Inisialisasi channel
        const syncChannel = new BroadcastChannel('apex_sync_channel');
        
        // Kirim data ke kanal
        syncChannel.postMessage({
            type: 'QUEUE_REQUEST',
            payload: { 
                method, 
                url, 
                data, 
                options, 
                requestId: options._requestId || ApexUtils.generateIdempotencyKey() 
            }
        });
        
        // Tutup channel setelah kirim
        syncChannel.close();
        
        return { 
            success: false, 
            status: 'QUEUED', 
            message: 'Data masuk antrean offline via BroadcastChannel' 
        };
    }

    static async _execute(method, url, data = null, options = {}, retryCount = 0) {
        const reUpload = options.reUpload || false;

        // 1. Cek Offline Awal
        if (typeof navigator !== "undefined" && !navigator.onLine && reUpload) {
            return this._handoverToSW(method, url, data, options);
        }

        const config = {
            method: method.toUpperCase(),
            headers: { ...this.globalHeaders, ...options.headers },
            ...options
        };

        if (!config.headers['Idempotency-Key'] && method.toUpperCase() !== 'GET') {
            config.headers['Idempotency-Key'] = options._requestId || ApexUtils.generateIdempotencyKey();
        }

        if (data) {
            config.body = (typeof data === 'object' && !(data instanceof FormData)) ? JSON.stringify(data) : data;
        }

        // 2. Gunakan Timeout Dinamis
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this._getTimeoutForNetwork());
        config.signal = controller.signal;

        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

        return this._enqueueRequest(async () => {
            try {
                const response = await fetch(fullUrl, config);
                clearTimeout(timeoutId);

                if (response.ok) return { success: true, data: await response.json().catch(() => null) };
                
                throw new Error(`HTTP_${response.status}`);
            } catch (error) {
                clearTimeout(timeoutId);

                // 3. Jika gagal karena jaringan, coba oper ke SW jika opsi reUpload aktif
                if (reUpload && (error.name === 'AbortError' || error.message.includes('Failed to fetch'))) {
                    return this._handoverToSW(method, url, data, options);
                }
                throw error;
            }
        });
    }

    // ... sisa method lain (_enqueueRequest, _processQueuePool, post) tetap sama
    static _enqueueRequest(requestExecutor) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ requestExecutor, resolve, reject });
            this._processQueuePool();
        });
    }

    static _processQueuePool() {
        if (this.activeConnections >= this.maxConcurrentRequests || this.requestQueue.length === 0) return;
        const { requestExecutor, resolve, reject } = this.requestQueue.shift();
        this.activeConnections++;
        requestExecutor().then(resolve).catch(reject).finally(() => {
            this.activeConnections--;
            this._processQueuePool();
        });
    }

    static async post(url, data = null, options = {}) {
        return await this._execute('POST', url, data, options);
    }
}

/*
    // import ApexHttp from './ApexHttp.js';

    // async function handleSubmitLaporan(dataLaporan) {
    //     console.log("Mengirim laporan...");

    //     // Opsi reUpload: true adalah kunci "Anti-Mati"
    //     const result = await ApexHttp.post('/api/laporan', dataLaporan, {
    //         reUpload: true, // Jika gagal, simpan ke IndexedDB
    //         headers: { 'Authorization': 'Bearer token_user' }
    //     });

    //     if (result.status === 'QUEUED') {
    //         alert("Sinyal lemot! Data sudah diamankan di antrean offline. Akan dikirim otomatis jika sinyal balik.");
    //     } else if (result.success) {
    //         alert("Data berhasil terkirim ke server pusat!");
    //     } else {
    //         alert("Gagal total: " + result.message);
    //     }
    // }
*/




// ApexUtils.js - Pusat Kendali Algoritma
// Gunakan library enkripsi pilihan lu (contoh: CryptoJS)
import CryptoJS from 'crypto-js'; 

export const ApexUtils = {
    
    // 1. GENERATOR UUID UNTUK IDEMPOTENCY KEY
    // Penting: Harus unik untuk setiap request yang "gagal" atau baru
    generateIdempotencyKey() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // 2. ENKRIPSI DATA (Untuk Payload yang mau dikirim)
    encrypt(data, secretKey) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    },

    // 3. DEKRIPSI DATA (Untuk Respons dari Server)
    decrypt(ciphertext, secretKey) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    },

    // 4. SENSOR KONEKSI (Adaptive Network)
    // Mendeteksi apakah jaringan lagi "bapuk" atau lancar
    getNetworkStatus() {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return {
            effectiveType: conn ? conn.effectiveType : '4g', // '4g', '3g', '2g', 'slow-2g'
            isOnline: navigator.onLine
        };
    },

    // 5. HELPER UNTUK DELAY (Biar gak "race condition")
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
