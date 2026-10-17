import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  FolderGit2,
  X,
  PlusCircle,
  Image as ImageIcon,
  Film,
} from 'lucide-react';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import {
  useGetAllProjectsAdminQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '../../features/projects/projectsApiSlice';
import Modal from '../../components/common/Modal';
import Tag from '../../components/common/Tag';
import { Skeleton } from '../../components/common/Skeleton';
import MediaUploadField from '../../components/common/MediaUploadField';

export const ManageProjects = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: projects, isLoading } = useGetAllProjectsAdminQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form State
  const initialFormState = {
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    coverImageUrl: '',
    images: [],
    demoVideoUrl: '',
    videos: [],
    role: 'Full-Stack Developer',
    duration: '',
    liveSiteUrl: '',
    githubRepoUrl: '',
    techStack: '',
    features: [{ title: '', description: '' }],
    isFeatured: false,
    isPublished: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const openCreateModal = () => {
    setEditingProjectId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProjectId(project._id);

    const coverImg = (project.coverImageUrl || '').trim();
    const rawImages = Array.isArray(project.images)
      ? project.images
          .map((img) => (typeof img === 'string' ? img.trim() : ''))
          .filter(Boolean)
      : [];

    // Additional screenshots should not duplicate the cover image
    const additionalScreenshots = coverImg
      ? rawImages.filter((img) => img !== coverImg)
      : rawImages.slice(1);
    const resolvedCoverImg = coverImg || rawImages[0] || '';

    const demoVideo = (project.demoVideoUrl || '').trim();
    const rawVideos = Array.isArray(project.videos)
      ? project.videos
          .map((v) => (typeof v === 'string' ? v.trim() : ''))
          .filter(Boolean)
      : [];
    const additionalVideos = demoVideo
      ? rawVideos.filter((v) => v !== demoVideo)
      : rawVideos.slice(1);
    const resolvedDemoVideo = demoVideo || rawVideos[0] || '';

    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      shortDescription: project.shortDescription || '',
      fullDescription: project.fullDescription || '',
      coverImageUrl: resolvedCoverImg,
      images: additionalScreenshots,
      demoVideoUrl: resolvedDemoVideo,
      videos: additionalVideos,
      role: project.role || 'Full-Stack Developer',
      duration: project.duration || '',
      liveSiteUrl: project.liveSiteUrl || '',
      githubRepoUrl: project.githubRepoUrl || '',
      techStack: Array.isArray(project.techStack)
        ? project.techStack.join(', ')
        : '',
      features:
        Array.isArray(project.features) && project.features.length > 0
          ? project.features.map((f) => ({
              title: f.title || '',
              description: f.description || '',
            }))
          : [{ title: '', description: '' }],
      isFeatured: !!project.isFeatured,
      isPublished: project.isPublished !== undefined ? project.isPublished : true,
    });
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: '', description: '' }],
    });
  };

  const handleRemoveFeature = (index) => {
    const updated = formData.features.filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      features: updated.length > 0 ? updated : [{ title: '', description: '' }],
    });
  };

  const handleFeatureChange = (index, field, value) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData({ ...formData, features: updated });
  };

  // Multiple Screenshots Handlers
  const handleAddScreenshot = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ''],
    }));
  };

  const handleMultipleScreenshotsUpload = (newUrls) => {
    setFormData((prev) => {
      const existing = (prev.images || []).filter(Boolean);
      return {
        ...prev,
        images: [...existing, ...newUrls],
      };
    });
  };

  const handleScreenshotChange = (index, url) => {
    const updated = [...(formData.images || [])];
    updated[index] = url;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const handleRemoveScreenshot = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== index),
    }));
  };

  // Multiple Walkthrough Videos Handlers
  const handleAddVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), ''],
    }));
  };

  const handleVideoChange = (index, url) => {
    const updated = [...(formData.videos || [])];
    updated[index] = url;
    setFormData((prev) => ({ ...prev, videos: updated }));
  };

  const handleRemoveVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      videos: (prev.videos || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    // Format techStack array
    const formattedTechStack = formData.techStack
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Format features array
    const formattedFeatures = formData.features.filter(
      (f) => f.title.trim() && f.description.trim()
    );

    // Sanitize image & video arrays
    const sanitizedImages = (formData.images || [])
      .map((img) => (typeof img === 'string' ? img.trim() : ''))
      .filter(Boolean);

    const sanitizedVideos = (formData.videos || [])
      .map((vid) => (typeof vid === 'string' ? vid.trim() : ''))
      .filter(Boolean);

    // Determine primary assets with sensible fallbacks
    const coverImageUrl = formData.coverImageUrl?.trim() || sanitizedImages[0] || '';
    const demoVideoUrl = formData.demoVideoUrl?.trim() || sanitizedVideos[0] || '';

    // Merge cover image and demo video into respective galleries if not already present
    const fullImages = Array.from(new Set([coverImageUrl, ...sanitizedImages].filter(Boolean)));
    const fullVideos = Array.from(new Set([demoVideoUrl, ...sanitizedVideos].filter(Boolean)));

    const payload = {
      ...formData,
      coverImageUrl,
      demoVideoUrl,
      images: fullImages,
      videos: fullVideos,
      slug: formData.slug && formData.slug.trim() ? formData.slug.trim() : undefined,
      techStack: formattedTechStack,
      features: formattedFeatures,
    };

    try {
      if (editingProjectId) {
        await updateProject({ id: editingProjectId, ...payload }).unwrap();
        setFeedback({
          type: 'success',
          message: 'Project updated successfully!',
        });
      } else {
        await createProject(payload).unwrap();
        setFeedback({
          type: 'success',
          message: 'Project created successfully!',
        });
      }
      setIsModalOpen(false);
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      const detailedErrors = err?.data?.errors?.map((e) => e.message).join(', ');
      setFeedback({
        type: 'error',
        message: detailedErrors || err?.data?.message || 'Operation failed. Check input details.',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id).unwrap();
      setDeleteConfirmId(null);
      setFeedback({
        type: 'success',
        message: 'Project deleted successfully.',
      });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.data?.message || 'Failed to delete project.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Manage Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add, update, or remove portfolio showcase projects.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/30"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/80 border border-red-800 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Projects Table / List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {projects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                          {project.coverImageUrl ? (
                            <img
                              src={project.coverImageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <FolderGit2 size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                            <span>{project.title}</span>
                            {project.isFeatured && (
                              <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800 px-1.5 py-0.2 rounded font-sans">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-slate-500 font-mono text-[11px]">
                              /{project.slug}
                            </span>
                            {((project.images?.length || (project.coverImageUrl ? 1 : 0)) > 0 ||
                              (project.videos?.length || (project.demoVideoUrl ? 1 : 0)) > 0) && (
                              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700/60 font-mono flex items-center gap-1.5">
                                <span>📷 {project.images?.length || (project.coverImageUrl ? 1 : 0)}</span>
                                <span>🎬 {project.videos?.length || (project.demoVideoUrl ? 1 : 0)}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.techStack?.slice(0, 3).map((t, idx) => (
                          <Tag key={idx} size="xs">
                            {t}
                          </Tag>
                        ))}
                        {project.techStack?.length > 3 && (
                          <span className="text-[10px] text-slate-500">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          project.isPublished
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {project.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View on site"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-300 transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(project._id)}
                          className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            No projects found. Click "Add Project" to create one.
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProjectId ? 'Edit Project' : 'Create New Project'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MERN E-Commerce Store"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Slug (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. mern-ecommerce-store"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Description (Card summary) *
            </label>
            <input
              type="text"
              required
              placeholder="Brief 1-2 sentence description of the project"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Description (Detailed project overview) *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Full in-depth walkthrough of the project and architecture..."
              value={formData.fullDescription}
              onChange={(e) =>
                setFormData({ ...formData, fullDescription: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Full-Stack Developer"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 3 Months"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Live Site URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={formData.liveSiteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, liveSiteUrl: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Repo URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.githubRepoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubRepoUrl: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* MEDIA SECTION: MULTIPLE IMAGES & MULTIPLE VIDEOS */}
          <div className="space-y-5 pt-3 border-t border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ImageIcon size={16} className="text-sky-400" />
                <span>Project Screenshots & Image Gallery</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload or link multiple high-resolution architecture diagrams, feature screenshots, and UI mockups.
              </p>
            </div>

            {/* Primary Cover Image */}
            <MediaUploadField
              type="image"
              label="Primary Cover Image / Thumbnail *"
              value={formData.coverImageUrl}
              onChange={(url) =>
                setFormData({ ...formData, coverImageUrl: url })
              }
              placeholderUrl="https://images.unsplash.com/..."
              helpText="Primary card thumbnail and default showcase banner. Upload (JPG, PNG, WEBP, SVG up to 15MB) or enter URL."
            />

            {/* Additional Screenshot Items */}
            <div className="space-y-4 pl-3 border-l-2 border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    Additional Screenshots ({formData.images?.length || 0})
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Upload multiple screenshots at once, or manage individual slots.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddScreenshot}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors self-start sm:self-auto"
                >
                  <PlusCircle size={13} />
                  <span>+ Add Single Slot</span>
                </button>
              </div>

              {/* Batch Multi-File Uploader */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-dashed border-sky-800/60">
                <MediaUploadField
                  type="image"
                  multiple={true}
                  label="Upload Multiple Screenshots at Once (Batch Upload)"
                  onMultipleUpload={handleMultipleScreenshotsUpload}
                  placeholderUrl=""
                  helpText="Select or drag & drop multiple screenshot files (JPG, PNG, WEBP, SVG). All images will be instantly uploaded and appended below."
                />
              </div>

              {formData.images && formData.images.length > 0 ? (
                formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        Screenshot #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Remove screenshot"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <MediaUploadField
                      type="image"
                      label=""
                      value={imgUrl}
                      onChange={(url) => handleScreenshotChange(idx, url)}
                      placeholderUrl="https://images.unsplash.com/... or uploaded file"
                      helpText="Upload a screenshot file or paste a direct image URL."
                    />
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic py-1">
                  No additional screenshots added yet. Click &quot;Add Screenshot&quot; to include more gallery images.
                </div>
              )}
            </div>

            {/* VIDEO SECTION */}
            <div className="pt-4 border-t border-slate-800/80 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Film size={16} className="text-amber-400" />
                  <span>Walkthrough Videos & Demonstrations</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Embed or upload video recordings, Loom walkthroughs, and YouTube demos.
                </p>
              </div>

              {/* Primary Demo Video */}
              <MediaUploadField
                type="video"
                label="Primary Walkthrough Demo Video"
                value={formData.demoVideoUrl}
                onChange={(url) =>
                  setFormData({ ...formData, demoVideoUrl: url })
                }
                placeholderUrl="https://www.youtube.com/watch?v=... or direct MP4 URL"
                helpText="Upload an MP4/WebM file (up to 100MB) or enter a YouTube/Vimeo embed link."
              />

              {/* Additional Video Items */}
              <div className="space-y-3 pl-3 border-l-2 border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Additional Videos ({formData.videos?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVideo}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-semibold transition-colors"
                  >
                    <PlusCircle size={13} />
                    <span>Add Video</span>
                  </button>
                </div>

                {formData.videos && formData.videos.length > 0 ? (
                  formData.videos.map((vidUrl, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/80 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">
                          Additional Video #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(idx)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Remove video"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <MediaUploadField
                        type="video"
                        label=""
                        value={vidUrl}
                        onChange={(url) => handleVideoChange(idx, url)}
                        placeholderUrl="https://www.youtube.com/... or uploaded MP4"
                        helpText="Upload a video file or paste a video link."
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic py-1">
                    No additional videos added. Click &quot;Add Video&quot; to include extra walkthrough recordings.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="React, Node.js, Express, MongoDB, Redux"
              value={formData.techStack}
              onChange={(e) =>
                setFormData({ ...formData, techStack: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Dynamic Feature Blocks */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-200">
                Key Features & Architecture
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
              >
                <PlusCircle size={14} />
                <span>Add Feature</span>
              </button>
            </div>

            {formData.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800"
              >
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Feature Title (e.g. Stripe Payment Gateway)"
                    value={feature.title}
                    onChange={(e) =>
                      handleFeatureChange(idx, 'title', e.target.value)
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Brief description of implementation..."
                    value={feature.description}
                    onChange={(e) =>
                      handleFeatureChange(idx, 'description', e.target.value)
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
              />
              <span>Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
              />
              <span>Published (Publicly Visible)</span>
            </label>
          </div>

          {/* Modal Feedback Banner */}
          {feedback.message && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                  : 'bg-red-950/80 border border-red-800 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle size={15} />
              ) : (
                <AlertCircle size={15} />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              {isCreating || isUpdating
                ? 'Saving...'
                : editingProjectId
                ? 'Save Changes'
                : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Project Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently delete this project and all associated public comments? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirmId)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-600/30"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageProjects;
