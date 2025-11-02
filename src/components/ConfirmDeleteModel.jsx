function ConfirmDeleteModal({ item, onConfirm, onCancel }) {
  if (!item) return null;

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

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shakeWarning {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .modal-overlay {
          animation: modalFadeIn 0.2s ease-out;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .warning-icon {
          animation: shakeWarning 0.5s ease-in-out, pulse 2s ease-in-out infinite 0.5s;
        }

        .delete-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .delete-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .delete-button:hover::before {
          width: 300px;
          height: 300px;
        }

        .delete-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }

        .delete-button:active {
          transform: translateY(0);
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

        .item-preview {
          transition: all 0.3s ease;
        }

        .item-preview:hover {
          background: #fef2f2;
          transform: scale(1.02);
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-overlay,
          .modal-content,
          .warning-icon,
          .delete-button,
          .cancel-button,
          .item-preview {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="modal-overlay fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <div
          className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Warning Icon */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5 border-b border-red-100">
            <div className="flex items-start gap-4">
              <div className="warning-icon flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Delete {item.isDirectory ? "Folder" : "File"}?
                </h2>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <p className="text-gray-700 mb-4 leading-relaxed">
              Are you sure you want to permanently delete this {item.isDirectory ? "folder" : "file"}?
              {item.isDirectory && " All contents inside will also be deleted."}
            </p>

            {/* Item Preview Card */}
            <div className="item-preview bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.isDirectory 
                    ? 'bg-blue-100' 
                    : 'bg-purple-100'
                }`}>
                  {item.isDirectory ? (
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.isDirectory ? "Folder" : "File"}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <svg
                className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-red-800 leading-relaxed">
                <strong>Warning:</strong> This will permanently delete the {item.isDirectory ? "folder and all its contents" : "file"}. This action cannot be reversed.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
            <button
              className="cancel-button px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="delete-button px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => onConfirm(item)}
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Permanently
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmDeleteModal;