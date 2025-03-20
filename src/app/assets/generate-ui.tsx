"use client";

import { useEffect, useRef } from "react";

// UI Element definitions
const uiElements = [
  {
    name: "button_spin",
    width: 200,
    height: 80,
    color: "#d1433e",
    text: "SPIN",
    fontSize: 32,
    radius: 40,
  },
  {
    name: "button_spin_disabled",
    width: 200,
    height: 80,
    color: "#888888",
    text: "SPIN",
    fontSize: 32,
    radius: 40,
  },
  {
    name: "button_stop",
    width: 200,
    height: 80,
    color: "#d1433e",
    text: "STOP",
    fontSize: 32,
    radius: 40,
  },
  {
    name: "button_buyin",
    width: 200,
    height: 60,
    color: "#617091",
    text: "BUY FEATURE",
    fontSize: 24,
    radius: 30,
  },
  {
    name: "button_bet_up",
    width: 60,
    height: 60,
    color: "#695962",
    text: "+",
    fontSize: 32,
    radius: 30,
  },
  {
    name: "button_bet_down",
    width: 60,
    height: 60,
    color: "#695962",
    text: "-",
    fontSize: 32,
    radius: 30,
  },
  {
    name: "panel",
    width: 400,
    height: 100,
    color: "#0d070f",
    text: "",
    fontSize: 0,
    radius: 10,
  },
  {
    name: "win_frame",
    width: 500,
    height: 200,
    color: "#f5d19b",
    text: "BIG WIN!",
    fontSize: 48,
    radius: 20,
  },
  {
    name: "frame",
    width: 960,
    height: 600,
    color: "rgba(13, 7, 15, 0.7)",
    text: "",
    fontSize: 0,
    radius: 15,
  },
];

export default function GenerateUI() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create canvas for each UI element
    uiElements.forEach((element) => {
      const canvas = document.createElement("canvas");
      canvas.width = element.width;
      canvas.height = element.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Draw rounded rect
      const radius = element.radius;
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
      ctx.fillStyle = element.color;
      ctx.fill();

      // Add text
      if (element.text) {
        ctx.font = `bold ${element.fontSize}px Arial`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(element.text, canvas.width / 2, canvas.height / 2);
      }

      // Add to container
      const div = document.createElement("div");
      div.style.margin = "10px";

      const label = document.createElement("p");
      label.textContent = element.name;
      div.appendChild(label);

      const download = document.createElement("a");
      download.href = canvas.toDataURL("image/png");
      download.download = `${element.name}.png`;
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
      <h1 className="text-2xl font-bold mb-4">UI Generator</h1>
      <p className="mb-4">
        Click the download links below to save each UI element. Place them in
        the public/assets/ui directory.
      </p>
      <div
        ref={containerRef}
        className="flex flex-wrap justify-center gap-4"
      ></div>
    </div>
  );
}
