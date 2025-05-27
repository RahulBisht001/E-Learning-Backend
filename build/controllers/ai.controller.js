"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseContext = exports.chatWithAI = void 0;
require("dotenv").config();
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const course_model_1 = __importDefault(require("../models/course.model"));
const chatWithAI = async (req, res) => {
    const groq = new groq_sdk_1.default({
        apiKey: process.env.CODE_EZ,
    });
    const { messages } = req.body;
    try {
        const chatCompletion = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages,
            temperature: 0.8,
            max_completion_tokens: 1024,
            top_p: 1,
            stream: false,
        });
        const reply = chatCompletion.choices?.[0]?.message?.content || "No valid response.";
        res.status(200).json({ reply });
    }
    catch (error) {
        console.error("Groq Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};
exports.chatWithAI = chatWithAI;
const courseContext = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await course_model_1.default.findById(courseId).select("name description courseData");
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        const response = {
            title: course.name,
            description: course.description,
            chapters: course.courseData.map((item) => ({
                title: item.title,
                description: item.description,
            })),
        };
        console.log(response);
        return res.status(200).json(response);
    }
    catch (error) {
        console.error("Failed to fetch course context:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.courseContext = courseContext;
