/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"

import config from "@/config";

export const registerUser = async (formData: FormData) => {
  try {
    const res = await fetch(`${config.baseUrl}/user/create-user`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Registration failed",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message || "Registration successful",
      data: result.data,
      token: result.data?.token,
    };
  } catch (error: any) {
    console.error("[registerUser] Error:", error);
    return {
      success: false,
      message: error.message || "Registration failed",
      data: null,
    };
  }
};