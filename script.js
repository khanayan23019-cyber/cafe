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

gsap.to(".hero-content", {
  yPercent: 15,
  opacity: 0.7,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
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
  const wrap = document.getElementById("three-canvas-wrap");
  if (!wrap || window.innerWidth < 700) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
  camera.position.set(0, 0.5, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  wrap.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xf5e6c5, 0.8);
  const key = new THREE.DirectionalLight(0xffd9a0, 1.2);
  key.position.set(2, 3, 4);
  scene.add(ambient, key);

  const cupGroup = new THREE.Group();
  const cup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.6, 1.2, 42),
    new THREE.MeshStandardMaterial({
      color: 0xeee2cf,
      metalness: 0.2,
      roughness: 0.34
    })
  );
  cup.position.y = 0.2;

  const coffee = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.08, 40),
    new THREE.MeshStandardMaterial({
      color: 0x2c150f,
      roughness: 0.9
    })
  );
  coffee.position.y = 0.75;

  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 0.1, 50),
    new THREE.MeshStandardMaterial({
      color: 0xd4b075,
      metalness: 0.5,
      roughness: 0.3
    })
  );
  plate.position.y = -0.5;

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.08, 16, 50, Math.PI * 1.6),
    new THREE.MeshStandardMaterial({ color: 0xeee2cf, roughness: 0.34, metalness: 0.2 })
  );
  handle.position.set(0.82, 0.25, 0);
  handle.rotation.z = Math.PI / 2;

  cupGroup.add(cup, coffee, plate, handle);
  scene.add(cupGroup);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  gsap.to(cupGroup.rotation, {
    y: Math.PI * 2,
    duration: 20,
    repeat: -1,
    ease: "none"
  });

  function render() {
    cupGroup.rotation.x += (pointer.y * 0.12 - cupGroup.rotation.x) * 0.04;
    cupGroup.rotation.z += (pointer.x * 0.08 - cupGroup.rotation.z) * 0.04;
    cupGroup.position.y = Math.sin(performance.now() * 0.0008) * 0.06;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  window.addEventListener("resize", () => {
    camera.aspect = wrap.clientWidth / wrap.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
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
