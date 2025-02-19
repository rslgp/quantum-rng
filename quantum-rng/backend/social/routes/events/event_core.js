import Router from "express";

const eventRouter = Router();

const userConn = new Map();

/*
// Add a client
clients.set(clientId, res);

// Remove a client
clients.delete(clientId);

// Broadcast to all clients
clients.forEach((client) => {
  client.write(`data: ${JSON.stringify(eventData)}\n\n`);
});
*/
eventRouter.get('/subscribe', async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    userConn.set(req.user.id, res);

    req.on('close', () => {
        console.log('REQ CLOSE');
        userConn.delete(req.user.id);
        console.log(`Client disconnected. Total clients: ${userConn.size}`);
    });
});

/**
 * @readonly
 * @enum {string}
 */
const EventType = Object.freeze({
    NEW_PREMIUM: 0,
    MORE_DECISIONS: 1,
});

/**
* Handles an event.
* 
* @param string userId - The event type (autocompletes in VS Code)
* @param {keyof typeof EventType} eventType - The event type (autocompletes in VS Code)
*/
const sendEvent = (userId, eventType) => {
    console.log("SEND EVENT", userId, eventType);
    const res = userConn.get(userId);
    const eventData = { eventType };
    res.write(`data: ${JSON.stringify(eventData)}\n\n`); // Send event to the user
    userConn.delete(userId);
}

export default eventRouter;
export { sendEvent };
