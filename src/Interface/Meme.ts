import ThudMeme from "../Memes/General/Thud";
import SusMeme from "../Memes/Sus/Sus";

export interface MemesId
{
    "00001": typeof ThudMeme;
    "00002": typeof SusMeme;
}

export interface MemeTemplate
{
    id: string;
    name: string;
    image: string;
    sound: string;
    size: number;
    x: number;
    y: number;
}