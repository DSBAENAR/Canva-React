package com.websocket.core.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

    /**
     * The `configureMessageBroker` function enables a simple broker for the "/topic" destination and
     * sets the application destination prefixes to "/app".
     * 
     * @param registry The `registry` parameter in the `configureMessageBroker` method is an instance
     * of the `MessageBrokerRegistry` class. It is used to configure the message broker for handling
     * messages in a Spring WebSocket application.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry){
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    /**
     * The `registerStompEndpoints` function configures a STOMP endpoint for WebSocket communication
     * with allowed origin patterns and SockJS support.
     * 
     * @param registry The `registry` parameter in the `registerStompEndpoints` method is an instance
     * of `StompEndpointRegistry`. It is used to register STOMP endpoints for WebSocket communication
     * in a Spring application.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/canvaWs")
        .setAllowedOriginPatterns("*")
        .withSockJS();
    }

}
