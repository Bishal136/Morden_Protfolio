import React from 'react';
import { ZoomIn, Eye } from 'lucide-react';
import { parseVideoUrl } from '../../utils/videoUtils';

/**
 * Universal video walkthrough player supporting uploaded files, YouTube, Vimeo, and direct links
 */
export const VideoPlayer = ({
  videoUrl,
  fallbackImageUrl,
  title = 'Project Demo',
  className = '',
  onExpandImage,
}) => {
  const videoInfo = parseVideoUrl(videoUrl);

  if (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'iframe') {
    return (
      <iframe
        src={videoInfo.url}
        title={title}
        className={`w-full h-full object-cover border-0 rounded-2xl ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (videoInfo.type === 'direct' && videoInfo.url) {
    return (
      <video
        src={videoInfo.url}
        poster={fallbackImageUrl}
        controls
        playsInline
        preload="metadata"
        className={`w-full h-full object-contain bg-slate-950 rounded-2xl ${className}`}
      />
    );
  }

  // When no video URL is provided, display high-resolution image with expand action
  return (
    <div
      onClick={onExpandImage}
      className={`relative w-full h-full flex items-center justify-center group overflow-hidden ${
        onExpandImage ? 'cursor-pointer' : ''
      } ${className}`}
      role={onExpandImage ? 'button' : undefined}
      tabIndex={onExpandImage ? 0 : undefined}
      onKeyDown={(e) => {
        if (onExpandImage && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onExpandImage();
        }
      }}
      aria-label={onExpandImage ? `View full resolution preview of ${title}` : title}
    >
      {fallbackImageUrl ? (
        <>
          <img
            src={fallbackImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
          />
          <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/50 flex items-center justify-center transition-colors rounded-2xl">
            <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-white/20 text-slate-100 flex items-center gap-2 text-xs font-mono font-semibold shadow-xl group-hover:scale-105 group-hover:border-sky-400/50 group-hover:text-sky-300 transition-all">
              <ZoomIn size={16} className="text-sky-400" />
              <span>Inspect Fullscreen</span>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-2 p-6 text-center">
          <Eye size={24} className="text-slate-600" />
          <span>Visual Architecture Asset Available on Request</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
