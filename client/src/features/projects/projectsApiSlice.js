import { apiSlice } from '../api/apiSlice';

export const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.tag && params.tag !== 'All') searchParams.append('tag', params.tag);
        if (params.featured) searchParams.append('featured', 'true');
        const queryStr = searchParams.toString();
        return queryStr ? `/projects?${queryStr}` : '/projects';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Project', id: _id })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
      transformResponse: (response) => response.data,
    }),
    getAllProjectsAdmin: builder.query({
      query: () => '/projects/admin/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Project', id: _id })),
              { type: 'Project', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Project', id: 'ADMIN_LIST' }],
      transformResponse: (response) => response.data,
    }),
    getProjectBySlug: builder.query({
      query: (slug) => `/projects/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Project', id: slug }],
      transformResponse: (response) => response.data,
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/id/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
      transformResponse: (response) => response.data,
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: [
        { type: 'Project', id: 'LIST' },
        { type: 'Project', id: 'ADMIN_LIST' },
      ],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
        { type: 'Project', id: 'ADMIN_LIST' },
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Project', id: 'LIST' },
        { type: 'Project', id: 'ADMIN_LIST' },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetAllProjectsAdminQuery,
  useGetProjectBySlugQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApiSlice;
