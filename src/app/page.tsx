"use client";
import { useState } from "react";
import Canvas from "./components/Canvas";

export default function Home() {
  const [count, setCount] = useState(0);
  
  return (
    <main>
      <h1>🎨 Mi Aplicación de Dibujo</h1>
      
      {/* Sección del contador */}
      <div className="container">
        <h2>Contador de Clicks</h2>
        <p>Has hecho click <span className="counter">{count}</span> veces</p>
        <button onClick={() => setCount(count + 1)}>
          👆 Hacer Click
        </button>
        <button onClick={() => setCount(0)}>
          🔄 Resetear
        </button>
      </div>

      {/* Sección del canvas */}
      <div className="container">
        <h2>Pizarra para Dibujar</h2>
        <p>Dibuja con el mouse y comparte en tiempo real</p>
        <Canvas />
      </div>
    </main>
  );
}