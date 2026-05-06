"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => {
      // No API call needed - just clear local state
      return Promise.resolve();
    },
    onSuccess: () => {
      authService.logout();
      toast.success("Logged out successfully");
    },
    onError: () => {
      // Logout should never really fail, but just in case
      toast.error("Failed to logout");
    },
  });
};
