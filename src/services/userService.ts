import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import ApiError from '../utils/ApiError';

const User = mongoose.model('user');
const Role = mongoose.model('role');


export default class UserService
{
    static async createUser(user :any){
		try{
			return User.create(user);
		}
		catch(err){
			throw ApiError.internalError('Unable to create user');
		}
	}
	static async saveUser(user)
	{
		if (!user._id)
		{
           
			return (new User(user)).save();
		}
		else
		{
			const existing = await User.findOne({_id : user._id}).exec();
			_.assign(existing, user);
			return existing.save();
		}
	}
    
    static async deleteUser(id:string){
        try
		{ 
			return User.findOneAndRemove({_id : id}).exec()
		}
		catch (err)
		{
			
			throw ApiError.internalError('Unable to delteUser');
		}
    }
	
	static async findByEmail(email : string)
	{
		try
		{ 
			return User.findOne({email : email}).exec()
		}
		catch (err)
		{
			
			throw ApiError.internalError('Unable to find by email');
		}
	}

	static async findById(id : string)
	{
		try
		{
			return User.findOne({_id : id}).exec()
		}
		catch (err)
		{
			
			throw ApiError.internalError('Unable to find by id');
		}
	}
	
	static async listRoles(){
		try{
			return Role.find({}).select('roleName').exec()
		}
		catch(err){
			throw ApiError.internalError('Unable to find Roles');
		}
	}

	static async findByRole(roleName :string){
	
		try{
			return Role.findOne({roleName: roleName}).exec();
		}
		catch(err){
			throw ApiError.internalError('Unable to find Roles');
		}
	}
	
	static async createRole(role :any){
		try{
			return Role.create(role)
		}
		catch(err){
			throw ApiError.internalError('Unable to create Role');
		}
	}
	static async assignRole(roleStr:any){
		try{
		 return User.findOneAndUpdate({_id:roleStr.userId},{ new: true },{$set:{role:roleStr.role,updatedAt:Date.now()}}).select('-password').exec();
		}
		catch(err){
			throw ApiError.internalError('Unable to Assign Role');
		}
	}


	// @check for admin
	static async findAdmin(email:string){
		try{
			return User.findOne({email: email,admin:true}).exec();
		}
		catch(err){
			throw ApiError.internalError('Unable to find Admin');
		}
	} 
	
static async findAllUsers(){       
    try{   
        return User.find().select('-password').exec();
        }         
    catch (err) {           
          throw ApiError.internalError('Unable to find user');
        }
    }

	
}