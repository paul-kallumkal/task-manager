const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const welcome = (email,name) => {
    sgMail.send({
        to: email,
        from: 'pomsux@gmail.com',
        subject: 'Thank you for registering',
        text: 'Hi ' + name + '. Welcome to my task manager API. Any feedback is appreciated'
    })
}

const bye = (email,name) => {
    sgMail.send({
        to: email,
        from: 'pomsux@gmail.com',
        subject: 'Sorry to see you leave',
        text: 'Hi ' + name + ". We're sorry to see you go. Please let us know how was your experience and if there's anything we could have done to make it better"
    })
}

module.exports = {
    welcome,
    bye
} 