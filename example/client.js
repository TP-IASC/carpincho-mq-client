const carpinchoMQ = require("../dist/index.js");

const init = carpinchoMQ.default;

const client = init("localhost:8080");

client.setMode(new carpinchoMQ.Transactional());

client.on("cola1", (msg) => {
    console.log(msg);
});

client.listen(41234);