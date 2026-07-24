import { z } from "zod";

export const quizAnswerModeSchema = z.enum(["pin", "type", "multiple_choice"]);

export type QuizAnswerMode = z.infer<typeof quizAnswerModeSchema>;
