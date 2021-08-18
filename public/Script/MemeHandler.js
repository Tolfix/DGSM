const socket = new io()
socket.on("mem", (data) => {
    let { image, sound, name, y, x, size, text } = data;

    console.log(`Activating ${name}`);

    if(!y)
        y = Math.floor(Math.random() * 600);
    if(!x)
        x = Math.floor(Math.random() * 1280);

    if(!size)
        size = 64;

    if(image)
    {
        let isImageUrl = image.match(/http|https/g);
        show_image(isImageUrl ? image : "/Images/"+image, size, x, y)
    }
    if(sound)
    {
        let isSoundUrl = sound.match(/http|https/g);
        let audio = new Audio(isSoundUrl ? sound : `/Sounds/${sound}`);
        audio.play();
    }
    if(text)
    {
        show_text(text, x, y)
    }
});

function show_text(text, x, y)
{
    let sourceText = document.createElement("div");
    sourceText.innerText = text;
    sourceText.style = `position: absolute; top: ${y}px; left: ${x}px; font-size: 3rem; text-shadow: 2px 2px 5px #E2E5E7;`;
    sourceText.classList.add("fade");
    sourceText.classList.add("fade-in");
    let customId = Math.floor(Math.random() * 99999999) + 1;
    sourceText.id = customId;
    document.body.appendChild(sourceText);
    remove(document.getElementById(customId), 3*1000)
}

function show_image(src, size, x, y)
{
    let img = document.createElement("img");
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