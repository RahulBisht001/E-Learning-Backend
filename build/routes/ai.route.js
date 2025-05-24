"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_controller_1 = require("../controllers/ai.controller");
const aiRouter = express_1.default.Router();
// aiRouter.post("/ai/ask", isAutheticated, chatWithAI);
aiRouter.post("/ai/ask", ai_controller_1.chatWithAI);
// aiRouter.post("ai/context/:courseId", isAutheticated, courseContext);
aiRouter.get("/ai/context/:courseId", ai_controller_1.courseContext);
exports.default = aiRouter;
