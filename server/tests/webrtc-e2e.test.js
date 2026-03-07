const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("WebRTC Signaling E2E Exchange", () => {
    let io, serverSocketA, serverSocketB, clientSocketA, clientSocketB, serverApp;

    beforeAll((done) => {
        serverApp = createServer();
        io = new Server(serverApp);

        // Mock the backend behavior for the test
        io.on("connection", (socket) => {
            socket.on("video-offer", (payload) => {
                socket.broadcast.emit("video-offer", payload);
            });
            socket.on("video-answer", (payload) => {
                socket.broadcast.emit("video-answer", payload);
            });
            socket.on("ice-candidate", (candidate) => {
                socket.broadcast.emit("ice-candidate", candidate);
            });
        });

        serverApp.listen(() => {
            const port = serverApp.address().port;
            clientSocketA = new Client(`http://localhost:${port}`);
            clientSocketB = new Client(`http://localhost:${port}`);
            clientSocketA.on("connect", () => {
                clientSocketB.on("connect", done);
            });
        });
    });

    afterAll(() => {
        io.close();
        clientSocketA.disconnect();
        clientSocketB.disconnect();
    });

    test("Client B should receive Client A's video offer", (done) => {
        const mockOffer = { type: "offer", sdp: "v=0\r\n..." };

        clientSocketB.on("video-offer", (payload) => {
            expect(payload).toEqual(mockOffer);
            done();
        });

        clientSocketA.emit("video-offer", mockOffer);
    });

    test("Client A should receive Client B's video answer", (done) => {
        const mockAnswer = { type: "answer", sdp: "v=0\r\n..." };

        clientSocketA.on("video-answer", (payload) => {
            expect(payload).toEqual(mockAnswer);
            done();
        });

        clientSocketB.emit("video-answer", mockAnswer);
    });

    test("Clients should exchange ICE candidates", (done) => {
        const mockCandidate = { candidate: "candidate:1 1 UDP 2113937151...", sdpMid: "0", sdpMLineIndex: 0 };

        clientSocketB.on("ice-candidate", (candidate) => {
            expect(candidate).toEqual(mockCandidate);
            done();
        });

        clientSocketA.emit("ice-candidate", mockCandidate);
    });
});
