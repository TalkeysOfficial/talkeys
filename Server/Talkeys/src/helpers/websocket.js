const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    const broadcastFeatures = async () => {
        try {
            const features = require('../models/features');
            const feature = await features.find({enabled: true});
            console.log(feature)
            const featureState = JSON.stringify({ type: 'feature_update', feature });
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(featureState);
                }
            });
        } catch (error) {
            console.error('Failed to broadcast features:', error);
        }
    };

    wss.on('connection', async (ws) => {
        try {
            const features = require('../models/features');
            const feature = await features.find({enabled: true});
            console.log(feature);
            ws.send(JSON.stringify({ type: 'feature_update', feature }));
        } catch (error) {
            console.error('Failed to send initial features:', error);
        }
    });

    return broadcastFeatures;
};
