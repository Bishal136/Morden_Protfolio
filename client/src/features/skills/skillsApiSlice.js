import { apiSlice } from '../api/apiSlice';

export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSkills: builder.query({
      query: (category) => (category ? `/skills?category=${category}` : '/skills'),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Skill', id: _id })),
              { type: 'Skill', id: 'LIST' },
            ]
          : [{ type: 'Skill', id: 'LIST' }],
      transformResponse: (response) => response.data,
    }),
    getAllSkillsAdmin: builder.query({
      query: () => '/skills/admin',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Skill', id: _id })),
              { type: 'Skill', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Skill', id: 'ADMIN_LIST' }],
      transformResponse: (response) => response.data,
    }),
    createSkill: builder.mutation({
      query: (skill) => ({
        url: '/skills',
        method: 'POST',
        body: skill,
      }),
      invalidatesTags: [
        { type: 'Skill', id: 'LIST' },
        { type: 'Skill', id: 'ADMIN_LIST' },
      ],
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/skills/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Skill', id },
        { type: 'Skill', id: 'LIST' },
        { type: 'Skill', id: 'ADMIN_LIST' },
      ],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Skill', id: 'LIST' },
        { type: 'Skill', id: 'ADMIN_LIST' },
      ],
    }),
    reorderSkills: builder.mutation({
      query: (items) => ({
        url: '/skills/reorder',
        method: 'PUT',
        body: { items },
      }),
      invalidatesTags: [
        { type: 'Skill', id: 'LIST' },
        { type: 'Skill', id: 'ADMIN_LIST' },
      ],
    }),
  }),
});

export const {
  useGetSkillsQuery,
  useGetAllSkillsAdminQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useReorderSkillsMutation,
} = skillsApiSlice;
