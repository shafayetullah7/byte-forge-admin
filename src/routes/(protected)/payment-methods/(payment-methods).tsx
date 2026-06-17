import { createMemo, createSignal, For, Show } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { Modal } from "~/components/ui/Modal";
import { TagMetricsPanel } from "~/components/taxonomy/TagMetricsPanel";
import { PaymentsIcon } from "~/components/icons";
import { PageHeader } from "~/components/layout/PageHeader";
import {
  MOCK_PAYMENT_METHODS,
  type PaymentMethod,
  type PaymentMethodStatus,
} from "./mock-data";

type ModalMode = "create" | "edit" | "view" | "activate" | "deactivate" | null;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PaymentMethodLogo(props: { method: PaymentMethod; size?: "sm" | "md" | "lg" }) {
  const sizeClass = () => {
    switch (props.size ?? "md") {
      case "sm":
        return "w-8 h-8 text-base";
      case "lg":
        return "w-14 h-14 text-2xl";
      default:
        return "w-10 h-10 text-lg";
    }
  };

  return (
    <div
      class={`${sizeClass()} rounded-lg bg-primary-green-50 border border-primary-green-100 flex items-center justify-center overflow-hidden flex-shrink-0`}
    >
      <Show
        when={props.method.logoUrl}
        fallback={
          <span class="font-bold text-primary-green-700">
            {props.method.key.slice(0, 2)}
          </span>
        }
      >
        {(url) => (
          <img src={url()} alt={props.method.displayName} class="w-full h-full object-contain p-1" />
        )}
      </Show>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = createSignal<PaymentMethod[]>([...MOCK_PAYMENT_METHODS]);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<"" | PaymentMethodStatus>("");
  const [modalMode, setModalMode] = createSignal<ModalMode>(null);
  const [selectedMethod, setSelectedMethod] = createSignal<PaymentMethod | null>(null);
  const [toast, setToast] = createSignal<string | null>(null);

  const [formKey, setFormKey] = createSignal("");
  const [formDisplayName, setFormDisplayName] = createSignal("");
  const [formLogoUrl, setFormLogoUrl] = createSignal("");
  const [formDescription, setFormDescription] = createSignal("");
  const [formErrors, setFormErrors] = createSignal<Record<string, string>>({});

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredMethods = createMemo(() => {
    const q = searchQuery().toLowerCase().trim();
    const status = statusFilter();
    return methods().filter((m) => {
      const matchesSearch =
        !q ||
        m.key.toLowerCase().includes(q) ||
        m.displayName.toLowerCase().includes(q);
      const matchesStatus = !status || m.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  const metrics = createMemo(() => {
    const all = methods();
    const active = all.filter((m) => m.status === "ACTIVE").length;
    const inactive = all.filter((m) => m.status === "INACTIVE").length;
    return [
      { label: "Total Methods", value: String(all.length), subValue: "Catalog entries" },
      { label: "Active", value: String(active), subValue: "Available at checkout" },
      { label: "Inactive", value: String(inactive), subValue: "Hidden from buyers" },
      {
        label: "Checkout Ready",
        value: active > 0 ? "Yes" : "No",
        subValue: active === 1 ? "COD only" : `${active} methods`,
      },
    ];
  });

  const resetForm = () => {
    setFormKey("");
    setFormDisplayName("");
    setFormLogoUrl("");
    setFormDescription("");
    setFormErrors({});
  };

  const openCreate = () => {
    resetForm();
    setSelectedMethod(null);
    setModalMode("create");
  };

  const openEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setFormKey(method.key);
    setFormDisplayName(method.displayName);
    setFormLogoUrl(method.logoUrl ?? "");
    setFormDescription(method.description);
    setFormErrors({});
    setModalMode("edit");
  };

  const openView = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setModalMode("view");
  };

  const openActivate = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setModalMode("activate");
  };

  const openDeactivate = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setModalMode("deactivate");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedMethod(null);
    resetForm();
  };

  const validateForm = (isEdit: boolean): boolean => {
    const errors: Record<string, string> = {};
    const key = formKey().trim().toUpperCase();
    const displayName = formDisplayName().trim();

    if (!key) errors.key = "Key is required";
    else if (!/^[A-Z][A-Z0-9_]{1,31}$/.test(key))
      errors.key = "Use uppercase letters, numbers, underscores (2–32 chars)";

    if (!displayName) errors.displayName = "Display name is required";

    if (!isEdit) {
      const exists = methods().some((m) => m.key === key);
      if (exists) errors.key = "This key already exists";
    } else if (selectedMethod() && key !== selectedMethod()!.key) {
      const exists = methods().some((m) => m.key === key && m.id !== selectedMethod()!.id);
      if (exists) errors.key = "This key already exists";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCreate = () => {
    if (!validateForm(false)) return;
    const now = new Date().toISOString();
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      key: formKey().trim().toUpperCase(),
      displayName: formDisplayName().trim(),
      logoUrl: formLogoUrl().trim() || null,
      description: formDescription().trim(),
      status: "INACTIVE",
      createdAt: now,
      updatedAt: now,
    };
    setMethods((prev) => [newMethod, ...prev]);
    closeModal();
    showToast(`Payment method "${newMethod.displayName}" created (inactive by default)`);
  };

  const handleSaveEdit = () => {
    if (!validateForm(true) || !selectedMethod()) return;
    const id = selectedMethod()!.id;
    setMethods((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              key: formKey().trim().toUpperCase(),
              displayName: formDisplayName().trim(),
              logoUrl: formLogoUrl().trim() || null,
              description: formDescription().trim(),
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
    closeModal();
    showToast("Payment method updated");
  };

  const handleActivate = () => {
    const method = selectedMethod();
    if (!method) return;
    setMethods((prev) =>
      prev.map((m) =>
        m.id === method.id
          ? { ...m, status: "ACTIVE" as const, updatedAt: new Date().toISOString() }
          : m
      )
    );
    closeModal();
    showToast(`"${method.displayName}" is now active at checkout`);
  };

  const handleDeactivate = () => {
    const method = selectedMethod();
    if (!method) return;
    const activeCount = methods().filter((m) => m.status === "ACTIVE").length;
    if (method.status === "ACTIVE" && activeCount <= 1) {
      showToast("Cannot deactivate the last active payment method");
      closeModal();
      return;
    }
    setMethods((prev) =>
      prev.map((m) =>
        m.id === method.id
          ? { ...m, status: "INACTIVE" as const, updatedAt: new Date().toISOString() }
          : m
      )
    );
    closeModal();
    showToast(`"${method.displayName}" has been deactivated`);
  };

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      <Title>Payment Methods | ByteForge Admin</Title>
      <Meta name="description" content="Manage platform payment methods" />

      {/* Toast */}
      <Show when={toast()}>
        <div class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl bg-primary-green-800 text-white text-sm font-medium shadow-lg border border-primary-green-700 animate-in fade-in slide-in-from-bottom-2">
          {toast()}
        </div>
      </Show>

      <PageHeader
        title="Payment Methods"
        description="Manage checkout payment options. Only active methods appear to buyers. Static prototype — changes are local only."
        icon={PaymentsIcon}
      >
        <Button variant="primary" size="md" onClick={openCreate}>
          Add Payment Method
        </Button>
      </PageHeader>

      {/* Stats */}
      <TagMetricsPanel metrics={metrics()} />

      <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="relative w-full sm:max-w-[400px]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <Input
            label="Search"
            placeholder="Search by key or display name..."
            class="pl-10 w-full"
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <button
            type="button"
            class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${statusFilter() === "" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            onClick={() => setStatusFilter("")}
          >
            All
          </button>
          <button
            type="button"
            class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${statusFilter() === "ACTIVE" ? "bg-primary-green-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-primary-green-50"}`}
            onClick={() => setStatusFilter("ACTIVE")}
          >
            Active
          </button>
          <button
            type="button"
            class={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${statusFilter() === "INACTIVE" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            onClick={() => setStatusFilter("INACTIVE")}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Table */}
      <Card class="overflow-hidden border-slate-200 shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200">
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Method</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Updated</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <For
                each={filteredMethods()}
                fallback={
                  <tr>
                    <td colspan="6" class="px-6 py-16 text-center">
                      <div class="flex flex-col items-center">
                        <PaymentsIcon class="w-10 h-10 text-slate-300 mb-3" />
                        <p class="text-sm font-semibold text-slate-500">No payment methods found</p>
                        <p class="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                }
              >
                {(method) => (
                  <tr class="group hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <PaymentMethodLogo method={method} />
                        <span class="font-semibold text-slate-900">{method.displayName}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        {method.key}
                      </span>
                    </td>
                    <td class="px-6 py-4 max-w-xs">
                      <p class="text-sm text-slate-500 truncate">{method.description}</p>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">{formatDate(method.updatedAt)}</td>
                    <td class="px-6 py-4 text-center">
                      <Badge variant={method.status === "ACTIVE" ? "success" : "secondary"} size="sm">
                        {method.status}
                      </Badge>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openView(method)}>
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEdit(method)}>
                          Edit
                        </Button>
                        <Show
                          when={method.status === "ACTIVE"}
                          fallback={
                            <Button variant="primary" size="sm" onClick={() => openActivate(method)}>
                              Activate
                            </Button>
                          }
                        >
                          <Button variant="danger" size="sm" onClick={() => openDeactivate(method)}>
                            Deactivate
                          </Button>
                        </Show>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <p class="text-sm text-slate-500">
            Showing <span class="font-medium text-slate-700">{filteredMethods().length}</span> of{" "}
            <span class="font-medium text-slate-700">{methods().length}</span> payment methods
          </p>
        </div>
      </Card>

      {/* Checkout preview hint */}
      <div class="mt-8 p-5 bg-gradient-to-br from-primary-green-50 to-emerald-50 border border-primary-green-100 rounded-2xl flex gap-4 shadow-sm">
        <div class="p-2 bg-primary-green-700 rounded-xl text-white shadow-md flex-shrink-0">
          <PaymentsIcon class="w-5 h-5" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-primary-green-950">Buyer checkout preview</h4>
          <p class="text-xs text-primary-green-900/80 mt-1 leading-relaxed">
            Active methods below will appear on the checkout payment step. Currently active:{" "}
            <span class="font-semibold">
              {methods()
                .filter((m) => m.status === "ACTIVE")
                .map((m) => m.displayName)
                .join(", ") || "None"}
            </span>
          </p>
          <div class="flex flex-wrap gap-2 mt-3">
            <For each={methods().filter((m) => m.status === "ACTIVE")}>
              {(m) => (
                <div class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-primary-green-200 shadow-sm">
                  <PaymentMethodLogo method={m} size="sm" />
                  <span class="text-sm font-medium text-slate-800">{m.displayName}</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        show={modalMode() === "create" || modalMode() === "edit"}
        onClose={closeModal}
        title={modalMode() === "create" ? "Add Payment Method" : "Edit Payment Method"}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={modalMode() === "create" ? handleSaveCreate : handleSaveEdit}
            >
              {modalMode() === "create" ? "Create Method" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div class="space-y-4">
          <Input
            label="Key"
            placeholder="e.g. COD, BKASH"
            value={formKey()}
            onInput={(e) => setFormKey(e.currentTarget.value.toUpperCase())}
            error={formErrors().key}
            disabled={modalMode() === "edit" && selectedMethod()?.key === "COD"}
          />
          <p class="text-xs text-slate-400 -mt-2">
            Machine-readable identifier sent to the API. Uppercase, no spaces.
          </p>
          <Input
            label="Display Name"
            placeholder="e.g. Cash on Delivery"
            value={formDisplayName()}
            onInput={(e) => setFormDisplayName(e.currentTarget.value)}
            error={formErrors().displayName}
          />
          <Input
            label="Logo URL"
            placeholder="https://..."
            value={formLogoUrl()}
            onInput={(e) => setFormLogoUrl(e.currentTarget.value)}
          />
          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </label>
            <textarea
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 min-h-[80px] resize-y"
              placeholder="Short description shown to admins..."
              value={formDescription()}
              onInput={(e) => setFormDescription(e.currentTarget.value)}
            />
          </div>
          <Show when={formDisplayName() || formKey()}>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Preview</p>
              <div class="inline-flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-green-600 bg-primary-green-50">
                <div class="w-10 h-10 rounded-lg bg-white border border-primary-green-200 flex items-center justify-center overflow-hidden">
                  <Show when={formLogoUrl()} fallback={<span class="text-xs font-bold text-primary-green-700">{formKey().slice(0, 2) || "?"}</span>}>
                    <img src={formLogoUrl()} alt="" class="w-full h-full object-contain p-1" />
                  </Show>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900">{formDisplayName() || "Display name"}</p>
                  <p class="text-xs text-slate-500 font-mono">{formKey() || "KEY"}</p>
                </div>
              </div>
            </div>
          </Show>
          <Show when={modalMode() === "create"}>
            <div class="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              New methods are created as <strong>Inactive</strong>. Activate after review.
            </div>
          </Show>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        show={modalMode() === "view"}
        onClose={closeModal}
        title="Payment Method Details"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Show when={selectedMethod()}>
              {(m) => (
                <Button variant="primary" onClick={() => openEdit(m())}>
                  Edit
                </Button>
              )}
            </Show>
          </>
        }
      >
        <Show when={selectedMethod()}>
          {(method) => (
            <div class="space-y-5">
              <div class="flex items-center gap-4">
                <PaymentMethodLogo method={method()} size="lg" />
                <div>
                  <h4 class="text-lg font-bold text-slate-900">{method().displayName}</h4>
                  <Badge variant={method().status === "ACTIVE" ? "success" : "secondary"} class="mt-1">
                    {method().status}
                  </Badge>
                </div>
              </div>
              <dl class="grid grid-cols-1 gap-3 text-sm">
                <div class="flex justify-between py-2 border-b border-slate-100">
                  <dt class="text-slate-500">Key</dt>
                  <dd class="font-mono font-semibold text-slate-900">{method().key}</dd>
                </div>
                <div class="flex justify-between py-2 border-b border-slate-100">
                  <dt class="text-slate-500">Created</dt>
                  <dd class="text-slate-700">{formatDate(method().createdAt)}</dd>
                </div>
                <div class="flex justify-between py-2 border-b border-slate-100">
                  <dt class="text-slate-500">Last updated</dt>
                  <dd class="text-slate-700">{formatDate(method().updatedAt)}</dd>
                </div>
              </dl>
              <div>
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</p>
                <p class="text-sm text-slate-700">{method().description}</p>
              </div>
            </div>
          )}
        </Show>
      </Modal>

      {/* Activate Modal */}
      <Modal
        show={modalMode() === "activate"}
        onClose={closeModal}
        title="Activate Payment Method"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleActivate}>
              Activate
            </Button>
          </>
        }
      >
        <Show when={selectedMethod()}>
          {(method) => (
            <div class="space-y-4">
              <p class="text-sm text-slate-600">
                Activate <strong>{method().displayName}</strong> ({method().key})? Buyers will be able to select this method at checkout.
              </p>
              <div class="flex items-center gap-3 p-4 rounded-xl bg-primary-green-50 border border-primary-green-200">
                <PaymentMethodLogo method={method()} />
                <span class="font-semibold text-slate-900">{method().displayName}</span>
              </div>
            </div>
          )}
        </Show>
      </Modal>

      {/* Deactivate Modal */}
      <Modal
        show={modalMode() === "deactivate"}
        onClose={closeModal}
        title="Deactivate Payment Method"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeactivate}>
              Deactivate
            </Button>
          </>
        }
      >
        <Show when={selectedMethod()}>
          {(method) => (
            <div class="space-y-4">
              <p class="text-sm text-slate-600">
                Deactivate <strong>{method().displayName}</strong>? It will be hidden from checkout. Existing orders using this method are unaffected.
              </p>
              <Show when={methods().filter((m) => m.status === "ACTIVE").length <= 1 && method().status === "ACTIVE"}>
                <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                  Warning: This is the only active payment method. Deactivating it would leave checkout with no payment options.
                </div>
              </Show>
            </div>
          )}
        </Show>
      </Modal>
    </div>
  );
}
