/* ============================================================
   EKOCHING — script.js
   All interactive functionality for the website
   ============================================================ */

// ---- Wait for DOM to load ----
document.addEventListener('DOMContentLoaded', () => {

  /* ========== LOADER ========== */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 1200);
  });
  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';


  /* ========== NAVBAR ========== */
  const navbar  = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    handleScrollTop();
    handleReveal();
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close nav on link click (mobile)
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });

  // Active nav link on scroll
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }


  /* ========== SCROLL TO TOP ========== */
  const scrollTopBtn = document.getElementById('scrollTop');

  function handleScrollTop() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ========== REVEAL ON SCROLL ========== */
  const revealEls = document.querySelectorAll('.reveal');

  function handleReveal() {
    const windowBottom = window.scrollY + window.innerHeight;

    revealEls.forEach((el, i) => {
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      if (windowBottom > elTop + 60) {
        // Stagger children of same parent
        const delay = el.parentElement
          ? Array.from(el.parentElement.children).indexOf(el) * 0.1
          : 0;
        el.style.transitionDelay = `${delay}s`;
        el.classList.add('visible');
      }
    });
  }

  // Initial check on page load
  setTimeout(handleReveal, 400);


  /* ========== SMOOTH SCROLL ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ========== GALLERY LIGHTBOX ========== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentIndex = 0;
  const imgSrcs = Array.from(galleryItems).map(item => item.getAttribute('data-src'));

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = imgSrcs[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${imgSrcs.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imgSrcs.length) % imgSrcs.length;
    lightboxImg.src = imgSrcs[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${imgSrcs.length}`;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imgSrcs.length;
    lightboxImg.src = imgSrcs[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${imgSrcs.length}`;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });


  /* ========== TESTIMONIALS SLIDER ========== */
  const testiTrack = document.getElementById('testiTrack');
  const testiPrev  = document.getElementById('testiPrev');
  const testiNext  = document.getElementById('testiNext');
  const testiDots  = document.getElementById('testiDots');
  const testiCards = document.querySelectorAll('.testi-card');

  let testiIndex = 0;
  let testiAuto;
  const totalTestis = testiCards.length;
  const visibleTestis = window.innerWidth <= 768 ? 1 : 2;

  // Create dots
  testiCards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('testi-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTesti(i));
    testiDots.appendChild(dot);
  });

  function updateTestiDots() {
    document.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === testiIndex);
    });
  }

  function goToTesti(idx) {
    const visible = window.innerWidth <= 768 ? 1 : 2;
    const maxIdx = Math.max(0, totalTestis - visible);
    testiIndex = Math.max(0, Math.min(idx, maxIdx));
    const cardWidth = testiCards[0].offsetWidth + 24; // gap = 1.5rem = 24px
    testiTrack.style.transform = `translateX(-${testiIndex * cardWidth}px)`;
    updateTestiDots();
  }

  testiNext.addEventListener('click', () => {
    const visible = window.innerWidth <= 768 ? 1 : 2;
    const maxIdx = totalTestis - visible;
    goToTesti(testiIndex < maxIdx ? testiIndex + 1 : 0);
    resetAutoSlide();
  });

  testiPrev.addEventListener('click', () => {
    const visible = window.innerWidth <= 768 ? 1 : 2;
    const maxIdx = totalTestis - visible;
    goToTesti(testiIndex > 0 ? testiIndex - 1 : maxIdx);
    resetAutoSlide();
  });

  function autoSlide() {
    testiAuto = setInterval(() => {
      const visible = window.innerWidth <= 768 ? 1 : 2;
      const maxIdx = totalTestis - visible;
      goToTesti(testiIndex < maxIdx ? testiIndex + 1 : 0);
    }, 4000);
  }

  function resetAutoSlide() {
    clearInterval(testiAuto);
    autoSlide();
  }

  autoSlide();

  // Re-calculate on resize
  window.addEventListener('resize', () => {
    goToTesti(0);
  });


  /* ========== FORM VALIDATION: INQUIRY ========== */
  const inquiryForm = document.getElementById('inquiryForm');
  const inqSuccess  = document.getElementById('inqSuccess');

  function validateField(inputId, errId, message, extraCheck) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (!input) return true;

    let value = input.value.trim();
    if (!value) {
      err.textContent = message || 'This field is required.';
      input.style.borderColor = '#e74c3c';
      return false;
    }
    if (extraCheck && !extraCheck(value)) {
      err.textContent = extraCheck.errorMsg || 'Invalid value.';
      input.style.borderColor = '#e74c3c';
      return false;
    }
    err.textContent = '';
    input.style.borderColor = '';
    return true;
  }

  function isValidPhone(val) { return /^[6-9]\d{9}$/.test(val.replace(/[\s\+\-]/g,'')); }
  function isValidEmail(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }

  // Attach real-time clearing on input
  ['inqName','inqPhone','inqCourse'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      const err = document.getElementById(id + 'Err');
      if (err) { err.textContent = ''; el.style.borderColor = ''; }
    });
  });

  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneCheck = (v) => isValidPhone(v);
    phoneCheck.errorMsg = 'Enter a valid 10-digit Indian mobile number.';

    const valid = [
      validateField('inqName', 'inqNameErr', 'Please enter your name.'),
      validateField('inqPhone', 'inqPhoneErr', 'Please enter your phone.', phoneCheck),
      validateField('inqCourse', 'inqCourseErr', 'Please select a course.'),
    ].every(Boolean);

    if (valid) {
      // Simulate form submission
      const btn = inquiryForm.querySelector('button[type="submit"]');
      btn.textContent = 'Submitting...';
      btn.disabled = true;

      setTimeout(() => {
        inqSuccess.style.display = 'flex';
        inquiryForm.reset();
        btn.innerHTML = 'Request a Call <i class="fas fa-phone"></i>';
        btn.disabled = false;
        setTimeout(() => { inqSuccess.style.display = 'none'; }, 5000);
      }, 1200);
    }
  });


  /* ========== FORM VALIDATION: CONTACT ========== */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  ['cName','cPhone','cEmail','cMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      const err = document.getElementById(id + 'Err');
      if (err) { err.textContent = ''; el.style.borderColor = ''; }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneCheck = (v) => isValidPhone(v);
    phoneCheck.errorMsg = 'Enter a valid 10-digit mobile number.';
    const emailCheck = (v) => isValidEmail(v);
    emailCheck.errorMsg = 'Enter a valid email address.';

    const valid = [
      validateField('cName', 'cNameErr', 'Please enter your name.'),
      validateField('cPhone', 'cPhoneErr', 'Please enter your phone.', phoneCheck),
      validateField('cEmail', 'cEmailErr', 'Please enter your email.', emailCheck),
      validateField('cMessage', 'cMessageErr', 'Please enter your message.'),
    ].every(Boolean);

    if (valid) {
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        contactSuccess.style.display = 'flex';
        contactForm.reset();
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        setTimeout(() => { contactSuccess.style.display = 'none'; }, 5000);
      }, 1200);
    }
  });


  /* ========== COUNTER ANIMATION ========== */
  // Animate stat numbers when hero comes into view
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = start + suffix;
      }
    }, 25);
  }

  // Trigger once on load
  setTimeout(() => {
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(el => {
      const text = el.textContent;
      const num  = parseInt(text);
      const suffix = text.replace(/[0-9]/g, '');
      if (!isNaN(num)) animateCounter(el, num, suffix);
    });
  }, 1500);


  /* ========== TOUCH SWIPE FOR GALLERY ========== */
  let touchStartX = 0;
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    galleryGrid.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    galleryGrid.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40 && lightbox.classList.contains('active')) {
        diff > 0 ? showNext() : showPrev();
      }
    });
  }

  // Swipe for testimonials
  let testiTouchX = 0;
  if (testiTrack) {
    testiTrack.addEventListener('touchstart', (e) => { testiTouchX = e.touches[0].clientX; }, { passive: true });
    testiTrack.addEventListener('touchend', (e) => {
      const diff = testiTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        const visible = window.innerWidth <= 768 ? 1 : 2;
        const maxIdx = totalTestis - visible;
        if (diff > 0) goToTesti(testiIndex < maxIdx ? testiIndex + 1 : 0);
        else goToTesti(testiIndex > 0 ? testiIndex - 1 : maxIdx);
        resetAutoSlide();
      }
    });
  }

  /* ========== INITIAL CALLS ========== */
  updateActiveNav();
  handleReveal();

  console.log('%cEkoching — Built with ❤️ in Ahmedabad', 'color:#1e4db7;font-size:14px;font-weight:700;');
});
