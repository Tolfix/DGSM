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
    private Actions: Array<[string, Partial<MemeTemplate>]> = [];
    
    constructor(memes: MemeHandler)
    {
        const client = tmijs.client(this.options);
        this.Memes = memes;
        this.cacheReplies();
        this.cacheActions();
        client.connect();

        client.on('message', async (channel, userstate, message, self) => {

            for(let reply of this.Replies)
            {
                if(message.match(new RegExp(reply[0], "g")))
                    this.Memes.emit("", {
                        text: this.formatReply(reply[1], {channel, userstate, message, self}),
                    });
            }

            for(let reply of this.Actions)
            {
                if(reply[1].text)
                    reply[1].text = this.formatReply(reply[1].text, {channel, userstate, message, self});
                if(message.match(new RegExp(reply[0], "g")))
                    this.Memes.emit("", reply[1]);
            }

        });
    }

    public formatReply(text: string, data: { channel: string, userstate: tmijs.ChatUserstate, message: string, self: boolean })
    {
        // Replace if user
        text = text.replace(/\{user\}/g, data.userstate.username ?? "user");

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
}