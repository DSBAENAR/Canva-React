"use client";

import { useRef, useEffect, useState } from "react";

export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement|null>(null)
    const [isDrawing,setIsDrawing] = useState(false)

    useEffect(()=>{
        const canvas = canvasRef.current
        if(!canvas) return

        const context = canvas.getContext("2d")

        if(!context) return

        context.lineWidth = 2

        context.strokeStyle = "black"

        const startDrawing = (e:MouseEvent) => {
            setIsDrawing(true)
        }

    },[]);

    return(
        <canvas ref={canvasRef} width={400} height={400} style={{ border: "1px solid black" }}/>
    )
}