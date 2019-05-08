import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import {config} from "../config";
import ApiError from '../utils/ApiError';
const User = mongoose.model('user');

export default class LoginService {

  
 static async findUserById(id:any) {
    try {
       return User.findOne({ id: id }).exec();
     }
    catch (err) {
        throw ApiError.internalError('Unable to find User');
    }
 }

 static async generateGraphJwt(id) {
	
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign(
      {
        sub: id,
        exp: expiry.getTime() / 1000
      },
      config.jwtSecret
    );
  }


}
