require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from "express-rate-limit";
import aiRouter from "./routes/ai.route";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
app.use(
	cors({
		origin: [
			"https://e-learning-frontend-flax.vercel.app",
			"http://localhost:3000",
		],
		methods: ["GET", "POST", "PUT", "DELETE"], // Add any methods you need
		allowedHeaders: ["Content-Type", "Authorization"], // Add headers if required
		credentials: true,
	})
);

// api requests limit
const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 50,
	standardHeaders: "draft-7",
	legacyHeaders: false,
});

// routes
app.use(
	"/api/v1",
	userRouter,
	orderRouter,
	courseRouter,
	notificationRouter,
	analyticsRouter,
	layoutRouter,
	aiRouter
);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		succcess: true,
		message: "API is working",
	});
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});

// middleware calls
app.use(limiter);
app.use(ErrorMiddleware);
