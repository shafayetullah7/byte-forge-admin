import { createSignal, createEffect } from "solid-js";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { Tag, UpdateTagDto } from "~/lib/api/endpoints/tags";

interface TagEditModalProps {
    show: boolean;
    tag: Tag | null;
    onClose: () => void;
    onSave: (id: string, data: UpdateTagDto) => Promise<void>;
}

export function TagEditModal(props: TagEditModalProps) {
    const [slug, setSlug] = createSignal("");
    const [isSaving, setIsSaving] = createSignal(false);

    createEffect(() => {
        if (props.show && props.tag) {
            setSlug(props.tag.slug);
        }
    });


    const handleSave = async () => {
        if (!slug().trim()) return;
        setIsSaving(true);
        try {
            await props.onSave(props.tag!.id, {
                slug: slug().trim()
            });
            props.onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            show={props.show}
            onClose={props.onClose}
            title="Edit Tag Details"
            footer={
                <>
                    <Button variant="outline" onClick={props.onClose} disabled={isSaving()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} isLoading={isSaving()}>
                        Save Changes
                    </Button>
                </>
            }
        >
            <div class="space-y-5">
                <div class="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Name</p>
                    <p class="text-sm font-semibold text-slate-900">{props.tag?.name || "—"}</p>
                    <p class="text-[10px] text-slate-400 mt-1">To edit the name, use the translations endpoint.</p>
                </div>
                <Input
                    label="Slug *"
                    value={slug()}
                    onInput={(e) => setSlug(e.currentTarget.value)}
                    placeholder="e.g. low-light"
                />
            </div>
        </Modal>
    );
}
