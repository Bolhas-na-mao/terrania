import { z } from "zod";

export const quizTimerRulesSchema = z
  .object({
    mode: z.enum(["elapsed", "countdown"]),
    seconds: z.number().int().positive("Countdown timer seconds must be positive").optional(),
  })
  .check((context) => {
    const timer = context.value;

    if (timer.mode === "countdown" && timer.seconds === undefined) {
      context.issues.push({
        code: "custom",
        input: timer.seconds,
        message: "Countdown timer needs seconds",
        path: ["seconds"],
      });
    }

    if (timer.mode === "elapsed" && timer.seconds !== undefined) {
      context.issues.push({
        code: "custom",
        input: timer.seconds,
        message: "Elapsed timer does not use seconds",
        path: ["seconds"],
      });
    }
  });

export const quizAttemptsRulesSchema = z.object({
  maxPerTarget: z.number().int().positive("Attempt limit must be positive").optional(),
});

export const quizScoringRulesSchema = z.object({
  mode: z.literal("basic"),
  penaltyPerIncorrect: z.number().min(0, "Incorrect penalty cannot be negative"),
  pointsPerCorrect: z.number().positive("Correct answer points must be positive"),
});

export const quizFeedbackRulesSchema = z.object({
  afterAnswer: z.literal("immediate"),
  revealCorrectAnswer: z.boolean(),
});

export const quizRulesSchema = z.object({
  attempts: quizAttemptsRulesSchema,
  feedback: quizFeedbackRulesSchema,
  ordering: z.enum(["fixed", "random"]),
  scoring: quizScoringRulesSchema,
  timer: quizTimerRulesSchema,
});

export type QuizTimerRules = z.infer<typeof quizTimerRulesSchema>;
export type QuizAttemptsRules = z.infer<typeof quizAttemptsRulesSchema>;
export type QuizScoringRules = z.infer<typeof quizScoringRulesSchema>;
export type QuizFeedbackRules = z.infer<typeof quizFeedbackRulesSchema>;
export type QuizRules = z.infer<typeof quizRulesSchema>;
