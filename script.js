// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Preloader
  setTimeout(function() {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('hide');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 300);
  }, 2000);

  // Initialize EmailJS
  emailjs.init("lh3Xhad9UeKgpBozB"); // Replace with your EmailJS user ID

  // Custom cursor
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(function() {
      cursorFollower.style.left = e.clientX + 'px';
      cursorFollower.style.top = e.clientY + 'px';
    }, 100);
  });
  
  document.addEventListener('mousedown', function() {
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
  });
  
  document.addEventListener('mouseup', function() {
    cursor.classList.remove('active');
    cursorFollower.classList.remove('active');
  });
  
  // Add active class to links and buttons for cursor effect
  const links = document.querySelectorAll('a, button');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      cursorFollower.classList.add('active');
    });
    link.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorFollower.classList.remove('active');
    });
  });

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

  // Header scroll effect
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

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
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Testimonial slider
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
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
  
  // Go to specific slide
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
  
  // Pause on hover
  testimonialTrack.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  testimonialTrack.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
  });

  // Animate stats counter
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / duration * 10; // Update every 10ms
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

  // Back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopButton.classList.add('active');
    } else {
      backToTopButton.classList.remove('active');
    }
  });
  
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
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

  // Form validation
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
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
        
        // Prepare template parameters for EmailJS
        const templateParams = {
          from_name: formValues.name,
          from_email: formValues.email,
          subject: formValues.subject,
          message: formValues.message,
          services: selectedServices.join(', '),
          to_email: 'pixelsixstudios@gmail.com'
        };
        
        // Send email using EmailJS
        emailjs.send('service_awajrqb', 'template_l85nw75', templateParams) // Replace with your service and template IDs
          .then(function(response) {
            console.log('Email sent successfully:', response);
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
          })
          .catch(function(error) {
            console.error('Email sending failed:', error);
            
            // Show error message
            alert('Sorry, there was a problem sending your message. Please try again or contact us directly via email.');
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
          });
      }
    });
  }

  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // AOS-like scroll animations
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        
        scrollObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => {
    el.classList.add('aos-init');
    scrollObserver.observe(el);
  });

  // Add CSS for AOS animations
  const style = document.createElement('style');
  style.textContent = `
    [data-aos] {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
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
});