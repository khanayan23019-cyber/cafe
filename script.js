gsap.registerPlugin(ScrollTrigger);

const loader = document.getElementById("entry-loader");
window.addEventListener("load", () => {
  gsap.to(loader, {
    autoAlpha: 0,
    duration: 0.8,
    onComplete: () => {
      loader.style.display = "none";
    }
  });
});

let sceneBooted = false;
let doorSoundPlayed = false;

gsap.set(".hero-bg", { scale: 1 });
gsap.set(".hero-plants", { scale: 1.03, y: 0 });
gsap.set(".overlay", { opacity: 1 });
gsap.set(".door-panel", { rotateY: 0 });
gsap.set(".next-line", { autoAlpha: 0, y: 18 });

const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

heroTl
  .to(".hero-bg", { scale: 1.5, filter: "blur(0px) brightness(0.94)", ease: "none" }, 0)
  .to(".hero-plants", { y: -180, scale: 1.22, ease: "none" }, 0)
  .to(".overlay", { opacity: 0.18, ease: "none" }, 0.08)
  .to(".intro-line", { autoAlpha: 0, y: -34, ease: "none" }, 0.25)
  .to(".hero-content h1", { autoAlpha: 0.1, y: -40, ease: "none" }, 0.25)
  .to(".next-line", { autoAlpha: 1, y: 0, ease: "power2.out" }, 0.44)
  .to(".door-panel", { rotateY: -108, ease: "power4.out" }, 0.71)
  .to(".door-shadow", { opacity: 0.65, ease: "power2.out" }, 0.71)
  .to(".fade-black", { opacity: 1, ease: "power2.out" }, 0.88)
  .to(".hero-content", { autoAlpha: 0, ease: "none" }, 0.9);

ScrollTrigger.create({
  trigger: "#hero",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    if (self.progress > 0.73 && !doorSoundPlayed) {
      const doorAudio = document.getElementById("door-audio");
      doorAudio.volume = 0.3;
      doorAudio.play().catch(() => null);
      doorSoundPlayed = true;
    }

    if (self.progress > 0.9 && !sceneBooted) {
      initThreeWorld();
      sceneBooted = true;
    }
  }
});

function initThreeWorld() {
  const canvas = document.getElementById("three-canvas");
  const section = document.getElementById("world");
  const enterBtn = document.getElementById("enter3d");
  if (!canvas || !section || !enterBtn) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);
  scene.fog = new THREE.Fog(0x050505, 8, 45);

  const camera = new THREE.PerspectiveCamera(
    72,
    section.clientWidth / section.clientHeight,
    0.1,
    200
  );
  camera.position.set(0, 1.7, 8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(section.clientWidth, section.clientHeight, false);

  const ambient = new THREE.AmbientLight(0xd8b26c, 0.45);
  const point = new THREE.PointLight(0xffd38a, 1.2, 45);
  point.position.set(0, 4, 4);
  scene.add(ambient, point);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x1b1712, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x12110f, roughness: 0.9 });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(40, 8, 0.5), wallMat);
  backWall.position.set(0, 4, -20);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 40), wallMat);
  leftWall.position.set(-20, 4, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 40), wallMat);
  rightWall.position.set(20, 4, 0);
  scene.add(rightWall);

  function createTable(x, z) {
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 0.16, 24),
      new THREE.MeshStandardMaterial({ color: 0x6f4a2a, roughness: 0.5 })
    );
    top.position.set(x, 1.15, z);
    scene.add(top);

    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x2a2119, roughness: 0.7 })
    );
    leg.position.set(x, 0.57, z);
    scene.add(leg);
  }

  createTable(-4, -2);
  createTable(3, -4);
  createTable(0, -10);
  createTable(-6, -12);

  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const keys = { w: false, a: false, s: false, d: false };
  let yaw = 0;
  let pitch = 0;
  let isLocked = false;

  enterBtn.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  document.addEventListener("pointerlockchange", () => {
    isLocked = document.pointerLockElement === canvas;
  });

  document.addEventListener("mousemove", (event) => {
    if (!isLocked) return;
    yaw -= event.movementX * 0.002;
    pitch -= event.movementY * 0.002;
    pitch = Math.max(-1.2, Math.min(1.2, pitch));
  });

  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = true;
  });
  document.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = false;
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.033);

    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    direction.set(0, 0, 0);
    if (keys.w) direction.z -= 1;
    if (keys.s) direction.z += 1;
    if (keys.a) direction.x -= 1;
    if (keys.d) direction.x += 1;
    direction.normalize();

    const speed = 6.5;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));

    velocity.set(0, 0, 0);
    velocity.addScaledVector(forward, direction.z * speed * delta);
    velocity.addScaledVector(right, direction.x * speed * delta);
    camera.position.add(velocity);
    camera.position.y = 1.7;

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -18, 18);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -18, 18);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = section.clientWidth / section.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(section.clientWidth, section.clientHeight, false);
  });
}
