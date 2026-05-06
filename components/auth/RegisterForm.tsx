"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/zod-schemas/auth";
import { useRegisterMutation } from "@/hooks/mutations/useRegisterMutation";
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

export function RegisterForm() {
  const { mutate: register, isPending } = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data);
  };

  return (
    <Card className="rounded-lg bg-card/85 shadow-sm">
      <CardHeader className="px-6 pb-2 pt-5">
        <CardTitle className="text-xl">Create an account</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-5">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          <Field className="gap-2">
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="h-8"
              {...registerField("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </Field>

          <Field className="gap-2">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="h-8"
              {...registerField("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive ">
                {errors.email.message}
              </p>
            )}
          </Field>

          <Field className="gap-2">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              className="h-8"
              {...registerField("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive ">
                {errors.password.message}
              </p>
            )}
          </Field>

          <Field className="gap-2">
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              className="h-8"
              {...registerField("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive ">
                {errors.confirmPassword.message}
              </p>
            )}
          </Field>

          <Button type="submit" disabled={isPending} className="w-full" size="sm">
            {isPending ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <SeparatorWithText text="Or continue with" />

          <div className="grid grid-cols-2 gap-3">
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
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </FieldDescription>
        </form>
      </CardContent>
    </Card>
  );
}
