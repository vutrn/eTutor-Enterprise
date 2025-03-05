const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const classRoute = require("./routes/personalclass");
const messageRoute = require("./routes/message");
const blogRoute = require("./routes/blog");
const meetingRoute = require("./routes/meeting");
const dashboardRoute = require("./routes/dashboard");

dotenv.config();
const app = express();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connect Success");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
connectDB();

app.use(cors({ origin: "http://localhost:8081", credentials: true }));
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/class", classRoute);
app.use("/v1/message", messageRoute);
app.use("/v1/blog", blogRoute);
app.use("/v1/meeting", meetingRoute);
app.use("/v1/dashboard", dashboardRoute);

app.listen(8000, () => {
    console.log("Server Running on port 8000");
});

//Authentication
//Authorization