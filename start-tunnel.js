import { startTunnel } from 'untun';
import http from 'http';
import fs from 'fs';

const start = async () => {
    try {
        const tunnel = await startTunnel({
            url: 'http://localhost:5173',
            port: 5173
        });

        if (!tunnel) {
            throw new Error("Tunnel failed to start");
        }

        const url = await tunnel.getURL();

        fs.writeFileSync('.tunnel.json', JSON.stringify({
            success: true,
            url: url
        }));

    } catch (error) {
        fs.writeFileSync('.tunnel.json', JSON.stringify({ success: false, error: error.message }));
    }
};

start();
