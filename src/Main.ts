require("dotenv").config();
import express from "express";
import cors from "cors";
import expressLayout from "express-ejs-layouts";
import { PORT, PoweredBy, Title } from "./Config";
import SocketIo from "./Sockets";
import MemeHandler from "./MemeHandler";

const server = express();

server.use(expressLayout);
server.set('view engine', 'ejs');
server.use(express.static('public'));

server.use(cors({
    origin: true,
    credentials: true
}));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use((req, res, next) => {
    res.locals.title = Title;
    res.setHeader('X-Powered-By', PoweredBy);
    next();
});

server.get("/", (req, res) => {
    res.render("Main");
});

new MemeHandler(server);

const sv = server.listen(PORT);
const io = (new SocketIo(sv)).io;
export default io;