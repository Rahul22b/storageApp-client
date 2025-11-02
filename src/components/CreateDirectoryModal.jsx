import { useEffect, useRef } from "react";

function CreateDirectoryModal({
  newDirname,
  setNewDirname,
  onClose,
  onCreateDirectory,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .modal-overlay {
          animation: modalFadeIn 0.2s ease-out;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .folder-icon-wrapper {
          animation: float 3s ease-in-out infinite;
        }

        .input-field {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-field:focus {
          transform: scale(1.01);
        }

        .create-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .create-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .create-button:hover::before {
          left: 100%;
        }

        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .create-button:active {
          transform: translateY(0);
        }

        .create-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .cancel-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cancel-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .cancel-button:active {
          transform: translateY(0);
        }

        .char-counter {
          transition: color 0.3s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-overlay,
          .modal-content,
          .folder-icon-wrapper,
          .input-field,
          .create-button,
          .cancel-button {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="modal-overlay fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={handleOverlayClick}
      >
        <div
          className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={handleContentClick}
        >
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-blue-100">
            <div className="flex items-center gap-4">
              <div className="folder-icon-wrapper flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Create New Folder
                </h2>
                <p className="text-sm text-gray-600">
                  Choose a name for your folder
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div>
            <div className="px-6 py-5">
              {/* Input Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Folder Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    className="input-field w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="e.g., My Documents"
                    value={newDirname}
                    onChange={(e) => setNewDirname(e.target.value)}
                    maxLength={50}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newDirname.trim()) {
                        onCreateDirectory(e);
                      }
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className={`char-counter text-xs font-medium ${
                      newDirname.length > 40 ? 'text-orange-500' : 'text-gray-400'
                    }`}>
                      {newDirname.length}/50
                    </span>
                  </div>
                </div>
              </div>

              {/* Helper Text */}
              <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <svg
                  className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Tip:</strong> Use descriptive names to organize your files better. You can rename it later if needed.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
              <button
                className="cancel-button px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="create-button px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="button"
                onClick={onCreateDirectory}
                disabled={!newDirname.trim()}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Folder
                </span>
              </button>
            </div>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-2 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                  Enter
                </kbd>
                <span>to create</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono">
                  Esc
                </kbd>
                <span>to cancel</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateDirectoryModal;