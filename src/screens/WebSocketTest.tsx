import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

const WebSocketTest: React.FC = () => {
  useEffect(() => {
    console.log('starting server')
    const ws = new WebSocket('ws://192.168.1.36:8080'); 
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      // Handle received message here
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up WebSocket connection on unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <View>
      <Text>WebSocket Test</Text>
    </View>
  );
};

export default WebSocketTest;
