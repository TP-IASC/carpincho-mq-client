import carpinchoMQ, { Transactional } from "../lib/index";

const server = {
    address: "localhost",
    port: 8080
}

const client = carpinchoMQ(server, 41234);

client.setMode(new Transactional());

client.subscribe("cola1");
client.subscribe("cola2");
client.subscribe("cola3");

client.on("cola3", (msg) => {
    for(let i=0; i < 99999; i++) { console.log(i); }
    console.log(msg);
});

client.on("cola2", (msg) => {
    console.log(msg);
});

client.on("cola1", (msg) => {
    for(let i=0; i < 99999 * 5; i++) { console.log(i); }
    console.log(msg);
});

client.listen();