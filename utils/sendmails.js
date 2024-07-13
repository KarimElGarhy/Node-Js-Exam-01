import nodemailer from "nodemailer"

export const sendMail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "karimelgarhy864@gmail.com",
      pass: "fbzatdzilxzrzimt",
    },
  })

  const info = await transporter.sendMail({
    from: 'Kareem " <karimelgarhy864@gmail.com>',
    to: email,
    subject: subject,
    html: html,
  })
}
