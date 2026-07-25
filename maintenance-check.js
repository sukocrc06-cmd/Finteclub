(function () {
    // ---- Google Translate (EN/TR) - bakım modunda bile çalışır ----
    try {
        document.write(
            '<div id="google_translate_element" style="position:fixed;top:14px;right:14px;z-index:999997;"></div>' +
            '<style>' +
            '.goog-te-banner-frame{display:none !important;}' +
            'body{top:0 !important;}' +
            '#goog-gt-tt, .goog-te-balloon-frame{display:none !important;}' +
            '.goog-text-highlight{background:none !important; box-shadow:none !important;}' +
            '.goog-te-gadget{font-family:Inter,Arial,sans-serif !important; color:transparent !important; font-size:0 !important;}' +
            '.goog-te-gadget .goog-te-combo{' +
            'font-size:0.8rem;color:#fff;background:#10141f;' +
            'border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:4px 6px;' +
            '}' +
            '</style>'
        );

        window.googleTranslateElementInit = function () {
            new google.translate.TranslateElement({
                pageLanguage: 'tr',
                includedLanguages: 'tr,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        };

        var gtScript = document.createElement('script');
        gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(gtScript);
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
