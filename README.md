# Exercise

Try to develop an interactive board that allows multiple users to draw on a shared canvas.

The board should enable multiple users to draw online and provide an erase button. Whatever each person draws should appear on the boards of all other users. Each person should start with a different color. When someone presses the erase button, the board should be cleared for everyone.

For this, I understood how React works with NextJS (because they had their own guide to understand React from scratch), so first I decided to implement a basic front at the moment to create a canva. I created as component, see `Canvas.tsx`
Here is a step-by-step explanation of how the `Canvas.tsx` component was created:

## Frontend

1. **Component Setup**: Started by creating a new React functional component called `Canvas.tsx`. This file is placed in `/components`.

2. **Canvas Element**: Added an HTML `<canvas>` element to the component's JSX. Set its width and height using props or default values.

3. **Refs and State**: Used the `useRef` hook to get a reference to the canvas DOM element. Managed drawing state (such as whether the mouse is pressed) using the `useState` hook.

```tsx
const canvasRef = useRef<HTMLCanvasElement|null>(null)
const [isDrawing,setIsDrawing] = useState(false)

    useEffect(()=>{
        const canvas = canvasRef.current
        if(!canvas) return

        const context = canvas.getContext("2d")

        if(!context) return

        context.lineWidth = 2

        context.strokeStyle = "black"

        const clickDrawing = (e: MouseEvent) => {
            if (!isDrawing) {
                context.beginPath()
                context.moveTo(e.offsetX, e.offsetY)
            }
            setIsDrawing((prev) => !prev)
            }

        const draw = (e:MouseEvent) => {
            if(!isDrawing) return

            context.lineTo(e.offsetX,e.offsetY)
            context.stroke()
        }

```

4. **Drawing Logic**: Implemented mouse event handlers (`onMouseDown`, `onMouseMove`, `onMouseUp`) to allow users to draw on the canvas. Used the canvas context (`getContext('2d')`) to draw lines as the mouse moves.

```tsx
 canvas.addEventListener("click",clickDrawing)
        canvas.addEventListener("mousemove",draw)

        return () => {
           canvas.removeEventListener("click", clickDrawing);
            canvas.removeEventListener("mousemove", draw);
        }
    }, [isDrawing]);
```

5. **Color Assignment**: Assigned a unique color to each user, either randomly or based on user information, and used this color for drawing.

```tsx
const [color] = useState(
    "#" + Math.floor(Math.random() * 16777215).toString(16) // color aleatorio
  );
```

6. **Erase Button**: Added a button that, when clicked, clears the canvas using the context's `clearRect` method.

7. **Real-Time Sync**: Integrated a real-time communication solution (such as WebSockets) to broadcast drawing actions and erase events to all connected users, ensuring the canvas stays synchronized.

```tsx
useEffect(() => {
    const socket = new SockJS("http://localhost:8080/canvaWs");
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
    });

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
```

## Backend (Java with Spring Boot)

1. **WebSocket Configuration**: Set up a WebSocket configuration class to enable STOMP messaging.

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/canvaWs").withSockJS();
    }
}
```

2. **Message Handling**: Created a controller to handle incoming drawing messages and broadcast them to all connected clients.

```java
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class CanvaController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/draw")
    @SendTo("/topic/board")
    public DrawEvent handleDrawEvent(DrawEvent event) {
        return event; 
    }
}
```

8. **DrawEvent Class**: Created a `DrawEvent` class to represent the drawing actions, including properties for the type of action (start, draw, clear), coordinates, and color.

```java
public class DrawEvent {
    private String type; 
    private Integer x;
    private Integer y;
    private String color;
    // Getters and Setters
}
```