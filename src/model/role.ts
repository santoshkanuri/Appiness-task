import {model, Schema} from "mongoose";
import * as mongoosePaginate from 'mongoose-paginate';


const schema : Schema = new Schema({
    roleName:{type:String,required:true},
    modifiedAt:{ type: Date, default: Date.now },
    createdAt:{ type: Date, default: Date.now },
    createdBy:Schema.Types.ObjectId
},{versionKey : false});
schema.pre("save", function (next) {
       const role = this;
       if (!role.createdAt)
               this.createdAt = new Date();
               next();

    });

schema.plugin(mongoosePaginate);

export default model('role', schema,'role');