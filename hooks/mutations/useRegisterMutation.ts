import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";

export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success("Registration successful! Please verify your email.");
      // Store email for verification page
      sessionStorage.setItem("verificationEmail", data.email);
      router.push("/verify-email");
    },
    onError: (error: AxiosError<ApiError>) => {
      const timeoutMessage =
        "Registration is taking too long. Please try again in a moment.";
      toast.error(
        error.code === "ECONNABORTED"
          ? timeoutMessage
          : error.response?.data?.message || "Registration failed"
      );
    },
  });
};
