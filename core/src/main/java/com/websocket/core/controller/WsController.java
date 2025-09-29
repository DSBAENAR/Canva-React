package com.websocket.core.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.websocket.core.model.DrawEvent;

@Controller
public class WsController {


   /**
    * The handleDraw function in Java handles drawing events and sends them to a specific topic for
    * broadcasting.
    * 
    * @param event The `event` parameter in the `handleDraw` method represents a DrawEvent object,
    * which is likely a class that contains information about a drawing event, such as the coordinates
    * of the drawing, the color used, or any other relevant data related to the drawing action. The
    * method receives this DrawEvent
    * @return The `handleDraw` method is returning the `DrawEvent` object that it receives as a
    * parameter.
    */
    @MessageMapping("/draw")
    @SendTo("/topic/board")
    public DrawEvent handleDraw(DrawEvent event) {
        return event;
    }

}
