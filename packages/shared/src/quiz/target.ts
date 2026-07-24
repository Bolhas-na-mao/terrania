import { z } from "zod";

export const quizTargetSchema = z.object({
  acceptedAnswers: z
    .array(z.string().trim().min(1, "Accepted answers cannot be empty"))
    .min(1, "Target needs at least one accepted answer"),
  id: z.string().trim().min(1, "Target id is required"),
  label: z.string().trim().min(1, "Target label is required"),
  map: z
    .object({
      featureId: z.string().trim().min(1, "Map feature id is required"),
    })
    .optional(),
});

export type QuizTarget = z.infer<typeof quizTargetSchema>;
