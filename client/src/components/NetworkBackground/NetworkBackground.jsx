import React, { useEffect, useRef } from "react";
import { getTheme } from "../../utils/theme";

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize node structure
    const nodeCount = 50;
    const nodes = [];
    const connectionDist = 200;

    const createNode = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      baseVx: (Math.random() - 0.5) * 0.4,
      baseVy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 4 + 7.5,
    });

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(createNode());
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleGlobalClick = () => {
      // Apply a sudden physical impulse velocity on click (random movement splash)
      nodes.forEach((node) => {
        node.vx = (Math.random() - 0.5) * 3;
        node.vy = (Math.random() - 0.5) * 3;
      });
    };
    window.addEventListener("click", handleGlobalClick);

    // Animation Loop
    const draw = () => {
      // Fetch active theme colors dynamically
      const theme = document.documentElement.getAttribute("data-theme") || getTheme();
      const isDark = theme === "dark";

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Render the background color directly inside the canvas to guarantee layering visibility
      ctx.fillStyle = isDark ? "#0c0c0f" : "#e5e3e0";
      ctx.fillRect(0, 0, width, height);

      // Highly visible node and line colors
      const nodeColor = isDark ? "rgba(208, 134, 92, 0.65)" : "rgba(164, 130, 104, 0.75)";
      const lineColor = isDark ? "rgba(208, 134, 92, 0.3)" : "rgba(164, 130, 104, 0.35)";

      // Draw lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 2.4;
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Update coordinates
        node.x += node.vx;
        node.y += node.vy;

        // Apply friction/damping back to the default slow base drift speeds
        node.vx = node.vx * 0.96 + node.baseVx * 0.04;
        node.vy = node.vy * 0.96 + node.baseVy * 0.04;

        // Wall boundary bounce
        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
          node.baseVx *= -1;
        }
        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
          node.baseVy *= -1;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleGlobalClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
};

export default NetworkBackground;
