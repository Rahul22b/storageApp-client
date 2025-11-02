import { useState } from "react";
import { Grid, List as ListIcon } from "lucide-react";
import { useDirectoryContext } from "../context/DirectoryContext";
import DirectoryItem from "./DirectoryItem";

function DirectoryList({ items }) {
  const { progressMap } = useDirectoryContext();
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-400">
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
        <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-gray-700 text-blue-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
            title="List view"
          >
            <ListIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-gray-700 text-blue-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
            title="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items Container */}
      {viewMode === "list" ? (
        <div className="space-y-2 mx-2">
          {items.map((item) => {
            const uploadProgress = progressMap[item.id] || 0;
            return (
              <DirectoryItem
                key={item.id}
                item={item}
                uploadProgress={uploadProgress}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mx-2">
          {items.map((item) => {
            const uploadProgress = progressMap[item.id] || 0;
            return (
              <DirectoryItem
                key={item.id}
                item={item}
                uploadProgress={uploadProgress}
                viewMode="grid"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DirectoryList;