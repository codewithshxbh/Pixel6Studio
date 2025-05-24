/**
 * Performance Monitoring Script for Pixel6Studio
 * Tracks key performance metrics and resource loading
 */

(function() {
  // Configuration
  const config = {
    // Whether to log performance data
    enableLogging: true,
    // Whether to send metrics to analytics (future feature)
    sendMetrics: false,
    // Threshold values in milliseconds
    thresholds: {
      // Time to first byte
      ttfb: 200,
      // First contentful paint
      fcp: 1000,
      // Largest contentful paint
      lcp: 2500,
      // First input delay
      fid: 100,
      // Cumulative layout shift
      cls: 0.1,
      // Total blocking time
      tbt: 200
    }
  };

  // Helper function to log data
  function log(...args) {
    if (config.enableLogging) {
      console.log('[Performance]', ...args);
    }
  }

  // Store reference times
  const times = {
    start: performance.now(),
    pageStart: window.performance.timing ? window.performance.timing.navigationStart : 0,
    domReady: 0,
    windowLoad: 0
  };

  // Track core web vitals
  function trackCoreWebVitals() {
    if ('PerformanceObserver' in window) {
      // First contentful paint
      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const fcp = entry.startTime;
            const fcpSeconds = (fcp / 1000).toFixed(2);
            log(`First Contentful Paint: ${fcpSeconds}s`, 
                fcp < config.thresholds.fcp ? '✅' : '⚠️');
          }
        }).observe({type: 'paint', buffered: true});
      } catch (e) {
        log('FCP measurement error:', e);
      }

      // Largest contentful paint
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          const lcp = lastEntry.startTime;
          const lcpSeconds = (lcp / 1000).toFixed(2);
          log(`Largest Contentful Paint: ${lcpSeconds}s`, 
              lcp < config.thresholds.lcp ? '✅' : '⚠️');
        }).observe({type: 'largest-contentful-paint', buffered: true});
      } catch (e) {
        log('LCP measurement error:', e);
      }

      // Cumulative layout shift
      try {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            // Only count layout shifts without recent user input
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          log(`Cumulative Layout Shift: ${clsValue.toFixed(3)}`, 
              clsValue < config.thresholds.cls ? '✅' : '⚠️');
        }).observe({type: 'layout-shift', buffered: true});
      } catch (e) {
        log('CLS measurement error:', e);
      }

      // First input delay
      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const delay = entry.processingStart - entry.startTime;
            log(`First Input Delay: ${delay.toFixed(1)}ms`, 
                delay < config.thresholds.fid ? '✅' : '⚠️');
          }
        }).observe({type: 'first-input', buffered: true});
      } catch (e) {
        log('FID measurement error:', e);
      }

      // Long tasks for Total Blocking Time estimation
      try {
        let totalBlockingTime = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            // Any task over 50ms is considered blocking
            const blockingTime = entry.duration - 50;
            if (blockingTime > 0) {
              totalBlockingTime += blockingTime;
            }
          }
          log(`Total Blocking Time: ${totalBlockingTime.toFixed(1)}ms`, 
              totalBlockingTime < config.thresholds.tbt ? '✅' : '⚠️');
        }).observe({type: 'longtask', buffered: true});
      } catch (e) {
        log('TBT measurement error:', e);
      }
    }
  }

  // Track resource loading
  function trackResourceLoading() {
    if (window.performance && window.performance.getEntriesByType) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const resources = window.performance.getEntriesByType('resource');
          let totalSize = 0;
          const resourcesByType = {
            script: { count: 0, size: 0 },
            css: { count: 0, size: 0 },
            image: { count: 0, size: 0 },
            video: { count: 0, size: 0 },
            font: { count: 0, size: 0 },
            other: { count: 0, size: 0 }
          };

          resources.forEach(resource => {
            // Extract size (transferSize is compressed size over network)
            const size = resource.transferSize || 0;
            totalSize += size;

            // Categorize by resource type
            if (resource.name.match(/\.js(\?.*)?$/)) {
              resourcesByType.script.count++;
              resourcesByType.script.size += size;
            } else if (resource.name.match(/\.css(\?.*)?$/)) {
              resourcesByType.css.count++;
              resourcesByType.css.size += size;
            } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)(\?.*)?$/i)) {
              resourcesByType.image.count++;
              resourcesByType.image.size += size;
            } else if (resource.name.match(/\.(mp4|webm|mov)(\?.*)?$/i)) {
              resourcesByType.video.count++;
              resourcesByType.video.size += size;
            } else if (resource.name.match(/\.(woff|woff2|ttf|otf|eot)(\?.*)?$/i)) {
              resourcesByType.font.count++;
              resourcesByType.font.size += size;
            } else {
              resourcesByType.other.count++;
              resourcesByType.other.size += size;
            }
          });

          // Log resource statistics
          log('Resource Statistics:');
          log(`- Total Resources: ${resources.length} (${(totalSize / (1024 * 1024)).toFixed(2)}MB)`);
          Object.entries(resourcesByType).forEach(([type, data]) => {
            if (data.count > 0) {
              log(`- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${data.count} files (${(data.size / (1024 * 1024)).toFixed(2)}MB)`);
            }
          });
        }, 0);
      });
    }
  }

  // Track navigation timing metrics
  function trackNavigationTiming() {
    window.addEventListener('DOMContentLoaded', () => {
      times.domReady = performance.now();
      const domReadyTime = times.domReady - times.start;
      log(`DOM Ready: ${domReadyTime.toFixed(1)}ms`);
    });

    window.addEventListener('load', () => {
      times.windowLoad = performance.now();
      const windowLoadTime = times.windowLoad - times.start;
      log(`Window Load: ${windowLoadTime.toFixed(1)}ms`);
      
      // Report more detailed timings from Navigation Timing API
      if (window.performance && window.performance.timing) {
        const t = window.performance.timing;
        
        setTimeout(() => {
          const timings = {
            ttfb: t.responseStart - t.navigationStart,
            domInteractive: t.domInteractive - t.navigationStart,
            domComplete: t.domComplete - t.navigationStart, 
            loadEvent: t.loadEventEnd - t.navigationStart
          };
          
          log('Navigation Timing:');
          log(`- Time to First Byte: ${timings.ttfb}ms`, 
              timings.ttfb < config.thresholds.ttfb ? '✅' : '⚠️');
          log(`- DOM Interactive: ${timings.domInteractive}ms`);
          log(`- DOM Complete: ${timings.domComplete}ms`);
          log(`- Load Event: ${timings.loadEvent}ms`);
        }, 0);
      }
    });
  }

  // Initialize tracking
  trackCoreWebVitals();
  trackResourceLoading();
  trackNavigationTiming();

  // Expose API for potential future use
  window.pixelSixPerformance = {
    getTimes: () => ({ ...times }),
    getMetrics: () => {
      // To be implemented for more detailed metrics collection
      return {};
    }
  };
})();
