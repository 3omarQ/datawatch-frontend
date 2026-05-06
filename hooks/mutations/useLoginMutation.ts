"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { ApiError } from "@/types/auth.types";

export const useLoginMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");

  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      toast.success("Login successful!");
      router.push(nextPath?.startsWith("/") ? nextPath : "/dashboard/targets");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.code === "ECONNABORTED"
          ? "Login is taking too long. Please try again in a moment."
          : error.response?.data?.message || "Invalid email or password"
      );
    },
  });
};
