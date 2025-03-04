import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import "./SolarSystem.css"; // Import external CSS for styling

const SolarSystem = ({ planets }) => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    mount.appendChild(renderer.domElement);

    // Create stars for background
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(15, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      emissive: 0xffaa00,
      emissiveIntensity: 1.2,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 5, 500);
    light.position.set(0, 0, 0);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);

    // Default planet colors
    const defaultColors = [
      0xff5733, 0x33ff57, 0x3357ff, 0xff33a8, 0xffff33,
      0xa833ff, 0x33fff5, 0xff9633, 0xaaaaff,
    ];

    // Planets
    const planetMeshes = planets.map((planet, index) => {
      const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color || defaultColors[index % defaultColors.length]),
        emissive: new THREE.Color(planet.color || defaultColors[index % defaultColors.length]),
        emissiveIntensity: 0.3,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      return {
        mesh,
        speed: planet.speed,
        orbitRadius: planet.distance,
      };
    });

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.0001;

      planetMeshes.forEach(({ mesh, speed, orbitRadius }) => {
        const angle = time * speed;
        mesh.position.x = Math.cos(angle) * orbitRadius;
        mesh.position.z = Math.sin(angle) * orbitRadius;
        mesh.rotation.y += 0.02;
      });

      stars.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [planets]);

  return (
    <div className="solar-system-container">
      <div ref={mountRef} className="solar-canvas" />
      <div className="planet-controls">
        {planets.map((planet, index) => (
          <div key={index} className="planet-control">
            <h3>{planet.name}</h3>
            <label>
              Size: <input type="number" defaultValue={planet.size} />
            </label>
            <label>
              Color: <input type="color" defaultValue={planet.color} />
            </label>
            <label>
              Speed: <input type="number" step="0.1" defaultValue={planet.speed} />
            </label>
            <label>
              Distance: <input type="number" defaultValue={planet.distance} />
            </label>
          </div>
        ))}
      </div>
      
    </div>
  );
};

SolarSystem.propTypes = {
  planets: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number.isRequired,
      color: PropTypes.string,
      speed: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
    })
  ).isRequired,
};

SolarSystem.defaultProps = {
  planets: [
    { name: "Mercury", size: 2, color: "#ff5733", speed: 1, distance: 21 },
    { name: "Venus", size: 3, color: "#33ff57", speed: 0.8, distance: 24 },
    { name: "Earth", size: 4, color: "#3357ff", speed: 0.6, distance: 22 },
    { name: "Mars", size: 3.5, color: "#ff33a8", speed: 0.5, distance: 24 },
    { name: "Jupiter", size: 1, color: "#ffff33", speed: 0.3, distance: 25 },
    { name: "Saturn", size: 2, color: "#a833ff", speed: 0.2, distance: 45 },
    { name: "Uranus", size: 2, color: "#33fff5", speed: 0.15, distance: 55 },
    { name: "Neptune", size: 4.5, color: "#ff9633", speed: 0.1, distance: 65 },
    
  ],
};

export default SolarSystem;
