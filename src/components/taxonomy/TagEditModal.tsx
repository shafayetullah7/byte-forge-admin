import { createSignal, createEffect } from "solid-js";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface TagEditModalProps {
    show: boolean;
    tag: any;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export function TagEditModal(props: TagEditModalProps) {
    const [name, setName] = createSignal("");
    const [slug, setSlug] = createSignal("");
    const [desc, setDesc] = createSignal("");
    const [isSlugManual, setIsSlugManual] = createSignal(false);
    const [isSaving, setIsSaving] = createSignal(false);

    createEffect(() => {
        if (props.show && props.tag) {
            setName(props.tag.name);
            setSlug(props.tag.slug);
            setDesc(props.tag.description || "");
            setIsSlugManual(false);
        }
    });

    const generateSlug = (val: string) => {
        return val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    createEffect(() => {
        const currentName = name();
        if (!isSlugManual() && currentName && props.show) {
            setSlug(generateSlug(currentName));
        }
    });

    const handleSave = async () => {
        if (!name().trim() || !slug().trim()) return;

        setIsSaving(true);
        try {
            await props.onSave({
                id: props.tag.id,
                name: name().trim(),
                slug: slug().trim(),
                description: desc().trim()
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
                <Input
                    label="Tag Name *"
                    value={name()}
                    onInput={(e) => setName(e.currentTarget.value)}
                    placeholder="e.g. Low Light"
                />
                <Input
                    label="Slug *"
                    value={slug()}
                    onInput={(e) => {
                        setSlug(e.currentTarget.value);
                        setIsSlugManual(true);
                    }}
                    placeholder="e.g. low-light"
                />
                <div class="space-y-2">
                    <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Description</label>
                    <textarea
                        class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 transition-all min-h-[80px]"
                        value={desc()}
                        onInput={(e) => setDesc(e.currentTarget.value)}
                        placeholder="Optional description..."
                    />
                </div>
            </div>
        </Modal>
    );
}
