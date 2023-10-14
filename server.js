const app = require("./src/app");

const   PORT = 3055;

//* connect with server 
const server = app.listen( PORT ,() => {
    console.log(`WsV eCommerce start with ${PORT} `)
})


process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Sever Express`))
})