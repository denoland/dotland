// How to run:
// deno run --allow-net=echo.websocket.org https://deno.land/posts/v1.4/websocket.js

// Start the connection to the WebSocket server at echo.websocket.org
const ws = new WebSocket("ws://echo.websocket.org/");

// Register event listeners for the open, close, and message events
ws.onopen = () => {
  console.log("WebSocket ready!");

  // Send a message over the WebSocket to the server
  ws.send("Hello World!");
};
ws.onmessage = (message) => {
  // Log the message we recieve:
  console.log("Received data:", message.data);

  // Close the websocket after receiving the message
  ws.close();
};
ws.onclose = () => console.log("WebSocket closed!");
ws.onerror = (err) => console.log("WebSocket error:", err.error);

// When running this the following is logged to the console:
//
// WebSocket ready!
// Received data: Hello World!
// WebSocket closed!
