import { Router, Application } from "express";
import io from "./Main";
import { MemesId, MemeTemplate } from "./Memes/Meme";

export default class MemeHandler
{
    protected server: Application;
    protected router: Router;

    protected Memes: MemesId = {
        "00001": {
            name: "thud_sound_effect",
            image: null,
            sound: "thud.mp3",
        },
        "00002": {
            image: "sus.png",
            name: "sussy_baka",
            size: 128,
            sound: "amugus.mp3",
        },
    }

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/", this.router);

        this.router.post("/:memeId", async (req, res) => {
            const memeId = req.params.memeId as keyof MemesId
            const body = req.body;
            console.log(body);
            // Get our meme :D
            io.emit("mem", this.getMeme(memeId, body));
            return res.send(this.getMeme(memeId, body));
        });

        this.router.get("/memes", (req, res) => {
            return res.send(this.Memes);
        })
    }

    public getMeme(memeId: keyof MemesId, custom?: MemeTemplate)
    {
        let meme: any = this.Memes[memeId];

        if(custom?.image)
            meme.image = custom.image;

        if(custom?.size)
            meme.size = custom.size;

        if(custom?.sound)
            meme.sound = custom.sound;

        if(custom?.x)
            meme.x = custom.x;

        if(custom?.y)
            meme.y = custom.y;

        if(!meme)
            return { image: null, sound: null };
        return meme;
    }
}