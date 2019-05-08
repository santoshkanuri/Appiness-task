import * as Joi from 'joi';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import Validator from "../../utils/Validator";
import UserService from "../../services/UserService";
import * as _ from 'lodash';
import ApiError from "../../utils/ApiError";
import user from "../../model/user";


const User = mongoose.model('user');
const Role = mongoose.model('role');
export default class UserController
{
    static async createUser(req,res){
        const schema = Joi.object().keys({
            method : 'local',
            firstName: Joi.string(),
            lastName: Joi.string(),
            email:Joi.string().email(),
            phoneNo:Joi.number(),
			password : Joi.string(),
            admin:Joi.boolean(),
            role:Joi.string(),
        });
        const validated : any = await Validator.validate(req.body, schema);  
        const user :any = await UserService.createUser(validated);
        console.log(user);
        if(!user)
            res.send(ApiError.generic('something went Wrong', 'user not created'));
            res.send(user);
    }
    static async updateUser(req, res){
        const schema = Joi.object().keys({
            method : 'local',
            _id:Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            email:Joi.string().email(),
            phoneNo:Joi.number(),
			password : Joi.string(),
            admin:Joi.boolean(),
            role:Joi.string(),
        });
       
        const validated : any = await Validator.validate(req.body, schema);  
        const user :any = await UserService.saveUser(validated);
        if(!user)
            res.sendStatus(400).send(ApiError.generic('something went Wrong', 'user not found'));
            res.sendStatus(204).send(user);
    }

    static async deleteUser(req,res){
        const userId:string= req.params.id;
        const user:any = await UserService.deleteUser(userId);
        if(!user)
            res.send(400).send(ApiError.generic('something went Wrong', 'user not found'));
            res.send(204).send(user);

    }
    static async createRole(req, res)
	{
			const schema = Joi.object().keys({
            method : 'local',
            _id:Joi.string(),
			roleName: Joi.string().required()
        });
        req.body.roleName= _.capitalize(req.body.roleName);
        const roleBody=req.body;
        
		const validated : any = await Validator.validate(roleBody, schema);  
		const role :any = await UserService.findByRole(validated.roleName);
		    if (role)
				return res.status(424).send(ApiError.generic('Dupicate entry', 'Role Alredy Exist'));
		
		const created :any = await UserService.createRole(validated);
        return res.status(200).send(created);
	}
	
	static async fetchRoles(req, res)
	{
		
        const roles = await UserService.listRoles();  
		if (!roles)
			return res.status(400).send(ApiError.generic('Unauthorized', 'roles not found'));
        return res.status(200).send({roles});
	}
	static async assignRole(req, res)
	{
	
		const schema = Joi.object().keys({
			method : 'local',
			userId: Joi.string().required(),
			role:Joi.string().required()

        });
        
		const validated : any = await Validator.validate(req.body, schema);  
			const results :any = await UserService.assignRole(validated);
		return res.status(200).send(results);
	}


static async fetchAllUsers(req,res){        
const users :any = await UserService.findAllUsers();  
      if(!users)          
        return res.status(404).send(ApiError.generic('User data not found', 'something Went wrong'));    
	  return res.status(200).send(users); 
	   }

}