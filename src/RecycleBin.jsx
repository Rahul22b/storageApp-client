import { useState,} from "react";
import { Trash2, RefreshCw, X, FolderOpen, File, Calendar } from "lucide-react";
import { useRestoreFileMutation ,useGetRecycledFilesQuery,useDeleteRecycledFileMutation} from "./api/directoryApi";

export default function RecycleBin() {
  const [actionLoading, setActionLoading] = useState(null);

  

 const { data, isLoading } = useGetRecycledFilesQuery();
 const files = data?.files ?? [];
const [restoreFile] = useRestoreFileMutation();

const handleRestore = async (fileId, dirId) => {
  setActionLoading(fileId);
  try {
    await restoreFile({ fileId, parentDirId: dirId }).unwrap();
  } finally {
    setActionLoading(null);
  }
};

 const [deleteRecycledFile] = useDeleteRecycledFileMutation();

  const handleDelete = async (fileId) => {
    setActionLoading(fileId);
    try {
      await deleteRecycledFile(fileId).unwrap();
    } finally {
      setActionLoading(null);
    }
  };


 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <Trash2 className="w-6 h-6 text-slate-400" />
          <h1 className="text-xl font-semibold">Recycle Bin</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : files?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Trash2 className="w-20 h-20 mb-4 opacity-30" />
            <p className="text-lg">Recycle bin is empty</p>
            <p className="text-sm mt-2">Deleted files will appear here</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-400 text-sm mb-4">
              {files?.length} {files?.length === 1 ? 'item' : 'items'}
            </p>
            <div className="space-y-2">
              {files?.map(file => (
                <div
                  key={file._id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {file.type === 'folder' ? (
                        <FolderOpen className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                      ) : (
                        <File className="w-8 h-8 text-blue-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        {file.deletedAt && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>Deleted {formatDate(file.deletedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleRestore(file._id)}
                        disabled={actionLoading === file._id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
                      >
                        <RefreshCw className={`w-4 h-4 ${actionLoading === file._id ? 'animate-spin' : ''}`} />
                        Restore
                      </button>
                      <button
                        onClick={() => handleDelete(file._id)}
                        disabled={actionLoading === file._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
                      >
                        <X className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}