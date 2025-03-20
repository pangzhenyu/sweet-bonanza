"use client";

import { useEffect, useRef } from "react";

// Background definitions
const backgrounds = [
  {
    name: "bg_main",
    width: 1280,
    height: 720,
    colors: ["#3b2b38", "#0d070f"], // Top to bottom gradient
    candyColors: ["#f5d19b", "#ff88ff", "#ffff00", "#ff0000", "#00ff00", "#0000ff"], // Candy colors
  },
  {
    name: "bg_freespin",
    width: 1280,
    height: 720,
    colors: ["#0d070f", "#3b2b38"], // Top to bottom gradient (reversed)
    candyColors: ["#f5d19b", "#ff88ff", "#ffff00", "#ff0000", "#00ff00", "#0000ff"], // Candy colors
  },
];

export default function GenerateBackgrounds() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create canvas for each background
    backgrounds.forEach((bg) => {
      const canvas = document.createElement("canvas");
      canvas.width = bg.width;
      canvas.height = bg.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, bg.height);
      gradient.addColorStop(0, bg.colors[0]);
      gradient.addColorStop(1, bg.colors[1]);

      // Fill background with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, bg.width, bg.height);

      // Draw candy-like elements in background
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * bg.width;
        const y = Math.random() * bg.height;
        const size = 5 + Math.random() * 20;
        const color = bg.candyColors[Math.floor(Math.random() * bg.candyColors.length)];

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.1 + Math.random() * 0.2; // Semi-transparent

        // Randomly draw circles or rounded rects
        if (Math.random() > 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.roundRect(x - size / 2, y - size / 2, size, size, size / 4);
          ctx.fill();
        }
      }

      // Reset alpha
      ctx.globalAlpha = 1;

      // Add a frame for the reels
      const frameX = bg.width / 2 - 480;
      const frameY = bg.height / 2 - 300;
      const frameWidth = 960;
      const frameHeight = 600;

      ctx.strokeStyle = "rgba(245, 209, 155, 0.3)"; // Light gold with transparency
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 20);
      ctx.stroke();

      // Add to container
      const div = document.createElement("div");
      div.style.margin = "10px";

      const label = document.createElement("p");
      label.textContent = bg.name;
      div.appendChild(label);

      // Wrap canvas in smaller container
      const canvasContainer = document.createElement("div");
      canvasContainer.style.width = "640px"; // Half size
      canvasContainer.style.height = "360px"; // Half size
      canvasContainer.style.overflow = "hidden";

      // Style canvas
      canvas.style.width = "100%";
      canvas.style.height = "auto";

      canvasContainer.appendChild(canvas);
      div.appendChild(canvasContainer);

      const download = document.createElement("a");
      download.href = canvas.toDataURL("image/png");
      download.download = `${bg.name}.png`;
      download.textContent = "Download";
      download.style.display = "block";
      download.style.marginTop = "5px";
      div.appendChild(download);

      containerRef.current?.appendChild(div);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Background Generator</h1>
      <p className="mb-4">
        Click the download links below to save each background. Place them in
        the public/assets/backgrounds directory.
      </p>
      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-8"
      ></div>
    </div>
  );
}
