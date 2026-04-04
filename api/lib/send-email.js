import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});


export const sendEmail = async (to , htmlContent , textContent , subject)=>{
    try {
        await transporter.sendMail({
            from: `"CodifyDev" <noreply@ourouimed.dev>`,
            to, 
            subject: subject,
            html: htmlContent,
            text: textContent
        });
    } catch (error) {
        throw new Error(`Email failed: ${error.message}`);
    }
}



export const sendVerificationEmail = async (to, otp) => {
    const otpPageUrl = `${process.env.ALLOW_CORS_URL}/otp?email=${to}&code=${otp}`;

    const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 500px; margin: auto; color: #333;">
            <h2 style="color: #1a73e8; text-align: center;">Verify Your Email</h2>
            <p style="font-size: 16px; line-height: 1.5;">Welcome to <strong>CodifyDev</strong>! Use the verification code below to complete your registration:</p>
            
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
                If you did not sign up for CodifyDev, please ignore this email.
            </p>
        </div>
    `;

    const textContent = `
        Welcome to CodifyDev!
        Your verification code is: ${otp}
        Enter it at: ${otpPageUrl}
        If you did not sign up, please ignore this email.
    `;


    await sendEmail(to , htmlContent , textContent , `${otp} is your verification code`)
    
};
export const sendWelcomeEmail = async (to, name, provider) => {
    const providerMessage = provider 
        ? `You signed up using <strong>${provider}</strong> login.`
        : `You signed up using your email and password.`;

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 500px; margin: auto; color: #333;">
        <h2 style="color: #1a73e8; text-align: center;">Welcome to CodifyDev, ${name}!</h2>
        <p style="font-size: 16px; line-height: 1.5;">
            Hi ${name}, your account has been successfully verified. ${providerMessage}
        </p>
        <p style="font-size: 16px; line-height: 1.5; text-align: center; margin-top: 20px;">
            You can now log in and start exploring all the features we offer.
        </p>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/login"
               style="display: inline-block; padding: 12px 25px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;"
               target="_blank"
            >
                Go to Login
            </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 0.8em; color: #888; text-align: center;">
            If you did not create this account, please contact our support immediately.
        </p>
    </div>
    `;

    const textContent = `
        Hi ${name}, your account has been successfully verified.
        ${provider ? `You signed up using ${provider} login.` : `You signed up using email and password.`}
        Log in at: ${process.env.FRONTEND_URL}/login
        If this wasn't you, contact support immediately.
    `;

    await sendEmail(to, htmlContent, textContent, `Welcome to CodifyDev, ${name}!`);
};

export const sendPasswordResetEmail = async (to, resetToken) => {
    const resetUrl = `${process.env.ALLOW_CORS_URL}/reset-password?token=${resetToken}&email=${to}`;

    const htmlContent = `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 500px; margin: auto; color: #333;">
            <h2 style="color: #1a73e8; text-align: center;">Reset Your Password</h2>
            <p style="font-size: 16px; line-height: 1.5;">
                You requested a password reset. Click the button below to set a new password. This link is valid for 10 minutes.
            </p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 12px 25px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;"
                   target="_blank"
                >
                    Reset Password
                </a>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 0.8em; color: #888; text-align: center;">
                If you did not request a password reset, you can safely ignore this email.
            </p>
        </div>
    `;

    const textContent = `
        Reset your password at: ${resetUrl}
        If you did not request this, ignore this email.
    `;

    await sendEmail(to, htmlContent, textContent, "Reset your CodifyDev password");
};


export const sendPasswordChangedConfirmationEmail = async (to) => {
    const htmlContent = `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 500px; margin: auto; color: #333;">
            <h2 style="color: #1a73e8; text-align: center;">Password Changed Successfully</h2>
            <p style="font-size: 16px; line-height: 1.5;">
                Your password has been updated successfully. If you did not perform this action, please contact our support immediately.
            </p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.ALLOW_CORS_URL}/login" 
                   style="display: inline-block; padding: 12px 25px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;"
                   target="_blank"
                >
                    Go to Login
                </a>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 0.8em; color: #888; text-align: center;">
                Stay safe! If this wasn't you, reset your password immediately.
            </p>
        </div>
    `;

    const textContent = `
        Your password has been changed successfully.
        Log in at: ${process.env.ALLOW_CORS_URL}/login
        If this wasn't you, reset your password immediately.
    `;

    await sendEmail(to, htmlContent, textContent, "Your CodifyDev password has been changed");
};


export const sendEmailVerifiedConfirmation = async (to, name) => {
    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 500px; margin: auto; color: #333;">
        <h2 style="color: #1a73e8; text-align: center;">Email Verified Successfully!</h2>
        <p style="font-size: 16px; line-height: 1.5;">
            Hi ${name},  Welcome to <strong>CodifyDev</strong>! 🎉
        </p>
        <p style="font-size: 16px; line-height: 1.5; text-align: center; margin-top: 20px;">
            You can now log in and start exploring all the features we offer.
        </p>

        <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.ALLOW_CORS_URL}/login"
               style="display: inline-block; padding: 12px 25px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;"
               target="_blank"
            >
                Go to Login
            </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 0.8em; color: #888; text-align: center;">
            If you did not perform this action, please contact our support immediately.
        </p>
    </div>
    `;

    const textContent = `
        Hi ${name}, welcome to CodifyDev. 
        You can now log in at: ${process.env.ALLOW_CORS_URL}/login
        If this wasn't you, contact support immediately.
    `;

    await sendEmail(to, htmlContent, textContent, "Your CodifyDev Email is Verified!");
};