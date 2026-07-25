(function () {
    // ---- Çeviri (TR/EN) - Google widget'ı çakışmasız arka planda çalışır ----
    try {
        document.write(
            '<div id="google_translate_element" style="position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;"></div>' +
            '<div id="lang-switcher" class="notranslate" translate="no" style="position:fixed;top:14px;left:14px;z-index:999997;' +
            'display:flex;background:#10141f;border:1px solid rgba(255,255,255,0.18);' +
            'border-radius:8px;overflow:hidden;font-family:Inter,Arial,sans-serif;' +
            'font-size:0.78rem;box-shadow:0 4px 14px rgba(0,0,0,0.35);">' +
            '<button id="lang-tr" type="button" class="notranslate" translate="no" style="padding:7px 13px;background:#3b82f6;color:#fff;' +
            'border:none;cursor:pointer;font-weight:600;font-family:inherit;font-size:inherit;">TR</button>' +
            '<button id="lang-en" type="button" class="notranslate" translate="no" style="padding:7px 13px;background:transparent;color:#cbd5e1;' +
            'border:none;cursor:pointer;font-weight:600;font-family:inherit;font-size:inherit;">EN</button>' +
            '</div>' +
            '<style>' +
            '/* Google Banner iframe-ini kaldırmıyoruz, ekran dışına itiyoruz ki Google çıldırmasın */' +
            'iframe.goog-te-banner-frame, .goog-te-banner-frame {' +
            '    position: absolute !important;' +
            '    top: -9999px !important;' +
            '    left: -9999px !important;' +
            '    width: 0 !important;' +
            '    height: 0 !important;' +
            '}' +
            '/* Body nin üste boşluk bırakmasını engelle */' +
            'body, html {' +
            '    top: 0px !important;' +
            '    position: static !important;' +
            '    margin-top: 0px !important;' +
            '}' +
            '/* Tooltip ve Baloncukları tamamen kapat */' +
            '#goog-gt-tt, .goog-te-balloon-frame, .goog-tooltip, .goog-tooltip:hover {' +
            '    display: none !important;' +
            '    visibility: hidden !important;' +
            '}' +
            '/* Mavi metin vurgusunu temizle */' +
            '.goog-text-highlight {' +
            '    background: transparent !important;' +
            '    box-shadow: none !important;' +
            '}' +
            '@media (max-width: 600px) {' +
            '    #lang-switcher { top: 60px !important; }' +
            '}' +
            '</style>'
        );

        window.googleTranslateElementInit = function () {
            new google.translate.TranslateElement({
                pageLanguage: 'tr',
                includedLanguages: 'tr,en',
                layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                autoDisplay: false
            }, 'google_translate_element');
        };

        var gtScript = document.createElement('script');
        gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(gtScript);

        function waitForCombo(callback, attempts) {
            attempts = attempts || 0;
            var select = document.querySelector('.goog-te-combo');
            if (select) { callback(select); return; }
            if (attempts > 30) return;
            setTimeout(function () { waitForCombo(callback, attempts + 1); }, 200);
        }

        function updateButtons(lang) {
            var trBtn = document.getElementById('lang-tr');
            var enBtn = document.getElementById('lang-en');
            if (!trBtn || !enBtn) return;
            trBtn.style.background = lang === 'tr' ? '#3b82f6' : 'transparent';
            trBtn.style.color = lang === 'tr' ? '#fff' : '#cbd5e1';
            enBtn.style.background = lang === 'en' ? '#3b82f6' : 'transparent';
            enBtn.style.color = lang === 'en' ? '#fff' : '#cbd5e1';
        }

        function setLang(lang) {
            if (lang === 'tr') {
                document.cookie = 'googtrans=/tr/tr; path=/;';
                document.cookie = 'googtrans=/tr/tr; domain=' + window.location.hostname + '; path=/;';
                waitForCombo(function (select) {
                    select.value = 'tr';
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    updateButtons('tr');
                });
            } else {
                document.cookie = 'googtrans=/tr/en; path=/;';
                document.cookie = 'googtrans=/tr/en; domain=' + window.location.hostname + '; path=/;';
                waitForCombo(function (select) {
                    select.value = 'en';
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    updateButtons('en');
                });
            }
        }

        document.addEventListener('click', function (e) {
            if (e.target && e.target.id === 'lang-en') setLang('en');
            if (e.target && e.target.id === 'lang-tr') setLang('tr');
        });

        // Sayfa her yüklendiğinde (geri tuşu dahil) önceki dil tercihini oku ve
        // hem buton görünümünü hem de gerçek çeviriyi buna göre senkronize et
        function getCookie(name) {
            var match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
            return match ? decodeURIComponent(match[2]) : null;
        }

        var savedTrans = getCookie('googtrans');
        if (savedTrans && savedTrans.indexOf('/en') !== -1) {
            setLang('en'); // buton + gerçek çeviri birlikte senkron olsun
        } else {
            updateButtons('tr');
        }
    } catch (e) {
        console.error('Çeviri widget hatası:', e);
    }
})();

(function () {
    try {
        var params = new URLSearchParams(window.location.search);
        var bypassMaintenance =
            params.has('panel') ||
            sessionStorage.getItem('finteclub_admin_session') === 'true';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'site-data.json?t=' + Date.now(), false);
        xhr.send(null);

        if (xhr.status !== 200) return;
        var cfg = JSON.parse(xhr.responseText);

        // ---- BAKIM MODU ----
        if (cfg.maintenanceMode && !bypassMaintenance) {
            var title = (cfg.maintenanceTitle || 'Bakım Çalışması').replace(/</g, '&lt;');
            var message = (cfg.maintenanceMessage || '').replace(/</g, '&lt;');

            document.write(
                '<style>' +
                'html,body{margin:0;padding:0;background:#0a0e1a;}' +
                'body > *:not(#maintenance-overlay){display:none !important;}' +
                '</style>' +
                '<div id="maintenance-overlay" style="' +
                'position:fixed;inset:0;z-index:999999;background:#0a0e1a;' +
                'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
                'text-align:center;padding:40px;box-sizing:border-box;' +
                'font-family:Inter,Arial,sans-serif;color:#fff;">' +
                '<h1 style="font-size:2.2rem;margin-bottom:16px;font-weight:700;">' + title + '</h1>' +
                '<p style="font-size:1.1rem;max-width:600px;line-height:1.6;color:#cbd5e1;">' + message + '</p>' +
                '</div>'
            );
            return;
        }

        // ---- SİTE GENELİ BANNER ----
        if (cfg.bannerEnabled && cfg.bannerText && sessionStorage.getItem('finteclub_banner_dismissed') !== 'true') {
            var bannerText = cfg.bannerText.replace(/</g, '&lt;');
            document.write(
                '<div id="finteclub-banner" style="' +
                'position:relative;width:100%;background:#3b82f6;color:#fff;' +
                'text-align:center;padding:10px 40px;font-family:Inter,Arial,sans-serif;' +
                'font-size:0.95rem;box-sizing:border-box;z-index:99998;">' +
                '<span>' + bannerText + '</span>' +
                '<button onclick="document.getElementById(\'finteclub-banner\').style.display=\'none\';sessionStorage.setItem(\'finteclub_banner_dismissed\',\'true\');" ' +
                'style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1;">&times;</button>' +
                '</div>'
            );
        }
    } catch (e) {
        console.error('Site kontrol scripti hatası:', e);
    }
})();
