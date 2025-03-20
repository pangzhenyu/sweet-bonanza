"use client";

import { useEffect, useRef } from "react";
import { SymbolType } from "@/lib/game/types";

export default function GenerateSymbols() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Symbol types and their colors
  const symbolColors: Record<string, string> = {
    RED_HEART: "#ff0000",
    BLUE_CANDY: "#0000ff",
    GREEN_CANDY: "#00ff00",
    PURPLE_CANDY: "#ff00ff",
    PLUM: "#8800ff",
    WATERMELON: "#00ff88",
    APPLE: "#ff4400",
    GRAPE: "#8800ff",
    BANANA: "#ffff00",
    LOLLIPOP: "#ff88ff",
    BOMB: "#222222",
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Create canvas for each symbol
    Object.entries(symbolColors).forEach(([symbolName, color]) => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Draw rounded rect
      const radius = 20;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();

      // Fill with color
      ctx.fillStyle = color;
      ctx.fill();

      // Add text
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(symbolName.substring(0, 1), canvas.width / 2, canvas.height / 2);

      // Add to container
      const div = document.createElement("div");
      div.style.margin = "10px";

      const label = document.createElement("p");
      label.textContent = symbolName;
      div.appendChild(label);

      const download = document.createElement("a");
      download.href = canvas.toDataURL("image/png");
      download.download = `${symbolName.toLowerCase()}.png`;
      download.textContent = "Download";
      download.style.display = "block";
      download.style.marginTop = "5px";

      div.appendChild(canvas);
      div.appendChild(download);

      containerRef.current?.appendChild(div);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Symbol Generator</h1>
      <p className="mb-4">
        Click the download links below to save each symbol image. Place them in
        the public/assets/symbols directory.
      </p>
      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-4"
      ></div>
    </div>
  );
}
