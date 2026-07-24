import { z } from "zod";

export const quizFormatSchema = z.enum(["map", "flag", "image", "shape"]);

export type QuizFormat = z.infer<typeof quizFormatSchema>;
