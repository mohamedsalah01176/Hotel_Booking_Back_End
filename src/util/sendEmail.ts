import nodemailer from "nodemailer";
import { ISendQuestion } from "../interface/question";



export async function sendEmail(userFounded:{email:string},type:string){
    let transporter =nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.AUTHEMAIL,
        pass: process.env.AUTHPASS,
    },
    secure: true,
    port: 465,
    })
    let emailContent;
    if(type=== "password"){
        let resetLink=`http://localhost:5173/resetPassword?email=${userFounded.email}`;
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
    if(type === "question"){
        const data=userFounded as ISendQuestion
        emailContent = {
        from: `"Support Team" <${process.env.AUTHEMAIL}>`,
        to: data.email,
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
    if(emailContent){
        await transporter.sendMail(emailContent);
    }
}
