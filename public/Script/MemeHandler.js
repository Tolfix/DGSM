// const { Socket } = require("socket.io");
const socket = new io()
socket.on("mem", (data) => {
    const { image, sound, name } = data;
    console.log(`Activating ${name}`);
    let audio = new Audio(`/Sounds/${sound}`);
    audio.play();
});