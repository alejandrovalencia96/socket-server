import express from 'express';
import { SERVER_PORT } from '../global/enviroment';
import socketIO, { Socket } from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';


export default class Server{

    private static _instance: Server;
      
    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor(){

        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server(this.app);
        this.io = new socketIO.Server( this.httpServer, { cors: { origin: true, credentials: true } } );

        this.escucharScokets();

    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    private escucharScokets(){
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            //Conectar cliente
            socket.conectarCliente(cliente);

            //Configurar usuario
            socket.configurarUsuario(cliente, this.io);

            //Mensajes
            socket.mensaje(cliente, this.io);

            //Desconectar
            socket.desconectar(cliente);
            
        });

    }

    //metodo que levanta el servidor
    start( callback: any){        
        this.httpServer.listen(this.port, callback);
    }

}