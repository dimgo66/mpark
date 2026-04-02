/**
 * Аналитика для сайта Михаила Пака
 * Google Analytics 4 и Яндекс.Метрика
 */

(function() {
  'use strict';
  
  // Конфигурация
  const config = {
    gaMeasurementId: 'G-XXXXXXXXXX', // Заменить на реальный ID
    yandexMetrikaId: 00000000, // Заменить на реальный ID
    debug: false
  };
  
  // Google Analytics 4
  function initGoogleAnalytics() {
    if (!config.gaMeasurementId || config.gaMeasurementId === 'G-XXXXXXXXXX') {
      if (config.debug) console.log('Google Analytics: ID не настроен');
      return;
    }
    
    // Загрузка скрипта GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', config.gaMeasurementId, {
      'anonymize_ip': true,
      'allow_google_signals': false,
      'allow_ad_personalization_signals': false,
      'page_title': document.title,
      'page_location': window.location.href,
      'page_path': window.location.pathname + window.location.search
    });
    
    // Отслеживание событий
    function trackEvent(category, action, label, value) {
      if (typeof gtag === 'function') {
        gtag('event', action, {
          'event_category': category,
          'event_label': label,
          'value': value,
          'non_interaction': false
        });
      }
    }
    
    // Отслеживание кликов по внешним ссылкам
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Внешние ссылки
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        trackEvent('external_link', 'click', href, 1);
        
        // Задержка перехода для отправки события
        if (!link.hasAttribute('data-analytics-processed')) {
          e.preventDefault();
          link.setAttribute('data-analytics-processed', 'true');
          
          setTimeout(function() {
            window.location.href = href;
          }, 150);
        }
      }
      
      // Клики по покупке книг
      if (link.closest('.buy-cards') || link.closest('.buy-section')) {
        trackEvent('book_purchase', 'click', href, 1);
      }
      
      // Клики по галерее
      if (link.closest('.gallery-item')) {
        trackEvent('gallery', 'click', 'gallery_image', 1);
      }
    });
    
    // Отслеживание прокрутки
    let scrollTracked = {};
    window.addEventListener('scroll', function() {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(function(section) {
        const rect = section.getBoundingClientRect();
        const sectionId = section.id;
        
        if (rect.top >= 0 && rect.top <= window.innerHeight * 0.5) {
          if (!scrollTracked[sectionId]) {
            scrollTracked[sectionId] = true;
            trackEvent('scroll', 'view_section', sectionId, 1);
          }
        }
      });
    });
    
    if (config.debug) console.log('Google Analytics инициализирован');
  }
  
  // Яндекс.Метрика
  function initYandexMetrika() {
    if (!config.yandexMetrikaId || config.yandexMetrikaId === 00000000) {
      if (config.debug) console.log('Яндекс.Метрика: ID не настроен');
      return;
    }
    
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    
    ym(config.yandexMetrikaId, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: false,
      trackHash: true
    });
    
    if (config.debug) console.log('Яндекс.Метрика инициализирована');
  }
  
  // Инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initGoogleAnalytics();
      initYandexMetrika();
    });
  } else {
    initGoogleAnalytics();
    initYandexMetrika();
  }
  
  // Экспорт для ручного вызова
  window.siteAnalytics = {
    trackEvent: function(category, action, label, value) {
      // Google Analytics
      if (typeof gtag === 'function') {
        gtag('event', action, {
          'event_category': category,
          'event_label': label,
          'value': value
        });
      }
      
      // Яндекс.Метрика
      if (typeof ym === 'function') {
        ym(config.yandexMetrikaId, 'reachGoal', action, {
          category: category,
          label: label,
          value: value
        });
      }
    },
    
    trackPageView: function(url, title) {
      // Google Analytics
      if (typeof gtag === 'function') {
        gtag('config', config.gaMeasurementId, {
          'page_title': title || document.title,
          'page_location': url || window.location.href,
          'page_path': window.location.pathname + window.location.search
        });
      }
    }
  };
  
})();