import { z } from "zod";

export const APP_NAME = "Terrania";

export const AUTH_PASSWORD_MIN_LENGTH = 8;
export const AUTH_PASSWORD_MAX_LENGTH = 72;
export const AUTH_NAME_MAX_LENGTH = 60;

export const authEmailSchema = z.email("Enter a valid email address").trim().toLowerCase();

export const authPasswordSchema = z
  .string()
  .min(
    AUTH_PASSWORD_MIN_LENGTH,
    `Password must have at least ${AUTH_PASSWORD_MIN_LENGTH} characters`,
  )
  .max(
    AUTH_PASSWORD_MAX_LENGTH,
    `Password must have at most ${AUTH_PASSWORD_MAX_LENGTH} characters`,
  );

export const authNameSchema = z
  .string()
  .trim()
  .min(2, "Name must have at least 2 characters")
  .max(AUTH_NAME_MAX_LENGTH, `Name must have at most ${AUTH_NAME_MAX_LENGTH} characters`);

export const signInSchema = z.object({
  email: authEmailSchema,
  password: authPasswordSchema,
  rememberMe: z.boolean().default(true),
});

export const signUpSchema = z.object({
  email: authEmailSchema,
  name: authNameSchema,
  password: authPasswordSchema,
  rememberMe: z.boolean().default(true),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignInFormValues = z.input<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignUpFormValues = z.input<typeof signUpSchema>;

export type ApiHealthResponse = {
  appName: string;
  status: "ok";
  timestamp: string;
};
