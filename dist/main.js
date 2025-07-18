"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./route/user"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const Port = process.env.PORT;
const Mongo_URL = process.env.MONGO_URL;
app.use(express_1.default.json());
/*const limiter=rateLimit({
     windowMs:15 * 60 * 1000, //  15 minutes
     limit:1000, // you have 100 request from one ip address at 15 minutes
    message:"Too many requests, please try again later"
})

app.use(limiter)*/
// we use it to provide the attacks accourding header
app.use((0, helmet_1.default)({
    // to solve show image problem
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'"],
            // "img-src":["'self'","https://cdn.dummyjson.com"]
        }
    },
    // to provide attecker to write iframe in page
    xFrameOptions: {
        action: "deny"
    }
}));
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use("/api", user_1.default);
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
