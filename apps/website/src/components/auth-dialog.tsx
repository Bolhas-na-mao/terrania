import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";

import {
  authEmailSchema,
  type SignInFormValues,
  type SignInInput,
  type SignUpFormValues,
  type SignUpInput,
  signInSchema,
  signUpSchema,
} from "@terrania/shared";

import { authClient } from "../lib/auth-client.ts";
import { Button } from "./ui/button.tsx";
import { Checkbox } from "./ui/checkbox.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { PasswordInput } from "./ui/password-input.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.tsx";

type AuthDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

type SessionRefetch = () => Promise<void>;

const toFieldErrors = <T extends Record<string, unknown>>(
  issues: {
    message: string;
    path: PropertyKey[];
  }[],
) =>
  issues.reduce<Record<string, { message: string; type: string }>>((errors, issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === "string" && !(fieldName in errors)) {
      errors[fieldName] = {
        message: issue.message,
        type: "validate",
      };
    }

    return errors;
  }, {}) as FieldErrors<T>;

const validateWithSchema = async <TInput extends Record<string, unknown>>(
  values: TInput,
  schema: {
    safeParseAsync: (value: unknown) => Promise<
      | {
          data: unknown;
          success: true;
        }
      | {
          error: {
            issues: {
              message: string;
              path: PropertyKey[];
            }[];
          };
          success: false;
        }
    >;
  },
) => {
  const result = await schema.safeParseAsync(values);

  if (result.success) {
    return {
      errors: {},
      values,
    };
  }

  return {
    errors: toFieldErrors<TInput>(
      (result as { error: { issues: { message: string; path: PropertyKey[] }[] } }).error.issues,
    ),
    values: {},
  };
};

const getAuthErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive">{message}</p> : null;

const rememberMeLabel = "Keep me signed in on this device";

const SignInForm = ({ onSuccess }: { onSuccess: SessionRefetch }) => {
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    resolver: (values) => validateWithSchema(values, signInSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const payload: SignInInput = {
      email: authEmailSchema.parse(values.email),
      password: values.password,
      rememberMe: values.rememberMe,
    };
    const result = await authClient.signIn.email(payload);

    if (result.error) {
      setFormError(getAuthErrorMessage(result.error));
      return;
    }

    form.reset({
      email: "",
      password: "",
      rememberMe: values.rememberMe,
    });
    await onSuccess();
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="sign-in-email">Email</Label>
        <Input
          autoComplete="email"
          id="sign-in-email"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        <FieldError message={form.formState.errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sign-in-password">Password</Label>
        <PasswordInput
          autoComplete="current-password"
          id="sign-in-password"
          placeholder="Enter your password"
          {...form.register("password")}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={form.watch("rememberMe")}
          id="sign-in-remember-me"
          onCheckedChange={(checked) => {
            form.setValue("rememberMe", checked === true, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
        />
        <Label htmlFor="sign-in-remember-me">{rememberMeLabel}</Label>
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 size-4 animate-spin" />
            Signing in
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};

const SignUpForm = ({ onSuccess }: { onSuccess: SessionRefetch }) => {
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<SignUpFormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
      rememberMe: true,
    },
    resolver: (values) => validateWithSchema(values, signUpSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const payload: SignUpInput = {
      email: authEmailSchema.parse(values.email),
      name: values.name,
      password: values.password,
      rememberMe: values.rememberMe,
    };
    const result = await authClient.signUp.email(payload);

    if (result.error) {
      setFormError(getAuthErrorMessage(result.error));
      return;
    }

    form.reset({
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
      rememberMe: values.rememberMe,
    });
    await onSuccess();
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="sign-up-name">Name</Label>
        <Input
          autoComplete="name"
          id="sign-up-name"
          placeholder="Your name"
          {...form.register("name")}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sign-up-email">Email</Label>
        <Input
          autoComplete="email"
          id="sign-up-email"
          placeholder="you@example.com"
          type="email"
          {...form.register("email")}
        />
        <FieldError message={form.formState.errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sign-up-password">Password</Label>
        <PasswordInput
          autoComplete="new-password"
          id="sign-up-password"
          placeholder="Create a password"
          {...form.register("password")}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sign-up-password-confirmation">Confirm password</Label>
        <PasswordInput
          autoComplete="new-password"
          id="sign-up-password-confirmation"
          placeholder="Confirm your password"
          {...form.register("passwordConfirmation")}
        />
        <FieldError message={form.formState.errors.passwordConfirmation?.message} />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={form.watch("rememberMe")}
          id="sign-up-remember-me"
          onCheckedChange={(checked) => {
            form.setValue("rememberMe", checked === true, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
        />
        <Label htmlFor="sign-up-remember-me">{rememberMeLabel}</Label>
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 size-4 animate-spin" />
            Creating account
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
};

export const AuthDialog = ({ onOpenChange, open }: AuthDialogProps) => {
  const session = authClient.useSession();

  useEffect(() => {
    void open;
  }, [open]);

  const handleSuccess = async () => {
    await session.refetch();
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>Sign in or create an account.</DialogDescription>
        </DialogHeader>

        <Tabs className="w-full" defaultValue="sign-in">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign in</TabsTrigger>
            <TabsTrigger value="sign-up">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in">
            <SignInForm onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="sign-up">
            <SignUpForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
