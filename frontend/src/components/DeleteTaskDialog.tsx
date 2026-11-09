interface DeleteTaskDialogProps {
  taskTitle: string;
  isDeleting: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteTaskDialog({
  taskTitle,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteTaskDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-task-title"
        aria-describedby="delete-task-description"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="delete-task-title" className="text-lg font-semibold text-slate-900">
          Delete task?
        </h2>
        <p id="delete-task-description" className="mt-2 text-sm leading-6 text-slate-600">
          Are you sure you want to delete this task?
        </p>
        <p className="mt-2 truncate text-sm font-medium text-slate-800">{taskTitle}</p>

        {error && (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            autoFocus
            className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting…' : 'Confirm'}
          </button>
        </div>
      </section>
    </div>
  );
}
