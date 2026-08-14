import { action, useSubmission, useAction, A } from "@solidjs/router";
import { createSignal, createEffect, Show } from "solid-js";
import { createForm, setError } from "@modular-forms/solid";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { PasswordInput } from "~/components/ui/PasswordInput";
import { PottedPlantIcon } from "~/components/icons/PottedPlantIcon";
import { authApi } from "~/lib/api";
import { ApiError } from "~/lib/api/types";
import {
  registerDetailsSchema,
  toRegisterPayload,
  type RegisterDetailsFormData,
} from "~/schemas/register.schema";
import { z } from "zod";

interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  message?: string;
  statusCode?: number;
  errorCode?: string;
  validationErrors?: ValidationError[];
}

interface ActionError {
  message?: string;
  status?: number;
  response?: ErrorResponse;
}

const otpInputSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpInputSchema>;

function resolveActionError(error: unknown): {
  message: string;
  status?: number;
  validationErrors?: ValidationError[];
} {
  if (error instanceof ApiError) {
    const data = error.data as ErrorResponse | null;
    return {
      message: error.message,
      status: error.status,
      validationErrors: data?.validationErrors,
    };
  }

  const actionError = error as ActionError;
  return {
    message:
      actionError.response?.message ||
      actionError.message ||
      "Something went wrong. Please try again.",
    status: actionError.status ?? actionError.response?.statusCode,
    validationErrors: actionError.response?.validationErrors,
  };
}

function isRateLimitError(status?: number, errorCode?: string, message?: string) {
  return (
    status === 429 ||
    errorCode === "TOO_MANY_REQUESTS" ||
    Boolean(message?.toLowerCase().includes("once per minute"))
  );
}

const requestOtpAction = action(async (data: RegisterDetailsFormData) => {
  "use server";
  const result = await authApi.requestRegistrationOtp(toRegisterPayload(data));
  return { success: true as const, expiresAt: result.expiresAt };
}, "admin-register-request-otp");

const completeRegistrationAction = action(
  async (data: RegisterDetailsFormData & { otp: string }) => {
    "use server";
    await authApi.completeRegistration({
      ...toRegisterPayload(data),
      otp: data.otp,
    });
    return { success: true as const, target: "/login?registered=1" };
  },
  "admin-register-complete"
);

