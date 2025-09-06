import app from "./app.js";
import connectToDB from "./database/mongodb.js";
import { PORT } from "./config/env.js";

process.on('uncaughtException', (err) => {
    console.log("Uncaught Exceptioin: ", err)
})

const startServer = async() => {
    try {
        await connectToDB();
        app.listen(PORT, () => {
            console.log("Server is listening on PORT:", PORT);
        });
    } catch(error){
        console.error("Error starting server: ", error.message);
        process.exit(1);
    }
}

startServer();

process.on('unhandledRejection', (err) => {
    console.log("Unhandled Rejection : ", err);
    process.exit(1);
})