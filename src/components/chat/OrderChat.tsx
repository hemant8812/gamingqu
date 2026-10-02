import { getChatAccess, getMessages } from "@/lib/orderChat";
import { postOrderMessage } from "@/lib/chatActions";
import { ChatComposer } from "./ChatComposer";
import { ChatRefresh } from "./ChatRefresh";

const ROLE_LABEL: Record<string, string> = { BOOSTER: "Booster", ADMIN: "Support", SUPERADMIN: "Support", MEMBER: "Customer" };

// Chat thread for one order. Renders nothing for people who are not part of the order.
export async function OrderChat({ code, title = "Order chat" }: { code: string; title?: string }) {
  const access = await getChatAccess(code);
  if (!access) return null;
  const messages = await getMessages(access.orderId).catch(() => []);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800" aria-label={title}>
      <ChatRefresh />
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <span className="text-[11px] text-gray-500">Don&apos;t share passwords here — support can read this chat.</span>
      </div>
      <ol className="flex max-h-80 flex-col gap-2 overflow-y-auto p-4">
        {messages.length === 0 && <li className="py-6 text-center text-sm text-gray-500">No messages yet. Say hi!</li>}
        {messages.map((m) => {
          const mine = m.sender.id === access.viewer.id;
          return (
            <li key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                  mine ? "rounded-br-sm bg-brand-600 text-white" : "rounded-bl-sm bg-white/[0.06] text-gray-100"
                }`}
              >
                {m.body}
              </div>
              <span className="mt-1 text-[10px] text-gray-500">
                {mine ? "You" : `${m.sender.username} · ${ROLE_LABEL[m.sender.role] ?? ""}`} ·{" "}
                {new Date(m.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </li>
          );
        })}
      </ol>
      <ChatComposer code={code} action={postOrderMessage} />
    </section>
  );
}
