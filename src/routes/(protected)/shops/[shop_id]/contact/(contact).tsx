import { useParams } from "@solidjs/router";
import { For } from "solid-js";

const contactInfo = [
  { label: "Business Email", value: "business@greengarden.com", icon: "email" },
  { label: "Phone", value: "+880 1712345678", icon: "phone" },
  { label: "Alternative Phone", value: "+880 1898765432", icon: "phone" },
];

const messagingApps = [
  { label: "WhatsApp", value: "+880 1712345678", icon: "whatsapp", url: "https://wa.me/8801712345678" },
  { label: "Telegram", value: "@greengarden_bd", icon: "telegram", url: "https://t.me/greengarden_bd" },
];

const socialMedia = [
  { label: "Facebook", value: "greengardenbd", icon: "facebook", url: "https://facebook.com/greengardenbd" },
  { label: "Instagram", value: "@greengarden_bd", icon: "instagram", url: "https://instagram.com/greengarden_bd" },
  { label: "X (Twitter)", value: "@greengardenbd", icon: "x", url: "https://x.com/greengardenbd" },
];

export default function ContactRoute() {
  const params = useParams();
  const shopId = params.shop_id;

  return (
    <div class="space-y-6">
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Shop ID</h3>
        <p class="text-sm text-slate-900 font-mono mb-6">{shopId}</p>

        <h3 class="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <For each={contactInfo}>
            {(item) => (
              <div class="flex items-start gap-3">
                <div class="p-2 bg-slate-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-600">
                    {item.icon === "email" && <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></>}
                    {item.icon === "phone" && <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>}
                  </svg>
                </div>
                <div>
                  <label class="text-xs font-semibold text-slate-500 uppercase">{item.label}</label>
                  <p class="text-sm text-slate-900 mt-1">{item.value}</p>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Messaging Apps</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <For each={messagingApps}>
            {(app) => (
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div class={`p-2 rounded-lg ${app.icon === "whatsapp" ? "bg-green-100" : "bg-blue-100"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={app.icon === "whatsapp" ? "text-green-600" : "text-blue-600"}>
                    {app.icon === "whatsapp" && <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>}
                    {app.icon === "telegram" && <><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></>}
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-700">{app.label}</p>
                  <p class="text-xs text-slate-500">{app.value}</p>
                </div>
              </a>
            )}
          </For>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Social Media</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <For each={socialMedia}>
            {(social) => (
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div class={`p-2 rounded-lg ${social.icon === "facebook" ? "bg-blue-100" : social.icon === "instagram" ? "bg-pink-100" : "bg-slate-100"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={social.icon === "facebook" ? "text-blue-600" : social.icon === "instagram" ? "text-pink-600" : "text-slate-600"}>
                    {social.icon === "facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>}
                    {social.icon === "instagram" && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></>}
                    {social.icon === "x" && <path d="M4 4l7.07 17.5h2l7-17.5M9 9h6"></path>}
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-700">{social.label}</p>
                  <p class="text-xs text-slate-500">{social.value}</p>
                </div>
              </a>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
