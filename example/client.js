import carpinchoMQ, { Transactional } from "../lib/index";


const client = carpinchoMQ("localhost:8080");

client.setMode(new Transactional());

client.on("cola1", (msg) => {
    console.log(msg);
});

client.listen(41234);