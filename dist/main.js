"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./route/user"));
const express_rate_limit_1 = require("express-rate-limit");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const property_1 = __importDefault(require("./route/property"));
const city_1 = __importDefault(require("./route/city"));
const review_1 = __importDefault(require("./route/review"));
const reservDates_1 = __importDefault(require("./route/reservDates"));
const commonQuestions_1 = __importDefault(require("./route/commonQuestions"));
const dashboard_1 = __importDefault(require("./route/dashboard"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const Port = process.env.PORT;
const Mongo_URL = process.env.MONGO_URL;
app.set("trust proxy", 1);
// we use it to provide the attacks accourding header
// app.use(helmet({
//     // to solve show image problem
//     contentSecurityPolicy:{
//         directives:{
//             "default-src": ["'self'"],
//             "script-src": ["'self'", "'unsafe-inline'"],  
//             // "img-src":["'self'","https://cdn.dummyjson.com"]
//         }
//     },
//     // to provide attecker to write iframe in page
//     xFrameOptions:{
//         action:"deny"
//     }
// }))
// console.log(process.env.FRONTEND_BASEUSER)
// app.set("trust proxy", 1);
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://hotel-booking-front-end-x8sw.vercel.app",
//   "https://damainn.com",
//     "https://www.damainn.com",
//     "https://api.damainn.com",
//     "https://hotel-booking-front-end-hhqs.vercel.app"
// ];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     // 👉 هنا نطبع علشان نعرف المصدر المرفوض
//     console.log("❌ Blocked CORS request from:", origin);
//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
// }));
app.use((0, cors_1.default)({ 
    origin: true,
    credentials: true,
}));
app.options(/.*/, (0, cors_1.default)());
app.use(express_1.default.json({ limit: "150mb" }));
app.use(express_1.default.urlencoded({ limit: "150mb", extended: true }));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 200, //  15 minutes
    limit: 1000, // you have 100 request from one ip address at 15 minutes
    message: "Too many requests, please try again later"
});
app.use(limiter);
app.use((req, res, next) => {
    console.log("Method:", req.method);
    console.log("Origin:", req.headers.origin);
    console.log("URL:", req.originalUrl);
    next();
});
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true); 
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'CORS policy does not allow access from this origin';
//       return callback(new Error(msg), true);
//     }
//     return callback(null, true);
//   },
//   credentials: true
// }));
app.use((0, compression_1.default)());
app.use("/api", user_1.default);
app.use("/api", property_1.default);
app.use("/api", city_1.default);
app.use("/api", review_1.default);
app.use("/api", reservDates_1.default);
app.use("/api", commonQuestions_1.default);
app.use("/api", dashboard_1.default);
app.get('/', (_req, res) => {
    res.send('API is working 🎉');
});
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
            status: "fail",
            message: `The ${req.originalUrl} Url Not Found`
        });
    }
    res.status(404).json({
        status: "Error",
        message: "Url is Not Valid"
    });
});
mongoose_1.default.connect(Mongo_URL).then(() => console.log("databse connected"));
app.listen(Port, () => console.log(`http://localhost:${Port}`));
exports.default = app;
