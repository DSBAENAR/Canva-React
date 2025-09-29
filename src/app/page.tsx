"use client";
import { useState } from "react";
import Canvas from "./components/Canvas";
export default function Home(){
  const[count,setCount] = useState(0)
  
  return (
    <main>
      <h1>Hola mundo en React</h1>
        <p> Has hecho click {count} veces</p>
        <button onClick={() => setCount(count +1)}>Click me</button>
    </main>
  );
}