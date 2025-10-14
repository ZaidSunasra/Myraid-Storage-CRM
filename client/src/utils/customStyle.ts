import { CheckCircle, Clock, FileText, Handshake, Pencil, Target, X, type LucideIcon } from "lucide-react";
import type { deal_status } from "zs-crm-common";

export const mentionStyle = {
	control: { backgroundColor: "#fff", fontSize: 14, fontWeight: "normal" },

	"&multiLine": { control: { fontFamily: "monospace", minHeight: 63 }, highlighter: { padding: 9, border: "1px solid transparent" }, input: { padding: 9, border: "1px solid silver" } },

	"&singleLine": { display: "inline-block", width: 180, highlighter: { padding: 1, border: "2px inset transparent" }, input: { padding: 1, border: "2px inset" } },

	suggestions: { list: { backgroundColor: "white", border: "1px solid rgba(0,0,0,0.15)", fontSize: 14 }, item: { padding: "5px 15px", borderBottom: "1px solid rgba(0,0,0,0.15)", "&focused": { backgroundColor: "#cee4e5" } } }
};

export const DEAL_STATUS_META: Record<deal_status, { icon: LucideIcon, bg: string }> = {
	pending: { icon: Clock, bg: "bg-gradient-to-r from-gray-500 to-gray-600" },
	drawing: { icon: Pencil, bg: "bg-gradient-to-r from-blue-500 to-blue-600" },
	quotation: { icon: FileText, bg: "bg-gradient-to-r from-amber-500 to-amber-600" },
	high_order_value: { icon: Target, bg: "bg-gradient-to-r from-purple-500 to-purple-600" },
	negotiation: { icon: Handshake, bg: "bg-gradient-to-r from-orange-500 to-orange-600" },
	order_lost: { icon: X, bg: "bg-gradient-to-r from-red-500 to-red-600" },
	order_confirmed: { icon: CheckCircle, bg: "bg-gradient-to-r from-green-500 to-green-600" }
};

export const ROLE_COLORS: Record<string, string> = {
  admin: "bg-blue-100 text-blue-800",
  sales: "bg-green-100 text-green-800",
  drawing: "bg-yellow-100 text-yellow-800",
  factory: "bg-orange-100 text-orange-800",
  accounts: "bg-red-100 text-red-800"
};