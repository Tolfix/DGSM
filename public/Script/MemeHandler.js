const socket = new io()
socket.on("mem", (data) => {
    let { image, sound, name, y, x, size } = data;

    console.log(`Activating ${name}`);

    if(!y)
        y = Math.floor(Math.random() * 600);
    if(!x)
        x = Math.floor(Math.random() * 1080);

    if(!size)
        size = 64;

    if(image)
    {
        show_image("/Images/"+image, size, x, y)
    }
    if(sound)
    {
        let audio = new Audio(`/Sounds/${sound}`);
        audio.play();
    }
});

function show_image(src, size, x, y) {
    var img = document.createElement("img");
    img.src = src;
    img.width = size;
    img.style = `position: absolute; top: ${y}px; left: ${x}px;`;
    img.classList.add("fade");
    img.classList.add("fade-in");
    let customId = Math.floor(Math.random() * 99999999) + 1;
    img.id = customId;
    document.body.appendChild(img);
    remove(document.getElementById(customId), 3*1000)
}

function remove( el, speed ) {
    setTimeout(function() {
        el.classList.remove("fade-in");
        el.classList.add("fade-out");
        setTimeout(() => {
            el.parentNode.removeChild(el);
        }, 3*1000);
    }, speed);
}