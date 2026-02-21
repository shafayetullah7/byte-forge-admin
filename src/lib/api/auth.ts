import { action } from "@solidjs/router";
import { loginAdmin } from "./endpoints/auth.api";
import type { LoginLocalAdminDto } from "./types";

export const loginAction = action(async (data: LoginLocalAdminDto) => {
  return loginAdmin(data);
}, "login-admin");

