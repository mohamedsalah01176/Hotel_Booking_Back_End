import  mongoose  from 'mongoose';

const schema =new mongoose.Schema({
  name:{
    required:true,
    type:String,
    minlength:3,
    message:"Name of city is required and greater than 3 char"
  },
  nameEn:{
    type:String,
  },
  nameAr:{
    type:String,
  },
  numberOfHotel:{
    type:Number,
    default:0,
  },
});

const CityModel=mongoose.model("city",schema);

export default CityModel;