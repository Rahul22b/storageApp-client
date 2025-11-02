import {
  Folder,
  FileText,
  Image,
  Video,
  Archive,
  Code,
  File,
  MoreVertical,
  Calendar,
  HardDrive,
} from "lucide-react";
import ContextMenu from "./ContextMenu";
import { useDirectoryContext } from "../context/DirectoryContext";
import { formatSize } from "./DetailsPopup";

function DirectoryItem({ item, uploadProgress }) {
  const {
    handleRowClick,
    activeContextMenu,
    handleContextMenu,
    getFileIcon,
    isUploading,
  } = useDirectoryContext();

  function renderFileIcon(iconString) {
    const iconClass = "w-5 h-5";
    switch (iconString) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-400`} />;
      case "image":
        return <Image className={`${iconClass} text-purple-400`} />;
      case "video":
        return <Video className={`${iconClass} text-pink-400`} />;
      case "archive":
        return <Archive className={`${iconClass} text-yellow-400`} />;
      case "code":
        return <Code className={`${iconClass} text-green-400`} />;
      case "alt":
      default:
        return <File className={`${iconClass} text-gray-400`} />;
    }
  }

  const isUploadingItem = item.id.startsWith("temp-");
  const isComplete = uploadProgress === 100;

  return (
    <div
      className={`group relative flex flex-col gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg transition-all duration-200 ${
        isUploadingItem 
          ? 'cursor-wait opacity-75' 
          : 'hover:bg-gray-800 hover:border-gray-600 hover:shadow-lg cursor-pointer'
      }`}
      onClick={() =>
        !(activeContextMenu || isUploading || isUploadingItem) &&
        handleRowClick(item.isDirectory ? "directory" : "file", item.id)
      }
      onContextMenu={(e) => {
        if (!isUploadingItem) {
          handleContextMenu(e, item.id);
        }
      }}
    >
      {/* Main Content */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className={`flex-shrink-0 p-2 rounded-lg ${
            item.isDirectory 
              ? 'bg-amber-500/10' 
              : 'bg-gray-700/50'
          }`}>
            {item.isDirectory ? (
              <Folder className="w-5 h-5 text-amber-400" />
            ) : (
              renderFileIcon(getFileIcon(item.name))
            )}
          </div>

          {/* Name and Info */}
          <div className="flex-1 min-w-0">
            <div className="text-gray-200 font-medium truncate group-hover:text-white transition-colors">
              {item.name}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                {formatSize(item.size)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isUploadingItem && (
          <button
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors  "
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, item.id);
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}

        {/* Context Menu */}
        {activeContextMenu === item.id && (
          <ContextMenu item={item} isUploadingItem={isUploadingItem} />
        )}
      </div>

      {/* Upload Progress */}
      {isUploadingItem && (
        <div className="relative">
          <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-300 ${
                isComplete ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400">
              {isComplete ? 'Upload complete' : 'Uploading...'}
            </span>
            <span className={`text-xs font-medium ${
              isComplete ? 'text-green-400' : 'text-blue-400'
            }`}>
              {Math.floor(uploadProgress)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectoryItem;