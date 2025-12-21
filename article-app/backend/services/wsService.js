import { WebSocketServer } from "ws";

const WSPORT = 4001;

const wss = new WebSocketServer({ port: WSPORT });

export function broadcast(data) {
  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

console.log(`WebSocket server running on ws://localhost:${WSPORT}`);
