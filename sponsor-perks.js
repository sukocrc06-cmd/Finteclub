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
        background: rgba(3, 6, 20, 0.78);
        backdrop-filter: blur(8px);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #sp-overlay.open { display: flex; }
    .sp-card {
        position: relative;
        width: 100%; max-width: 440px;
        border-radius: 28px;
        padding: 32px 24px;
        box-sizing: border-box;
        background: linear-gradient(160deg, #070d24 0%, #0d153a 40%, #152258 80%, #1b2a6b 100%);
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 25px 70px rgba(0,0,0,0.65), 0 0 40px rgba(59,130,246,0.12);
        color: #fff;
        text-align: center;
        max-height: 90vh;
        overflow-y: auto;
    }
    .sp-close {
        position: absolute; top: 14px; right: 18px;
        background: none; border: none; color: #94a3b8;
        font-size: 26px; cursor: pointer; line-height: 1;
        transition: color 0.15s;
    }
    .sp-close:hover { color: #fff; }
    .sp-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.5rem; font-weight: 700; line-height: 1.3;
        margin: 10px 0 12px 0;
    }
    .sp-title .sp-accent { color: #38bdf8; }
    .sp-subtitle {
        font-size: 0.9rem; color: #cbd5e1; line-height: 1.5;
        margin-bottom: 24px;
    }
    .sp-field { text-align: left; margin-bottom: 15px; }
    .sp-field label {
        display: block; font-size: 0.8rem; font-weight: 700;
        letter-spacing: 0.04em; margin-bottom: 6px; color: #cbd5e1;
        text-transform: uppercase;
    }
    .sp-field input {
        width: 100%; box-sizing: border-box;
        border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;
        padding: 12px 16px; font-size: 0.95rem;
        font-family: inherit; background: rgba(255,255,255,0.06); color: #fff;
        outline: none; transition: border-color 0.2s, background 0.2s;
    }
    .sp-field input:focus {
        border-color: #38bdf8;
        background: rgba(255,255,255,0.1);
    }
    .sp-btn {
        width: 100%; border: none; border-radius: 12px;
        padding: 13px 20px; font-weight: 700; font-size: 0.98rem;
        cursor: pointer; margin-top: 8px;
        background: #2563eb; color: #fff;
        box-shadow: 0 4px 14px rgba(37,99,235,0.35);
        transition: transform 0.15s, background 0.15s;
        font-family: inherit;
    }
    .sp-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
    .sp-btn.secondary {
        background: transparent; border: 1px solid rgba(255,255,255,0.2);
        margin-top: 10px; box-shadow: none; color: #cbd5e1;
    }
    .sp-btn.secondary:hover { background: rgba(255,255,255,0.06); color: #fff; }
    .sp-error { color: #f87171; font-size: 0.85rem; margin-top: 10px; display: none; }

    /* ---- Kart Çıktı Alanı ---- */
    #sp-card-capture {
        border-radius: 22px;
        padding: 24px 20px;
        background: linear-gradient(155deg, #0a112c 0%, #101a46 45%, #18286a 100%);
        border: 1px solid rgba(255,255,255,0.15);
        box-shadow: inset 0 0 25px rgba(56,189,248,0.06);
    }
    .sp-club-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px dashed rgba(255,255,255,0.18);
    }
    .sp-club-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(56,189,248,0.12);
        border: 1px solid rgba(56,189,248,0.3);
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #7dd3fc;
    }
    .sp-club-logo-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.4rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: #ffffff;
        margin-top: 2px;
    }
    .sp-club-logo-title span {
        color: #38bdf8;
    }
    .sp-member-badge-row {
        margin-bottom: 18px;
    }
    .sp-member-title-sub {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #94a3b8;
        font-weight: 600;
        margin-bottom: 3px;
    }
    .sp-member-name {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.3rem;
        font-weight: 700;
        color: #f8fafc;
        letter-spacing: 0.02em;
    }
    .sp-perk-card {
        background: #ffffff; color: #0f172a; border-radius: 16px;
        padding: 16px 14px; margin-bottom: 12px; text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.18);
    }
    .sp-perk-card img {
        max-width: 100%; max-height: 52px; object-fit: contain; margin-bottom: 8px;
    }
    .sp-perk-card strong {
        display: block; font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 3px;
        font-family: 'Space Grotesk', sans-serif;
    }
    .sp-perk-card p {
        font-size: 0.84rem; line-height: 1.35; margin: 0; color: #475569;
    }
    .sp-empty-perks { color: #94a3b8; font-size: 0.88rem; padding: 20px 0; }
    `;
    var styleTag = document.createElement('style');
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    var overlayHtml = `
    <div id="sp-overlay">
        <div class="sp-card" id="sp-card">
            <button class="sp-close" id="sp-close-btn">&times;</button>

            <div id="sp-screen-form">
                <div class="sp-title"><span class="sp-accent">Fin</span>TeClub'lı Olmanın Avantajlarını Keşfet!</div>
                <div class="sp-subtitle">Üye bilgilerini doldur, kulüp üyelerine özel fırsatlardan ve indirimlerden yararlan!</div>

                <div class="sp-field"><label>İsim</label><input type="text" id="sp-first-name" placeholder="Adınız"></div>
                <div class="sp-field"><label>Soyisim</label><input type="text" id="sp-last-name" placeholder="Soyadınız"></div>
                <div class="sp-field"><label>Öğrenci Numarası</label><input type="text" id="sp-student-number" placeholder="Örn: 22000000"></div>
                <div class="sp-field"><label>Bölüm</label><input type="text" id="sp-department" placeholder="Örn: Yönetim Bilişim Sistemleri"></div>
                <div class="sp-field"><label>Kulübümüzü Nereden Duydunuz?</label><input type="text" id="sp-source" placeholder="Örn: Instagram, Arkadaş, Stant..."></div>

                <button class="sp-btn" id="sp-submit-btn">Avantaj Kartımı Oluştur</button>
                <div class="sp-error" id="sp-error">Lütfen isim ve soyisim alanlarını doldurun.</div>
            </div>

            <div id="sp-screen-card" style="display:none;">
                <div id="sp-card-capture">
                    <div class="sp-club-header">
                        <div class="sp-club-badge">FinTeClub Üyelik Kartı</div>
                        <div class="sp-club-logo-title"><span>Fin</span>TeClub</div>
                    </div>
                    <div class="sp-member-badge-row">
                        <div class="sp-member-title-sub">Kulüp Üyesi</div>
                        <div class="sp-member-name" id="sp-member-name">BERKAY ARSLANARGÜN</div>
                    </div>
                    <div id="sp-perks-list"></div>
                </div>
                <button class="sp-btn" id="sp-download-btn" style="margin-top:18px;">Kartı İndir</button>
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

        function escapeHtml(str) {
            return String(str).replace(/[&<>"']/g, function (c) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
            });
        }

        submitBtn.addEventListener('click', async function () {
            var firstName = document.getElementById('sp-first-name').value.trim();
            var lastName = document.getElementById('sp-last-name').value.trim();
            var studentNumber = document.getElementById('sp-student-number').value.trim();
            var department = document.getElementById('sp-department').value.trim();
            var source = document.getElementById('sp-source').value.trim();

            if (!firstName || !lastName) {
                errorEl.style.display = 'block';
                return;
            }
            errorEl.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Kart Hazırlanıyor...';

            try {
                await fetch('/api/submit-membership', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, studentNumber, department, source })
                });
            } catch (e) {
                console.error('Üyelik başvurusu gönderilemedi:', e);
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Avantaj Kartımı Oluştur';

            memberNameEl.textContent = (firstName + ' ' + lastName).toLocaleUpperCase('tr-TR');
            perksListEl.innerHTML = '<div class="sp-empty-perks">Ayrıcalıklar yükleniyor...</div>';

            try {
                var res = await fetch('site-data.json?t=' + Date.now());
                var data = await res.json();
                var perks = data.sponsorPerks || [];

                if (perks.length === 0) {
                    perksListEl.innerHTML = '<div class="sp-empty-perks">Şu anda aktif bir ayrıcalık bulunmuyor.</div>';
                } else {
                    perksListEl.innerHTML = perks.map(function (p) {
                        var imgHtml = p.logo ? '<img src="' + escapeHtml(p.logo) + '" alt="">' : '';
                        var titleHtml = p.name ? '<strong>' + escapeHtml(p.name) + '</strong>' : '';
                        return '<div class="sp-perk-card">' + imgHtml + titleHtml + '<p>' + escapeHtml(p.description || '') + '</p></div>';
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
                alert('Görsel oluşturucu henüz yüklenmedi, lütfen birkaç saniye sonra tekrar deneyin.');
                return;
            }
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Görsel Hazırlanıyor...';
            window.html2canvas(target, { 
                backgroundColor: null, 
                scale: 2.5,
                useCORS: true 
            }).then(function (canvas) {
                var link = document.createElement('a');
                link.download = 'FinTeClub-Uyelik-Karti.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Kartı İndir';
            }).catch(function () {
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Kartı İndir';
                alert('Görsel indirilemedi, lütfen tekrar deneyin.');
            });
        });
    }
})();
