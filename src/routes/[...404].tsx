import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="text-center mx-auto text-slate-700 p-8">
      <h1 class="text-6xl font-bold text-indigo-600 my-16">404</h1>
      <h2 class="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p class="mb-8 text-slate-500">The page you are looking for does not exist.</p>
      <A href="/" class="text-indigo-600 hover:underline font-medium">
        Return to Dashboard
      </A>
    </main>
  );
}
