import { Server } from "socket.io";
import { Server as HttpServer } from "http"
export default class SocketIo
{
    public io: Server

    constructor(server: HttpServer)
    {
        this.io = new Server(server);
    }
}