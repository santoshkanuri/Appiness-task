import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';
import {model, Schema} from "mongoose";
import {config} from "../config";

import * as mongoosePaginate from 'mongoose-paginate';
const Genders = Object.freeze({
    Male: 'male',
    Female: 'female'
  });
const schema : Schema = new Schema({
	email : {type : String, unique : true, required : true},
	password : String,
	firstName : String,
	lastName : String,
    admin: {type:Boolean,default:false},
    age:Number,
    gender: {
        type: String,
        enum: Object.values(Genders),
      },
    phoneNo:{ type:Number,unique:true},
    role:Schema.Types.ObjectId,
    createdAt:Date
	
}, {versionKey : false});


schema.pre("save", function (next) {
	const user = this;
	if (!this.createdAt)
		this.createdAt = new Date();
	
	if (!user.isModified('password'))
		return next();
	
	bcrypt.genSalt(8, (err, salt) => {
		if (err)
			return next(err);
		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err)
				return next(err);
			user.password = hash;
			next();
		});
	});
});

// Helper method for validating user's password
schema.methods.comparePassword = function (candidatePassword) {
	if (!this.password)
		return Promise.resolve(false);
	
	return new Promise((resolve, reject) => {
		return bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
			if (err)
				reject(err);
			else
				resolve(isMatch);
		});
	})
};

schema.methods.generateJwt = function (data) {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);
	
	return jwt.sign({
		sub : data,
		exp : expiry.getTime() / 1000,
	}, config.jwtSecret );
};


schema.plugin(mongoosePaginate);

export default model('user', schema);