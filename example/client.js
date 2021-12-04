import carpinchoMQ, { Transactional } from "../lib/index";

const server = {
    address: "localhost",
    port: 8080
}

const client = carpinchoMQ(server, 41234);

client.setMode(new Transactional());

client.subscribe("cola1");

client.on("cola1", (msg) => {
    console.log(msg);
});

client.listen();