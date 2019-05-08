import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';
import {model, Schema} from "mongoose";
import { config} from "../config";
import * as mongoosePaginate from 'mongoose-paginate';
const schema : Schema = new Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    modifiedAt:{ type: Date, default: Date.now },
    createdAt:{ type: Date, default: Date.now },
    createdBy:Schema.Types.ObjectId
});
schema.pre("save", function (next) {
       const admin = this;
       if (!admin.createdAt)
               this.createdAt = new Date();
               next();

    });

schema.methods.generateJwt = function (data) {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        
        return jwt.sign({
            sub : data,
            exp : expiry.getTime() / 1000,
        },   config.jwtSecret
);
    };
// Helper method for validating user's password
schema.methods.comparePassword =  function  (candidatePassword){
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
schema.plugin(mongoosePaginate);

export default model('admin', schema);