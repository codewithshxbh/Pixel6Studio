// Immediately execute this function to preload all work section images
(function() {
  // Array containing all work section image paths
  const allWorkImagePaths = [
    'images/website/1.png',
    'images/website/2.png',
    'images/website/3.png',
    'images/website/4.png',
    'images/website/5.png',
    'images/website/6.png',
    'images/social/Project_1@3x.png',
    'images/social/Project_2@3x.png',
    'images/social/project_3@3x.png',
    'images/social/project_4@3x.png',
    'images/social/project_5@3x.png',
    'images/social/Project_6@3x.png'
  ];

  // Super aggressive loading strategy for ALL images
  allWorkImagePaths.forEach(imagePath => {
    // Create new image with highest priority
    const img = new Image();
    
    // Set all high-priority attributes
    img.importance = 'high';
    img.fetchPriority = 'high';
    img.loading = 'eager';
    
    // Start loading the image
    img.src = imagePath;
    
    // Force immediate DOM attachment to prioritize loading
    document.head ? document.head.appendChild(img) : 
      window.addEventListener('DOMContentLoaded', () => document.head.appendChild(img));
    
    // Force browser to parse image immediately
    img.decode().catch(() => {});
    
    // Force image to stay cached but hidden
    setTimeout(() => {
      // Force painting by accessing properties
      void img.naturalWidth;
      void img.naturalHeight;
      img.style.cssText = 'position:absolute;opacity:0;z-index:-9999;width:1px;height:1px;';
    }, 0);
  });
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Promotional Banner functionality
  const promoBanner = document.querySelector('.promo-banner');
  const promoCloseBtn = document.querySelector('.promo-close');
  const heroSection = document.querySelector('.hero');
  
  // Function to scroll to and highlight the promo checkbox
  window.scrollToPromo = function() {
    const checkbox = document.getElementById('service-promo');
    const promoContainer = document.querySelector('.checkbox-item-featured');
    
    // Wait for the scroll to complete, then highlight the checkbox
    setTimeout(() => {
      checkbox.checked = true;
      
      // Show the promo info section
      if (promoInfoSection) {
        promoInfoSection.style.display = 'block';
        setTimeout(() => {
          promoInfoSection.style.transition = 'opacity 0.3s ease, max-height 0.5s ease';
          promoInfoSection.style.opacity = '1';
          promoInfoSection.style.maxHeight = '300px';
        }, 10);
      }
      
      // Add highlight effect to the promo container
      promoContainer.classList.add('promo-highlight');
      
      // Remove highlight effect after animation completes
      setTimeout(() => {
        promoContainer.classList.remove('promo-highlight');
      }, 3000);
    }, 800);
  };
  
  if (promoBanner && promoCloseBtn) {
    // Always show banner on page refresh (no localStorage check)
    promoBanner.style.display = 'block';
    
    // Initially hide banner
    promoBanner.style.transform = 'translateY(-100%)';
    
    // Make sure hero has the correct initial padding - this prevents the sudden jump
    if (heroSection) {
      // Set padding immediately to prevent jumps in layout
      heroSection.style.paddingTop = '140px'; 
      // Prepare the hero section for banner appearance
      heroSection.classList.add('promo-ready');
    }
    
    // Show after a short delay with improved animation
    setTimeout(() => {
      // Slide down animation
      promoBanner.style.transform = 'translateY(0)';
      // Apply a class to trigger pulse and gradient animations
      promoBanner.classList.add('promo-banner-visible');
      
      // Add class to hero section to properly adjust spacing
      if (heroSection) {
        heroSection.classList.add('promo-active');
      }
    }, 1000); // 1 second delay
    
    // Add click event to close button
    promoCloseBtn.addEventListener('click', () => {
      // Remove animation class first
      promoBanner.classList.remove('promo-banner-visible');
      
      // Slide up animation
      promoBanner.style.transform = 'translateY(-100%)';
      
      // Reset hero padding when banner is closed
      if (heroSection) {
        heroSection.classList.remove('promo-active');
        heroSection.style.paddingTop = '110px'; // Back to original padding
      }
      
      // Remove completely after animation
      setTimeout(() => {
        promoBanner.style.display = 'none';
      }, 500); // Increased timeout for smoother transition
    });
  }
  
  // Free Services Promotion form logic
  const promoCheckbox = document.getElementById('service-promo');
  const promoInfoSection = document.getElementById('promoInfoSection');
  
  if (promoCheckbox && promoInfoSection) {
    // Add character counter for business description
    const businessDescription = document.getElementById('business-description');
    const characterCounter = document.createElement('div');
    characterCounter.className = 'char-counter';
    characterCounter.textContent = '0/50 characters (minimum)';
    promoInfoSection.insertBefore(characterCounter, document.querySelector('.form-hint'));
    
    // Update character count on input
    if (businessDescription) {
      businessDescription.addEventListener('input', function() {
        const count = this.value.trim().length;
        const meetsMinimum = count >= 50;
        characterCounter.textContent = `${count}/50 characters ${meetsMinimum ? '(minimum met)' : '(minimum)'}`;
        characterCounter.style.color = meetsMinimum ? '#4CAF50' : '#666';
      });
    }
    
    promoCheckbox.addEventListener('change', function() {
      if (this.checked) {
        promoInfoSection.style.display = 'block';
        // Smooth appearance animation
        promoInfoSection.style.opacity = '0';
        promoInfoSection.style.maxHeight = '0';
        setTimeout(() => {
          promoInfoSection.style.transition = 'opacity 0.3s ease, max-height 0.5s ease';
          promoInfoSection.style.opacity = '1';
          promoInfoSection.style.maxHeight = '300px';
        }, 10);
      } else {
        // Smooth disappearance animation
        promoInfoSection.style.opacity = '0';
        promoInfoSection.style.maxHeight = '0';
        setTimeout(() => {
          promoInfoSection.style.display = 'none';
        }, 300);
      }
    });
  }

  // Original preloader timing (restored)
  setTimeout(function() {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('hide');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 300);
  }, 1000);
  
  // Special handling for work section images only
  const workImages = document.querySelectorAll('.work-image img');
  workImages.forEach(img => {
    img.style.cssText = 'display:block !important; opacity:1 !important; visibility:visible !important;';
    
    // Force a repaint to make sure the image shows immediately
    void img.offsetWidth;
    void img.offsetHeight;
  });
  
  // Optimized lazy loading for non-work images with decreased delay
  if ('loading' in HTMLImageElement.prototype) {
    // Use native lazy loading but with smaller thresholds
    const nonWorkImages = document.querySelectorAll('img:not(.work-image img):not([loading])');
    nonWorkImages.forEach(img => {
      // Use eager loading for images that are likely to be visible soon
      const rect = img.getBoundingClientRect();
      const isNearViewport = rect.top <= window.innerHeight + 500; // 500px threshold instead of default
      
      if (isNearViewport) {
        img.loading = 'eager'; // Load immediately for near-viewport images
      } else {
        img.loading = 'lazy'; // Use lazy loading for others
      }
    });
  } else {
    // Enhanced fallback for browsers that don't support native lazy loading
    const lazyImages = document.querySelectorAll('img:not(.work-image img)');
    
    if ('IntersectionObserver' in window) {
      // Use a more aggressive root margin to load images earlier
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '300px 0px', // Load images when they're 300px from viewport instead of default
        threshold: 0.01 // Trigger with just 1% visibility
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init("lh3Xhad9UeKgpBozB");
  }

  // Custom cursor - only initialize on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Use passive event listeners for better scroll performance
    document.addEventListener('mousemove', function(e) {
      requestAnimationFrame(function() {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(function() {
          cursorFollower.style.left = e.clientX + 'px';
          cursorFollower.style.top = e.clientY + 'px';
        }, 100);
      });
    }, { passive: true });
    
    document.addEventListener('mousedown', function() {
      cursor.classList.add('active');
      cursorFollower.classList.add('active');
    }, { passive: true });
    
    document.addEventListener('mouseup', function() {
      cursor.classList.remove('active');
      cursorFollower.classList.remove('active');
    }, { passive: true });
    
    // Add active class to links and buttons for cursor effect
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
      }, { passive: true });
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
      }, { passive: true });
    });
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  // Close mobile menu when clicking on a link
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Header scroll effect with throttling for better performance
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (scrollTop > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        lastScrollTop = scrollTop;
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true });

  // Portfolio filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter items
      workItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Pricing Toggle (Monthly/Annual) - Use function to reduce repetition
  const pricingToggle = document.getElementById('pricingToggle');
  if(pricingToggle) {
    const monthlyText = document.querySelector('.pricing-toggle-text:first-child');
    const annualText = document.querySelector('.pricing-toggle-text:last-child');
    const monthlyPrices = document.querySelectorAll('.pricing-price.monthly');
    const annualPrices = document.querySelectorAll('.pricing-price.annual');
    const monthlyFeatures = document.querySelectorAll('.pricing-features.monthly');
    const annualFeatures = document.querySelectorAll('.pricing-features.annual');
    
    // Set initial active state
    monthlyText.classList.add('active');
    
    function updatePricingDisplay(isAnnual) {
      // Handle pricing display
      monthlyPrices.forEach(price => price.style.display = isAnnual ? 'none' : 'flex');
      annualPrices.forEach(price => price.style.display = isAnnual ? 'flex' : 'none');
      
      // Handle features display
      monthlyFeatures.forEach(features => features.style.display = isAnnual ? 'none' : 'block');
      annualFeatures.forEach(features => features.style.display = isAnnual ? 'block' : 'none');
      
      // Update toggle text active state
      monthlyText.classList.toggle('active', !isAnnual);
      annualText.classList.toggle('active', isAnnual);
    }
    
    pricingToggle.addEventListener('change', function() {
      updatePricingDisplay(this.checked);
    });
  }
  
  // Pricing FAQ Accordion with optimized event handling
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  if(accordionHeaders.length > 0) {
    accordionHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const accordionItem = this.parentElement;
        const accordionContent = this.nextElementSibling;
        const accordionIcon = this.querySelector('.accordion-icon i');
        const isActive = accordionItem.classList.contains('active');
        
        // Toggle active class
        accordionItem.classList.toggle('active');
        
        // Toggle icon and content height
        if(accordionIcon) {
          if(!isActive) {
            accordionIcon.classList.replace('fa-plus', 'fa-minus');
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
          } else {
            accordionIcon.classList.replace('fa-minus', 'fa-plus');
            accordionContent.style.maxHeight = '0';
          }
        }
      });
    });
  }

  // Testimonial slider with improved performance
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  if(testimonialTrack && testimonialSlides.length > 0) {
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    let currentIndex = 0;
    const slideWidth = 100; // 100%
    
    // Create dots
    testimonialSlides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.testimonial-dot');
    
    // Go to specific slide using hardware-accelerated transforms
    function goToSlide(index) {
      currentIndex = index;
      testimonialTrack.style.transform = `translateX(-${slideWidth * currentIndex}%)`;
      
      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    // Next slide
    function nextSlide() {
      currentIndex = (currentIndex + 1) % testimonialSlides.length;
      goToSlide(currentIndex);
    }
    
    // Previous slide
    function prevSlide() {
      currentIndex = (currentIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
      goToSlide(currentIndex);
    }
    
    // Event listeners for buttons
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover - use event delegation for better performance
    testimonialTrack.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    testimonialTrack.addEventListener('mouseleave', () => {
      slideInterval = setInterval(nextSlide, 5000);
    });
  }

  // Animate stats counter with IntersectionObserver
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1500; // Reduced from 2000ms to 1500ms
    const step = target / duration * 10;
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }
      el.textContent = Math.floor(current);
    }, 10);
  }
  
  // Intersection Observer for stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(stat => {
          animateCounter(stat);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Back to top button with throttled scroll event
  const backToTopButton = document.querySelector('.back-to-top');
  let lastScrollPosition = 0;
  let scrollTicking = false;
  
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 500) {
          backToTopButton.classList.add('active');
        } else {
          backToTopButton.classList.remove('active');
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
  
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Optimized smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Form validation with better error handling
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    const showFormError = (field, message) => {
      field.classList.add('error');
      const errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.textContent = message;
      field.parentNode.appendChild(errorElement);
    };
    
    const clearFormErrors = () => {
      document.querySelectorAll('.form-error').forEach(error => error.remove());
      document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    };
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      clearFormErrors();
      
      // Simple validation
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          showFormError(field, 'This field is required');
        }
      });
      
      // Check promotional application
      const applyingForPromo = document.getElementById('service-promo').checked;
      if (applyingForPromo) {
        const businessDescription = document.getElementById('business-description');
        if (!businessDescription.value.trim()) {
          isValid = false;
          showFormError(businessDescription, 'Please provide your business description for the promotion');
        } else if (businessDescription.value.trim().length < 50) {
          isValid = false;
          showFormError(businessDescription, 'Please provide at least 50 characters describing your business');
        }
      }
      
      // Email validation
      const emailField = document.getElementById('email');
      if (emailField && emailField.value.trim() && !emailField.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        isValid = false;
        showFormError(emailField, 'Please enter a valid email address');
      }
      
      if (isValid && window.emailjs) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Get selected services
        const selectedServices = [];
        const serviceCheckboxes = contactForm.querySelectorAll('input[name="services[]"]:checked');
        serviceCheckboxes.forEach(checkbox => {
          selectedServices.push(checkbox.value);
        });
        
        // Check if applying for promotion
        const applyingForPromo = selectedServices.includes('Free Web Services Promotion');
        const businessDescription = applyingForPromo ? document.getElementById('business-description').value : '';
        
        // Create a custom subject line for promotional applications
        let emailSubject = formValues.subject;
        if (applyingForPromo) {
          emailSubject = 'PROMO APPLICATION: ' + emailSubject;
        }
        
        // Prepare template parameters for EmailJS
        const templateParams = {
          from_name: formValues.name,
          from_email: formValues.email,
          subject: emailSubject,
          message: formValues.message,
          services: selectedServices.join(', '),
          to_email: 'pixelsixstudios@gmail.com',
          is_promo_application: applyingForPromo ? 'Yes' : 'No',
          business_description: businessDescription
        };
        
        // Send email using EmailJS
        emailjs.send('service_awajrqb', 'template_l85nw75', templateParams)
          .then(function(response) {
            console.log('Email sent successfully:', response);
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            const successMsg = document.createElement('div');
            
            // Check if this was a promotional application
            if (templateParams.is_promo_application === 'Yes') {
              successMsg.className = 'success-message promo-success';
              successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your promotion application! We will review your business details and contact you within 5 business days if selected.';
            } else {
              successMsg.className = 'success-message';
              successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your message! We will get back to you soon.';
            }
            
            contactForm.prepend(successMsg);
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Remove success message after 5 seconds
            setTimeout(() => {
              successMsg.remove();
            }, 5000);
          })
          .catch(function(error) {
            console.error('Email sending failed:', error);
            
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Sorry, there was a problem sending your message. Please try again or contact us directly via email.';
            contactForm.prepend(errorMsg);
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Remove error message after 5 seconds
            setTimeout(() => {
              errorMsg.remove();
            }, 5000);
          });
      }
    });
  }

  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Optimized AOS-like scroll animations using IntersectionObserver
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        
        // Unobserve after animation to improve performance
        scrollAnimationObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  
  animatedElements.forEach(el => {
    el.classList.add('aos-init');
    scrollAnimationObserver.observe(el);
  });

  // Add CSS for AOS animations using a single style element
  if (!document.getElementById('aos-styles')) {
    const style = document.createElement('style');
    style.id = 'aos-styles';
    style.textContent = `
      [data-aos] {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
        will-change: opacity, transform;
      }
      
      [data-aos].aos-animate {
        opacity: 1;
        transform: translateY(0);
      }
      
      [data-aos="fade-right"] {
        transform: translateX(-30px);
      }
      
      [data-aos="fade-left"] {
        transform: translateX(30px);
      }
      
      [data-aos="fade-right"].aos-animate,
      [data-aos="fade-left"].aos-animate {
        transform: translateX(0);
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize first FAQ item as open - do this after a slight delay to ensure layout is stable
  setTimeout(() => {
    if(document.querySelector('.accordion-item')) {
      const firstAccordionItem = document.querySelector('.accordion-item');
      const firstAccordionContent = firstAccordionItem.querySelector('.accordion-content');
      const firstAccordionIcon = firstAccordionItem.querySelector('.accordion-icon i');
      
      firstAccordionItem.classList.add('active');
      if (firstAccordionIcon) {
        firstAccordionIcon.classList.replace('fa-plus', 'fa-minus');
      }
      if (firstAccordionContent) {
        firstAccordionContent.style.maxHeight = firstAccordionContent.scrollHeight + 'px';
      }
    }
  }, 100);
});