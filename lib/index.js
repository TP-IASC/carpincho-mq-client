import Axios from "axios";
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
    constructor(serverUrl) {
        this.serverUrl = serverUrl;
        this.mode = new Transactional();
        this.udp = dgram.createSocket("udp4");
        this.callbacks = {};
    }

    setMode(mode) {
        this.mode = mode;
    }

    subscribe(queueName) {
        const url = `${this.serverUrl}/${queueName}/subscribers`;
        console.log(`Subscribing to ${queueName}...\n\tPOST ${url}`);
        return Axios.post();
    }

    ack(message) {
        const url = `${this.serverUrl}/${message.queueName}/subscribers/${message.message.id}`
        console.log(`Acknowledging message ${message.message.id}...\n\tPATCH ${url}`);
        return Axios.patch(url);
    }


    on(queueName, callback) {
       this.callbacks[queueName] = callback; 
    }

    listen(port) {
        this.udp.on("error", (err) => {
            console.log(`server error:\n${err.stack}`);
            this.udp.close();
        });

        this.udp.on("message", (msg, _rinfo) => {
            const message = JSON.parse(msg);
            this.mode.handleMessage(this, message, this.callbacks[message.queueName]);
        });

        this.udp.on("listening", () => {
            const address = this.udp.address();
            console.log(`${this.mode.styleDescription()} listening on: ${address.address}:${address.port}`);
        });

        this.udp.bind(port);
    }
}


export default (serverUrl) => new CarpinchoClient(serverUrl);