import { Router, Application } from "express";
import { readdirSync } from "fs";
import io from "./Main";
import { MemeTemplate } from "./Interface/Meme";

export default class MemeHandler
{
    protected server: Application;
    protected router: Router;

    public MemeLimit = new Map<any, number>();
    public Replies: Array<[string, string]> = [];
    public Actions: Array<[string, Partial<MemeTemplate>]> = [];
    public rateLimit = parseInt(process.env.RATELIMIT ?? "10");
    public rateLimitCount = 0;

    constructor(server: Application) {
        this.server = server;
        this.router = Router();
        this.server.use("/", this.router);
        this.cacheReplies();
        this.cacheActions();

        // this.router.post("/:memeId", async (req, res) => {
        //     const memeId = req.params.memeId as keyof MemesId
        //     const body = req.body;
        //     this.emit("mem", this.createMeme(memeId, body));
        //     return res.send(this.createMeme(memeId, body));
        // });

        this.router.get("/memes", (req, res) => {
            return res.render("Memes", {
                ShowMemes: true,
                Replies: this.Replies,
                Actions: this.Actions
            });
        });
    }

    public emit(data: Partial<MemeTemplate>)
    {
        if(this.rateLimit < this.rateLimitCount)
            return;

        this.rateLimitCount = this.rateLimitCount+1;

        setTimeout(() => {
            this.rateLimitCount = this.rateLimitCount-1;
        }, 5*1000);

        return io.emit("mem", this.createMeme(data));
    }

    public cacheReplies()
    {
        let count = 1;
        while(true)
        {
            let reply = process.env[`TWITCH_REPLY_${count}`];
            if(!reply)
                break;

            const list = JSON.parse(reply);
            this.Replies.push(list);

            count++;
        }
    }

    public cacheActions()
    {
        let count = 1;
        while(true)
        {
            let reply = process.env[`TWITCH_ACTION_${count}`];
            if(!reply)
                break;

            reply = reply.replace(/{COLON}/g, ":");
            
            let list = JSON.parse(reply);

            this.Actions.push(list);

            count++;
        }
    }

    public createMeme(custom: Partial<MemeTemplate>)
    {
        let meme: any = custom;
        
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

