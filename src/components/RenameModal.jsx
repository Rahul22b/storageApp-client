import { useEffect, useRef } from "react";
import { X, File, Folder, Edit } from "lucide-react";

function RenameModal({
  renameType,
  renameValue,
  setRenameValue,
  onClose,
  onRenameSubmit,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const dotIndex = renameValue.lastIndexOf(".");
      if (dotIndex > 0 && renameType === "file") {
        // For files, select everything except extension
        inputRef.current.setSelectionRange(0, dotIndex);
      } else {
        // For folders or files without extension, select all
        inputRef.current.select();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (renameValue.trim()) {
      onRenameSubmit(e);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              renameType === "file" 
                ? "bg-blue-500/10" 
                : "bg-amber-500/10"
            }`}>
              {renameType === "file" ? (
                <File className="w-5 h-5 text-blue-400" />
              ) : (
                <Folder className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-white">
              Rename {renameType === "file" ? "File" : "Folder"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Edit className="w-4 h-4 text-gray-400" />
              New name
            </label>
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={`Enter new ${renameType} name`}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
            />
            {renameType === "file" && renameValue.includes(".") && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span>💡</span>
                <span>Tip: Extension will be preserved automatically</span>
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={!renameValue.trim()}
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameModal;