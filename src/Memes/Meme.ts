import { Meme_Sus } from "./Sus";
import { Meme_Thud } from "./Thud";

export interface MemesId
{
    "00001": Meme_Thud;
    "00002": Meme_Sus;
}

export interface MemeTemplate
{
    name: string;
    image: string;
    sound: string;
    size: number;
    x: number;
    y: number;
}