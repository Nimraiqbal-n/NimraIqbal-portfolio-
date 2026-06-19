/*===========================================
  HERO 3D SCENE — wireframe network sphere
  Built with Three.js. Renders a glowing geometric
  node-and-edge structure that drifts and tilts
  toward the cursor, echoing the site's blueprint /
  systems theme.
===========================================*/
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const heroSection = document.getElementById('home');

    let width = heroSection.clientWidth;
    let height = heroSection.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    /* ---- group holding all 3D objects ---- */
    const group = new THREE.Group();
    scene.add(group);

    /* ---- core wireframe icosahedron (the "node graph") ---- */
    const coreGeo = new THREE.IcosahedronGeometry(2.3, 1);
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.55 });
    const coreLines = new THREE.LineSegments(coreEdges, coreMat);
    group.add(coreLines);

    /* ---- glowing nodes at each vertex ---- */
    const nodePositions = coreGeo.attributes.position;
    const nodeGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x5eead4 });
    const seen = new Set();
    for (let i = 0; i < nodePositions.count; i++) {
        const x = nodePositions.getX(i).toFixed(3);
        const y = nodePositions.getY(i).toFixed(3);
        const z = nodePositions.getZ(i).toFixed(3);
        const key = x + '_' + y + '_' + z;
        if (seen.has(key)) continue;
        seen.add(key);
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(parseFloat(x), parseFloat(y), parseFloat(z));
        nodeGroup.add(node);
    }
    group.add(nodeGroup);

    /* ---- outer faint shell for depth ---- */
    const shellGeo = new THREE.IcosahedronGeometry(3.1, 1);
    const shellEdges = new THREE.EdgesGeometry(shellGeo);
    const shellMat = new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.12 });
    const shellLines = new THREE.LineSegments(shellEdges, shellMat);
    group.add(shellLines);

    /* ---- ambient point starfield ---- */
    const starCount = 140;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 16;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x9aa6c4, size: 0.025, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* position the whole rig to the right side on desktop */
    function positionGroup() {
        const isDesktop = window.innerWidth >= 880;
        group.position.set(isDesktop ? 2.6 : 0, isDesktop ? 0.2 : -1.2, 0);
    }
    positionGroup();

    /* ---- mouse parallax ---- */
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    /* ---- resize handling ---- */
    function handleResize() {
        width = heroSection.clientWidth;
        height = heroSection.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        positionGroup();
    }
    window.addEventListener('resize', handleResize);

    /* ---- reduced motion respect ---- */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- animation loop ---- */
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        if (!prefersReducedMotion) {
            targetRotY += (mouseX * 0.6 - targetRotY) * 0.04;
            targetRotX += (mouseY * 0.4 - targetRotX) * 0.04;

            group.rotation.y = t * 0.12 + targetRotY;
            group.rotation.x = t * 0.05 + targetRotX;
            shellLines.rotation.y = -t * 0.06;
            stars.rotation.y = t * 0.01;

            nodeGroup.children.forEach((n, i) => {
                n.material.color.offsetHSL(0, 0, Math.sin(t * 2 + i) * 0.0008);
            });
        }

        renderer.render(scene, camera);
    }
    animate();
})();
