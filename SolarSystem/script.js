document.addEventListener("DOMContentLoaded", () => {
  let scene, camera, renderer, controls;
  const planets = {};
  const planetPivots = {};
  const orbitLines = {};
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let currentFocus = null; // Para armazenar planeta focado

  const canvas = document.getElementById("solarSystemCanvas");
  const infoPanel = document.getElementById("info-panel");
  const closeInfoPanelButton = document.getElementById("close-info-panel");
  const planetNameEl = document.getElementById("planet-name");
  const planetImageEl = document.getElementById("planet-image");
  const planetDiameterEl = document.getElementById("planet-diameter");
  const planetMassEl = document.getElementById("planet-mass");
  const planetDistanceEl = document.getElementById("planet-distance");
  const planetOrbitalPeriodEl = document.getElementById(
    "planet-orbital-period"
  );
  const planetRotationPeriodEl = document.getElementById(
    "planet-rotation-period"
  );
  const planetTemperatureEl = document.getElementById("planet-temperature");
  const planetMoonsEl = document.getElementById("planet-moons");
  const planetFactEl = document.getElementById("planet-fact");
  const planetSelectorMenu = document.getElementById("planet-selector-menu");

  const planetData = {
    sun: {
      name: "Sol",
      diameter: "1.392.700 km",
      mass: "1,989 × 10^30 kg",
      distance: "N/A",
      orbitalPeriod: "N/A (Estrela)",
      rotationPeriod: "25-35 dias terrestres (na equador)",
      temperature: "5.500 °C (superfície)",
      moons: "N/A",
      fact: "O Sol contém 99,86% da massa total do Sistema Solar.",
      texture: "textures/sun.jpg",
      infoImage: "img/sun.jpg",
      size: 20,
      orbitalSpeed: 0,
      rotationSpeed: 0.0005,
      isStar: true,
      baseColor: 0xfff5c3,
    },
    mercury: {
      name: "Mercúrio",
      diameter: "4.879 km",
      mass: "3,301 × 10^23 kg",
      distance: "57,9 milhões km",
      orbitalPeriod: "88 dias terrestres",
      rotationPeriod: "58,6 dias terrestres",
      temperature: "167 °C (média)",
      moons: "0",
      fact: "Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol.",
      texture: "textures/mercury.jpg",
      infoImage: "img/mercury.jpg",
      baseColor: 0x9e9e9e,
      orbitColor: 0xaaaaaa,
      size: 0.8,
      distanceFromSun: 30,
      orbitalSpeed: 0.0048,
      rotationSpeed: 0.0017,
    },
    venus: {
      name: "Vênus",
      diameter: "12.104 km",
      mass: "4,867 × 10^24 kg",
      distance: "108,2 milhões km",
      orbitalPeriod: "224,7 dias terrestres",
      rotationPeriod: "243 dias terrestres (retrógrado)",
      temperature: "464 °C (média)",
      moons: "0",
      fact: "Vênus é o planeta mais quente, com uma atmosfera densa que causa um efeito estufa descontrolado.",
      texture: "textures/venus.jpg",
      infoImage: "img/venus.jpg",
      baseColor: 0xe6c3a1,
      orbitColor: 0xffd700,
      size: 1.9,
      distanceFromSun: 45,
      orbitalSpeed: 0.0035,
      rotationSpeed: -0.0008,
    },
    earth: {
      name: "Terra",
      diameter: "12.742 km",
      mass: "5,972 × 10^24 kg",
      distance: "149,6 milhões km (1 UA)",
      orbitalPeriod: "365,25 dias terrestres",
      rotationPeriod: "23,93 horas",
      temperature: "15 °C (média)",
      moons: "1 (Lua)",
      fact: "A Terra é o único planeta conhecido por abrigar vida.",
      texture: "textures/earth.jpg",
      infoImage: "img/earth.jpg",
      baseColor: 0x2e6da4,
      orbitColor: 0x6cb4ee,
      size: 2.0,
      distanceFromSun: 60,
      orbitalSpeed: 0.003,
      rotationSpeed: 0.01,
      moonData: {
        name: "Lua",
        texture: "textures/moon.jpg",
        infoImage: "img/moon.jpg",
        baseColor: 0xbdbdbd,
        orbitColor: 0x999999,
        size: 0.5,
        distanceFromPlanet: 4,
        orbitalSpeed: 0.02,
        rotationSpeed: 0.001,
        diameter: "3.474 km",
        mass: "7,342 × 10^22 kg",
        orbitalPeriod: "27,3 dias terrestres",
        rotationPeriod: "27,3 dias terrestres (síncrona)",
        temperature: "-20°C a -150°C",
        fact: "A Lua é o único satélite natural da Terra.",
      },
    },
    mars: {
      name: "Marte",
      diameter: "6.779 km",
      mass: "6,417 × 10^23 kg",
      distance: "227,9 milhões km",
      orbitalPeriod: "687 dias terrestres",
      rotationPeriod: "24,6 horas",
      temperature: "-65 °C (média)",
      moons: "2 (Fobos, Deimos)",
      fact: "Marte é conhecido como o 'Planeta Vermelho' devido ao óxido de ferro em sua superfície.",
      texture: "textures/mars.jpg",
      infoImage: "img/mars.jpg",
      baseColor: 0xc1440e,
      orbitColor: 0xff8c00,
      size: 1.2,
      distanceFromSun: 80,
      orbitalSpeed: 0.0024,
      rotationSpeed: 0.0098,
    },
    jupiter: {
      name: "Júpiter",
      diameter: "139.820 km",
      mass: "1,898 × 10^27 kg",
      distance: "778,5 milhões km",
      orbitalPeriod: "11,86 anos terrestres",
      rotationPeriod: "9,93 horas",
      temperature: "-110 °C (topo das nuvens)",
      moons: "95 (confirmadas)",
      fact: "Júpiter é o maior planeta do Sistema Solar e possui a Grande Mancha Vermelha, uma tempestade gigantesca.",
      texture: "textures/jupiter.jpg",
      infoImage: "img/jupiter.jpg",
      baseColor: 0xd8c8a8,
      orbitColor: 0xc0c0c0,
      size: 10,
      distanceFromSun: 130,
      orbitalSpeed: 0.0013,
      rotationSpeed: 0.024,
    },
    saturn: {
      name: "Saturno",
      diameter: "116.460 km (sem anéis)",
      mass: "5,683 × 10^26 kg",
      distance: "1,43 bilhão km",
      orbitalPeriod: "29,45 anos terrestres",
      rotationPeriod: "10,7 horas",
      temperature: "-140 °C (topo das nuvens)",
      moons: "146 (confirmadas e provisórias)",
      fact: "Saturno é famoso por seus impressionantes anéis, compostos principalmente de partículas de gelo.",
      texture: "textures/saturn.jpg",
      infoImage: "img/saturn.jpg",
      baseColor: 0xe0d8b0,
      orbitColor: 0xbdb76b,
      size: 8.5,
      distanceFromSun: 180,
      orbitalSpeed: 0.00097,
      rotationSpeed: 0.022,
      rings: {
        innerRadius: 10,
        outerRadius: 18,
        texture: "textures/saturn_ring.png",
      },
    },
    uranus: {
      name: "Urano",
      diameter: "50.724 km",
      mass: "8,681 × 10^25 kg",
      distance: "2,87 bilhões km",
      orbitalPeriod: "84 anos terrestres",
      rotationPeriod: "17,2 horas (retrógrado)",
      temperature: "-195 °C (topo das nuvens)",
      moons: "27 (confirmadas)",
      fact: "Urano gira de lado em relação ao seu plano orbital, possivelmente devido a uma colisão massiva.",
      texture: "textures/uranus.jpg",
      infoImage: "img/uranus.jpg",
      baseColor: 0xa2d9ce,
      orbitColor: 0xadd8e6,
      size: 5,
      distanceFromSun: 230,
      orbitalSpeed: 0.00068,
      rotationSpeed: -0.013,
    },
    neptune: {
      name: "Netuno",
      diameter: "49.244 km",
      mass: "1,024 × 10^26 kg",
      distance: "4,50 bilhões km",
      orbitalPeriod: "164,8 anos terrestres",
      rotationPeriod: "16,1 horas",
      temperature: "-200 °C (topo das nuvens)",
      moons: "14 (confirmadas)",
      fact: "Netuno é o planeta mais distante do Sol (desde o rebaixamento de Plutão) e possui os ventos mais fortes do Sistema Solar.",
      texture: "textures/neptune.jpg",
      infoImage: "img/neptune.jpg",
      baseColor: 0x3a5fcd,
      orbitColor: 0x708090,
      size: 4.8,
      distanceFromSun: 280,
      orbitalSpeed: 0.00054,
      rotationSpeed: 0.014,
    },
  };

  // Fatores para controlar velocidade
  let orbitalSpeedFactor = 1.0;
  let rotationSpeedFactor = 1.0;
  const speedStep = 1.1; // incremento para ajustar velocidade
  const minSpeedFactor = 0.1;
  const maxSpeedFactor = 20.0;

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    camera.position.set(0, 80, 200);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Luz ambiente suave para iluminar a cena
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Luz pontual simulando o Sol (central)
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 0, 2);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Sol (mantém MeshBasicMaterial para brilhar como luz)
    const sunData = planetData.sun;
    const sunGeometry = new THREE.SphereGeometry(sunData.size, 64, 64);
    const sunTexture = sunData.texture
      ? new THREE.TextureLoader().load(sunData.texture)
      : null;
    if (sunTexture) sunTexture.encoding = THREE.sRGBEncoding;
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: sunData.texture ? 0xffffff : new THREE.Color(sunData.baseColor),
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.name = "sun";
    planets.sun = sunMesh;
    scene.add(sunMesh);

    Object.keys(planetData).forEach((key) => {
      if (key === "sun") return;
      const data = planetData[key];
      createCelestialBody(key, data, sunMesh);
      if (data.distanceFromSun) {
        createOrbitLine(
          data.distanceFromSun,
          data.orbitColor || 0x555555,
          sunMesh
        );
      }
    });

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 1500;
    controls.target.set(0, 0, 0);
    controls.update();

    createStarfield();

    window.addEventListener("resize", onWindowResize, false);
    canvas.addEventListener("click", onCanvasClick, false);
    closeInfoPanelButton.addEventListener("click", hideInfoPanel);

    planetSelectorMenu.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        const planetKey = button.getAttribute("data-planet");
        if (planets[planetKey]) {
          showInfoForPlanet(planetKey);
          focusOnPlanet(planets[planetKey]);
        }
      });
    });

    animate();
  }

  function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      transparent: true,
      opacity: 0.75,
    });
    const starVertices = [];
    for (let i = 0; i < 20000; i++) {
      const x = (Math.random() - 0.5) * 4000;
      const y = (Math.random() - 0.5) * 4000;
      const z = (Math.random() - 0.5) * 4000;
      if (Math.sqrt(x * x + y * y + z * z) > 300) {
        starVertices.push(x, y, z);
      }
    }
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  }

  function createOrbitLine(radius, color, parentObject) {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.5,
    });
    const line = new THREE.Line(geometry, material);
    parentObject.add(line);
  }

  function createCelestialBody(key, data, parentObject) {
    const textureLoader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(data.size, 64, 64);

    let material;

    if (data.isStar) {
      const tex = data.texture ? textureLoader.load(data.texture) : null;
      if (tex) tex.encoding = THREE.sRGBEncoding;
      material = new THREE.MeshBasicMaterial({
        map: tex,
        color: data.texture
          ? 0xffffff
          : new THREE.Color(data.baseColor || 0xffffff),
      });
    } else {
      const colorMap = data.texture ? textureLoader.load(data.texture) : null;
      if (colorMap) colorMap.encoding = THREE.sRGBEncoding;
      material = new THREE.MeshStandardMaterial({
        map: colorMap,
        roughness: 1,
        metalness: 0,
      });
    }

    const celestialMesh = new THREE.Mesh(geometry, material);
    celestialMesh.name = key;

    const pivot = new THREE.Object3D();
    parentObject.add(pivot);
    pivot.add(celestialMesh);

    if (data.distanceFromSun) {
      celestialMesh.position.x = data.distanceFromSun;
    } else if (data.distanceFromPlanet) {
      celestialMesh.position.x = data.distanceFromPlanet;
      if (data.orbitColor) {
        const planetMeshParentOfMoon = planets[key.split("_of_")[1]];
        if (planetMeshParentOfMoon) {
          createOrbitLine(
            data.distanceFromPlanet,
            data.orbitColor,
            planetMeshParentOfMoon
          );
        }
      }
    }

    planets[key] = celestialMesh;
    planetPivots[key] = pivot;

    if (data.rings) {
      const ringGeometry = new THREE.RingGeometry(
        data.rings.innerRadius,
        data.rings.outerRadius,
        64
      );
      const ringTexture = textureLoader.load(data.rings.texture, (texture) => {
        texture.encoding = THREE.sRGBEncoding;
      });
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        color: 0xffffff,
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      celestialMesh.add(ringMesh);
    }

    if (data.moonData && key === "earth") {
      createCelestialBody("moon_of_" + key, data.moonData, celestialMesh);
    }
  }

  function focusOnPlanet(planetMesh) {
    const targetPosition = new THREE.Vector3();
    planetMesh.getWorldPosition(targetPosition);
    const radius = planetMesh.geometry.parameters.radius || 1;
    const offsetDistance = radius * 4 + 10;

    if (typeof TWEEN !== "undefined") {
      new TWEEN.Tween(controls.target)
        .to(targetPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => controls.update())
        .start();
      const cameraOffset = new THREE.Vector3(
        0,
        offsetDistance * 0.4,
        offsetDistance
      );
      const currentCameraQuaternion = camera.quaternion.clone();
      const newCameraPosition = targetPosition
        .clone()
        .add(cameraOffset.applyQuaternion(currentCameraQuaternion));
      new TWEEN.Tween(camera.position)
        .to(newCameraPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    } else {
      controls.target.copy(targetPosition);
      camera.position.set(
        targetPosition.x + offsetDistance,
        targetPosition.y + offsetDistance,
        targetPosition.z + offsetDistance
      );
      controls.update();
    }

    currentFocus = planetMesh;
  }

  function returnCameraToSun() {
    const sun = planets["sun"];
    const sunPos = new THREE.Vector3();
    sun.getWorldPosition(sunPos);

    const offsetDistance = 200;
    const cameraOffset = new THREE.Vector3(
      0,
      offsetDistance * 0.4,
      offsetDistance
    );
    const currentCameraQuaternion = camera.quaternion.clone();
    const newCameraPosition = sunPos
      .clone()
      .add(cameraOffset.applyQuaternion(currentCameraQuaternion));

    if (typeof TWEEN !== "undefined") {
      new TWEEN.Tween(controls.target)
        .to(sunPos, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => controls.update())
        .start();
      new TWEEN.Tween(camera.position)
        .to(newCameraPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    } else {
      controls.target.copy(sunPos);
      camera.position.set(
        sunPos.x + offsetDistance,
        sunPos.y + offsetDistance,
        sunPos.z + offsetDistance
      );
      controls.update();
    }

    currentFocus = null;
  }

  function showInfoForPlanet(planetKey) {
    const data = planetData[planetKey];
    if (!data) return;

    planetNameEl.textContent = data.name;
    planetImageEl.src = data.infoImage || "";
    planetImageEl.alt = `Imagem de ${data.name}`;
    planetDiameterEl.textContent = data.diameter || "N/A";
    planetMassEl.textContent = data.mass || "N/A";
    planetDistanceEl.textContent = data.distance || "N/A";
    planetOrbitalPeriodEl.textContent = data.orbitalPeriod || "N/A";
    planetRotationPeriodEl.textContent = data.rotationPeriod || "N/A";
    planetTemperatureEl.textContent = data.temperature || "N/A";
    planetMoonsEl.textContent = data.moons || "N/A";
    planetFactEl.textContent = data.fact || "N/A";

    infoPanel.classList.remove("info-panel-hidden");
  }

  function hideInfoPanel() {
    infoPanel.classList.add("info-panel-hidden");
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onCanvasClick(event) {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(planets));
    if (intersects.length > 0) {
      const clickedPlanet = intersects[0].object;
      showInfoForPlanet(clickedPlanet.name);

      if (currentFocus === clickedPlanet) {
        returnCameraToSun();
      } else {
        focusOnPlanet(clickedPlanet);
      }
    }
  }

  function animate(time) {
    requestAnimationFrame(animate);

    const delta = time ? (time - (animate.lastTime || time)) / 1000 : 0;
    animate.lastTime = time;

    Object.keys(planetPivots).forEach((key) => {
      const pivot = planetPivots[key];
      const planetMesh = planets[key];
      const dataToUse = planetData[key] || {};

      // Rotação do planeta em torno do próprio eixo (rotacional)
      if (planetMesh && dataToUse.rotationSpeed) {
        planetMesh.rotation.y +=
          dataToUse.rotationSpeed * rotationSpeedFactor * delta * 30;
      }

      // Translação orbital do planeta em torno do Sol
      if (pivot && dataToUse.orbitalSpeed) {
        pivot.rotation.y +=
          dataToUse.orbitalSpeed * orbitalSpeedFactor * delta * 7;
      }
    });

    controls.update();
    if (typeof TWEEN !== "undefined") TWEEN.update();

    renderer.render(scene, camera);
  }

  // Controle de velocidade via teclado
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "+": // Aumentar velocidade orbital
        orbitalSpeedFactor = Math.min(
          orbitalSpeedFactor + speedStep,
          maxSpeedFactor
        );
        console.log(
          `Velocidade orbital aumentada: ${orbitalSpeedFactor.toFixed(2)}`
        );
        break;
      case "-": // Diminuir velocidade orbital
        orbitalSpeedFactor = Math.max(
          orbitalSpeedFactor - speedStep,
          minSpeedFactor
        );
        console.log(
          `Velocidade orbital diminuída: ${orbitalSpeedFactor.toFixed(2)}`
        );
        break;
      case "]": // Aumentar velocidade rotacional
        rotationSpeedFactor = Math.min(
          rotationSpeedFactor + speedStep,
          maxSpeedFactor
        );
        console.log(
          `Velocidade rotacional aumentada: ${rotationSpeedFactor.toFixed(2)}`
        );
        break;
      case "[": // Diminuir velocidade rotacional
        rotationSpeedFactor = Math.max(
          rotationSpeedFactor - speedStep,
          minSpeedFactor
        );
        console.log(
          `Velocidade rotacional diminuída: ${rotationSpeedFactor.toFixed(2)}`
        );
        break;
    }
  });

  init();
});
