import dgram from "dgram";


export class Transactional {
    styleDescription() { return "transactional"; }

    handleMessage(client, message, callback) {
        callback(message);
        client.ack(message);
    }
}

export class NonTransactional {
    styleDescription() { return "non transactional"; }

    handleMessage(client, message, callback) {
        client.ack(message).then(() => {
            callback(message);
        });
    }
}


class CarpinchoClient {
    constructor(server, listenerPort = 3000) {
        this.server = server;
        this.mode = new Transactional();
        this.senderSocket = dgram.createSocket("udp4");
        this.listenerPort = listenerPort;
        this.listenerSocket = dgram.createSocket("udp4");
        this.callbacks = {};
    }

    setMode(mode) {
        this.mode = mode;
    }

    subscribe(queueName) {
        this.sendToServer("subscribe", { queueName });
    }

    ack(message) {
        console.log(`acknowledging message ${message.message.id}`);
        this.sendToServer("ack", { queueName: message.queueName, messageId: message.message.id });
    }


    on(queueName, callback) {
       this.callbacks[queueName] = callback; 
    }

    listen() {
        this.listenerSocket.on("error", (err) => {
            console.log(`server error:\n${err.stack}`);
            this.senderSocket.close();
            this.listenerSocket.close();
        });

        this.listenerSocket.on("message", (msg, _rinfo) => {
            const message = JSON.parse(msg);
            this.mode.handleMessage(this, message, this.callbacks[message.queueName]);
        });

        this.listenerSocket.on("listening", () => {
            const address = this.listenerSocket.address();
            console.log(`${this.mode.styleDescription()} listening on: ${address.address}:${address.port}`);
        });

        this.listenerSocket.bind(this.listenerPort);
    }


    sendToServer(method, body) {
        const payload = {
            port: this.listenerPort,
            data: {
                method,
                body
            }
        }
        this.senderSocket.send(JSON.stringify(payload), this.server.port, this.server.address);
    }
}


export default (server, listenerPort) => new CarpinchoClient(server, listenerPort);