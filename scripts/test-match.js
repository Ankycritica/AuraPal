import { io } from "socket.io-client";

const socket1 = io("http://localhost:3000");
const socket2 = io("http://localhost:3000");

socket1.on("connect", () => {
    console.log("Socket 1 connected");
    socket1.emit("identify", { sessionId: "sess1", guestName: "UserA" });
    socket1.emit("find_random", { isPremium: false });
});

socket2.on("connect", () => {
    console.log("Socket 2 connected");
    socket2.emit("identify", { sessionId: "sess2", guestName: "UserB" });
    socket2.emit("find_random", { isPremium: false });
});

socket1.on("paired", (data) => {
    console.log("Socket 1 paired with", data);
});

socket2.on("paired", (data) => {
    console.log("Socket 2 paired with", data);
    process.exit(0);
});

setTimeout(() => {
    console.log("Timeout! Pairing failed.");
    process.exit(1);
}, 5000);
