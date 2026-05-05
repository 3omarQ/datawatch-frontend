import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";

export const useVerifyEmailMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      toast.success("Email verified successfully!");
      sessionStorage.removeItem("verificationEmail");
      router.push("/dashboard/targets");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || "Verification failed");
    },
  });
};
