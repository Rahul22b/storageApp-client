import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', 
});

export const directoryApi = createApi({
  reducerPath: 'directoryApi',
  baseQuery: baseQuery,
  tagTypes: ['DirectoryItem'],
  endpoints: (builder) => ({
    getDirectoryItems: builder.query({
      query: (dirId = "") => ({   
        url: `/directory/${dirId}`,
      }),
      providesTags: (result, error, dirId) => [{ type: 'DirectoryItem', id: dirId || 'ROOT' }],
    }),

createDirectory: builder.mutation({
    // Define the query endpoint details
    query: ({ dirId = "", newDirname }) => {
        // Validation moved to the client side before calling the hook, but kept here as a fallback
        if (!newDirname || newDirname.trim() === "") {
            // Throwing an error will prevent the request from being sent
            throw new Error('Directory name cannot be empty.');
        }
        const urlPath = dirId ? `/directory/${dirId}` : '/directory';
        
        return {
            url: urlPath, 
            method: 'POST',
            body: { dirname: newDirname }
        };
    },
    invalidatesTags: (result, error, { dirId = '' }) => [{ type: 'DirectoryItem', id: dirId || 'ROOT' }],
}),

    // 3. **deleteDirectory (Mutation)**
    deleteDirectory: builder.mutation({
      query: ({id}) => ({
        url: `/directory/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({id,parentId},{dispatch,queryFulfilled}){
        const targetId=id.toString();
        const patchResult=dispatch(
          directoryApi.util.updateQueryData(
            'getDirectoryItems',
            parentId,
            (draft)=>{
              if(draft.directories){
                draft.directories=draft.directories.filter(
                  item=>item.id.toString()!==targetId
                );
              }
            }
          )
        );

        try{
          await queryFulfilled;
        }
        catch{
          patchResult.undo();
        }
      },
      invalidatesTags:(result,error,{parentId})=>[{type:'DirectoryItem',id:parentId}]
    }),
    renameDirectory: builder.mutation({
     query: ({ id, newDirName }) => {
        // 💡 Validation Check (Optional but Recommended)
        if (!newDirName || newDirName.trim() === "") {
          throw new Error("New directory name cannot be empty.");
        }
        return {
          url: `/directory/${id}`,
          method: 'PATCH',
          body: { newDirName }, 
        };
      },
      // Optimistic Update Logic
      async onQueryStarted({ id, newDirName, parentId }, { dispatch, queryFulfilled }) {
        // Optimistically update the cached data *before* the API call returns
        const patchResult = dispatch(
          directoryApi.util.updateQueryData('getDirectoryItems', parentId, (draft) => {
            // Find the item to be renamed in the cached list

            const itemToRename = draft.directories?.find(item => item.id.toString() === id.toString())
            if (itemToRename) {
              itemToRename.name = newDirName; // Assuming the field is 'name'
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // If the API call fails, revert the optimistic change
          patchResult.undo();
        }
      },
      // Invalidation is optional with an optimistic update, but can be useful
  
      invalidatesTags: (result, error, { id }) => [{ type: 'DirectoryItem', id }],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetDirectoryItemsQuery,
  useCreateDirectoryMutation,
  useDeleteDirectoryMutation,
  useRenameDirectoryMutation,
} = directoryApi;




// {
//     
//     
//     
//     
//    
//     "updatedAt": "2025-11-04T08:59:03.112Z",
//     "__v": 0,
//     
//     
// 
// }


// {
//     "id": "temp-1762246806643",
//     "_id": "temp-1762246806643",
//     "name": "New Folder",
//     "parentDirId": "ROOT",
//     "size": 0,
//     "directories": [],
//     "files": [],
//     "createdAt": "2025-11-04T09:00:06.643Z"
// }