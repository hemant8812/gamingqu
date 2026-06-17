"use client";

import { FiTrash2 } from "react-icons/fi";

type Props = {
  id: number;
  action: (formData: FormData) => Promise<void>;
};

export function DeleteApplicationButton({ id, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this application?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title="Delete"
        className="p-2 rounded-lg bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white transition-all"
      >
        <FiTrash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
