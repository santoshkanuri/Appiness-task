import * as Joi from "joi";
import * as mongoose from "mongoose";
import Validator from "../../utils/Validator";
import UserService from "../../services/UserService";
import * as _ from "lodash";
import ApiError from "../../utils/ApiError";
import user from "../../model/user";
import {config} from "../../config/";


const User = mongoose.model("user");
const Role = mongoose.model("role");



export default class LoginController {
  static async login(req, res) {          
    const schema = Joi.object().keys({                                    
                   email: Joi.string().email().required(),  
                   password: Joi.string().required()
                });

   const validated: any = await Validator.validate(req.body, schema);                   
          
    const user: any = await UserService.findByEmail(validated.email);  
 
      
 if (!user || !(await user.comparePassword(validated.password)) )   
        return res .status(400).send(ApiError.generic("Unauthorized", "Invalid Email or  Password"));       
    return res.status(200).send({token: user.generateJwt({id:user._id,firstName:user.firstName,lastName:user.lastName,email:user.email,isAdmin:user.admin})}); 
 } 

      
}
