/**
 * The Canvas component in TypeScript React sets up a drawing canvas with click and mousemove event
 * listeners to enable drawing functionality.
 */
"use client";

import { useRef, useEffect, useState } from "react";

export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement|null>(null)
    const [isDrawing,setIsDrawing] = useState(false)

    /* The `useEffect(() => { ... }, [isDrawing]);` hook in the Canvas component is used in TypeScript
    React to perform side effects in function components. In this case, the `useEffect` hook is
    setting up event listeners for click and mousemove events on the canvas element. */
    useEffect(()=>{
        const canvas = canvasRef.current
        if(!canvas) return

        const context = canvas.getContext("2d")

        if(!context) return

        context.lineWidth = 2

        context.strokeStyle = "black"

        

       /**
        * The function `clickDrawing` alternates the drawing state and starts a new path if not already
        * drawing.
        * @param {MouseEvent} e - The parameter `e` in the `clickDrawing` function is of type
        * `MouseEvent`, which represents an event that occurs due to the user interacting with a mouse.
        * It contains information about the event such as the position of the mouse cursor (`offsetX`
        * and `offsetY`), target element,
        */
        const clickDrawing = (e: MouseEvent) => {
            if (!isDrawing) {
                context.beginPath()
                context.moveTo(e.offsetX, e.offsetY)
            }
            setIsDrawing((prev) => !prev)
            }

        /**
         * The function `draw` is used in TypeScript React to draw a line on a canvas based on mouse
         * movement.
         * @param {MouseEvent} e - The parameter `e` in the `draw` function is of type `MouseEvent`,
         * which represents an event that occurs due to the user's interaction with the mouse. It
         * contains information about the event, such as the position of the mouse cursor (`offsetX`
         * and `offsetY` properties) when
         * @returns If the `isDrawing` variable is false, the `draw` function will return early and not
         * execute the rest of the code inside the function.
         */
        const draw = (e:MouseEvent) => {
            if(!isDrawing) return

            context.lineTo(e.offsetX,e.offsetY)
            context.stroke()
        }


        canvas.addEventListener("click",clickDrawing)
        canvas.addEventListener("mousemove",draw)

        return () => {
           canvas.removeEventListener("click", clickDrawing);
            canvas.removeEventListener("mousemove", draw);
        }

    },[isDrawing]);

    const clear = () => {
        const canva = canvasRef.current

        if (!canva) return

        const context = canva.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canva.width, canva.height);
    }

    

    return(
        <div>
      <button
        onClick={clear}
        style={{
          marginBottom: "10px",
          padding: "5px 10px",
          border: "1px solid gray",
          cursor: "pointer",
        }}
      >
        Clear
      </button>
      <br />
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid black", background: "white" }}
      />
    </div>
        
    )
}