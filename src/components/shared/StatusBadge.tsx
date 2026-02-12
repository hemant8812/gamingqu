import { CheckCircle, Clock, Shield } from "lucide-react";

export function PaymentBadge({ status }: { status: "CREATED" | "PENDING" | "PAID" | "CANCELED" | "FAILED" }) {
  const cls =
    status === "PAID"
      ? "bg-emerald-500/20 text-emerald-400"
      : status === "PENDING" || status === "CREATED"
      ? "bg-yellow-500/20 text-yellow-400"
      : status === "CANCELED" || status === "FAILED"
      ? "bg-red-500/20 text-red-400"
      : "bg-blue-500/20 text-blue-400";
  const Icon = status === "PAID" ? CheckCircle : status === "PENDING" || status === "CREATED" ? Clock : Shield;
  const label = status === "PAID" ? "Paid" : status === "PENDING" ? "Pending" : status === "CREATED" ? "Created" : status === "CANCELED" ? "Canceled" : "Failed";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md w-fit whitespace-nowrap ${cls}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}

export function FulfillmentBadge({ status }: { status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" }) {
  const cls =
    status === "COMPLETED"
      ? "bg-emerald-500/20 text-emerald-400"
      : status === "PENDING"
      ? "bg-yellow-500/20 text-yellow-400"
      : status === "CANCELED"
      ? "bg-red-500/20 text-red-400"
      : "bg-blue-500/20 text-blue-400";
  const Icon = status === "COMPLETED" ? CheckCircle : status === "PENDING" ? Clock : Shield;
  const label = status === "COMPLETED" ? "Completed" : status === "PENDING" ? "Pending" : status === "ACCEPTED" ? "Accepted" : status === "IN_PROGRESS" ? "In Progress" : "Canceled";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md w-fit whitespace-nowrap ${cls}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}
