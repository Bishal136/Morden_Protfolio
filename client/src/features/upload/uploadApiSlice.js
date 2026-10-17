import { apiSlice } from '../api/apiSlice';

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/upload/image',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: '/upload/images',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadVideo: builder.mutation({
      query: (formData) => ({
        url: '/upload/video',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useUploadImageMutation,
  useUploadImagesMutation,
  useUploadVideoMutation,
} = uploadApiSlice;
