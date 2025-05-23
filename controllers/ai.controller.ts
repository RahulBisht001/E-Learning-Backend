require("dotenv").config();

import { Request, Response, NextFunction } from "express";
import Groq from "groq-sdk";
import CourseModel from "../models/course.model";

export const chatWithAI = async (req: Request, res: Response) => {
	const groq = new Groq({
		apiKey: "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",
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

		const reply =
			chatCompletion.choices?.[0]?.message?.content || "No valid response.";
		res.status(200).json({ reply });
	} catch (error) {
		console.error("Groq Error:", error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

export const courseContext = async (req: Request, res: Response) => {
	try {
		const { courseId } = req.params;
		const course = await CourseModel.findById(courseId).select(
			"name description courseData"
		);

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
	} catch (error) {
		console.error("Failed to fetch course context:", error);
		return res.status(500).json({ error: "Server error" });
	}
};
