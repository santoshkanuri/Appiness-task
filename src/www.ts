
import * as expresswsroutes from "express-ws-routes";
import * as http from "http";
import Server from "./server";
import Mongo from "./utils/Mongo";
import {config} from './config'

    Mongo.connect();
	const app = Server.instance().app;
	
	const server : any = http.createServer(<any> app);
	server.wsServer = expresswsroutes.createWebSocketServer(server, app, {});
	server.listen(config.port);
	
	

