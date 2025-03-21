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
const documentRoute = require("./routes/document");
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

// Configure CORS for production or development
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:8081",
    "https://etutor-enterprise.expo.app",
    // Add any other origins you need here
];

app.use(cors({ 
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS: ", origin);
            callback(null, true); // Temporarily allow all origins while testing
        }
    },
    credentials: true 
}));

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
app.use("/v1/document", documentRoute);

// Server port configuration
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});