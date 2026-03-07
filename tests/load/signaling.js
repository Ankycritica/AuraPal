import ws from 'k6/ws';
import { check } from 'k6';
import { sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 }, // Ramp up
        { duration: '1m', target: 50 },  // Hold
        { duration: '30s', target: 0 }   // Ramp down
    ]
};

export default function () {
    const url = `ws://localhost:3000/socket.io/?EIO=4&transport=websocket`;

    const res = ws.connect(url, null, function (socket) {
        socket.on('open', function () {
            // socket.io connection initialization (send 40 for connect)
            socket.send('40');

            sleep(1);

            // Emit find random (42 is custom event)
            socket.send('42["video-find-random",{"genderPreference":"everyone"}]')
        });

        socket.on('message', function (msg) {
            if (msg === '2') {
                // respond to ping with pong
                socket.send('3');
            }
            if (msg.includes('video-ready')) {
                check(msg, {
                    'Matched dynamically': (s) => s.includes('partner')
                });

                sleep(2);
                socket.send('42["video-skip"]');
            }
        });

        setTimeout(() => {
            socket.close();
        }, 15000);
    });

    check(res, { 'status is 101': (r) => r && r.status === 101 });
}
