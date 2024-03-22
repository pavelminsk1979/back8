import nodemailer from 'nodemailer'


export const emailAdapter = {
    async sendEmail(email: string, confirmationCode: string) {
        let transport =  nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pavvel.potapov@gmail.com',
                pass: 'cfas asrj bell izdi'
            }
        });

        const letter = `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>`

        let info = await transport.sendMail({
            from: 'Pavel',
            to: email,
            subject: 'ПОДТВЕРЖДЕНИЕ регистации',
            html: letter,
        })


        return !!info
    }
}