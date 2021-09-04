import * as tmijs from 'tmi.js';
import { Twitch_Channels, Twitch_Password, Twitch_Username } from '../Config';
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
    
    constructor(memes: MemeHandler)
    {
        const client = tmijs.client(this.options);
        this.Memes = memes;
        client.connect();

        client.on('message', async (channel, userstate, message, self) => {
            message = message.toLocaleLowerCase();

            for(let reply of this.Memes.Replies)
            {
                if(message.match(new RegExp(reply[0], "g")))
                    this.Memes.emit({
                        text: this.formatReply(reply[1], {channel, userstate, message, self}),
                    });
            }

            for(let reply of this.Memes.Actions)
            {
                if(reply[1].text)
                    reply[1].text = this.formatReply(reply[1].text, {channel, userstate, message, self});
                if(message.match(new RegExp(reply[0], "g")))
                    this.Memes.emit(reply[1]);
            }

        });
    }

    public formatReply(text: string, data: { channel: string, userstate: tmijs.ChatUserstate, message: string, self: boolean })
    {
        // Replace if user
        text = text.replace(/\{user\}/g, data.userstate.username ?? "user");

        return text;
    }
}