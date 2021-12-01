const udp = require("dgram");

const client = udp.createSocket("udp4");

var id = 1;

setInterval(() => {
    const msg = {
        queueName: "cola1",
        message: {
            id,
            payload: `Mensaje ${id}`
        }
    }
    id += 1;
    client.send(JSON.stringify(msg), 41234, "localhost");
}, 4000);