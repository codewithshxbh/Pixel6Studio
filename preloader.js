// Ultra-fast preloading script
// This file should be included before other scripts for fastest loading
(function() {
  // Preload critical resources immediately
  const criticalResources = [
    'videos/furniture.mp4',
    'videos/BloodBank.mp4',
    'videos/quiz1.mp4',
    'videos/medicine.mp4',
    'videos/NGO.mp4',
    'videos/NGO (2).mp4',
    'images/social/Project_1@3x.png',
    'images/social/Project_2@3x.png',
    'images/social/project_3@3x.png',
    'images/social/project_4@3x.png',
    'images/social/project_5@3x.png',
    'images/social/Project_6@3x.png'
  ];
  
  // Start loading resources even before DOM is ready
  criticalResources.forEach(url => {
    const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
    
    if (isImage) {
      const img = new Image();
      img.src = url;
    } else if (isVideo) {
      // Use fetch for videos for fastest loading
      fetch(url, { 
        method: 'GET',
        cache: 'force-cache',
        mode: 'no-cors'
      }).catch(() => {});
    }
  });
  
  // Hide preloader faster
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const preloader = document.querySelector('.preloader');
      if (preloader) {
        preloader.classList.add('hide');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 100);
      }
    }, 300);
  });
})();
