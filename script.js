document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  lucide.createIcons();

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });
  }

  // Enhanced floating navbar scroll behavior
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  const scrollThreshold = 50;
  
  if (header) {
    // Add subtle entrance animation on page load
    setTimeout(() => {
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
    }, 100);
    
    window.addEventListener('scroll', function() {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Add scrolled class when page is scrolled beyond threshold
      if (scrollTop > scrollThreshold) {
        header.classList.add('scrolled');
        
        // Add subtle parallax effect to the navbar
        const parallaxAmount = Math.min(scrollTop / 20, 10);
        header.style.boxShadow = `var(--navbar-glow), 0 ${4 + parallaxAmount/2}px ${20 + parallaxAmount}px rgba(0, 0, 0, ${0.08 + parallaxAmount/200})`;
      } else {
        header.classList.remove('scrolled');
        header.style.boxShadow = 'var(--navbar-glow), 0 4px 20px rgba(0, 0, 0, 0.08)';
      }
      
      lastScrollTop = scrollTop;
    });
  }

  // Set current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Animate counters when they come into view
  const counters = document.querySelectorAll('.counter');
  
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window && counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const duration = 2000; // Animation duration in ms
          const step = target / (duration / 30); // Update every 30ms
          
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            counter.textContent = Math.round(current);
            
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            }
          }, 30);
          
          // Unobserve after animation starts
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    // Observe all counter elements
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  // Handle newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        // In a real application, you would send this to your server
        alert('Thank you for subscribing! You would receive updates at: ' + emailInput.value);
        emailInput.value = '';
      }
    });
  }

  // Enhanced navigation link hover effects
  const navLinks = document.querySelectorAll('nav a.group');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const indicator = link.querySelector('.nav-indicator');
      if (indicator) {
        indicator.style.width = '100%';
        // Add slight movement up on hover
        link.style.transform = 'translateY(-2px)';
      }
    });
    
    link.addEventListener('mouseleave', () => {
      const indicator = link.querySelector('.nav-indicator');
      if (indicator) {
        indicator.style.width = '0';
        // Reset position
        link.style.transform = 'translateY(0)';
      }
    });
  });

  // Handle smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});