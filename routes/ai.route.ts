import express from "express";
import { isAutheticated } from "../middleware/auth";
import { chatWithAI, courseContext } from "../controllers/ai.controller";

const aiRouter = express.Router();
// aiRouter.post("/ai/ask", isAutheticated, chatWithAI);
aiRouter.post("/ai/ask", chatWithAI);
// aiRouter.post("ai/context/:courseId", isAutheticated, courseContext);
aiRouter.get("/ai/context/:courseId", courseContext);

export default aiRouter;
