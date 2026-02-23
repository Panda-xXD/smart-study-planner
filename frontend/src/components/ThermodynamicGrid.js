import React, { useRef, useEffect } from "react";

function ThermodynamicGrid({ resolution = 25, coolingFactor = 0.98 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let grid;
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;

    const mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      cols = Math.ceil(width / resolution);
      rows = Math.ceil(height / resolution);

      grid = new Float32Array(cols * rows).fill(0);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const update = () => {
      // Clear background manually
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);


      if (mouse.active) {
        const col = Math.floor(mouse.x / resolution);
        const row = Math.floor(mouse.y / resolution);

        const radius = 2;
        for (let i = -radius; i <= radius; i++) {
          for (let j = -radius; j <= radius; j++) {
            const c = col + i;
            const r = row + j;
            if (c >= 0 && c < cols && r >= 0 && r < rows) {
              const idx = c + r * cols;
              const d = Math.sqrt(i * i + j * j);
              if (d <= radius) {
                grid[idx] = Math.min(1, grid[idx] + 0.3 * (1 - d / radius));
              }
            }
          }
        }
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = c + r * cols;
          const temp = grid[idx];
          grid[idx] *= coolingFactor;

          if (temp > 0.05) {
            const x = c * resolution;
            const y = r * resolution;

            ctx.fillStyle = `rgba(79,140,255,${temp})`;
            ctx.fillRect(x, y, resolution - 2, resolution - 2);
          }
        }
      }

      requestAnimationFrame(update);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    resize();
    update();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [resolution, coolingFactor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        mixBlendMode: "screen"
      }}
    />
  );
}

export default ThermodynamicGrid;
