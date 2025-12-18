import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";
import { useEffect,useState } from "react";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);


  const option=[
    {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: { value: 50 },
    color: { value: ["#3b82f6", "#8b5cf6"] },
    opacity: { value: 0.3 },
    size: { value: 2 },
    move: { enable: true, speed: 0.6 },
    links: {
      enable: true,
      distance: 140,
      opacity: 0.2,
      color: "random",
    },
  },
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" } },
    modes: { grab: { distance: 150 } },
  },
},

 {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: { value: 50 },
    color: { value: ["#3b82f6", "#8b5cf6"] },
    opacity: { value: 0.3 },
    size: { value: 2 },
    move: { enable: true, speed: 0.6 },
    links: {
      enable: true,
      distance: 140,
      opacity: 0.2,
      color: "random",
    },
  },
  interactivity: {
    events: { onHover: { enable: true, mode: "grab" } },
    modes: { grab: { distance: 150 } },
  },
},


  ]

  const [animationType,setAnimationType]=useState(0);

  useEffect(()=>{
    const types=[0,1];
    let index=0;
    const interval=setInterval(()=>{
      setAnimationType(types[index]);
      index=(index+1)%types.length;
    },20000);
    return ()=>clearInterval(interval);
  },[]);

  return (
    <Particles
      init={particlesInit}
      options={option[animationType]}
      // options={option[0]}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0, // behind content
      }}
    />
  );
}
