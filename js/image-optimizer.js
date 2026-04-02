/**
 * Оптимизация загрузки изображений для SEO и производительности
 */

(function() {
  'use strict';
  
  // Конфигурация
  const config = {
    lazyClass: 'lazy',
    loadedClass: 'lazy-loaded',
    rootMargin: '50px 0px',
    threshold: 0.01
  };
  
  // Функция для загрузки изображения
  function loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    if (img.dataset.sizes) {
      img.sizes = img.dataset.sizes;
    }
    
    img.classList.remove(config.lazyClass);
    img.classList.add(config.loadedClass);
    
    // Уведомление о загрузке
    img.dispatchEvent(new CustomEvent('lazyloaded', {
      bubbles: true,
      detail: { element: img }
    }));
  }
  
  // Intersection Observer для lazy loading
  let observer;
  
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: config.rootMargin,
        threshold: config.threshold
      });
      
      // Наблюдаем за всеми lazy изображениями
      document.querySelectorAll('img.' + config.lazyClass).forEach(function(img) {
        observer.observe(img);
      });
    } else {
      // Fallback для старых браузеров
      document.querySelectorAll('img.' + config.lazyClass).forEach(function(img) {
        loadImage(img);
      });
    }
  }
  
  // Оптимизация placeholder изображений
  function createPlaceholders() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(function(img) {
      if (!img.hasAttribute('src')) {
        // Создаем маленький placeholder (1x1 прозрачный пиксель)
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PC9zdmc+';
        img.classList.add(config.lazyClass);
      }
    });
  }
  
  // Предзагрузка критичных изображений
  function preloadCriticalImages() {
    const criticalImages = [
      'https://static.wixstatic.com/media/1dc050_b9bcbd909fa649528b1a3ca0d6bbe82b~mv2.jpg',
      'https://raw.githubusercontent.com/dimgo66/mpark/main/icons/og-image.png'
    ];
    
    criticalImages.forEach(function(src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
  
  // Инициализация при полной загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      createPlaceholders();
      initLazyLoading();
      preloadCriticalImages();
    });
  } else {
    createPlaceholders();
    initLazyLoading();
    preloadCriticalImages();
  }
  
  // Экспорт для использования в других скриптах
  window.imageOptimizer = {
    initLazyLoading: initLazyLoading,
    loadImage: loadImage,
    preloadCriticalImages: preloadCriticalImages
  };
  
})();