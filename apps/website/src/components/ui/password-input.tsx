import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button.tsx";
import { Input } from "./input.tsx";

type PasswordInputProps = React.ComponentProps<typeof Input>;

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        className={cn("pr-9", className)}
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <Button
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => {
          setShowPassword((current) => !current);
        }}
        pressEffect={false}
        size="icon-sm"
        tabIndex={-1}
        type="button"
        variant="ghost"
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}

export { PasswordInput };
