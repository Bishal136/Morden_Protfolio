import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link2,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  useUploadImageMutation,
  useUploadVideoMutation,
} from '../../features/upload/uploadApiSlice';
import { VideoPlayer } from './VideoPlayer';

export const MediaUploadField = ({
  type = 'image', // 'image' | 'video'
  label,
  value = '',
  onChange,
  placeholderUrl = '',
  helpText = '',
  required = false,
}) => {
  const isImage = type === 'image';
  const [activeTab, setActiveTab] = useState(
    value && !value.startsWith('/uploads/') ? 'link' : 'upload'
  );
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();
  const [uploadVideo, { isLoading: isUploadingVideo }] = useUploadVideoMutation();
  const isUploading = isUploadingImage || isUploadingVideo;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    setUploadError('');

    const isVideoFile = file.type.startsWith('video/');
    const isImageFile = file.type.startsWith('image/');

    if (isImage && !isImageFile) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }

    if (!isImage && !isVideoFile) {
      setUploadError('Please select a valid video file (MP4, WebM, OGG, MOV, MKV).');
      return;
    }

    // Size limit check
    if (isImage && file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit.');
      return;
    }
    if (!isImage && file.size > 100 * 1024 * 1024) {
      setUploadError('Video size exceeds 100MB limit.');
      return;
    }

    const formData = new FormData();
    try {
      if (isImage) {
        formData.append('image', file);
        const res = await uploadImage(formData).unwrap();
        if (res?.data?.url) {
          onChange(res.data.url);
        }
      } else {
        formData.append('video', file);
        const res = await uploadVideo(formData).unwrap();
        if (res?.data?.url) {
          onChange(res.data.url);
        }
      }
    } catch (err) {
      setUploadError(
        err?.data?.message || err?.message || `Failed to upload ${type}. Please try again.`
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          {isImage ? (
            <ImageIcon size={14} className="text-cyan-400" />
          ) : (
            <VideoIcon size={14} className="text-purple-400" />
          )}
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </label>

        {/* Tab Toggle */}
        <div className="inline-flex rounded-xl bg-slate-950 p-0.5 border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud size={12} />
            <span>Upload {isImage ? 'Image' : 'Video'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              activeTab === 'link'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 size={12} />
            <span>Direct Link / URL</span>
          </button>
        </div>
      </div>

      {/* Upload Error banner */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Mode 1: File Upload (Drag & Drop Zone) */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={
              isImage
                ? 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
                : 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska'
            }
            onChange={handleFileChange}
            className="hidden"
          />

          {!value ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  {isUploading ? (
                    <RefreshCw size={22} className="animate-spin text-cyan-400" />
                  ) : (
                    <UploadCloud size={24} className={isImage ? 'text-cyan-400' : 'text-purple-400'} />
                  )}
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-blue-400 hover:underline">
                    {isUploading ? `Uploading ${type}...` : 'Click to upload'}
                  </span>{' '}
                  or drag & drop
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {isImage
                    ? 'JPG, PNG, WEBP, GIF, SVG (Max 15MB)'
                    : 'MP4, WebM, OGG, MOV (Max 100MB)'}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {activeTab === 'link' && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder={
                placeholderUrl ||
                (isImage
                  ? 'https://images.unsplash.com/...'
                  : 'https://www.youtube.com/watch?v=... or direct .mp4 link')
              }
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {helpText ||
              (isImage
                ? 'Provide any public image URL (Unsplash, Imgur, CDN, etc.).'
                : 'Supports YouTube (watch/shorts/embed), Vimeo, or direct MP4 video URLs.')}
          </p>
        </div>
      )}

      {/* Live Preview & Management Box if a value is set */}
      {value ? (
        <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium truncate">
              <CheckCircle2 size={14} className="shrink-0" />
              <span className="truncate max-w-xs font-mono text-[11px] text-slate-300">
                {value}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 transition-colors flex items-center gap-1"
                title="Replace file"
              >
                <RefreshCw size={11} />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 transition-colors"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Media Preview Box */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            {isImage ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <VideoPlayer
                videoUrl={value}
                title="Video Preview"
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MediaUploadField;
