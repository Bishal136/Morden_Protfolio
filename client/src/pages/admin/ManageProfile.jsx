import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Save,
  CheckCircle,
  AlertCircle,
  Mail,
} from 'lucide-react';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { GithubIcon, LinkedinIcon } from '../../components/common/SocialIcons';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '../../features/profile/profileApiSlice';
import { Skeleton } from '../../components/common/Skeleton';
import MediaUploadField from '../../components/common/MediaUploadField';

export const ManageProfile = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    tagline: '',
    aboutText: '',
    photoUrl: '',
    aboutPhotoUrl: '',
    resumeUrl: '',
    socialLinks: {
      github: '',
      linkedin: '',
      email: '',
    },
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        tagline: profile.tagline || '',
        aboutText: profile.aboutText || '',
        photoUrl: profile.photoUrl || '',
        aboutPhotoUrl: profile.aboutPhotoUrl || '',
        resumeUrl: profile.resumeUrl || '',
        socialLinks: {
          github: profile.socialLinks?.github || '',
          linkedin: profile.socialLinks?.linkedin || '',
          email: profile.socialLinks?.email || '',
        },
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialKey]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    try {
      await updateProfile(formData).unwrap();
      setFeedback({
        type: 'success',
        message: 'Profile information updated successfully!',
      });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      const detailedErrors = err?.data?.errors?.map((e) => e.message).join(', ');
      setFeedback({
        type: 'error',
        message: detailedErrors || err?.data?.message || 'Failed to update profile.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Profile & About Me</h1>
          <p className="text-xs text-slate-400 mt-1">
            Update your personal brand details, hero copy, bio, and social connections.
          </p>
        </div>
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

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
            Primary Identification & Hero Copy
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Professional Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tagline / Subheading
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              About Me (Bio Paragraphs)
            </label>
            <textarea
              name="aboutText"
              rows={5}
              value={formData.aboutText}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Media & URLs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
            Media & External Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MediaUploadField
              type="image"
              label="Hero Profile Photo"
              value={formData.photoUrl}
              onChange={(url) => setFormData({ ...formData, photoUrl: url })}
              placeholderUrl="https://... or /ME.jpg"
              helpText="Upload a portrait photo or provide an image link."
            />

            <MediaUploadField
              type="image"
              label="About Section Circular Photo"
              value={formData.aboutPhotoUrl}
              onChange={(url) => setFormData({ ...formData, aboutPhotoUrl: url })}
              placeholderUrl="https://... or /ME.jpg"
              helpText="Upload a circular portrait or provide an image link."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Resume / CV Download URL
            </label>
            <input
              type="text"
              name="resumeUrl"
              placeholder="https://example.com/resume.pdf"
              value={formData.resumeUrl}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
            Social Profiles & Contact Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <GithubIcon size={14} /> GitHub Profile
              </label>
              <input
                type="url"
                name="social_github"
                value={formData.socialLinks.github}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <LinkedinIcon size={14} /> LinkedIn Profile
              </label>
              <input
                type="url"
                name="social_linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail size={14} /> Contact Email
              </label>
              <input
                type="email"
                name="social_email"
                value={formData.socialLinks.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Save size={16} />
            <span>{isUpdating ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageProfile;
