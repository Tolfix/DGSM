import { Router, Application } from "express";
import { readdirSync } from "fs";
import io from "./Main";
import { MemesId, MemeTemplate } from "./Interface/Meme";

export default class MemeHandler
{
    protected server: Application;
    protected router: Router;

    public Memes = new Map<keyof MemesId, MemeTemplate>();
    public MemesName = new Map<MemeTemplate["name"], MemeTemplate>();

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/", this.router);
        this.cacheMemes();

        this.router.post("/:memeId", async (req, res) => {
            const memeId = req.params.memeId as keyof MemesId
            const body = req.body;
            io.emit("mem", this.getMeme(memeId, body));
            return res.send(this.getMeme(memeId, body));
        });

        this.router.get("/memes", (req, res) => {
            return res.send(this.Memes.entries());
        });
    }

    public cacheMemes()
    {
        let commandDir = ((__dirname.replace("\\build", "")).replace("/build", ""))+"/build/Memes";
        readdirSync(commandDir).forEach((dir) => {
            const command = readdirSync(`${commandDir}/${dir}`).filter((f) => f.endsWith('.js'));
            for (let file of command)
            {
                const pull = (require(`${commandDir}/${dir}/${file}`)).default;
                if (pull.id) {
                    this.Memes.set(pull.id, pull);
                    this.MemesName.set(pull.name, pull)
                }
                continue;
            }
        });
    }

    public getMeme(memeId: keyof MemesId, custom?: Partial<MemeTemplate>)
    {
        let meme: any = this.Memes.get(memeId);
        if(!meme)
            meme = this.MemesName.get(memeId as string) ?? {};
        
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

        if(custom?.text)
            meme.text = custom.text;

        if(!meme)
            return { image: null, sound: null };

        return meme;
    }
}

