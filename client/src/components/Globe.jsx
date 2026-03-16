import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function Globe() {
  const canvasRef = useRef();

  useEffect(() => {
    let phi = 0;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.3,
      dark: 1, 
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.2], 
      markerColor: [0.3, 0.8, 1], 
      glowColor: [0.1, 0.1, 0.2],
      markers: [
        { location: [12.9716, 77.5946], size: 0.05 }, // Bengaluru coordinates!
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003; 
      }
    });

    return () => globe.destroy();
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-200 pointer-events-none z-10">
      <canvas
        ref={canvasRef}
        style={{ width: 800, height: 800, maxWidth: "100%", aspectRatio: 1 }}
      />
    </div>
  );
}