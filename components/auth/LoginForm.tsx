"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/zod-schemas/auth";
import { useLoginMutation } from "@/hooks/mutations/useLoginMutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Loader2Icon } from "lucide-react";
import SeparatorWithText from "@/components/ui/separator-with-text";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { authService } from "@/services/auth.service";
import Link from "next/link";

export function LoginForm() {
  const { mutate: login, isPending } = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <Card className="rounded-lg bg-card/85 shadow-sm">
      <CardHeader className="px-8 pb-3 pt-7">
        <CardTitle className="text-xl">Login to your account</CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <Field className="gap-2">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...registerField("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </Field>

          <Field className="gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              {...registerField("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </Field>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <SeparatorWithText text="Or continue with" />

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={() => authService.socialLogin("google")}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={() => authService.socialLogin("github")}
            >
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <FieldDescription className="text-center">
            {"Don't have an account? "}
            <Link
              href="/sign-up"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </FieldDescription>
        </form>
      </CardContent>
    </Card>
  );
}
