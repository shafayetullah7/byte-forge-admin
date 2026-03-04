import { CreateTagGroupForm } from "~/components/taxonomy/TagGroupForm";
import { A, type RouteDefinition } from "@solidjs/router";
import { ArrowLeftIcon } from "~/components/icons";

export const route: RouteDefinition = {};

export default function CreateTagGroupPage() {
    return (
        <div class="mx-auto w-full">
            <CreateTagGroupForm />
        </div>
    );
}
