"use client";

import { useRef, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface DrawEvent {
  type: "start" | "draw" | "clear";
  x?: number;
  y?: number;
  color?: string;
}

/* This code snippet is defining a React functional component named `Canvas`. Inside this component, it
is using React hooks to manage state and references. */
export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [color] = useState(
    "#" + Math.floor(Math.random() * 16777215).toString(16) // color aleatorio
  );

  
  /* This `useEffect` hook is responsible for establishing a WebSocket connection to a server using
  SockJS and STOMP protocol. Here's a breakdown of what it does: */
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/canvaWs");
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
    });

    /* The `client.onConnect` function is a callback that gets executed when the WebSocket client
    successfully connects to the server. Inside this function, it subscribes to a specific topic
    ("/topic/board") to receive messages related to drawing events. When a message is received, it
    parses the message body into a `DrawEvent` object and then performs different actions based on
    the type of event. */
    client.onConnect = () => {
      console.log("Conectado a WebSocket");

      client.subscribe("/topic/board", (message) => {
        const event: DrawEvent = JSON.parse(message.body);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (event.type === "start" && event.x !== undefined && event.y !== undefined) {
          ctx.beginPath();
          ctx.moveTo(event.x, event.y);
        } else if (event.type === "draw" && event.x !== undefined && event.y !== undefined) {
          ctx.strokeStyle = event.color || "black";
          ctx.lineTo(event.x, event.y);
          ctx.stroke();
        } else if (event.type === "clear") {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;

    /**
     * The handleMouseDown function sets a drawing state to true, begins a new path in a canvas
     * context, and publishes a message with drawing information.
     * @param {MouseEvent} e - The parameter `e` in the `handleMouseDown` function is of type
     * `MouseEvent`, which represents the event object generated when a mouse button is pressed on an
     * element. It contains information such as the coordinates of the mouse pointer relative to the
     * target element (offsetX and offsetY).
     */
    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);

      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({ type: "start", x: e.offsetX, y: e.offsetY, color }),
      });
    };

    /**
     * The handleMouseMove function updates the drawing canvas and sends drawing data to a WebSocket
     * server.
     * @param {MouseEvent} e - The parameter `e` in the `handleMouseMove` function is of type
     * `MouseEvent`, which represents the event object generated when a mouse move event occurs. It
     * contains information about the event such as the coordinates of the mouse pointer (offsetX and
     * offsetY) relative to the target element.
     * @returns If the `isDrawing` condition is met, the function will return `undefined`. Otherwise,
     * it will continue executing the code to draw a line on the canvas and publish a message using
     * `stompClient`.
     */
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({ type: "draw", x: e.offsetX, y: e.offsetY, color }),
      });
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDrawing, stompClient, color]);

  const clear = () => {
    const canva = canvasRef.current;
    if (!canva) return;
    const ctx = canva.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canva.width, canva.height);

    stompClient?.publish({
      destination: "/app/draw",
      body: JSON.stringify({ type: "clear" }),
    });
  };

  return (
    <div>
      {/* Información del color del usuario */}
      <div className="color-info">
        🎨 Tu color de dibujo: 
        <span 
          style={{ 
            backgroundColor: color, 
            padding: '2px 8px', 
            borderRadius: '3px',
            color: 'white',
            marginLeft: '5px'
          }}
        >
          {color}
        </span>
      </div>

      {/* Botón para limpiar el canvas */}
      <button onClick={clear} className="btn-clear">
        🗑️ Limpiar Pizarra
      </button>

      {/* Canvas donde se dibuja */}
      <canvas
        ref={canvasRef}
        width={500}
        height={350}
      />

      {/* Instrucciones simples */}
      <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
        💡 Arrastra el mouse sobre la pizarra para dibujar
      </p>
    </div>
  );
}