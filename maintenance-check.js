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
                '<style>' +
                '@keyframes finteclubBannerScroll {' +
                '0% { transform: translateY(-50%) translateX(100vw); }' +
                '100% { transform: translateY(-50%) translateX(-100%); }' +
                '}' +
                '#finteclub-banner-track {' +
                'display:inline-block;white-space:nowrap;position:absolute;left:0;top:50%;' +
                'transform:translateY(-50%) translateX(100vw);' +
                'animation:finteclubBannerScroll 16s linear infinite;' +
                'will-change:transform;' +
                '}' +
                '</style>' +
                '<div id="finteclub-banner" style="' +
                'position:relative;width:100%;background:transparent;color:#fff;' +
                'overflow:hidden;height:26px;font-family:Inter,Arial,sans-serif;' +
                'font-size:0.9rem;font-weight:600;box-sizing:border-box;z-index:99998;' +
                'border-bottom:1px solid rgba(255,255,255,0.12);">' +
                '<span id="finteclub-banner-track">' + bannerText + '</span>' +
                '<button onclick="document.getElementById(\'finteclub-banner\').style.display=\'none\';sessionStorage.setItem(\'finteclub_banner_dismissed\',\'true\');" ' +
                'style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1;z-index:1;">&times;</button>' +
                '</div>'
            );
        }
    } catch (e) {
        console.error('Site kontrol scripti hatası:', e);
    }
})();
