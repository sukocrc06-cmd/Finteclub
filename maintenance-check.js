(function () {
    // ---- Çeviri (TR/EN) - kendi tasarımımız, Google widget'ı arka planda gizli çalışır ----
    try {
        document.write(
            '<div id="google_translate_element" style="position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;"></div>' +
            '<div id="lang-switcher" style="position:fixed;bottom:14px;right:14px;z-index:999997;' +
            'display:flex;background:#10141f;border:1px solid rgba(255,255,255,0.18);' +
            'border-radius:8px;overflow:hidden;font-family:Inter,Arial,sans-serif;' +
            'font-size:0.78rem;box-shadow:0 4px 14px rgba(0,0,0,0.35);">' +
            '<button id="lang-tr" type="button" style="padding:7px 13px;background:#3b82f6;color:#fff;' +
            'border:none;cursor:pointer;font-weight:600;font-family:inherit;font-size:inherit;">TR</button>' +
            '<button id="lang-en" type="button" style="padding:7px 13px;background:transparent;color:#cbd5e1;' +
            'border:none;cursor:pointer;font-weight:600;font-family:inherit;font-size:inherit;">EN</button>' +
            '</div>' +
            '<style>' +
            '.goog-te-banner-frame{display:none !important;}' +
            'body{top:0 !important;}' +
            '#goog-gt-tt, .goog-te-balloon-frame{display:none !important;}' +
            '.goog-text-highlight{background:none !important; box-shadow:none !important;}' +
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
            if (attempts > 25) return; // ~7,5 saniye sonra vazgeç
            setTimeout(function () { waitForCombo(callback, attempts + 1); }, 300);
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
            waitForCombo(function (select) {
                select.value = lang;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                updateButtons(lang);
            });
        }

        // Google zaman zaman üste kendi bildirim çubuğunu ekliyor; her eklendiğinde zorla gizle
        function killGoogleBanner() {
            document.querySelectorAll('iframe').forEach(function (f) {
                var cls = f.className || '';
                var src = f.src || '';
                if (cls.indexOf('goog-te-banner-frame') !== -1 ||
                    (src.indexOf('translate.google') !== -1 && cls.indexOf('goog-te-menu-frame') === -1)) {
                    f.style.setProperty('display', 'none', 'important');
                    f.style.setProperty('visibility', 'hidden', 'important');
                    f.style.setProperty('height', '0px', 'important');
                }
            });
            if (document.body) {
                document.body.style.setProperty('top', '0px', 'important');
            }
            document.documentElement.style.setProperty('margin-top', '0px', 'important');
        }

        var bannerObserver = new MutationObserver(killGoogleBanner);
        bannerObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        setInterval(killGoogleBanner, 400);

        document.addEventListener('click', function (e) {
            if (e.target && e.target.id === 'lang-en') setLang('en');
            if (e.target && e.target.id === 'lang-tr') setLang('tr');
        });
    } catch (e) {
        console.error('Çeviri widget hatası:', e);
    }
})();

(function () {
    try {
        // Admin panelinden bakım modu açıkken siteye erişmek için:
        // sayfa adresine ?panel=1 ekleyerek bakım ekranını atlayabilirsin.
        var params = new URLSearchParams(window.location.search);
        var bypassMaintenance =
            params.has('panel') ||
            sessionStorage.getItem('finteclub_admin_session') === 'true';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'site-data.json?t=' + Date.now(), false); // senkron istek
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
            return; // bakım ekranı gösterildiyse banner'a gerek yok
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
        // Bir sorun olursa siteyi kilitleme, normal şekilde açılsın
        console.error('Site kontrol scripti hatası:', e);
    }
})();
