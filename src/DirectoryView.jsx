import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, FolderOpen, Upload as UploadIcon } from "lucide-react";
import DirectoryHeader from "./components/DirectoryHeader";
import CreateDirectoryModal from "./components/CreateDirectoryModal";
import RenameModal from "./components/RenameModal";
import DirectoryList from "./components/DirectoryList";
import { DirectoryContext } from "./context/DirectoryContext";
import { useGetDirectoryItemsQuery,useCreateDirectoryMutation,useDeleteDirectoryMutation,useRenameDirectoryMutation,useDeleteFileMutation,useRenameFileMutation } from "./api/directoryApi";
import DetailsPopup from "./components/DetailsPopup";
import ConfirmDeleteModal from "./components/ConfirmDeleteModel";
import { directoryApi } from "./api/directoryApi";

// Shimmer Loading Component
function ShimmerItem() {
  return (
    <div className="animate-pulse flex flex-col gap-2 px-4 py-3 bg-gray-800/40 border border-gray-700/60 rounded-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon skeleton */}
          <div className="w-9 h-9 bg-gray-700/50 rounded-lg shimmer" />
          {/* Text skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-3/4 shimmer" />
            <div className="h-3 bg-gray-700/30 rounded w-1/2 shimmer" />
          </div>
        </div>
        {/* Action button skeleton */}
        <div className="w-8 h-8 bg-gray-700/30 rounded-lg shimmer" />
      </div>
    </div>
  );
}

function ShimmerLoading() {
  return (
    <div className="space-y-4">
      {/* Header shimmer */}
      <div className="flex items-center justify-between px-2">
        <div className="h-5 w-20 bg-gray-700/50 rounded shimmer" />
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700/50">
          <div className="w-8 h-8 bg-gray-700/50 rounded shimmer" />
          <div className="w-8 h-8 bg-gray-700/50 rounded shimmer" />
        </div>
      </div>
      
      {/* Items shimmer */}
      <div className="space-y-2 mx-2">
        {[...Array(6)].map((_, i) => (
          <ShimmerItem key={i} />
        ))}
      </div>
    </div>
  );
}

