import dgram from "dgram";


class CarpinchoClient {
    constructor(server, listenerPort = 3000) {
        this.server = server;
        this.senderSocket = dgram.createSocket("udp4");
        this.listenerPort = listenerPort;
        this.listenerSocket = dgram.createSocket("udp4");
        this.callbacks = {};
    }

    subscribe(queueName) {
        this.sendToServer("subscribe", { queueName });
    }

    ack(message) {
        console.log(`acknowledging message ${message.data.id}`);
        this.sendToServer("ack", { queueName: message.queueName, messageId: message.data.id });
    }

    on(queueName, callback) {
       this.callbacks[queueName] = callback; 
    }

    handleMessage(message) {
        this.callbacks[message.queueName](message);
        if(message.method === "message")
            this.ack(message);
    }

    listen() {
        this.listenerSocket.on("error", (err) => {
            console.log(`server error:\n${err.stack}`);
            this.senderSocket.close();
            this.listenerSocket.close();
        });

        this.listenerSocket.on("message", (msg, _rinfo) => {
            const message = JSON.parse(msg);
            this.handleMessage(message);
        });

        this.listenerSocket.on("listening", () => {
            const address = this.listenerSocket.address();
            console.log(`listening on: ${address.address}:${address.port}`);
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