export default function RegisterPage() {
  const [step, setStep] = createSignal<"details" | "otp">("details");
  const [expiresAt, setExpiresAt] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [registrationDetails, setRegistrationDetails] =
    createSignal<RegisterDetailsFormData | null>(null);

  const requestOtpTrigger = useAction(requestOtpAction);
  const requestOtpSubmission = useSubmission(requestOtpAction);
  const completeTrigger = useAction(completeRegistrationAction);
  const completeSubmission = useSubmission(completeRegistrationAction);

  const [detailsForm, { Form: DetailsForm, Field: DetailsField }] =
    createForm<RegisterDetailsFormData>({
      validate: (values) => {
        const result = registerDetailsSchema.safeParse(values);
        if (result.success) return {};
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            errors[issue.path.join(".")] = issue.message;
          }
        });
        return errors;
      },
    });

  const [otpForm, { Form: OtpForm, Field: OtpField }] = createForm<OtpFormData>({
    validate: (values) => {
      const result = otpInputSchema.safeParse(values);
      if (result.success) return {};
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errors[issue.path.join(".")] = issue.message;
        }
      });
      return errors;
    },
  });

  const applyFieldErrors = (
    form: typeof detailsForm,
    errors: Record<string, string> | undefined,
    fields: string[]
  ) => {
    if (!errors) return false;
    let handled = false;
    for (const field of fields) {
      if (errors[field]) {
        setError(form, field as keyof RegisterDetailsFormData, errors[field]);
        handled = true;
      }
    }
    return handled;
  };

  createEffect(() => {
    if (!requestOtpSubmission.error) return;
    const { message, status, validationErrors } = resolveActionError(
      requestOtpSubmission.error
    );
    const errorCode = (requestOtpSubmission.error as ActionError).response
      ?.errorCode;

    if (isRateLimitError(status, errorCode, message)) {
      setErrorMessage(
        "Registration codes can only be requested once per minute. Please wait and try again."
      );
      return;
    }

    const formErrors: Record<string, string> = {};
    validationErrors?.forEach((err) => {
      formErrors[err.field] = err.message;
    });

    const handled = applyFieldErrors(detailsForm, formErrors, [
      "firstName",
      "lastName",
      "userName",
      "email",
      "password",
      "confirmPassword",
    ]);

    if (!handled) {
      setErrorMessage(message);
    }
  });

  createEffect(() => {
    if (requestOtpSubmission.result?.success) {
      setExpiresAt(requestOtpSubmission.result.expiresAt);
      setStep("otp");
      setErrorMessage(null);
    }
  });

  createEffect(() => {
    if (!completeSubmission.error) return;
    const { message } = resolveActionError(completeSubmission.error);

    if (message.toLowerCase().includes("otp")) {
      setError(otpForm, "otp", message);
    } else {
      setErrorMessage(message);
    }
  });

  createEffect(() => {
    if (completeSubmission.result?.success) {
      window.location.assign(completeSubmission.result.target || "/login");
    }
  });

  const handleDetailsSubmit = (values: RegisterDetailsFormData) => {
    setErrorMessage(null);
    setRegistrationDetails(values);
    requestOtpTrigger(values);
  };

  const handleOtpSubmit = (values: OtpFormData) => {
    const details = registrationDetails();
    if (!details) {
      setStep("details");
      setErrorMessage("Please enter your account details again.");
      return;
    }

    setErrorMessage(null);
    completeTrigger({ ...details, otp: values.otp });
  };

  const pending = () =>
    requestOtpSubmission.pending || completeSubmission.pending;

  return (
    <main class="min-h-screen bg-primary-green-50 relative flex items-center justify-center p-4 overflow-hidden">
      <div
        class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style="background-image: radial-gradient(#1F6F4A 1px, transparent 1px); background-size: 24px 24px;"
      />
      <div class="absolute inset-0 z-0 bg-gradient-to-b from-primary-green-100 to-transparent pointer-events-none" />

      <div class="w-full max-w-lg relative z-10">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-primary-green-200 shadow-sm mb-6 text-primary-green-700">
            <PottedPlantIcon class="w-8 h-8" />
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create admin account
          </h1>
          <p class="text-slate-500 mt-3 font-medium">
            {step() === "details"
              ? "Step 1 of 2 — account details"
              : "Step 2 of 2 — enter approval code"}
          </p>
        </div>

        <Card class="p-8 group card-premium">
          <Show when={errorMessage()}>
            <div class="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start gap-3 mb-6">
              <svg
                class="w-5 h-5 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errorMessage()}
            </div>
          </Show>

          <Show when={step() === "details"}>
            <DetailsForm
              onSubmit={handleDetailsSubmit}
              class="space-y-5"
              autocomplete="on"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailsField name="firstName">
                  {(field, props) => (
                    <Input
                      {...props}
                      label="First name"
                      value={field.value || ""}
                      error={field.error}
                      disabled={pending()}
                      autocomplete="given-name"
                    />
                  )}
                </DetailsField>

                <DetailsField name="lastName">
                  {(field, props) => (
                    <Input
                      {...props}
                      label="Last name"
                      value={field.value || ""}
                      error={field.error}
                      disabled={pending()}
                      autocomplete="family-name"
                    />
                  )}
                </DetailsField>
              </div>

              <DetailsField name="userName">
                {(field, props) => (
                  <Input
                    {...props}
                    label="Username"
                    placeholder="jane_admin"
                    value={field.value || ""}
                    error={field.error}
                    disabled={pending()}
                    autocomplete="username"
                  />
                )}
              </DetailsField>

              <DetailsField name="email">
                {(field, props) => (
                  <Input
                    {...props}
                    type="email"
                    label="Email"
                    placeholder="admin@byteforge.com"
                    value={field.value || ""}
                    error={field.error}
                    disabled={pending()}
                    autocomplete="email"
                  />
                )}
              </DetailsField>

              <DetailsField name="password">
                {(field, props) => (
                  <PasswordInput
                    {...props}
                    label="Password"
                    value={field.value || ""}
                    error={field.error}
                    disabled={pending()}
                    autocomplete="new-password"
                  />
                )}
              </DetailsField>

              <DetailsField name="confirmPassword">
                {(field, props) => (
                  <PasswordInput
                    {...props}
                    label="Confirm password"
                    value={field.value || ""}
                    error={field.error}
                    disabled={pending()}
                    autocomplete="new-password"
                  />
                )}
              </DetailsField>

              <Button
                type="submit"
                class="w-full"
                variant="primary"
                isLoading={requestOtpSubmission.pending}
              >
                {requestOtpSubmission.pending
                  ? "Sending approval code..."
                  : "Request approval code"}
              </Button>
            </DetailsForm>
          </Show>

          <Show when={step() === "otp"}>
            <div class="mb-6 rounded-lg border border-primary-green-100 bg-primary-green-50/60 p-4 text-sm text-slate-600 leading-relaxed">
              <p>
                An approval code was sent to the platform gatekeeper email. Ask
                them for the OTP, then enter it below to finish registration.
              </p>
              <Show when={expiresAt()}>
                <p class="mt-2 text-xs text-slate-500">
                  Code expires at{" "}
                  {new Date(expiresAt()!).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  . Only one request per minute is allowed globally.
                </p>
              </Show>
            </div>

            <OtpForm
              onSubmit={handleOtpSubmit}
              class="space-y-5"
              autocomplete="off"
            >
              <OtpField name="otp">
                {(field, props) => (
                  <Input
                    {...props}
                    label="Approval code (OTP)"
                    placeholder="123456"
                    inputmode="numeric"
                    maxlength={6}
                    value={field.value || ""}
                    error={field.error}
                    disabled={pending()}
                    autocomplete="one-time-code"
                  />
                )}
              </OtpField>

              <div class="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  class="sm:w-1/3"
                  disabled={pending()}
                  onClick={() => {
                    setStep("details");
                    setErrorMessage(null);
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  class="sm:flex-1"
                  variant="primary"
                  isLoading={completeSubmission.pending}
                >
                  {completeSubmission.pending
                    ? "Creating account..."
                    : "Complete registration"}
                </Button>
              </div>
            </OtpForm>
          </Show>

          <p class="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <A
              href="/login"
              class="font-semibold text-primary-green-700 hover:text-primary-green-800"
            >
              Sign in
            </A>
          </p>
        </Card>
      </div>
    </main>
  );
}
