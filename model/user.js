import mongoose from 'mongoose';

//creating a new moogose schema
//fill the required fields
const userSchema = new mongoose.Schema({
    firstName:{
        type: String, 
        required: [true, "Please enter a Username"]
    }, 
    lastName:{
        type: String, 
        required:[true, "Please enter a last Name"]
    },
    email:{
        type: String, 
        required:[true, "Please enter a email"]
    },
    password:{
        type: String, 
        min: 5, 
        max: 20
    }
});
//eport store the schema in object as moongoe model
export const User = mongoose.model("User", userSchema);