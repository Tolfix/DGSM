import * as tmijs from 'tmi.js';
import { Twitch_Channels, Twitch_Password, Twitch_Username } from '../Config';
import { MemesId, MemeTemplate } from '../Interface/Meme';
import io from '../Main';
import MemeHandler from '../MemeHandler';

export default class TwitchBot
{
    private options = {
        // options: { debug: true },
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
        // this.Memes.cacheMemes();
        client.connect();
        
        client.on('message', async (channel, userstate, message, self) => {
            if(this.Memes.MemesName.get(message as keyof MemesId))
                io.emit("mem", this.Memes.getMeme(message as keyof MemesId));

            // if(message.includes("gg"))

        });
    }
}