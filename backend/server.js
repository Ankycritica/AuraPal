const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

let waitingUser = null;

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("findPartner", () => {
        console.log("User searching:", socket.id);

        if (waitingUser) {
            const room = `room-${socket.id}-${waitingUser.id}`;

            socket.join(room);
            waitingUser.join(room);

            socket.emit("matched", { room });
            waitingUser.emit("matched", { room });

            waitingUser = null;
        } else {
            waitingUser = socket;
        }
    });

    socket.on("message", ({ room, message }) => {
        socket.to(room).emit("message", message);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
        if (waitingUser && waitingUser.id === socket.id) {
            waitingUser = null;
        }
    });
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});