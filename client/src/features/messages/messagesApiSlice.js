import { apiSlice } from '../api/apiSlice';

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/messages',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
    getAllMessagesAdmin: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.filter && params.filter !== 'all') {
          queryParams.append('filter', params.filter);
        }
        const str = queryParams.toString();
        return str ? `/messages?${str}` : '/messages';
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Message', id: _id })),
              { type: 'Message', id: 'LIST' },
            ]
          : [{ type: 'Message', id: 'LIST' }],
    }),
    getMessageById: builder.query({
      query: (id) => `/messages/${id}`,
      providesTags: (result, error, id) => [{ type: 'Message', id }],
      transformResponse: (response) => response.data,
    }),
    toggleMessageRead: builder.mutation({
      query: (id) => ({
        url: `/messages/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Message', id },
        { type: 'Message', id: 'LIST' },
      ],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Message', id },
        { type: 'Message', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetAllMessagesAdminQuery,
  useGetMessageByIdQuery,
  useToggleMessageReadMutation,
  useDeleteMessageMutation,
} = messagesApiSlice;
