/*===========================================
  LOADER
===========================================*/
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader && loader.classList.add('is-hidden'), 600);
});

/*===========================================
  MENU SHOW / HIDE
===========================================*/
const toggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (toggle && navMenu) {
    toggle.addEventListener('click', () => navMenu.classList.toggle('show'));
}

document.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => navMenu && navMenu.classList.remove('show'));
});

/*===========================================
  HEADER STATE + SCROLL PROGRESS + SCROLLSPY
===========================================*/
const header = document.getElementById('l-header');
const progressBar = document.getElementById('scroll-progress');
const sections = document.querySelectorAll('section[id]');
const toTopBtn = document.getElementById('to-top');

function onScroll() {
    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle('is-scrolled', scrollY > 30);
    if (progressBar) progressBar.style.width = `${(scrollY / docHeight) * 100}%`;
    if (toTopBtn) toTopBtn.classList.toggle('show', scrollY > 480);

    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 90;
        const id = current.getAttribute('id');
        const link = document.querySelector(`.nav__menu a[href*="${id}"]`);
        if (!link) return;
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', onScroll);
onScroll();

if (toTopBtn) {
    toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/*===========================================
  TYPED ROLE EFFECT
===========================================*/
const roles = ['Full-Stack Developer', 'ASP.NET & SQL Builder', 'Problem Solver', 'UI-Minded Engineer'];
const roleHost = document.querySelector('.home__role');
const roleTextNode = roleHost ? roleHost.firstChild : null;

if (roleTextNode) {
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
        const current = roles[roleIndex];
        charIndex += deleting ? -1 : 1;
        roleTextNode.textContent = current.substring(0, charIndex) + ' ';

        let delay = deleting ? 35 : 75;

        if (!deleting && charIndex >= current.length) {
            deleting = true;
            delay = 1500;
        } else if (deleting && charIndex <= 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 300;
        }

        setTimeout(typeLoop, delay);
    }
    typeLoop();
}

/*===========================================
  ANIMATED COUNTERS (About stats)
===========================================*/
const counters = document.querySelectorAll('.stat__num');
let countersStarted = false;

function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach((el) => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const duration = 1100;
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    });
}

/*===========================================
  SKILL BARS FILL
===========================================*/
const skillFills = document.querySelectorAll('.skill-bar__fill');
let skillsStarted = false;

function animateSkillBars() {
    if (skillsStarted) return;
    skillsStarted = true;
    skillFills.forEach((el) => {
        const width = el.getAttribute('data-width') || '0';
        requestAnimationFrame(() => { el.style.width = width + '%'; });
    });
}

/*===========================================
  INTERSECTION OBSERVER TRIGGERS
===========================================*/
const aboutStatsEl = document.querySelector('.about__stats');
const skillsEl = document.querySelector('.skills');

const triggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target === aboutStatsEl) animateCounters();
        if (entry.target === skillsEl) animateSkillBars();
    });
}, { threshold: 0.35 });

if (aboutStatsEl) triggerObserver.observe(aboutStatsEl);
if (skillsEl) triggerObserver.observe(skillsEl);

/*===========================================
  PROJECT CARD TILT
===========================================*/
document.querySelectorAll('.portfolio__card').forEach((card) => {
    const maxTilt = 6;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const tiltX = (py - 0.5) * -maxTilt * 2;
        const tiltY = (px - 0.5) * maxTilt * 2;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/*===========================================
  SCROLL REVEAL ANIMATIONS
===========================================*/
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({ origin: 'bottom', distance: '40px', duration: 900, easing: 'cubic-bezier(.22,1,.36,1)', reset: false });

    sr.reveal('.home__copy > *', { interval: 90 });
    sr.reveal('.about__media', { origin: 'left' });
    sr.reveal('.about__content > *', { interval: 80 });
    sr.reveal('.skills__col', { interval: 150 });
    sr.reveal('.portfolio__card', { interval: 100 });
    sr.reveal('.contact__info > *', { interval: 80 });
    sr.reveal('.contact__form', { origin: 'right' });
}

/*===========================================
  TOAST NOTIFICATIONS
===========================================*/
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message, type = 'success') {
    if (!toast) return;
    const icon = toast.querySelector('i');
    const text = toast.querySelector('.toast__text');
    toast.classList.remove('success', 'error');
    toast.classList.add(type);
    icon.className = type === 'success' ? 'bx bx-check-circle' : 'bx bx-error-circle';
    text.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}

/*===========================================
  CONTACT FORM (EmailJS)
===========================================*/
const form = document.getElementById('contact-form');
const sendBtn = document.getElementById('send');

if (form && sendBtn) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameVal = document.getElementById('name').value.trim();
        const emailVal = document.getElementById('email_id').value.trim();
        const messageVal = document.getElementById('message').value.trim();

        if (!nameVal || !emailVal || !messageVal) {
            showToast('Please fill in every field before sending.', 'error');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailVal)) {
            showToast('That email address looks off — double-check it.', 'error');
            return;
        }

        sendBtn.classList.add('is-loading');
        sendBtn.disabled = true;

        const params = { from_name: nameVal, email_id: emailVal, message: messageVal };

        emailjs.send('service_b1o6tjr', 'template_52icps8', params)
            .then(() => {
                showToast('Message sent — thanks for reaching out!', 'success');
                form.reset();
            })
            .catch((error) => {
                showToast('Could not send right now. Try again shortly.', 'error');
                console.error('EmailJS error:', error);
            })
            .finally(() => {
                sendBtn.classList.remove('is-loading');
                sendBtn.disabled = false;
            });
    });
}

/*===========================================
  FOOTER YEAR
===========================================*/
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
