import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, logoutUser, logoutAllSessions } from "../api/userApi";
import { Link } from "react-router-dom";
import { 
  FolderPlus, 
  Upload, 
  User, 
  LogOut, 
  LogIn, 
  ShoppingCart,
  ChevronDown,
  HardDrive
} from "lucide-react";

// Mock API functions for demo

function DirectoryHeader({
  directoryName,
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
  disabled = false,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userPicture, setUserPicture] = useState("");
  const [maxStorageInBytes, setMaxStorageInBytes] = useState(1073741824);
  const [usedStorageInBytes, setUsedStorageInBytes] = useState(0);
  const usedGB = usedStorageInBytes / 1024 ** 3;
  const totalGB = maxStorageInBytes / 1024 ** 3;
  const storagePercentage = (usedGB / totalGB) * 100;

  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchUser();
        setUserName(user.name);
        setUserEmail(user.email);
        setMaxStorageInBytes(user.maxStorageInBytes);
        setUsedStorageInBytes(user.usedStorageInBytes);
        setUserPicture(user.picture || "");
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        setUserName("Guest User");
        setUserEmail("guest@example.com");
      }
    }
    loadUser();
  }, []);

  const handleUserIconClick = () => {
    setShowUserMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions();
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
      navigate("/login");
    } catch (err) {
      console.error("Logout all error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    function handleDocumentClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const getStorageColor = () => {
    if (storagePercentage >= 90) return "bg-red-500";
    if (storagePercentage >= 75) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-2 mb-6">
      <div className="flex items-center justify-between">
        {/* Directory Name */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <HardDrive className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-xl font-semibold text-white">{directoryName}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Create Folder Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 group"
            title="Create Folder"
            onClick={onCreateFolderClick}
            disabled={disabled}
          >
            <FolderPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium hidden sm:inline">New Folder</span>
          </button>

          {/* Upload Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 group"
            title="Upload Files"
            onClick={onUploadFilesClick}
            disabled={disabled}
          >
            <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium hidden sm:inline">Upload</span>
          </button>

          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
              title="User Menu"
              onClick={handleUserIconClick}
            >
              {userPicture ? (
                <img
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-700"
                  src={userPicture}
                  alt={userName}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                {loggedIn ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        {userPicture ? (
                          <img
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700"
                            src={userPicture}
                            alt={userName}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{userName}</div>
                          <div className="text-xs text-gray-400 truncate">{userEmail}</div>
                        </div>
                      </div>

                      {/* Storage Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            Storage
                          </span>
                          <span className="text-gray-300 font-medium">
                            {usedGB.toFixed(2)} / {totalGB.toFixed(0)} GB
                          </span>
                        </div>
                        <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`absolute left-0 top-0 h-full ${getStorageColor()} transition-all duration-300 rounded-full`}
                            style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                          />
                        </div>
                        {storagePercentage >= 90 && (
                          <div className="text-xs text-red-400 flex items-center gap-1">
                            <span>⚠</span>
                            <span>Storage almost full</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 transition-colors group"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                        <span className="text-sm">Logout</span>
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 transition-colors group"
                        onClick={handleLogoutAll}
                      >
                        <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                        <span className="text-sm">Logout All Sessions</span>
                      </button>
                      <Link
                        to="/subscription"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 transition-colors group"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShoppingCart className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                        <span className="text-sm">Upgrade Storage</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors group"
                    onClick={() => {
                      setShowUserMenu(false);
                       navigate("/login");
                    }}
                  >
                    <LogIn className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    <span className="text-sm">Login</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DirectoryHeader;
