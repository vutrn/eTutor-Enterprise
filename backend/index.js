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
const onlmeetingRoute = require("./routes/onlmeeting");
const bodyParser = require("body-parser");
const { server, app } = require("./lib/socket");

dotenv.config();

const PORT = process.env.PORT || 8000;

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

const frontendOrigin = process.env.NODE_ENV === 'development' 
    ? "http://localhost:8081" 
    : (process.env.FRONTEND_URL || "https://etutor.expo.app");

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (process.env.NODE_ENV === 'development' || frontendOrigin.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cookieParser());
app.use(express.json());

//Routes
// app.use("/", (req,res) => {
//     res.send("Welcome to the backend API");
// })
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/class", classRoute);
app.use("/v1/message", messageRoute);
app.use("/v1/blog", blogRoute);
app.use("/v1/meeting", meetingRoute);
app.use("/v1/dashboard", dashboardRoute);
app.use("/v1/document", documentRoute);
app.use("/v1/onlmeeting", onlmeetingRoute);

server.listen(PORT, () => {
    console.log(`Server Running on port http://localhost:${PORT}`);
});

//Authentication
//Authorization