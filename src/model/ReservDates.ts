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
  }],
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  propertyId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Property",
  }
},{
  timestamps: true
})

export const ReserveDateModel=mongoose.model("reservDate",schema);

