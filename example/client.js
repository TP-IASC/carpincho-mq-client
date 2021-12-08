import carpi from "../lib/index";

const server = {
    address: "localhost",
    port: 8080
}


const port = Number(process.argv[2]);

const client = carpi(server, port);

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