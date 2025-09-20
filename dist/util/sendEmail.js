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
exports.sendEmailChange = sendEmailChange;
exports.sendEmailCode = sendEmailCode;
exports.sendEmailCreatedProperty = sendEmailCreatedProperty;
exports.sendEmailActivatedProperty = sendEmailActivatedProperty;
exports.sendEmailDeactivatedProperty = sendEmailDeactivatedProperty;
exports.sendEmailManagerDeletedProperty = sendEmailManagerDeletedProperty;
exports.sendReservationEmailForUser = sendReservationEmailForUser;
exports.sendEmailReservationCancelled = sendEmailReservationCancelled;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmailChange(userFounded, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTHEMAIL,
                pass: process.env.AUTHPASS,
            },
        });
        let emailContent;
        if (type === "password") {
            let resetLink = `${process.env.FRONTEND_BASEUSER}/resetPassword?email=${userFounded.email}`;
            emailContent = {
                from: `"Support Team" <${process.env.AUTHEMAIL}>`,
                to: userFounded.email,
                subject: "Reset Your Password",
                text: `Hello, click the link below to reset your password`,
                html: `<html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .email-container {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    background: #ffffff;
                                    padding: 20px;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                    text-align: center;
                                }
                                h2 {
                                    color: #333;
                                }
                                p {
                                    font-size: 16px;
                                    color: #555;
                                }
                                .reset-button {
                                    display: inline-block;
                                    margin-top: 15px;
                                    padding: 12px 25px;
                                    font-size: 18px;
                                    color: #ffffff;
                                    background: #007bff;
                                    text-decoration: none;
                                    border-radius: 5px;
                                    font-weight: bold;
                                }
                                .reset-button:hover {
                                    background: #0056b3;
                                }
                                .footer {
                                    margin-top: 20px;
                                    font-size: 14px;
                                    color: #888;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <h2>Reset Your Password</h2>
                                <p>Hello,</p>
                                <p>Click the button below to reset your password:</p>
                                <a href=${resetLink} class="reset-button">Reset Password</a>
                                <p>If you didn't request this, please ignore this email.</p>
                                <p class="footer">This is an automated message, please do not reply.</p>
                            </div>
                        </body>
                        </html>
                        `,
            };
        }
        if (type === "question") {
            console.log("cccccccccccccccccc");
            const data = userFounded;
            emailContent = {
                from: `"Question From" <${data.email}>`,
                to: process.env.AUTHEMAIL,
                subject: "New Question from Contact Form",
                text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nMessage: ${data.message}`,
                html: `
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Question Submitted</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Message:</strong> ${data.message}</p>
            </body>
        </html>
        `,
            };
        }
        if (emailContent) {
            const res = yield transporter.sendMail(emailContent);
        }
    });
}
function sendEmailCode(code, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTHEMAIL,
                pass: process.env.AUTHPASS,
            },
        });
        let emailContent;
        emailContent = {
            from: `"Support Team" <${process.env.AUTHEMAIL}>`,
            to: userEmail,
            subject: "OTP Code",
            text: `Hello, click the link below to get your OTP Code`,
            html: `<html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }

                    .email-container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 30px 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }

                    h2 {
                        color: #333;
                    }

                    p {
                        font-size: 16px;
                        color: #555;
                    }

                    .otp-code {
                        display: inline-block;
                        margin: 20px 0;
                        padding: 15px 25px;
                        font-size: 28px;
                        font-weight: bold;
                        color: #ffffff;
                        background: #007bff;
                        border-radius: 8px;
                        letter-spacing: 5px;
                    }

                    .footer {
                        margin-top: 25px;
                        font-size: 14px;
                        color: #888;
                    }

                    @media (max-width: 480px) {
                        .otp-code {
                            font-size: 22px;
                            padding: 12px 20px;
                            letter-spacing: 4px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h2>Your OTP Code</h2>
                    <p>Use the following OTP to complete your action. It expires in 10 minutes.</p>
                    <div class="otp-code">${code}</div>
                    <p>If you did not request this code, please ignore this email.</p>
                    <p class="footer">This is an automated message, please do not reply.</p>
                </div>
            </body>
            </html>
            `
        };
        if (emailContent) {
            const res = yield transporter.sendMail(emailContent);
            console.log(res);
        }
    });
}
function sendEmailCreatedProperty(propertyName, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTHEMAIL,
                pass: process.env.AUTHPASS,
            },
        });
        let emailContent;
        emailContent = {
            from: `"Support Team" <${process.env.AUTHEMAIL}>`,
            to: userEmail,
            subject: "Property Successfully Created",
            text: `Hello, your property "${propertyName.split(" ").slice(0, 3).join(" ")}" has been created successfully. You can add more properties without waiting for confirmation.`,
            html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 30px auto;
                        background: #ffffff;
                        padding: 40px 30px;
                        border-radius: 12px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                        text-align: center;
                    }
                    h2 {
                        color: #222;
                        margin-bottom: 10px;
                    }
                    p {
                        font-size: 16px;
                        color: #555;
                        margin: 10px 0;
                    }
                    .highlight {
                        font-weight: bold;
                        color: #007bff;
                    }
                    .footer {
                        margin-top: 25px;
                        font-size: 14px;
                        color: #888;
                    }
                    .button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 30px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #ffffff;
                        background-color: #28a745;
                        text-decoration: none;
                        border-radius: 6px;
                    }
                    .button:hover {
                        background-color: #218838;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h2>Property Created Successfully!</h2>
                    <p>Hello,</p>
                    <p>Your property <span class="highlight">${propertyName}</span> has been created successfully.</p>
                    <p>You can add more properties anytime without waiting for confirmation.</p>
                    <a href="https://yourwebsite.com/add-property" class="button">Add Another Property</a>
                    <p class="footer">This is an automated message, please do not reply.</p>
                </div>
            </body>
            </html>
            `
        };
        if (emailContent) {
            const res = yield transporter.sendMail(emailContent);
            console.log(res);
        }
    });
}
function sendEmailActivatedProperty(propertyName, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create transporter
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTHEMAIL,
                pass: process.env.AUTHPASS,
            },
        });
        let resetLink = `${process.env.FRONTEND_BASEUSER}/dashboard`;
        // Email content
        const emailContent = {
            from: `"Support Team" <${process.env.AUTHEMAIL}>`,
            to: userEmail,
            subject: "Property Activated",
            text: `Hello, your property "${propertyName.split(" ").slice(0, 3).join(" ")}" has been activated and is now live.`,
            html: `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    padding: 40px 30px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h2 {
                    color: #222;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    color: #555;
                    margin: 10px 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #28a745;
                }
                .footer {
                    margin-top: 25px;
                    font-size: 14px;
                    color: #888;
                }
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 30px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    background-color: #28a745;
                    text-decoration: none;
                    border-radius: 6px;
                }
                .button:hover {
                    background-color: #218838;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>Property Activated</h2>
                <p>Hello,</p>
                <p>Your property <span class="highlight">${propertyName}</span> has been activated and is now live.</p>
                <p>You can share it with potential guests and start receiving bookings.</p>
                <a href='${resetLink} class="button">Manage Property</a>
                <p class="footer">This is an automated message, please do not reply.</p>
            </div>
        </body>
        </html>
        `
        };
        if (emailContent) {
            const res = yield transporter.sendMail(emailContent);
            console.log(res);
        }
    });
}
function sendEmailDeactivatedProperty(propertyName, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create transporter
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTHEMAIL,
                pass: process.env.AUTHPASS,
            },
        });
        // Email content
        const emailContent = {
            from: `"Support Team" <${process.env.AUTHEMAIL}>`,
            to: userEmail,
            subject: "Property Deactivated",
            text: `Hello, your property "${propertyName.split(" ").slice(0, 3).join(" ")}" has been deactivated by the host.`,
            html: `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    padding: 40px 30px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h2 {
                    color: #222;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    color: #555;
                    margin: 10px 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #ffc107;
                }
                .footer {
                    margin-top: 25px;
                    font-size: 14px;
                    color: #888;
                }
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 30px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    background-color: #ffc107;
                    text-decoration: none;
                    border-radius: 6px;
                }
                .button:hover {
                    background-color: #e0a800;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>Property Deactivated</h2>
                <p>Hello,</p>
                <p>Your property <span class="highlight">${propertyName}</span> has been deactivated by the host.</p>
                <p>If this was unexpected, you can contact support for more information.</p>
            </div>
        </body>
        </html>
        `
        };
        if (emailContent) {
            const res = yield transporter.sendMail(emailContent);
            console.log(res);
        }
    });
}
function sendEmailManagerDeletedProperty(propertyName, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTHEMAIL,
                pass: process.env.AUTHPASS,
            },
        });
        const emailContent = {
            from: `"Support Team" <${process.env.AUTHEMAIL}>`,
            to: userEmail,
            subject: "Property Removed by Manager",
            text: `Hello, your property "${propertyName.split(" ").slice(0, 3).join(" ")}" has been removed by the manager.`,
            html: `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    padding: 40px 30px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h2 {
                    color: #222;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    color: #555;
                    margin: 10px 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #dc3545;
                }
                .footer {
                    margin-top: 25px;
                    font-size: 14px;
                    color: #888;
                }
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 30px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    background-color: #dc3545;
                    text-decoration: none;
                    border-radius: 6px;
                }
                .button:hover {
                    background-color: #c82333;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>Property Removed</h2>
                <p>Hello,</p>
                <p>Your property <span class="highlight">${propertyName}</span> has been removed by the manager.</p>
                <p>If you think this was a mistake or want more details, please contact support.</p>
            </div>
        </body>
        </html>
        `
        };
        if (emailContent) {
            const res = yield transporter.sendMail(emailContent);
            console.log(res);
        }
    });
}
function sendReservationEmailForUser(propertyName, userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        let trannsport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTHEMAIL,
                pass: process.env.AUTHPASS,
            },
        });
        let resetLink = `${process.env.FRONTEND_BASEUSER}/setting/#listing`;
        let emailContenet = {
            from: `"Support Team" <${process.env.AUTHEMAIL}>`,
            to: userEmail,
            subject: "Reservation Confirmed – DAMA INN",
            text: `Hello, your reservation for "${propertyName.split(" ").slice(0, 3).join(" ")}" has been confirmed successfully. We look forward to welcoming you soon.`,
            html: `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    padding: 40px 30px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h2 {
                    color: #222;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    color: #555;
                    margin: 10px 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #007bff;
                }
                .footer {
                    margin-top: 25px;
                    font-size: 14px;
                    color: #888;
                }
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 30px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    background-color: #28a745;
                    text-decoration: none;
                    border-radius: 6px;
                }
                .button:hover {
                    background-color: #218838;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>Reservation Confirmed!</h2>
                <p>Hello,</p>
                <p>Your reservation at <span class="highlight">${propertyName}</span> has been confirmed successfully.</p>
                <p>We look forward to welcoming you soon. Please remember, payment will be made upon arrival.</p>
                <a href=${resetLink} class="button">View My Reservations</a>
                <p class="footer">This is an automated message, please do not reply.</p>
            </div>
        </body>
        </html>
        `
        };
        if (emailContenet) {
            let res = yield trannsport.sendMail(emailContenet);
            console.log(res);
        }
    });
}
function sendEmailReservationCancelled(propertyName, userEmail, reservationDate) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create transporter
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTHEMAIL,
                pass: process.env.AUTHPASS,
            },
        });
        // Email content
        const emailContent = {
            from: `"Support Team" <${process.env.AUTHEMAIL}>`,
            to: userEmail,
            subject: "Reservation Cancelled",
            text: `Hello, your reservation for "${propertyName.split(" ").slice(0, 3).join(" ")}" on ${reservationDate} has been cancelled successfully.`,
            html: `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    padding: 40px 30px;
                    border-radius: 12px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h2 {
                    color: #222;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    color: #555;
                    margin: 10px 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #dc3545;
                }
                .footer {
                    margin-top: 25px;
                    font-size: 14px;
                    color: #888;
                }
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 30px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    background-color: #dc3545;
                    text-decoration: none;
                    border-radius: 6px;
                }
                .button:hover {
                    background-color: #c82333;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>Reservation Cancelled</h2>
                <p>Hello,</p>
                <p>Your reservation for <span class="highlight">${propertyName}</span> on <span class="highlight">${reservationDate}</span> has been cancelled successfully.</p>
                <p>You can make a new reservation anytime.</p>
            </div>
        </body>
        </html>
        `
        };
        if (emailContent) {
            const res = yield transporter.sendMail(emailContent);
            console.log(res);
        }
    });
}
