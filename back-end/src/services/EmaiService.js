const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()
const sendEmailCreateOrder = async (email, orderItems) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    let listItem = ''
    orderItems.forEach((order) => {
        listItem += `<div>
        <div>Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là : <b>${order.price} VND</b></div>  
        <div><img src="${order.image}" alt="sản phẩm"/></div>
        </div>`
    })

    // Wrap in an async IIFE so we can use await.
    const info = await transporter.sendMail({
        from: `"MIHOO E-COMMERCE" " <${process.env.EMAIL_USER}>`,
        to: "nvdong0902@gmail.com",
        subject: "Bạn đã đặt hàng tại MIHOO E-COMMERCE",
        text: "Hello world?", // plain‑text body
        html: `<div><b>Bạn đã đặt hàng thành công tại MIHOO E-COMMERCE</b></div> ${listItem}`, // HTML body
    });
}

module.exports = {
    sendEmailCreateOrder
}