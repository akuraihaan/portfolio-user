$(document).ready(function () {

  /* =====================================================
     GLOBAL
  ===================================================== */
  const $window = $(window);
  const $document = $(document);
  const $body = $('body');
  const $navbar = $('.navbar');
  const $navLinks = $('.nav-link');
  const $sections = $('.section');
  const $progress = $('#scrollProgress');
  const $backToTop = $('#backToTop');
  const $navbarCollapse = $('.navbar-collapse');
  const $navbarToggler = $('.navbar-toggler');

  const HEADER_OFFSET = 90;
  let lastScrollTop = 0;
  let isProgrammaticScroll = false;
  let ticking = false;

  /* =====================================================
   HAPTIC FEEDBACK HELPER
===================================================== */

  function haptic(duration = 10) {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }

  /* =====================================================
     HELPER
  ===================================================== */
  function isMobile() {
    return $window.width() <= 768;
  }

  /* =====================================================
     PAGE LOAD
  ===================================================== */
  $body.css('opacity', 0).animate({ opacity: 1 }, 400);

  /* =====================================================
     HAMBURGER STATE (BOOTSTRAP SAFE)
  ===================================================== */

  // Toggle icon animation only
  $navbarToggler.on('click', function () {
    $(this).toggleClass('active');
  });

  // Saat menu benar-benar terbuka
  $navbarCollapse.on('shown.bs.collapse', function () {
    $navbarToggler.addClass('active');
  });

  // Saat menu benar-benar tertutup
  $navbarCollapse.on('hidden.bs.collapse', function () {
    $navbarToggler.removeClass('active');
  });

  // Klik menu (mobile) → tutup navbar
  $navLinks.on('click', function () {
    if (isMobile() && $navbarCollapse.hasClass('show')) {
      $navbarCollapse.collapse('hide');
    }
  });

  /* =====================================================
     SMOOTH NAVIGATION
  ===================================================== */
  $('a[href^="#"]').on('click', function (e) {
    const target = $($(this).attr('href'));
    if (!target.length) return;

    e.preventDefault();
    isProgrammaticScroll = true;

    $navbar.removeClass('nav-hide');

    $('html, body').stop().animate(
      { scrollTop: target.offset().top - HEADER_OFFSET },
      650,
      'swing',
      () => {
        lastScrollTop = $window.scrollTop();
        isProgrammaticScroll = false;
      }
    );
  });

  /* =====================================================
     SCROLL HANDLER
  ===================================================== */
  function handleScroll() {
    const st = $window.scrollTop();
    const docHeight = $document.height() - $window.height();

    // Navbar shadow
    $navbar.toggleClass('scrolled', st > 80);

    // Navbar hide (desktop only)
    if (!isMobile() && !isProgrammaticScroll) {
      if (st > lastScrollTop && st > 200) {
        $navbar.addClass('nav-hide');
      } else {
        $navbar.removeClass('nav-hide');
      }
    }

    lastScrollTop = st;

    // Scroll progress
    if ($progress.length) {
      $progress.css('width', (st / docHeight) * 100 + '%');
    }

    // Back to top
    $backToTop.toggle(st > 500);

    // Active menu
    $sections.each(function () {
      const top = $(this).offset().top - HEADER_OFFSET - 20;
      const bottom = top + $(this).outerHeight();

      if (st >= top && st < bottom) {
        const id = $(this).attr('id');
        $navLinks.removeClass('active');
        $navLinks.filter(`[href="#${id}"]`).addClass('active');
      }
    });

    revealCards(st);
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  $window.on('scroll', onScroll);

  /* =====================================================
     CARD REVEAL
  ===================================================== */
  function revealCards(scrollTop) {
    const trigger = scrollTop + $window.height() * 0.85;

    $('.card-animate').each(function () {
      if ($(this).hasClass('show')) return;
      if (trigger > $(this).offset().top) {
        $(this).addClass('show');
      }
    });
  }

  /* =====================================================
     BACK TO TOP
  ===================================================== */
  $backToTop.on('click', function () {
    isProgrammaticScroll = true;
    $navbar.removeClass('nav-hide');

    $('html, body').animate({ scrollTop: 0 }, 700, () => {
      lastScrollTop = 0;
      isProgrammaticScroll = false;
    });
  });

  /* =====================================================
     RESIZE SAFETY
  ===================================================== */
  $window.on('resize', function () {
    if (!isMobile()) {
      $navbarCollapse.removeClass('show');
      $navbarToggler.removeClass('active');
    }
  });

  /* =====================================================
     INIT
  ===================================================== */
  handleScroll();
  revealCards($window.scrollTop());

  
});

/* =====================================================
   INTERAKSI FORM KONTAK 
===================================================== */

$('#contactForm').on('submit', function (e) {
  e.preventDefault();

  const $form = $(this);
  const $btn = $form.find('button[type="submit"]');

  // Loading state dengan animasi halus
  $btn.prop('disabled', true)
      .css({ transform: 'scale(.96)' })
      .text('Mengirim...');

  // Simulasi proses kirim
  setTimeout(() => {

    // Reset form dengan fade lembut
    $form[0].reset();
    $form.find('input, textarea')
         .css('opacity', 0)
         .animate({ opacity: 1 }, 300);

    // Kembalikan tombol
    $btn.prop('disabled', false)
        .css({ transform: 'scale(1)' })
        .text('Kirim Pesan');

    // Tampilkan modal (Bootstrap sudah handle fade)
    const successModal = new bootstrap.Modal(
      document.getElementById('successModal'),
      { backdrop: 'static', keyboard: true }
    );
    successModal.show();

  }, 1100);
});
$('#successModal').on('shown.bs.modal', function () {
  setTimeout(() => {
    bootstrap.Modal.getInstance(this).hide();
  }, 2500);
});
