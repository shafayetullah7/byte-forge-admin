import { useNavigate, action, useSubmission, useAction } from "@solidjs/router";
import { createSignal, createEffect, Show } from "solid-js";
import { createForm, setError } from "@modular-forms/solid";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { PasswordInput } from "~/components/ui/PasswordInput";
import { PottedPlantIcon } from "~/components/icons/PottedPlantIcon";
import { authApi } from "~/lib/api";
import { loginSchema, type LoginFormData } from "~/schemas/login.schema";

// Type definitions for error handling
interface ValidationError {
    field: string;
    message: string;
}

interface ErrorResponse {
    message?: string;
    validationErrors?: ValidationError[];
}

interface ActionError {
    message?: string;
    response?: ErrorResponse;
}

/**
 * Login Action
 * Handles server-side authentication for the admin panel.
 */
const loginAction = action(async (data: LoginFormData) => {
    "use server";
    await authApi.login({
        email: data.email,
        password: data.password,
    });

    return { success: true, target: "/" };
}, "login-admin");

export default function LoginPage() {
    const navigate = useNavigate();
    const loginTrigger = useAction(loginAction);
    const submission = useSubmission(loginAction);
    const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

    const [loginForm, { Form, Field }] = createForm<LoginFormData>({
        validate: (values) => {
            const result = loginSchema.safeParse(values);
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

    // Map server errors from the action back to the form fields
    createEffect(() => {
        if (submission.error) {
            const error = submission.error as ActionError;
            const errorData = error.response;

            if (errorData) {
                let handled = false;

                // Handle validation errors if any
                if (Array.isArray(errorData.validationErrors)) {
                    errorData.validationErrors.forEach((err: ValidationError) => {
                        const field = err.field.toLowerCase();
                        if (field === "email" || field === "password") {
                            setError(loginForm, field as keyof LoginFormData, err.message);
                            handled = true;
                        }
                    });
                }

                const message = errorData.message || error.message;
                if (!handled && message) {
                    const lowerMsg = message.toLowerCase();
                    if (lowerMsg.includes("password")) {
                        setError(loginForm, "password", message);
                        handled = true;
                    } else if (lowerMsg.includes("email") || lowerMsg.includes("user")) {
                        setError(loginForm, "email", message);
                        handled = true;
                    }
                }

                if (!handled) {
                    setErrorMessage(message || "Login failed. Please try again.");
                }
            } else {
                setErrorMessage(error.message || "An unexpected error occurred.");
            }
        }
    });

    // Handle successful login
    createEffect(() => {
        if (submission.result?.success) {
            navigate(submission.result.target || "/", { replace: true });
        }
    });

    const handleSubmit = (values: LoginFormData) => {
        setErrorMessage(null);
        loginTrigger(values);
    };

    return (
        <main class="min-h-screen bg-primary-green-50 relative flex items-center justify-center p-4 overflow-hidden">
            {/* Subtle Grid Background */}
            <div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style="background-image: radial-gradient(#1F6F4A 1px, transparent 1px); background-size: 24px 24px;"></div>
            <div class="absolute inset-0 z-0 bg-gradient-to-b from-primary-green-100 to-transparent pointer-events-none"></div>

            <div class="w-full max-w-md relative z-10">
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-primary-green-200 shadow-sm mb-6 text-primary-green-700">
                        <PottedPlantIcon class="w-8 h-8" />
                    </div>
                    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">ByteForge Admin</h1>
                    <p class="text-slate-500 mt-3 font-medium">Please enter your credentials to continue</p>
                </div>

                <Card class="p-8 group card-premium">
                    <Form onSubmit={handleSubmit} class="space-y-6">
                        <Show when={errorMessage()}>
                            <div class="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start gap-3">
                                <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errorMessage()}
                            </div>
                        </Show>

                        <Field name="email">
                            {(field, props) => (
                                <Input
                                    {...props}
                                    type="email"
                                    label="Email"
                                    placeholder="admin@byteforge.com"
                                    value={field.value || ""}
                                    error={field.error}
                                    required
                                    disabled={submission.pending}
                                />
                            )}
                        </Field>

                        <Field name="password">
                            {(field, props) => (
                                <PasswordInput
                                    {...props}
                                    label="Password"
                                    placeholder="••••••••"
                                    value={field.value || ""}
                                    error={field.error}
                                    required
                                    disabled={submission.pending}
                                />
                            )}
                        </Field>

                        <div class="pt-2">
                            <Button
                                type="submit"
                                class="w-full"
                                variant="primary"
                                isLoading={submission.pending}
                            >
                                {submission.pending ? "Authenticating..." : "Sign in to Dashboard"}
                            </Button>
                        </div>
                    </Form>
                </Card>

                <p class="text-center mt-8 text-sm text-slate-400 font-medium">
                    &copy; {new Date().getFullYear()} ByteForge &bull; Secure Access
                </p>
            </div>
        </main>
    );
}
