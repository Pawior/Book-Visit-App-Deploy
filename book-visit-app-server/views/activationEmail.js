const activationEmail = (token, email) => {
    return `
 <div style="background-color: royalblue; padding: 15px; border-radius: 5px;">
     <h3 style="color: white;">Hi! We are Book Visit App team</h3>
     <p style="color: white">We are sending your account activation link: </p>
     <button style="border: 1px solid darkblue; background-color: white; height: 40px; width: 100px; border-radius: 5px">
         <a style="text-decoration: none; color: black; font-weight: bold;"
         href="${process.env.NODE_SERVER_IP}/active?token=${token}&email=${email}">
         Your activation link
         </a>
     </button>
 </div>`
}

module.exports = activationEmail;