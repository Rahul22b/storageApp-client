import { useEffect, useRef } from "react";
import {
  Download,
  Edit,
  Trash2,
  Info,
  X,
} from "lucide-react";
import { useDirectoryContext } from "../context/DirectoryContext";

function ContextMenu({ item, isUploadingItem }) {
  const {
    handleCancelUpload,
    setDeleteItem,
    openRenameModal,
    openDetailsPopup,
    BASE_URL,
  } = useDirectoryContext();

  const menuRef = useRef(null);

  useEffect(() => {
    // Auto-focus menu for keyboard navigation
    if (menuRef.current) {
      menuRef.current.focus();
    }
  }, []);

  const MenuItem = ({ icon: Icon, label, color, onClick, danger = false }) => (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-300 hover:bg-gray-700 transition-all duration-150 group ${
        danger ? 'hover:bg-red-500/10 hover:text-red-400' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Icon className={`w-4 h-4 ${color} transition-transform group-hover:scale-110`} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const Divider = () => <div className="h-px bg-gray-700 my-1" />;

  // Directory Context Menu
  if (item.isDirectory) {
    return (
      <div
        ref={menuRef}
        tabIndex={-1}
        className="absolute bg-gray-800 border border-gray-700 shadow-2xl rounded-lg text-sm z-50 right-2 top-full mt-1 overflow-hidden min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          <MenuItem
            icon={Edit}
            label="Rename"
            color="text-yellow-400"
            onClick={() => openRenameModal("directory", item.id, item.name)}
          />
          <MenuItem
            icon={Info}
            label="Details"
            color="text-blue-400"
            onClick={() => openDetailsPopup(item)}
          />
          <Divider />
          <MenuItem
            icon={Trash2}
            label="Delete"
            color="text-red-400"
            onClick={() => setDeleteItem(item)}
            danger
          />
        </div>
      </div>
    );
  }

  // Uploading File Context Menu
  if (isUploadingItem && item.isUploading) {
    return (
      <div
        ref={menuRef}
        tabIndex={-1}
        className="absolute bg-gray-800 border border-gray-700 shadow-2xl rounded-lg text-sm z-50 right-2 top-full mt-1 overflow-hidden min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-gray-700">
            Uploading
          </div>
          <MenuItem
            icon={X}
            label="Cancel Upload"
            color="text-red-400"
            onClick={() => handleCancelUpload(item.id)}
            danger
          />
        </div>
      </div>
    );
  }

  // Regular File Context Menu
  return (
    <div
      ref={menuRef}
      tabIndex={-1}
      className="absolute bg-gray-800 border border-gray-700 shadow-2xl rounded-lg text-sm z-50 right-2 top-full mt-1 overflow-hidden min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        <MenuItem
          icon={Download}
          label="Download"
          color="text-blue-400"
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL || BASE_URL}/file/${item.id}?action=download`;
          }}
        />
        <MenuItem
          icon={Edit}
          label="Rename"
          color="text-yellow-400"
          onClick={() => openRenameModal("file", item.id, item.name)}
        />
        <MenuItem
          icon={Info}
          label="Details"
          color="text-purple-400"
          onClick={() => openDetailsPopup(item)}
        />
        <Divider />
        <MenuItem
          icon={Trash2}
          label="Delete"
          color="text-red-400"
          onClick={() => setDeleteItem(item)}
          danger
        />
      </div>
    </div>
  );
}

export default ContextMenu;