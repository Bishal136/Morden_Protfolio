import { apiSlice } from '../api/apiSlice';

export const commentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByProject: builder.query({
      query: (projectIdOrSlug) => `/projects/${projectIdOrSlug}/comments`,
      providesTags: (result, error, projectIdOrSlug) => [
        { type: 'Comment', id: projectIdOrSlug },
        { type: 'Comment', id: 'LIST' },
      ],
      transformResponse: (response) => response.data,
    }),
    addComment: builder.mutation({
      query: ({ projectIdOrSlug, ...commentData }) => ({
        url: `/projects/${projectIdOrSlug}/comments`,
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { projectIdOrSlug }) => [
        { type: 'Comment', id: projectIdOrSlug },
        { type: 'Project', id: projectIdOrSlug },
        { type: 'Comment', id: 'LIST' },
      ],
    }),
    getAllCommentsAdmin: builder.query({
      query: () => '/comments/admin',
      providesTags: [{ type: 'Comment', id: 'ADMIN_LIST' }],
      transformResponse: (response) => response.data,
    }),
    toggleCommentApproval: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        { type: 'Comment', id: 'LIST' },
        { type: 'Comment', id: 'ADMIN_LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Comment', id: 'LIST' },
        { type: 'Comment', id: 'ADMIN_LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCommentsByProjectQuery,
  useAddCommentMutation,
  useGetAllCommentsAdminQuery,
  useToggleCommentApprovalMutation,
  useDeleteCommentMutation,
} = commentsApiSlice;
