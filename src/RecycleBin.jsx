import { useState} from "react";
import { useParams } from "react-router-dom";
import { Trash2, FolderOpen, File, Calendar } from "lucide-react";
import {
  useRestoreFileMutation,
  useGetRecycledFilesQuery,
  useDeleteRecycledFileMutation,
  useRestoreDirectoryMutation,
  useDeleteRecycledDirectoryMutation,
} from "./api/directoryApi";
import { useNavigate } from "react-router-dom";


export default function RecycleBin() {
  const { dirId } = useParams();
  const navigate=useNavigate();
  const [actionLoading, setActionLoading] = useState(null);

  const { data, isLoading } = useGetRecycledFilesQuery(dirId);
  const files = data?.files ?? [];
  const directories = data?.directories ?? [];

  const [restoreFile] = useRestoreFileMutation();
  const [restoreDirectory] = useRestoreDirectoryMutation();

  const [deleteRecycledFile] = useDeleteRecycledFileMutation();
  const [deleteRecycledDirectory] = useDeleteRecycledDirectoryMutation();

 const handleRestore = async (file) => {
  setActionLoading(file._id);

  try {
    const response = await restoreFile({
      fileId: file._id,
      parentDirId: file.parentDirId,
    }).unwrap();

    console.log("success:", response);
  } catch (err) {
    // RTK Query error shape
    if (err?.status === 400) {
      alert(err?.data?.error || "Restore failed");
    } else {
      alert("Something went wrong");
    }
  } finally {
    setActionLoading(null);
  }
};


  const handleRestoreDirectory = async (directory) => {
  setActionLoading(directory._id);

  try {
    const res = await restoreDirectory({
      directoryId: directory._id,
      parentDirId: directory.parentDirId,
    }).unwrap();

    console.log("Directory restored:", res);
  } catch (err) {
    if (err?.status === 400) {
      alert(err?.data?.error || "Cannot restore directory");
    } else if (err?.status === 404) {
      alert("Directory not found");
    } else {
      alert("Something went wrong while restoring");
    }
  } finally {
    setActionLoading(null);
  }
};


  const handleDelete = async (file) => {
    setActionLoading(file._id);
    try {
      await deleteRecycledFile({
        fileId: file._id,
        parentDirId: file.parentDirId,
      }).unwrap();
    } finally {
      setActionLoading(null);
    }
  };

 

  const handleDeleteDirectory = async (directory) => {
    setActionLoading(directory._id);
    try {
      await deleteRecycledDirectory({
        directoryId: directory._id,
        parentDirId: directory.parentDirId,
      }).unwrap();
    }
    finally {
      setActionLoading(null);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
        ) : data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Trash2 className="w-20 h-20 mb-4 opacity-30" />
            <p className="text-lg">Recycle bin is empty</p>
            <p className="text-sm mt-2">Deleted files will appear here</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-400 text-sm mb-4">
              {files?.length} {files?.length === 1 ? "item" : "items"}
            </p>
            <div className="space-y-2">
              {files?.map((file) => (
                <div
                  key={file._id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {file.type === "folder" ? (
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
                      <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                        onClick={() => handleRestore(file)}
                        disabled={actionLoading === file._id}
                      >
                        Restore
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                        onClick={() => handleDelete(file)}
                        disabled={actionLoading === file._id}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {directories?.map((directory) => (
                <div
                  key={directory._id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FolderOpen className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p  className="font-medium truncate" onClick={() => { navigate(`/bin/${directory._id}`)}} >{directory.name}</p>
                        {directory.deletedAt && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>Deleted {formatDate(directory.deletedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                        onClick={() => handleRestoreDirectory(directory)}
                        disabled={actionLoading === directory._id}
                      >
                        Restore
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                        onClick={() => handleDeleteDirectory(directory)}
                        disabled={actionLoading === directory._id}
                      >
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
