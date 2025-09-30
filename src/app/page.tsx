"use client";
import { useState } from "react";
import Canvas from "./components/Canvas";

export default function Home() {
  
  return (
    <main>
      <h1>Shared Canva</h1>
      <div className="container">
        <h2>Canvas to Draw</h2>
        <p>Draw with your mouse and share in real-time</p>
        <Canvas />
      </div>
    </main>
  );
}