import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback, useEffect, useRef } from "react";

export default function ParticlesBackground({ enabled = true }) {
  const particlesRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback((container) => {
    particlesRef.current = container;
  }, []);

  // Pause / Resume particles
  useEffect(() => {
    if (!particlesRef.current) return;

    if (!enabled) {
      particlesRef.current.pause();
    } else {
      particlesRef.current.play();
    }
  }, [enabled]);

  return (
    <Particles
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: false,
        fpsLimit: 60,

        particles: {
          number: {
            value: 25,
            density: { enable: true, area: 1000 },
          },
          color: {
            value: ["#60a5fa", "#a5b4fc", "#38bdf8"],
          },
          opacity: {
            value: { min: 0.05, max: 0.15 },
          },
          size: {
            value: { min: 6, max: 14 },
          },
          move: {
            enable: true,
            direction: "top",
            speed: 0.4,
            outModes: { default: "out" },
          },
          stroke: {
            width: 1,
            color: "rgba(255,255,255,0.1)",
          },
        },

        detectRetina: true,
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}
