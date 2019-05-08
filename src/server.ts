import * as express from "express";
import * as expressWsRoutes from "express-ws-routes";
import * as bodyParser from "body-parser";

export default class Server
{

    public app = expressWsRoutes();

    static instance() : Server

    {

        return new Server();

    }

    private constructor()

    {

        // configure app

        this.config();

        // add routes

        this.routes();

    }

    

    private config()

    {


        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({extended : false}));

        

        this.app.use(function(req, res, next) {

            res.header("Access-Control-Allow-Origin", "*");

            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            next();

         });

    }

    

    private routes(){
    this.app.use(function(req, res, next) {

            res.header("Access-Control-Allow-Origin", "*");

            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            next();

         });

     this.app.use('/api', require('./routes/api/index'));

        this.app.use((req, res, next) => {

            const err : any = new Error('Not Found');

            err.status = 404;

            next(err);

        });


        if (this.app.get('env') === 'development')

        {

            this.app.use((err, req, res, next) => {             

                res.status(err.status || 500);

                res.render('error', {

                    message : err.message,

                    error : err,

                });

            });

        }

        this.app.use((err, req, res, next) => {

            res.status(err.status || 500);

            res.render('error', {

                message : err.message,

                error : {},

            });

        });

    }

}

