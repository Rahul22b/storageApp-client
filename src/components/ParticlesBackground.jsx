import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      options={{
        fullScreen: false, // VERY IMPORTANT
        fpsLimit: 60,
        particles: {
          number: {
            value: 40,
            density: { enable: true, area: 800 },
          },
          color: { value: "#ffffff" },
          opacity: { value: 0.15 },
          size: { value: { min: 1, max: 2 } },
          move: {
            enable: true,
            speed: 0.3,
            outModes: "out",
          },
          links: {
            enable: true,
            distance: 120,
            opacity: 0.1,
            color: "#ffffff",
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
          },
          modes: {
            repulse: { distance: 80 },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0, // behind content
      }}
    />
  );
}
