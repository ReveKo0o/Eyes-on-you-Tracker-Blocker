(function() {
    'use strict';

    function removeAds() {
        const sponsorCards = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-promoted-video-renderer');
        sponsorCards.forEach(card => {
            if (card.innerText.includes('Sponsorlu') || card.querySelector('a[href*="ads_impression"]')) {
                card.remove();
            }
        });

        const adOverlays = document.querySelectorAll('.video-ads, .ytp-ad-module, .ytp-ad-player-overlay, #masthead-ad');
        adOverlays.forEach(ad => {
            ad.style.setProperty('display', 'none', 'important');
        });

        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-overlay-close-button');
        if (skipBtn) {
            skipBtn.click();
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                removeAds();
                break;
            }
        }
    });

    setInterval(() => {
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
    if (skipButton) {
        skipButton.click();
    }

    const adOverlay = document.querySelector('.ad-showing');
    const video = document.querySelector('video');
    if (adOverlay && video) {
        video.currentTime = video.duration || video.currentTime + 1; // Reklamı hızlıca sonuna götür
        video.playbackRate = 16.0; // Veya hızı maksimum yap
    }
}, 500);

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Sayfa ilk yüklendiğinde de çalıştır
    window.addEventListener('load', removeAds);
    removeAds();
})();