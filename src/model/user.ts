import mongoose from "mongoose";

const Schema=new mongoose.Schema({
  name:{
    type:String,
    minlength:3,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['host', 'user', 'manager'], 
    default: 'user',
    required:true
  },
  birthDate: {
    type: Date
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password:{
    type:String,
    required:true,
    minlength: 8,
    match: [/(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number']
  }
},{
  timestamps: true
})

const UserModel= mongoose.model('user',Schema);

export default UserModel;