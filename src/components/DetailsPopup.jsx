import { useEffect, useState } from "react";
import { X, File, Folder, Calendar, HardDrive, Clock, MapPin } from "lucide-react";

export const formatSize = (bytes = 0) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) return (bytes / GB).toFixed(2) + " GB";
  if (bytes >= MB) return (bytes / MB).toFixed(2) + " MB";
  if (bytes >= KB) return (bytes / KB).toFixed(2) + " KB";
  return bytes + " B";
};

function DetailsPopup({ item, onClose }) {
  if (!item) return null;

  const [details, setDetails] = useState({
    path: "/",
    size: 0,
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
    numberOfFiles: 0,
    numberOfFolders: 0,
  });

  const { id, name, isDirectory, size, createdAt, updatedAt } = item;
  const { path, numberOfFiles, numberOfFolders } = details;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
      <Icon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-400 mb-0.5">{label}</div>
        <div className="text-sm text-gray-200 break-all">{value}</div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg border border-gray-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {isDirectory ? (
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Folder className="w-6 h-6 text-amber-400" />
              </div>
            ) : (
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <File className="w-6 h-6 text-blue-400" />
              </div>
            )}
            <h2 className="text-xl font-semibold text-white">
              {isDirectory ? "Folder" : "File"} Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          <DetailRow 
            icon={isDirectory ? Folder : File} 
            label="Name" 
            value={name} 
          />
          <DetailRow 
            icon={MapPin} 
            label="Location" 
            value={path} 
          />
          <DetailRow 
            icon={HardDrive} 
            label="Size" 
            value={formatSize(size)} 
          />
          <DetailRow
            icon={Calendar}
            label="Created"
            value={new Date(createdAt).toLocaleString()}
          />
          <DetailRow
            icon={Clock}
            label="Modified"
            value={new Date(updatedAt).toLocaleString()}
          />

          {isDirectory && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">
                  {numberOfFiles}
                </div>
                <div className="text-xs text-gray-400 mt-1">Files</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400">
                  {numberOfFolders}
                </div>
                <div className="text-xs text-gray-400 mt-1">Folders</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
          <button
            className="px-6 py-2.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsPopup;