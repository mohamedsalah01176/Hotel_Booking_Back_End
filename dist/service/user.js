"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../model/user"));
const sendMessage_1 = require("../util/sendMessage");
const yapSchema_1 = require("../util/yapSchema");
const sendEmail_1 = require("../util/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const property_1 = __importDefault(require("../model/property"));
let otpStore = {};
class UserService {
    constructor() { }
    handleSendCode(body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!body) {
                return {
                    status: 'fail',
                    messageEn: "The Phone is Required",
                    messageAr: "يجب ادخال رقم التليفون",
                };
            }
            try {
                console.log(body.phone, "phone");
                let code = Math.floor(100000 + Math.random() * 900000);
                otpStore[body.phone] = code.toString();
                if (body.type === "whatsApp") {
                    yield (0, sendMessage_1.sendMessageWhatsUp)(code, body.phone);
                }
                else {
                    yield (0, sendMessage_1.sendMessageSMS)(code, body.phone);
                }
                return {
                    status: "success",
                    meessageEn: "Code Sended",
                    meessageAr: "تم ارسال الكود",
                };
            }
            catch (errors) {
                if (errors.code === 11000 && ((_a = errors.keyPattern) === null || _a === void 0 ? void 0 : _a.email)) {
                    return {
                        status: "fail",
                        messageEn: "this email is already registered",
                        messageAr: "تم تسجيل الايميل من قبل"
                    };
                }
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleVerfyCode(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body) {
                return {
                    status: 'fail',
                    messageEn: "The Phone is Required",
                    messageAr: "يجب ادخال رقم التليفون",
                };
            }
            try {
                if (body.code !== otpStore[body.phone]) {
                    return {
                        status: "fail",
                        messageEn: "Sorry, we are not able to verify the code. Please make sure you input the right mobile number and code.",
                        messageAr: "عذرًا، لا يمكننا التحقق من الرمز. يرجى التأكد من إدخال رقم الهاتف والرمز الصحيح"
                    };
                }
                delete otpStore[body.phone];
                yield user_1.default.updateOne({ phone: body.phone }, { $set: { phoneVerfy: true } });
                return {
                    status: "success",
                    messageEn: "verfiy correct",
                    messageAr: "التحقيق صحيح",
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    message: errors
                };
            }
        });
    }
    handleRegister(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundUser = yield user_1.default.findOne({ $or: [{ email: body.email }, { phone: body.phone }] });
                if (foundUser) {
                    return {
                        status: "fail",
                        messageEn: "The Email Or Phone Aready Registered",
                        messageAr: "تم تسجيل الايميل او الفون من قبل",
                    };
                }
                const validationBody = yapSchema_1.regiterBodySchema.validate(body, { abortEarly: false });
                console.log((yield validationBody).password);
                let bcriptPassword = yield bcrypt_1.default.hash((yield validationBody).password, parseInt(process.env.SALTPASSWORD));
                let newUser = new user_1.default(Object.assign(Object.assign({}, (yield validationBody)), { password: bcriptPassword }));
                yield newUser.save();
                const payload = {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    phone: newUser.phone,
                    image: newUser === null || newUser === void 0 ? void 0 : newUser.image,
                    phoneVerfy: newUser === null || newUser === void 0 ? void 0 : newUser.phoneVerfy,
                    createdAt: newUser.createdAt
                };
                let token = jsonwebtoken_1.default.sign(payload, process.env.SECTERTOKENKEY, { expiresIn: "30d" });
                return {
                    status: "success",
                    messageEn: "user Created",
                    messageAr: "تم انشاء المستخدم",
                    token
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleLogin(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body) {
                return {
                    status: "fail",
                    messageEn: "Email and Password are required",
                    messageAr: "يجب ادجال الايميل وكلمه السر",
                };
            }
            try {
                let validateBody = yield yapSchema_1.loginBodySchema.validate(body, { abortEarly: false });
                let foundUser;
                if (validateBody.emailOrPhone.startsWith("+")) {
                    foundUser = yield user_1.default.findOne({ phone: validateBody.emailOrPhone });
                }
                else {
                    foundUser = yield user_1.default.findOne({ email: validateBody.emailOrPhone });
                }
                console.log(foundUser);
                if (!foundUser) {
                    return {
                        status: "fail",
                        messageEn: "Email Or Phone Not Registered",
                        messageAr: "الايميل غير مسجل"
                    };
                }
                let matchedPassword = yield bcrypt_1.default.compare(validateBody.password, foundUser.password);
                const payload = {
                    _id: foundUser._id,
                    name: foundUser.name,
                    email: foundUser.email,
                    phone: foundUser.phone,
                    role: foundUser.role,
                    image: foundUser === null || foundUser === void 0 ? void 0 : foundUser.image,
                    phoneVerfy: foundUser === null || foundUser === void 0 ? void 0 : foundUser.phoneVerfy,
                    createdAt: foundUser.createdAt
                };
                let token = jsonwebtoken_1.default.sign(payload, process.env.SECTERTOKENKEY, { expiresIn: "30d" });
                console.log(validateBody.password);
                console.log(matchedPassword);
                if (matchedPassword) {
                    return {
                        status: "success",
                        messageEn: "Welcame in Our WebSite",
                        messageAr: "مرحبا بك في موقعنا",
                        token
                    };
                }
                else {
                    return {
                        status: "error",
                        messageEn: "Password is not correct",
                        messageAr: "كلمه السر غير صحيحيه",
                    };
                }
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleForgetPassword(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body) {
                return {
                    status: "fail",
                    messageEn: "Email is Required",
                    messageAr: "يجب ادخال الايميل",
                };
            }
            try {
                let userFounded = yield user_1.default.findOne({ email: body.email });
                if (!userFounded) {
                    return {
                        status: "fail",
                        messageُى: "Email Not Registered",
                        messageAr: "الايميل غير مسجل"
                    };
                }
                yield (0, sendEmail_1.sendEmail)(userFounded, "password");
                return {
                    status: "success",
                    messageEn: "Check your gmail account",
                    messageAr: "افحص الجيميل الخاص بك"
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleResetPassword(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body) {
                return {
                    status: "fail",
                    messageEn: "Email Not Found",
                    messageAr: "الايميل غير مسجل",
                };
            }
            try {
                let validateBody = yield yapSchema_1.loginBodySchema.validate(body);
                let foundUser = yield user_1.default.findOne({ email: validateBody.emailOrPhone });
                if (!foundUser) {
                    return {
                        status: "fail",
                        messageEn: "Email is not Registered",
                        messageAr: "البريد الإلكتروني غير مسجّل"
                    };
                }
                let bcriptPassword = yield bcrypt_1.default.hash(body.password, parseInt(process.env.SALTPASSWORD));
                let updateUser = yield user_1.default.updateOne({ email: validateBody.emailOrPhone }, { $set: { password: bcriptPassword } });
                if (updateUser.modifiedCount) {
                    return {
                        status: "success",
                        messageEn: "Password Updated",
                        messageAr: "تم تحديث كلمه السر",
                    };
                }
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleGetSpecificUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let foundUser = yield user_1.default.findOne({ _id: userId });
                if (!foundUser) {
                    return {
                        status: "fail",
                        messageEn: "User Not Found",
                        messageAr: "المستخدم ليس موجود"
                    };
                }
                return {
                    status: "success",
                    user: foundUser
                };
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleUpdateUser(userId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let hashPassword = "";
            try {
                let user = yield user_1.default.findOne({ _id: userId });
                if (!user) {
                    return {
                        status: "fail",
                        messageEn: "User Not Found",
                        messageAr: "المستخدم ليس موجود"
                    };
                }
                if (body.oldPassword) {
                    const checkedPassword = yield bcrypt_1.default.compare(body === null || body === void 0 ? void 0 : body.oldPassword, user === null || user === void 0 ? void 0 : user.password);
                    console.log(checkedPassword, "lllllllllll");
                    if (!checkedPassword) {
                        return {
                            status: "fail",
                            messageEn: "Your Old Password Not The Same your Password",
                            messageAr: "كلمه السر القديمه غير متشابه"
                        };
                    }
                    hashPassword = yield bcrypt_1.default.hash(body === null || body === void 0 ? void 0 : body.newPassword, Number(process.env.SALTPASSWORD));
                }
                console.log(body, "llllllllllllllllll");
                body.password = hashPassword;
                delete body.newPassword;
                delete body.oldPassword;
                const updateUser = yield user_1.default.updateOne({ _id: userId }, { $set: body }, { new: true });
                if (updateUser.modifiedCount > 0) {
                    return {
                        status: "success",
                        messageEn: "Your Account Updated",
                        messageAr: "تم تحديث حسابكم"
                    };
                }
                else {
                    return {
                        status: "fail",
                        messageEn: "Your Account Not Updated",
                        messageAr: "لم تم تحديث حسابكم"
                    };
                }
            }
            catch (errors) {
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleGetAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.default.find({});
                return {
                    status: "success",
                    users
                };
            }
            catch (errors) {
                console.log(errors);
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
    handleDeleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDeleted = yield user_1.default.deleteOne({ _id: userId });
                if (userDeleted.deletedCount > 0) {
                    yield property_1.default.deleteMany({ "admin._id": userId });
                    return {
                        status: "success",
                        userDeleted
                    };
                }
                else {
                    return {
                        status: "fail",
                        messageEn: "User Not Found",
                        messageAr: "المستخدم ليس موجود"
                    };
                }
            }
            catch (errors) {
                console.log(errors);
                return {
                    status: "error",
                    errors
                };
            }
        });
    }
}
exports.default = UserService;
