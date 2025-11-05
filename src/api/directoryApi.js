import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export const directoryApi = createApi({
  reducerPath: "directoryApi",
  baseQuery: baseQuery,
  tagTypes: ["DirectoryItem"],
  endpoints: (builder) => ({

    getDirectoryItems: builder.query ({
      query: (dirId = "") => ({
        url: `/directory/${dirId}`,
      }),
      providesTags: (result, error, dirId) => [
        { type: "DirectoryItem", id: dirId || "ROOT" },
      ],
    }),

    createDirectory: builder.mutation({
      // Define the query endpoint details
      query: ({ dirId = "", newDirname }) => {
        // Validation moved to the client side before calling the hook, but kept here as a fallback
        if (!newDirname || newDirname.trim() === "") {
          // Throwing an error will prevent the request from being sent
          throw new Error("Directory name cannot be empty.");
        }
        const urlPath = dirId ? `/directory/${dirId}` : "/directory";

        return {
          url: urlPath,
          method: "POST",
          body: { dirname: newDirname },
        };
      },
      invalidatesTags: (result, error, { dirId = "" }) => [
        { type: "DirectoryItem", id: dirId || "ROOT" },
      ],
    }),

    // 3. **deleteDirectory (Mutation)**
    deleteDirectory: builder.mutation({
      query: ({ id }) => ({
        url: `/directory/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ id, parentId }, { dispatch, queryFulfilled }) {
        const targetId = id.toString();

        const patchResult = dispatch(
          directoryApi.util.updateQueryData(
            "getDirectoryItems",
            parentId,
            (draft) => {
              if (draft.directories) {
                draft.directories = draft.directories.filter(
                  (item) => item.id.toString() !== targetId
                );
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { parentId }) => [
        { type: "DirectoryItem", id: parentId },
      ],
    }),


    renameDirectory: builder.mutation({
      query: ({ id, newDirName }) => {
        // 💡 Validation Check (Optional but Recommended)
        if (!newDirName || newDirName.trim() === "") {
          throw new Error("New directory name cannot be empty.");
        }
        return {
          url: `/directory/${id}`,
          method: "PATCH",
          body: { newDirName },
        };
      },
      // Optimistic Update Logic
      async onQueryStarted(
        { id, newDirName, parentId },
        { dispatch, queryFulfilled }
      ) {
        // Optimistically update the cached data *before* the API call returns
        const patchResult = dispatch(
          directoryApi.util.updateQueryData(
            "getDirectoryItems",
            parentId,
            (draft) => {
              // Find the item to be renamed in the cached list

              const itemToRename = draft.directories?.find(
                (item) => item.id.toString() === id.toString()
              );
              if (itemToRename) {
                itemToRename.name = newDirName; // Assuming the field is 'name'
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          // If the API call fails, revert the optimistic change
          patchResult.undo();
        }
      },
      // Invalidation is optional with an optimistic update, but can be useful

      invalidatesTags: (result, error, { id }) => [
        { type: "DirectoryItem", id },
      ],
    }),

    deleteFile: builder.mutation({
      query: ({ id }) => ({ // Note: backend uses /file/:id
        url: `/file/${id}`,
        method: "DELETE",
      }),
      // Requires parentId to update the correct directory list cache
      async onQueryStarted({ id, parentId }, { dispatch, queryFulfilled }) {
        const targetId = id.toString();
        
        // Optimistically remove the file from the parent directory's cached list
        const patchResult = dispatch(
          directoryApi.util.updateQueryData(
            "getDirectoryItems",
            parentId, // The parent directory's ID is the cache key
            (draft) => {
              // Assuming files are stored in a common array like 'directories' or 'items'
              // Using a generic 'items' array for simplicity, adjust as needed.
              if (draft.files) { 
                draft.files = draft.files.filter( 
                  (item) => item.id.toString() !== targetId
                );
              }
              // If your files are mixed in 'draft.directories', use that:
              // if (draft.directories) { 
              //   draft.directories = draft.directories.filter( (item) => item.id.toString() !== targetId );
              // }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback if the DELETE request fails
          patchResult.undo();
        }
      },
      // Invalidate the parent directory's tag to update file counts/size/etc.
      invalidatesTags: (result, error, { parentId }) => [
        { type: "DirectoryItem", id: parentId },
      ],
    }),

    // --- MUTATION: Rename File (Optimistic) ---
    renameFile: builder.mutation({
      query: ({ id, newFilename }) => ({ // Note: backend uses /file/:id
        url: `/file/${id}`,
        method: "PATCH",
        body: { newFilename },
      }),
      // Requires parentId to update the correct directory list cache
      async onQueryStarted({ id, newFilename, parentId }, { dispatch, queryFulfilled }) {
        const targetId = id.toString();

        // Optimistically rename the file in the parent directory's cached list
        const patchResult = dispatch(
          directoryApi.util.updateQueryData(
            "getDirectoryItems",
            parentId, // The parent directory's ID is the cache key
            (draft) => {
              // Assuming files are mixed with directories in 'draft.directories' or a generic 'items'
              const fileToRename = (draft.files || draft.items)?.find(
                (item) => item.id.toString() === targetId
              );
              if (fileToRename) {
                fileToRename.name = newFilename; // The file name field is 'name'
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback if the PATCH request fails
          patchResult.undo();
        }
      },
      // Invalidate the individual item tag for the file itself
      invalidatesTags: (result, error, { id }) => [
        { type: "DirectoryItem", id },
      ],
    }),


  }),
});

// Export hooks for use in components
export const {
  useGetDirectoryItemsQuery,
  useCreateDirectoryMutation,
  useDeleteDirectoryMutation,
  useRenameDirectoryMutation,
  useDeleteFileMutation,
  useRenameFileMutation
} = directoryApi;
