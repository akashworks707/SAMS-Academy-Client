/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import config from "@/config";

export function GoogleAuthButton() {
  const router = useRouter();
  const { login } = useUser();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch(`${config.baseUrl}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      login(result.data.user);

      if (result.data.user.role === "ADMIN") {
        router.push("/bn/dashboard");
      } else if (result.data.user.role === "TEACHER") {
        router.push("/en/teacher");
      } else {
        router.push("/bn/student/dashboard");
      }
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => toast.error("Google login failed")}
    />
  );
}
