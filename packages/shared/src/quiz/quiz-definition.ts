import { z } from "zod";

import { quizAnswerModeSchema } from "./answer-mode.ts";
import { quizFormatSchema } from "./format.ts";
import { quizRulesSchema } from "./rules.ts";
import { quizScopeSchema } from "./scope.ts";
import { quizTargetSchema } from "./target.ts";

const subjectSchema = z.string().trim().min(1, "Quiz subject is required");

const promptSchema = z.object({
  template: z.string().trim().min(1, "Prompt template is required"),
});

export const quizDefinitionSchema = z
  .object({
    answerMode: quizAnswerModeSchema,
    description: z.string().trim().min(1, "Quiz description is required"),
    format: quizFormatSchema,
    id: z.string().trim().min(1, "Quiz id is required"),
    prompt: promptSchema,
    rules: quizRulesSchema,
    scope: quizScopeSchema,
    subject: subjectSchema,
    targets: z.array(quizTargetSchema).min(1, "Quiz needs at least one target"),
    title: z.string().trim().min(1, "Quiz title is required"),
  })
  .check((context) => {
    const quiz = context.value;
    const targetIds = new Set<string>();

    for (const [index, target] of quiz.targets.entries()) {
      if (targetIds.has(target.id)) {
        context.issues.push({
          code: "custom",
          input: target.id,
          message: `Duplicate target id: ${target.id}`,
          path: ["targets", index, "id"],
        });
      }

      targetIds.add(target.id);

      if (quiz.format === "map" && quiz.answerMode === "pin" && !target.map?.featureId) {
        context.issues.push({
          code: "custom",
          input: target.map,
          message: "Map pin targets need a map feature id",
          path: ["targets", index, "map", "featureId"],
        });
      }
    }
  });

export type QuizDefinition = z.infer<typeof quizDefinitionSchema>;

export const parseQuizDefinition = (value: unknown) => quizDefinitionSchema.parse(value);
