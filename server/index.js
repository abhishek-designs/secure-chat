const { randomUUID } = require("crypto");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

// Init socket io
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Setting port
const PORT = 8000 || process.env.PORT;

// Testing http server
app.get("/", (req, res) => {
  res.send("hello from socket server");
});

// Establishing socket io connection
io.on("connection", socket => {
  console.log("new user connected" + socket.id);
  console.log(io.engine.clientCount);

  // CLIENT Listen when client sends a chat request
  socket.on("chat-request", user => {
    console.log(user);
    const notification = {
      id: socket.id,
      msg: `${user.name} wants to chat with you`,
    };
    // ADMIN Forward this request to the admin
    socket.broadcast.emit("to-admin", notification);
  });

  // ADMIN Send the alert to the user when He/She request again
  socket.on("request-alert", alert => {
    socket.broadcast.emit("on-alert", alert);
  });

  // SERVER Hold a chat between client and admin by sending a random room id
  socket.on("request-accept", userid => {
    const roomid = randomUUID();
    const response = {
      msg: "You r eligible for this chat",
      roomid,
    };
    // ADMIN Send the response to that specific client who requested for chat with the help of socket id
    socket.to(userid).emit("on-request-accept", response);
  });

  // SERVER If a client joined the chat room inform the admin with user details and room id
  socket.on("join-chat", (user, room) => {
    console.log(user, room);
    const message = {
      id: randomUUID(),
      userid: socket.id,
      msg: `${user.name} joined the chat`,
    };
    // SERVER Also join this client to this room
    socket.join(room);
    // socket.to(room).emit("room-msg", message);
    console.log("client joined");
    // ADMIN get the user details and room id when client joins
    socket.broadcast.emit("on-join-chat", user, room);
  });

  socket.on("admin-join", room => {
    const message = {
      id: randomUUID(),
      userid: socket.id,
      msg: "Admin joined the chat",
    };
    socket.join(room);
    socket.to(room).emit("room-msg", message);
    console.log("admin joined");
  });

  // SERVER Observing the sent messages
  socket.on("sent-message", (msg, room) => {
    // SERVER Forward the message to this room
    socket.to(room).emit("recieved-message", msg);
  });

  // SERVER Listen to this event user wants to leave the room
  socket.on("on-leave-room", (room, msg) => {
    // SERVER Kick out the users from the room
    socket.to(room).emit("room-msg", msg);
    socket.leave(room);
  });

  // ADMIN give indication to client for waiting
  socket.on("client-waiting", (waiting, id) => {
    // SERVER emit this indicator to client
    console.log(id, waiting);
    socket.to(id).emit("on-waiting", waiting);
  });

  //SERVER Log when any user gets disconnected
  socket.on("disconnection", () =>
    console.log(`User ${socket.id} disconnected`)
  );
});

// Listening the server on defined port
http.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
