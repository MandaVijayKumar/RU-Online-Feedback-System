import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mandavijaykumar40@gmail.com',
    pass: 'Vijay@33'
  }
})