function DirectoryView() {

  const { dirId } = useParams();
  const navigate = useNavigate();

  const { data:directoryData, error, isLoading,isFetching, refetch } = useGetDirectoryItemsQuery(dirId || "");

  const [createDirectoryMutation]=useCreateDirectoryMutation();
  const [deleteDirectoryMutation]=useDeleteDirectoryMutation();
  const [renameDirectoryMutation]=useRenameDirectoryMutation();
const [deleteFileMutation] = useDeleteFileMutation();
  const [renameFileMutation]=useRenameFileMutation();
  const [filesList, setFilesList] = useState([]);
  const [directoriesList, setDirectoriesList] = useState([]);
  const [directoryName,setDirectoryName]=useState("My Drive")
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [newDirname, setNewDirname] = useState("New Folder");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  // Single-file upload state
  const [uploadItem, setUploadItem] = useState(null);
  const xhrRef = useRef(null);

  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const openDetailsPopup = (item) => setDetailsItem(item);
  const closeDetailsPopup = () => setDetailsItem(null);

    
  useEffect(() => {
    if (directoryData) {
      setDirectoryName(dirId ? directoryData.name || "My Drive" : "My Drive");
      setDirectoriesList(directoryData.directories ? [...directoryData.directories].reverse() : []);
      setFilesList(directoryData.files ? [...directoryData.files].reverse() : []);
    } else if (!dirId) {
      setDirectoryName("My Drive");
      setDirectoriesList([]);
      setFilesList([]);
    }
  }, [directoryData, dirId]);


 useEffect(()=>{
  if(error){
    if(error.status===401) navigate("/login");
    else {setErrorMessage(error.data?.error || error.message);
    setTimeout(() => setErrorMessage(""), 3000);}

  }
 },[error,navigate]);

  useEffect(() => {
    setActiveContextMenu(null);
  }, [dirId]);

  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "pdf";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "image";
      case "mp4":
      case "mov":
      case "avi":
        return "video";
      case "zip":
      case "rar":
      case "tar":
      case "gz":
        return "archive";
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "html":
      case "css":
      case "py":
      case "java":
        return "code";
      default:
        return "alt";
    }
  }

  function handleRowClick(type, id) {
    if (type === "directory") navigate(`/directory/${id}`);
    else
      window.location.href = `${
        import.meta.env.VITE_BACKEND_BASE_URL
      }/file/${id}`;
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadItem?.isUploading) {
      setErrorMessage("An upload is already in progress. Please wait.");
      setTimeout(() => setErrorMessage(""), 3000);
      e.target.value = "";
      return;
    }

    const tempItem = {
      file,
      name: file.name,
      size: file.size,
      id: `temp-${Date.now()}`,
      isUploading: true,
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    setFilesList((prev) => [tempItem, ...prev]);
    setUploadItem(tempItem);
    e.target.value = "";
    startUpload(tempItem);
  }

  async function getsignedUrl(item) {
    return fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/file/initiate/${dirId || " "}`,
      {
        method: "POST",
        headers: {
          type: item.file.type,
          filename: item.name,
          filesize: item.size,
        },
        body: item,
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  }

  async function startUpload(item) {
    try {
      const { url, fileId } = await getsignedUrl(item);
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      xhr.open("PUT", url);
      
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          const progress = (evt.loaded / evt.total) * 100;
          setUploadItem((prev) => (prev ? { ...prev, progress } : prev));
        }
      });

      xhr.onload = async () => {
        if (xhr.status === 200) {
          await fetch(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/file/upload/check`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ fileId: fileId }),
              credentials: "include",
            }
          );
          // refetch();
          directoryApi.util.invalidateTags(["DirectoryItem"]);
        }
        setUploadItem(null);
        // loadDirectory();
      };

      xhr.onerror = () => {
        setErrorMessage("Upload failed. Please try again.");
        setFilesList((prev) => prev.filter((f) => f.id !== item.id));
        setUploadItem(null);
        setTimeout(() => setErrorMessage(""), 3000);
      };

      xhr.send(item.file);
    } catch (error) {
      setErrorMessage("Failed to initiate upload.");
      setFilesList((prev) => prev.filter((f) => f.id !== item.id));
      setUploadItem(null);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  function handleCancelUpload(tempId) {
    if (uploadItem && uploadItem.id === tempId && xhrRef.current) {
      xhrRef.current.abort();
    }
    setFilesList((prev) => prev.filter((f) => f.id !== tempId));
    setUploadItem(null);
  }

  async function confirmDelete(item) {
    setDeleteItem(null);
    const parentId=dirId || ""
    setDeleteItem(null);
    try {
      // if (item.isDirectory) await deleteDirectory(item.id);
      if(item.isDirectory) await deleteDirectoryMutation({id:item.id,parentId:parentId}).unwrap();
      // else await deleteFile(item.id);
      else deleteFileMutation({id:item.id,parentId}).unwrap();

    } catch (err) {
      setErrorMessage(err.data?.error || err.message || "not created");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  async function handleCreateDirectory(e) {
    e.preventDefault();
    setShowCreateDirModal(false);
    try {
      await createDirectoryMutation({dirId,newDirname}).unwrap();
      setNewDirname("New Folder");
    } catch (err) {
      setErrorMessage(err.data?.error || err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  function openRenameModal(type, id, currentName) {
    setRenameType(type);
    setRenameId(id);
    setRenameValue(currentName);
    setShowRenameModal(true);
  }

  async function handleRenameSubmit(e) {
    e.preventDefault();
    const parentId=dirId || "";
    
    if (!renameValue || renameValue.trim() === "") {
    setErrorMessage("Directory name cannot be empty. Please enter a valid name.");
    setTimeout(() => setErrorMessage(""), 3000);
    return; // Stop the function before calling the mutation
  }
  setShowRenameModal(false);
    try {
      if (renameType === "file") await renameFileMutation({id:renameId,newFilename:renameValue,parentId:parentId}).unwrap();
      else  await renameDirectoryMutation({ id: renameId, newDirName: renameValue, parentId: parentId }).unwrap();
    

      // setShowRenameModal(false);
      setRenameValue("");
      setRenameType(null);
      setRenameId(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  useEffect(() => {
    const handleDocumentClick = () => setActiveContextMenu(null);
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const combinedItems = [
    ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
    ...filesList.map((f) => ({ ...f, isDirectory: false })),
  ];

  const isUploading = !!uploadItem?.isUploading;
  const progressMap = uploadItem
    ? { [uploadItem.id]: uploadItem.progress || 0 }
    : {};

  const isAccessDenied =
    errorMessage === "Directory not found or you do not have access to it!";

  return (
    <DirectoryContext.Provider
      value={{
        handleRowClick,
        activeContextMenu,
        handleContextMenu: (e, id) => {
          e.stopPropagation();
          e.preventDefault();
          setActiveContextMenu((prev) => (prev === id ? null : id));
        },
        getFileIcon,
        isUploading,
        progressMap,
        handleCancelUpload,
        setDeleteItem,
        openRenameModal,
        openDetailsPopup,
      }}
    >
      <div className="min-h-screen bg-gray-950">
        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          .shimmer {
            background: linear-gradient(
              to right,
              rgba(55, 65, 81, 0.4) 0%,
              rgba(75, 85, 99, 0.6) 50%,
              rgba(55, 65, 81, 0.4) 100%
            );
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear;
          }
        `}</style>
        
        <div className="">
          {/* Error Message Banner */}
          {errorMessage && !isAccessDenied && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-3 max-w-md">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          <DirectoryHeader
            directoryName={directoryName}
            onCreateFolderClick={() => setShowCreateDirModal(true)}
            onUploadFilesClick={() => fileInputRef.current?.click()}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
            disabled={isAccessDenied}
          />

          {/* Main Content Area */}
          <div className="pb-8">
            {isLoading  || isFetching ? (
              <ShimmerLoading />
            ) : combinedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                {isAccessDenied ? (
                  <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">
                      Access Denied
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Directory not found or you do not have access to it!
                    </p>
                  </div>
                ) : (
                  <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
                      <FolderOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">
                      This folder is empty
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Upload a file or create a folder to get started
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setShowCreateDirModal(true)}
                        className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Create Folder
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <UploadIcon className="w-4 h-4" />
                        Upload File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <DirectoryList items={combinedItems} />
            )}
          </div>

          {/* Modals */}
          {showCreateDirModal && (
            <CreateDirectoryModal
              newDirname={newDirname}
              setNewDirname={setNewDirname}
              onClose={() => setShowCreateDirModal(false)}
              onCreateDirectory={handleCreateDirectory}
            />
          )}

          {showRenameModal && (
            <RenameModal
              renameType={renameType}
              renameValue={renameValue}
              setRenameValue={setRenameValue}
              onClose={() => setShowRenameModal(false)}
              onRenameSubmit={handleRenameSubmit}
            />
          )}

          {detailsItem && (
            <DetailsPopup item={detailsItem} onClose={closeDetailsPopup} />
          )}

          {deleteItem && (
            <ConfirmDeleteModal
              item={deleteItem}
              onConfirm={confirmDelete}
              onCancel={() => setDeleteItem(null)}
            />
          )}
        </div>
      </div>
    </DirectoryContext.Provider>
  );
}

export default DirectoryView;