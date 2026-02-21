import { useNavigate } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { useSession } from "~/lib/auth";

export default function AuthLayout(props: { children: any }) {
    const user = useSession();
    const navigate = useNavigate();

    createEffect(() => {
        const currentUser = user();
        if (currentUser) {
            navigate("/", { replace: true });
        }
    });

    return (
        <Show when={user() === null}>
            {props.children}
        </Show>
    );
}
