import mongoose from "mongoose";

const schema =new mongoose.Schema({
  reserveDates:[{
      startDate:{
        type:Date,
        required:true,
        validate: {
          validator: function (value:Date) {
            return value >= new Date();
          },
          message: "startDate must be in the future or today"
        }
      },
      endDate:{
        type:Date,
        required:true,
        validate: {
          validator: function (value:Date) {
            return value >= new Date();
          },
          message: "startDate must be in the future or today"
        }
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

