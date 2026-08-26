(function () {
    // ---- html2canvas kütüphanesini yükle (kartı PNG olarak indirebilmek için) ----
    var h2c = document.createElement('script');
    h2c.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(h2c);

    var css = `
    #sp-overlay {
        display: none;
        position: fixed; inset: 0; z-index: 999998;
        align-items: center; justify-content: center;
        padding: 20px; box-sizing: border-box;
        background: rgba(3, 6, 20, 0.75);
        font-family: Inter, Arial, sans-serif;
    }
    #sp-overlay.open { display: flex; }
    .sp-card {
        position: relative;
        width: 100%; max-width: 420px;
        border-radius: 28px;
        padding: 36px 28px;
        box-sizing: border-box;
        background: linear-gradient(160deg, #0a1030 0%, #141a4a 40%, #1c2a6e 75%, #232f7a 100%);
        border: 1px solid rgba(255,255,255,0.15);
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        color: #fff;
        text-align: center;
        max-height: 90vh;
        overflow-y: auto;
    }
    .sp-close {
        position: absolute; top: 14px; right: 18px;
        background: none; border: none; color: #cbd5e1;
        font-size: 24px; cursor: pointer; line-height: 1;
    }
    .sp-close:hover { color: #fff; }
    .sp-title {
        font-size: 1.5rem; font-weight: 800; line-height: 1.3;
        margin: 10px 0 12px 0;
    }
    .sp-title .sp-accent { color: #3b82f6; }
    .sp-subtitle {
        font-size: 0.92rem; color: #cbd5e1; line-height: 1.5;
        margin-bottom: 26px;
    }
    .sp-field { text-align: left; margin-bottom: 16px; }
    .sp-field-row { display: flex; gap: 10px; margin-bottom: 16px; }
    .sp-field-row .sp-field { flex: 1; margin-bottom: 0; min-width: 0; }
    .sp-field label {
        display: block; font-size: 0.85rem; font-weight: 700;
        letter-spacing: 0.03em; margin-bottom: 8px; color: #e5e9f5;
        text-align: center; text-transform: uppercase;
    }
    .sp-field input {
        width: 100%; box-sizing: border-box;
        border: none; border-radius: 999px;
        padding: 12px 18px; font-size: 0.95rem;
        font-family: inherit; background: #fff; color: #111;
        outline: none;
    }
    .sp-btn {
        width: 100%; border: none; border-radius: 999px;
        padding: 13px 20px; font-weight: 700; font-size: 1rem;
        cursor: pointer; margin-top: 8px;
        background: #3b82f6; color: #fff;
        transition: background 0.15s;
    }
    .sp-btn:hover { background: #2563eb; }
    .sp-btn.secondary {
        background: transparent; border: 1px solid rgba(255,255,255,0.3);
        margin-top: 12px;
    }
    .sp-btn.secondary:hover { background: rgba(255,255,255,0.08); }
    .sp-error { color: #fca5a5; font-size: 0.85rem; margin-top: 10px; display: none; }

    #sp-card-capture {
        border-radius: 24px;
        padding: 28px 22px;
        background: linear-gradient(160deg, #0a1030 0%, #141a4a 40%, #1c2a6e 75%, #232f7a 100%);
    }
    .sp-member-name {
        font-size: 1.2rem; font-weight: 800; margin-bottom: 22px;
    }
    .sp-perk-card {
        background: #fff; color: #111; border-radius: 16px;
        padding: 16px; margin-bottom: 14px; text-align: center;
    }
    .sp-perk-card img {
        max-width: 100%; max-height: 70px; object-fit: contain; margin-bottom: 10px;
    }
    .sp-perk-card p {
        font-size: 0.85rem; line-height: 1.4; margin: 0; color: #222;
    }
    .sp-empty-perks { color: #cbd5e1; font-size: 0.9rem; padding: 20px 0; }

    /* Navbar'daki "FinTeClub'lı Ol" butonu: kart paletiyle uyumlu, sade */
    #sponsor-perks-open-btn {
        background: linear-gradient(160deg, #0a1030 0%, #1c2a6e 100%) !important;
        color: #ffffff !important;
        border: 1px solid rgba(255,255,255,0.25) !important;
        box-shadow: none !important;
    }
    @media (max-width: 992px) {
        #sponsor-perks-open-btn {
            display: none;
            width: 100%;
            justify-content: center;
            margin-top: 8px;
        }
        #nav-links.open #sponsor-perks-open-btn {
            display: flex !important;
        }
    }
    `;
    var styleTag = document.createElement('style');
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    var overlayHtml = `
    <div id="sp-overlay">
        <div class="sp-card" id="sp-card">
            <button class="sp-close" id="sp-close-btn">&times;</button>

            <div id="sp-screen-form">
                <div class="sp-title">Fin<span class="sp-accent">Te</span>Club'lı Olmanın Avantajlarını Keşfet!</div>
                <div class="sp-subtitle">Üye bilgilerini doldur, kulüp üyelerine özel fırsatlardan sen de yararlan!</div>

                <div class="sp-field-row">
                    <div class="sp-field"><label>İsim</label><input type="text" id="sp-first-name"></div>
                    <div class="sp-field"><label>Soyisim</label><input type="text" id="sp-last-name"></div>
                </div>
                <div class="sp-field"><label>Öğrenci Numarası</label><input type="text" id="sp-student-number" inputmode="numeric" maxlength="11" placeholder="11 haneli öğrenci numaranız"></div>
                <div class="sp-field"><label>E-posta</label><input type="email" id="sp-email"></div>
                <div class="sp-field"><label>Telefon Numarası</label><input type="tel" id="sp-phone"></div>
                <div class="sp-field-row">
                    <div class="sp-field"><label>Üniversite</label><input type="text" id="sp-university"></div>
                    <div class="sp-field"><label>Fakülte</label><input type="text" id="sp-faculty"></div>
                </div>
                <div class="sp-field"><label>Bölüm</label><input type="text" id="sp-department"></div>
                <div class="sp-field"><label>Sınıf</label><input type="text" id="sp-grade"></div>

                <button class="sp-btn" id="sp-submit-btn">Gönder</button>
                <div class="sp-error" id="sp-error">Lütfen isim, soyisim alanlarını ve 11 haneli öğrenci numaranızı doğru doldurun.</div>
            </div>

            <div id="sp-screen-card" style="display:none;">
                <div id="sp-card-capture">
                    <div class="sp-member-name" id="sp-member-name">Üye Adı: </div>
                    <div id="sp-perks-list"></div>
                </div>
                <button class="sp-btn" id="sp-download-btn" style="margin-top:20px;">Kartı İndir</button>
                <button class="sp-btn secondary" id="sp-done-btn">Kapat</button>
            </div>
        </div>
    </div>
    `;
    document.addEventListener('DOMContentLoaded', function () {
        document.body.insertAdjacentHTML('beforeend', overlayHtml);
        initSponsorPerks();
    });

    function initSponsorPerks() {
        var overlay = document.getElementById('sp-overlay');
        var closeBtn = document.getElementById('sp-close-btn');
        var openTriggers = document.querySelectorAll('#sponsor-perks-open-btn, .sponsor-perks-open-btn');
        var screenForm = document.getElementById('sp-screen-form');
        var screenCard = document.getElementById('sp-screen-card');
        var submitBtn = document.getElementById('sp-submit-btn');
        var errorEl = document.getElementById('sp-error');
        var downloadBtn = document.getElementById('sp-download-btn');
        var doneBtn = document.getElementById('sp-done-btn');
        var memberNameEl = document.getElementById('sp-member-name');
        var perksListEl = document.getElementById('sp-perks-list');

        function openModal() {
            overlay.classList.add('open');
            screenForm.style.display = 'block';
            screenCard.style.display = 'none';
            errorEl.style.display = 'none';
        }
        function closeModal() {
            overlay.classList.remove('open');
        }

        openTriggers.forEach(function (btn) {
            btn.addEventListener('click', openModal);
        });
        closeBtn.addEventListener('click', closeModal);
        doneBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });

        var studentNumberInput = document.getElementById('sp-student-number');
        studentNumberInput.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 11);
        });

        function escapeHtml(str) {
            return String(str).replace(/[&<>"']/g, function (c) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
            });
        }

        submitBtn.addEventListener('click', async function () {
            var firstName = document.getElementById('sp-first-name').value.trim();
            var lastName = document.getElementById('sp-last-name').value.trim();
            var studentNumber = document.getElementById('sp-student-number').value.trim();
            var email = document.getElementById('sp-email').value.trim();
            var phone = document.getElementById('sp-phone').value.trim();
            var university = document.getElementById('sp-university').value.trim();
            var faculty = document.getElementById('sp-faculty').value.trim();
            var department = document.getElementById('sp-department').value.trim();
            var grade = document.getElementById('sp-grade').value.trim();

            var studentNumberValid = /^\d{11}$/.test(studentNumber);

            if (!firstName || !lastName || !studentNumberValid) {
                errorEl.style.display = 'block';
                return;
            }
            errorEl.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Gönderiliyor...';

            try {
                await fetch('/api/submit-membership', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, studentNumber, email, phone, university, faculty, department, grade })
                });
            } catch (e) {
                console.error('Üyelik başvurusu gönderilemedi:', e);
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Gönder';

            // Sponsorluk ayrıcalıklarını oku ve kart ekranını göster
            memberNameEl.textContent = 'Üye Adı: ' + firstName + ' ' + lastName;
            perksListEl.innerHTML = '<div class="sp-empty-perks">Yükleniyor...</div>';

            try {
                var res = await fetch('site-data.json?t=' + Date.now());
                var data = await res.json();
                var perks = data.sponsorPerks || [];

                if (perks.length === 0) {
                    perksListEl.innerHTML = '<div class="sp-empty-perks">Şu anda aktif bir ayrıcalık bulunmuyor.</div>';
                } else {
                    perksListEl.innerHTML = perks.map(function (p) {
                        var imgHtml = p.logo ? '<img src="' + escapeHtml(p.logo) + '" alt="">' : '';
                        return '<div class="sp-perk-card">' + imgHtml + '<p>' + escapeHtml(p.description || '') + '</p></div>';
                    }).join('');
                }
            } catch (e) {
                perksListEl.innerHTML = '<div class="sp-empty-perks">Ayrıcalıklar yüklenemedi.</div>';
            }

            screenForm.style.display = 'none';
            screenCard.style.display = 'block';
        });

        downloadBtn.addEventListener('click', function () {
            var target = document.getElementById('sp-card-capture');
            if (!window.html2canvas) {
                alert('Görsel oluşturucu henüz yüklenmedi, birkaç saniye sonra tekrar dene.');
                return;
            }
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Hazırlanıyor...';

            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            // Pop-up engellenmemesi için (Web Share desteklenmezse kullanılacak yedek) sekmeyi hemen açıyoruz
            var newTab = isMobile ? window.open('', '_blank') : null;

            window.html2canvas(target, { backgroundColor: null, scale: 2 }).then(function (canvas) {
                canvas.toBlob(async function (blob) {
                    downloadBtn.disabled = false;
                    downloadBtn.textContent = 'Kartı İndir';

                    if (!blob) {
                        if (newTab) newTab.close();
                        alert('Görsel oluşturulamadı, tekrar dener misin?');
                        return;
                    }

                    var file = new File([blob], 'finteclub-uyelik-karti.png', { type: 'image/png' });

                    // 1. Öncelik: Web Share API (iOS ve Android'de native "Fotoğraflara Kaydet" panelini açar)
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({ files: [file], title: 'FinTeClub Üyelik Kartı' });
                            if (newTab) newTab.close();
                            return;
                        } catch (shareErr) {
                            // Paylaşım iptal edildi ya da (iOS'ta sık görülen) kullanıcı etkileşimi
                            // süresi doldu - aşağıdaki yedek yönteme (zaten açık olan sekme) düş
                        }
                    }

                    var dataUrl = URL.createObjectURL(blob);

                    // 2. Yedek: mobilde yeni sekmede aç, uzun basıp kaydetmesini iste
                    if (isMobile && newTab) {
                        newTab.document.write(
                            '<html><head><title>FinTeClub Üyelik Kartı</title></head>' +
                            '<body style="margin:0;background:#0a0e1a;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;">' +
                            '<img src="' + dataUrl + '" style="max-width:92%;height:auto;border-radius:16px;margin-top:20px;">' +
                            '<p style="color:#cbd5e1;text-align:center;padding:16px 24px;font-size:0.95rem;">Görseli kaydetmek için resme basılı tutup "Resmi Kaydet" / "Görseli İndir" seçeneğini kullan.</p>' +
                            '</body></html>'
                        );
                    } else {
                        // 3. Masaüstü: normal indirme
                        var link = document.createElement('a');
                        link.download = 'finteclub-uyelik-karti.png';
                        link.href = dataUrl;
                        link.click();
                    }
                }, 'image/png');
            }).catch(function () {
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Kartı İndir';
                if (newTab) newTab.close();
                alert('Görsel oluşturulamadı, tekrar dener misin?');
            });
        });
    }
})();
