import mongoose from "mongoose";

const schema =new mongoose.Schema({
  reserveDates:[{
    dates:{
      type:[Date],
      required:true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt:{
      type:Date,
      default:Date.now
    }
  }],
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  propertyId:{
    type:String,
    required:true
  },
  property:{
    type: Object,
    // ref: "Property",
    required: true
  }
},{
  timestamps: true
})

export const ReserveDateModel=mongoose.model("reservDate",schema);

