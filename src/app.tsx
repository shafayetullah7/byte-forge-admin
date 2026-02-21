import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { AuthProvider } from "~/store/auth";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <AuthProvider>
          <Suspense>{props.children}</Suspense>
        </AuthProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
