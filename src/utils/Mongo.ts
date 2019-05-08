import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import {config} from "../config";

mongoosePaginate.paginate.options = {
	lean : true,
	limit : 20
};

export default class Mongo
{
	static async connect()
	{
		return new Promise((resolve, reject) => {
		if (process.env.MONGOOSE_DEBUG)
				mongoose.set('debug', true);
			mongoose.connect(config.DBHOST,{ useNewUrlParser: true });
            const connection = mongoose.connection;
            require("../model/index");        
          
			connection.on('open', () => {
                console.log("db connected");	
				
				resolve(connection);
			});
			connection.on('error', e => {
                console.log(e);
				reject(e);
			});
		});
	}
	static disconnect()
	{
		return mongoose.disconnect();
	}
}
