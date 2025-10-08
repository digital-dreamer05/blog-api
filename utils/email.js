const nodemailer = require('nodemailer');

class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `Bing Bang Blog 🤹 <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const subject = `🎉 Welcome to the Chaos, ${this.firstName}!`;
    const html = `
      <div style="font-family: Comic Sans MS, Arial, sans-serif; background-color: #fdf6e3; padding: 30px; border-radius: 10px; border: 2px dashed #ff9800; max-width: 600px; margin: auto;">
        <h2 style="color: #ff5722; text-align: center;">Hey ${this.firstName}! 🥳</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Welcome to <strong>Bing Bang Blog</strong> – the land where typos are forgiven, coffee is mandatory, and every post could be your next viral masterpiece. 🚀
        </p>
        <p style="font-size: 15px; color: #666; text-align: center;">
          Grab your keyboard, unleash your inner blogger, and let’s make the internet a weirder (and funnier) place together.  
        </p>
        <p style="font-size: 14px; color: #aaa; text-align: center;">
          💡 Pro tip: Write like nobody’s watching (because honestly, maybe no one is... yet).
        </p>
      </div>
    `;
    await this.send(subject, html);
  }
}

/**
 * Funky OTP Email
 */
const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Bing Bang Blog Security 🤖" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: '🔐 Your Secret Code (Don’t tell your cat!)',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #fff; padding: 30px; border-radius: 12px; border: 3px dotted #667eea; max-width: 600px; margin: auto;">
        <h2 style="color: #667eea; text-align: center;">Yo! Verification Time 🚨</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Before we let you unleash chaos on Bing Bang Blog, we need to make sure you’re not a robot (or worse, a boring person).  
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #667eea; color: white; padding: 15px 25px; font-size: 28px; border-radius: 10px; font-weight: bold; letter-spacing: 3px;">
            ${code}
          </span>
        </div>
        <p style="font-size: 15px; color: #666; text-align: center;">
          ⚡ Use this code within <strong>10 minutes</strong> or it will self-destruct (okay, not really, but it won’t work).
        </p>
        <p style="font-size: 14px; color: #aaa; text-align: center;">
          If you didn’t sign up, ignore this email… or forward it to someone who loves random codes.  
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  Email,
  sendVerificationEmail,
};
