import { z } from "zod";

export const quizScopeKindSchema = z.enum([
  "world",
  "continent",
  "region",
  "country",
  "subdivision_group",
  "collection",
]);

export const quizScopeSchema = z.object({
  id: z.string().trim().min(1, "Scope id is required"),
  kind: quizScopeKindSchema,
  label: z.string().trim().min(1, "Scope label is required"),
});

export type QuizScopeKind = z.infer<typeof quizScopeKindSchema>;
export type QuizScope = z.infer<typeof quizScopeSchema>;
