import PropertyModel from "../model/property";
import { ReserveDateModel } from "../model/ReservDates";
import UserModel from "../model/user";
import { getCounts } from "../util/getCoutDashboard";
import { groupByMonth } from "../util/groupByMonth";

export default class DashboardService {
  async handleGetAnalysisData() {
    try {

      const reserveDates = await getCounts(ReserveDateModel, "reserveDates");
      const properties = await getCounts(PropertyModel);
      const users = await getCounts(UserModel);

      return {
        status: "success",
        data: {
          reserveDates,
          properties,
          users,
        },
      };
    } catch (errors) {
      return {
        status: "error",
        errors,
      };
    }
  }
  
  async handleGetChartData() {
    try{
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const reservations = await ReserveDateModel.find({
        createdAt: { $gte: startOfYear },
      });
      
      const users = await UserModel.find({
        createdAt: { $gte: startOfYear },
      });
      console.log(reservations)

      const reservationsMonthly = groupByMonth(reservations,"reserveDates");
      const usersMonthly = groupByMonth(users,"users");

      const result = [
        {
          id: "Reservations",
          data: Object.keys(reservationsMonthly).map((month) => ({
            x: month,
            y: reservationsMonthly[month],
          })),
        },
        {
          id: "Users",
          data: Object.keys(usersMonthly).map((month) => ({
            x: month,
            y: usersMonthly[month],
          })),
        },
      ];

      return {
        status: "success",
        data: {
          result
        },
      };
    } catch (errors) {
        return {
          status: "error",
          errors,
        };
      }
  }

}
