import { authorizationForManager } from '../meddileware/user';
import { Router } from "express";
import DashboardService from '../service/dashboard';
import DashboardController from '../controler/dashboard';

const router =Router();

const dashboardService=new DashboardService();
const dashboardController=new DashboardController(dashboardService);

router.get("/dashboard",authorizationForManager,(req,res)=>dashboardController.analysisData(req,res))
router.get("/chart",authorizationForManager,(req,res)=>dashboardController.getChartData(req,res))
router.get("/topProperty",authorizationForManager,(req,res)=>dashboardController.getTopProperty(req,res))







export default router