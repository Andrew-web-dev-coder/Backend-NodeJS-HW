import { toast } from "./toastClient";

export const ws = new WebSocket("ws://localhost:4001");

ws.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);

    if (msg.message) {
      toast(msg.message);
    }
  } catch (e) {
    console.error("WS parse error:", e);
  }
};
