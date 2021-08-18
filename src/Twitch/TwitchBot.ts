import * as tmijs from 'tmi.js';
import { Twitch_Channels, Twitch_Password, Twitch_Username } from '../Config';
import { MemesId, MemeTemplate } from '../Interface/Meme';
import io from '../Main';
import MemeHandler from '../MemeHandler';

export default class TwitchBot
{
    private options = {
        connection: {
            reconnect: true,
            secure: true,
            cluster: "aws"
        },
        identity: {
            username: Twitch_Username,
            password: Twitch_Password
        },
        channels: [Twitch_Channels]
    }

    private Memes: MemeHandler;
    private Replies: Array<[string, string]> = [];
    
    constructor(memes: MemeHandler)
    {
        const client = tmijs.client(this.options);
        this.Memes = memes;
        this.cacheReplies();
        client.connect();

        client.on('message', async (channel, userstate, message, self) => {
            message = message.toLocaleLowerCase();
            if(this.Memes.MemesName.get(message as keyof MemesId))
                io.emit("mem", this.Memes.getMeme(message as keyof MemesId));

            for(const reply of this.Replies)
            {
                if(message.match(new RegExp(reply[0], "g")))
                    io.emit("mem", this.Memes.getMeme("" as keyof MemesId, {
                        text: this.formatReply(reply[0], {channel, userstate, message, self}),
                    }));
            }
        });
    }

    public formatReply(text: string, data: { channel: string, userstate: tmijs.ChatUserstate, message: string, self: boolean })
    {
        // Replace if user
        text = text.replace(/{user}/g, data.userstate.username ?? "");

        return text;
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
            console.log(list)
            this.Replies.push(list);

            count++;
        }
    }
}