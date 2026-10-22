import { IUserPayload } from "../interface/user";
import PropertyModel from "../model/property";
import { ReserveDateModel } from "../model/ReservDates";
import { sendEmailReservationCancelled, sendReservationEmailForUser } from "../util/sendEmail";

export default class ReservDatesService{

async handleRevesveDates(
  user: IUserPayload,
  body: {
    dates?: string[];
    startDate: string | Date;
    endDate: string | Date;
    paymentMethod?: "cash" | "paypal" | "stripe";
    paymentStatus?: "pending" | "paid" | "failed" | "refunded";
    paymentId?: string;
    amount?: number;
    currency?: string;
  },
  propertyId: string
) {
  try {
    const rawStartDate = body.startDate ?? body.dates?.[0];
    const rawEndDate =
      body.endDate ?? body.dates?.[body.dates.length - 1];

    if (!rawStartDate || !rawEndDate) {
      return {
        status: "error",
        message: "Start date and end date are required",
      };
    }

    const startDate = new Date(rawStartDate);
    const endDate = new Date(rawEndDate);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate <= startDate
    ) {
      return {
        status: "error",
        message: "Invalid startDate or endDate",
      };
    }

    const reservation = {
      startDate,
      endDate,
      userId: user._id,
      paymentMethod: body.paymentMethod ?? "cash",
      paymentStatus: body.paymentStatus ?? "pending",
      ...(body.paymentId && { paymentId: body.paymentId }),
      ...(body.amount !== undefined && { amount: body.amount }),
      currency: body.currency ?? "USD",
    };

    const property = await PropertyModel.findById(propertyId);

    if (!property) {
      return {
        status: "error",
        message: "Property not found",
      };
    }

    // Two stays overlap when each one starts before the other one ends.
    // This conditional update is atomic, so concurrent requests cannot both
    // add an intersecting stay. A checkout on the same day another ends is OK.
    const availableCalendar = {
      propertyId,
      reserveDates: {
        $not: {
          $elemMatch: {
            startDate: { $lt: endDate },
            endDate: { $gt: startDate },
          },
        },
      },
    };

    const update = await ReserveDateModel.updateOne(
      availableCalendar,
      { $push: { reserveDates: reservation } }
    );

    if (update.matchedCount === 0) {
      try {
        await new ReserveDateModel({
          reserveDates: [reservation],
          adminId: property.admin?._id,
          property,
          propertyId,
        }).save();
      } catch (error: any) {
        // A second request may have created this property's calendar between
        // the update and insert. Its unique index makes that request lose.
        if (error?.code === 11000) {
          return {
            status: "error",
            statusCode: 409,
            messageEn: "This property is already booked for the selected dates",
            messageAr: "هذا العقار محجوز بالفعل في التواريخ المحددة",
          };
        }
        throw error;
      }
    }

    await PropertyModel.updateOne(
      { _id: propertyId },
      { $inc: { ordersNumbers: 1 } }
    );

    sendReservationEmailForUser(property.titleEn as string, user.email);
    sendReservationEmailForUser(
      property.titleEn as string,
      property.admin.email as string
    );
    sendReservationEmailForUser(
      property.titleEn as string,
      process.env.AUTHEMAIL!
    );

    return {
      status: "success",
      message: "Date reserved successfully",
    };
  } catch (errors) {
    return {
      status: "error",
      errors,
    };
  }
}

 
  async handleGetReserveDateForProperty(propertyId:string){
    try{
      const foundHotal= await ReserveDateModel.findOne({propertyId:propertyId});
      if(foundHotal){
        return{
          status:"success",
          property:foundHotal,
          nightPrice:foundHotal.property?.nightPrice
        }
      }else{
        const property=await PropertyModel.findOne({_id:propertyId});
        return{
          status:"success",
          message:"You do not have any reserve date",
          nightPrice:property?.nightPrice
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleGetReserveDateForUser(userId:string){
    try{
      const foundHotels = await ReserveDateModel.find({ "reserveDates.userId": userId });
      if (foundHotels.length > 0) {
      return {
        status: "success",
        properties: foundHotels.map(hotel => ({
          property: hotel.property,
          nightPrice: hotel.property?.nightPrice,
          reserveDates: hotel.reserveDates.filter(r => r.userId.toString() === userId)
        }))
      };
    } else {
      return {
        status: "success",
        message: "You do not have any reserve dates"
      };
    }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleGetAllReserveDate(){
    try{
      const disableDates = await ReserveDateModel.find({});
      return {
        status: "success",
        disableDates:disableDates.map((item) => ({
        propertyId: item.propertyId,
        disableDates: item.reserveDates
      }))
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleDeleteRevervedDate(dateId:string,user:IUserPayload){
    try{
      const hotel = await ReserveDateModel.findOne({ "reserveDates._id": dateId });
      const property= await PropertyModel.findOne({_id:hotel?.propertyId})
      if (!hotel) {
          console.error("Reservation not found");
          return;
      }

      const deletedHotel = await ReserveDateModel.updateOne({"reserveDates._id": dateId },{$pull:{reserveDates:{_id:dateId}}});
    if (deletedHotel.modifiedCount>0) {
      sendEmailReservationCancelled(property?.titleEn!,user.email,dateId)
      sendEmailReservationCancelled(property?.titleEn!,property?.admin.email!,dateId)
      sendEmailReservationCancelled(property?.titleEn!,process.env.AUTHEMAIL!,dateId)
      return {
        status: "success",
        message :"Hotal Deleted"
      };
    } else {
      return {
        status: "success",
        message: "Not Found This Hotal"
      };
    }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
}
