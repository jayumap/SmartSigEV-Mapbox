const WebSocket = require('ws');

console.log('Starting WebSocket server...');
const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server started.');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // Broadcast received message to all clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
