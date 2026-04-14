gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  smoothWheel: true,
  duration: 1.2
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

const progressLine = document.createElement("div");
progressLine.className = "progress-line";
document.body.appendChild(progressLine);

gsap.to(progressLine, {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

const loadingScreen = document.getElementById("loadingScreen");
window.addEventListener("load", () => {
  const tl = gsap.timeline();
  tl.to(".loader-line", { width: 220, duration: 1.2, ease: "power2.inOut" })
    .to(loadingScreen, { autoAlpha: 0, duration: 0.8 }, "-=0.2")
    .set(loadingScreen, { display: "none" });
});

gsap.from(".site-header", {
  y: -30,
  autoAlpha: 0,
  duration: 1,
  delay: 0.4,
  ease: "power3.out"
});

gsap.from(".hero-content h1", {
  y: 100,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out"
});

gsap.from(".hero-content p", {
  y: 50,
  opacity: 0,
  delay: 0.3
});

gsap.from(".btn", {
  scale: 0.8,
  opacity: 0,
  delay: 0.6
});

gsap.utils.toArray(".reveal").forEach((el, i) => {
  gsap.to(el, {
    autoAlpha: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 1.1,
    delay: i * 0.12 + 0.5,
    ease: "power3.out"
  });
});

const revealConfigs = [
  { selector: ".reveal-up", y: 60 },
  { selector: ".reveal-left", x: -70 },
  { selector: ".reveal-right", x: 70 }
];

revealConfigs.forEach(({ selector, x = 0, y = 0 }) => {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, x, y, filter: "blur(8px)" },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%"
        }
      }
    );
  });
});

gsap.to(".parallax-bg", {
  yPercent: 14,
  ease: "none",
  scrollTrigger: {
    trigger: ".experience",
    scrub: true
  }
});

gsap.to(".hero-video", {
  scale: 1.3,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

gsap.to(".hero-content", {
  opacity: 0,
  y: -100,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

gsap.from(".about", {
  opacity: 0,
  y: 100,
  scrollTrigger: {
    trigger: ".about",
    start: "top 80%",
    end: "top 50%",
    scrub: true
  }
});

const cursorGlow = document.getElementById("cursorGlow");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

gsap.ticker.add(() => {
  gsap.set(cursorGlow, { x: mouseX, y: mouseY });
});

document.querySelectorAll("a, button, .gallery-item, .menu-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorGlow.style.width = "46px";
    cursorGlow.style.height = "46px";
  });
  el.addEventListener("mouseleave", () => {
    cursorGlow.style.width = "26px";
    cursorGlow.style.height = "26px";
  });
});

const filterButtons = document.querySelectorAll(".filter");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const selected = btn.dataset.filter;
    menuCards.forEach((card) => {
      const show = selected === "all" || card.dataset.category === selected;
      card.style.display = show ? "block" : "none";
      if (show) {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 20, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }
        );
      }
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");

document.querySelectorAll(".gallery-item").forEach((img) => {
  img.addEventListener("click", () => {
    lightbox.style.display = "grid";
    lightbox.setAttribute("aria-hidden", "false");
    lightboxImg.src = img.src;
    gsap.fromTo(lightboxImg, { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4 });
  });
});

function closePreview() {
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
}

closeLightbox.addEventListener("click", closePreview);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closePreview();
});

const reservationForm = document.getElementById("reservationForm");
const formMessage = document.getElementById("formMessage");
const softBell = document.getElementById("softBell");

reservationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(reservationForm);
  const payload = Object.fromEntries(data.entries());

  if (!payload.name || !payload.date || !payload.time || !payload.guests) {
    formMessage.textContent = "Please complete all reservation details.";
    gsap.fromTo(formMessage, { x: -10 }, { x: 0, duration: 0.35, ease: "power2.out" });
    return;
  }

  const whatsappText = encodeURIComponent(
    `Reservation Request - Beyond 7 Cafe%nName: ${payload.name}%nDate: ${payload.date}%nTime: ${payload.time}%nGuests: ${payload.guests}`
  );

  formMessage.textContent = "Reservation confirmed. Opening WhatsApp draft...";
  gsap.fromTo(formMessage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });

  softBell.volume = 0.25;
  softBell.play().catch(() => null);

  setTimeout(() => {
    window.open(`https://wa.me/919876543210?text=${whatsappText}`, "_blank");
  }, 500);

  gsap.fromTo(
    ".reserve-form",
    { boxShadow: "0 0 0 rgba(0,0,0,0)" },
    { boxShadow: "0 0 0 3px rgba(216,178,108,0.2)", duration: 0.35, yoyo: true, repeat: 1 }
  );

  reservationForm.reset();
});

const magneticButtons = document.querySelectorAll(".magnetic");
magneticButtons.forEach((button) => {
  button.addEventListener("mousemove", (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(button, { x: x * 0.16, y: y * 0.16, duration: 0.3, ease: "power2.out" });
  });
  button.addEventListener("mouseleave", () => {
    gsap.to(button, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
  });
});

document.querySelectorAll(".btn-premium").forEach((button) => {
  button.addEventListener("click", (e) => {
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--ripple-x", `${e.clientX - rect.left}px`);
    button.style.setProperty("--ripple-y", `${e.clientY - rect.top}px`);
    button.style.setProperty("--ripple-size", `${Math.max(rect.width, rect.height)}px`);
    button.classList.remove("ripple");
    requestAnimationFrame(() => button.classList.add("ripple"));
  });
});

document.querySelectorAll(".menu-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: px * 7,
      rotateX: -py * 5,
      transformPerspective: 800,
      duration: 0.3,
      ease: "power2.out"
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.45, ease: "power2.out" });
  });
});

gsap.utils.toArray(".section").forEach((section) => {
  if (section.id === "hero") return;
  gsap.fromTo(
    section,
    { autoAlpha: 0.7, y: 45 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 78%"
      }
    }
  );
});

function initHeroParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setCanvasSize();

  const particles = [];
  const particleCount = window.innerWidth < 700 ? 45 : 80;

  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speedY: Math.random() * 1
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.y += p.speedY;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
  window.addEventListener("resize", setCanvasSize);
}

function initThreeHero() {
  const canvas = document.getElementById("three-canvas");
  if (!canvas || window.innerWidth < 700) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.5
  });

  const coffee = new THREE.Mesh(geometry, material);
  scene.add(coffee);

  function animate3D() {
    requestAnimationFrame(animate3D);
    coffee.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate3D();

  document.addEventListener("mousemove", (e) => {
    coffee.rotation.x = (e.clientY / window.innerHeight) * 2;
    coffee.rotation.y = (e.clientX / window.innerWidth) * 2;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });
}

initHeroParticles();
initThreeHero();

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  gsap.to(".hero-content", {
    x,
    y,
    duration: 0.5
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -40, duration: 1.2 });
  });
});
