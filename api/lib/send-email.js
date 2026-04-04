import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});


export const sendVerificationEmail = async (to, otp) => {
    const otpPageUrl = `${process.env.ALLOW_CORS_URL}/otp?email=${to}&code=${otp}`;

    const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 500px; margin: auto; color: #333;">
            <h2 style="color: #1a73e8; text-align: center;">Verify Your Email</h2>
            <p style="font-size: 16px; line-height: 1.5;">Welcome to <strong>Yalla Fantasy</strong>! Use the verification code below to complete your registration:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f4f7ff; border: 1px dashed #1a73e8; color: #1a73e8; border-radius: 8px;">
                    ${otp}
                </span>
            </div>

            <p style="font-size: 14px; color: #555; text-align: center;">
                This code is valid for 10 minutes. Click the button below to enter your code:
            </p>

            <div style="text-align: center; margin-top: 20px;">
                <a href="${otpPageUrl}" 
                   style="display: inline-block; padding: 12px 25px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;"
                   target="_blank"
                >
                    Enter Verification Code
                </a>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 0.8em; color: #888; text-align: center;">
                If you did not sign up for Yalla Fantasy, please ignore this email.
            </p>
        </div>
    `;

    const textContent = `
        Welcome to Yalla Fantasy!
        Your verification code is: ${otp}
        Enter it at: ${otpPageUrl}
        If you did not sign up, please ignore this email.
    `;

    try {
        await transporter.sendMail({
            from: `"CodifyDev" <noreply@ourouimed.dev>`,
            to, 
            subject: `${otp} is your verification code`,
            html: htmlContent,
            text: textContent
        });
    } catch (error) {
        throw new Error(`Email failed: ${error.message}`);
    }
};