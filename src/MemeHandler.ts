import { Router, Application } from "express";
import io from "./Main";
import { MemesId } from "./Memes/Meme";

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
        "00002": null,
    }

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/", this.router);

        this.router.post("/:memeId", async (req, res) => {
            const memeId = req.params.memeId as keyof MemesId

            // Get our meme :D
            io.emit("mem", this.getMeme(memeId));
            return res.send(this.getMeme(memeId));
        });
    }

    public getMeme(memeId: keyof MemesId)
    {
        const meme = this.Memes[memeId];
        if(!meme)
            return { image: null, sound: null };
        return meme;
    }
}