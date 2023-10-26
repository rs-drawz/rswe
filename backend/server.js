const app = require('./app');
const path = require('path');
const connectDatabase = require('./config/database');


connectDatabase();
const server = app.listen(process.env.PORT, () => {
    console.log(`the server is listening at ${process.env.PORT} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`error occured:${err.message}`);
    console.log("Shutting down the server due to unhandledrejection");
    server.close(() => {
        process.exit(1);
    })
})
process.on('uncaughtException', (err) => {
    console.log(`error occured:${err.message}`);
    console.log("Shutting down the server due to uncaughtException");
    server.close(() => {
        process.exit(1);
    })
})
// console.log(b);