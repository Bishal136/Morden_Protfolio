import React from 'react';
import { Play } from 'lucide-react';

/**
 * Parses and identifies the video type (YouTube, Vimeo, direct MP4/WebM/upload, or generic embed)
 */
export const parseVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return { type: 'none', url: '' };

  const trimmed = url.trim();

  // 1. YouTube (watch?v=, youtu.be/, embed/, shorts/)
  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      type: 'youtube',
      url: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&rel=0`,
      id: youtubeMatch[1],
    };
  }

  // 2. Vimeo (vimeo.com/123456)
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      id: vimeoMatch[1],
    };
  }

  // 3. Direct video file (/uploads/videos/..., .mp4, .webm, .ogg, .mov, blob:)
  const isDirectVideo =
    trimmed.startsWith('/uploads/videos/') ||
    trimmed.startsWith('blob:') ||
    /\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i.test(trimmed);

  if (isDirectVideo) {
    return {
      type: 'direct',
      url: trimmed,
    };
  }

  // 4. Default URL (may be generic embed or external host)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      type: 'iframe',
      url: trimmed,
    };
  }

  return {
    type: 'direct',
    url: trimmed,
  };
};

/**
 * Universal video walkthrough player supporting uploaded files, YouTube, Vimeo, and direct links
 */
export const VideoPlayer = ({
  videoUrl,
  fallbackImageUrl,
  title = 'Project Demo',
  className = '',
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
        controls
        playsInline
        preload="metadata"
        className={`w-full h-full object-contain bg-slate-950 rounded-2xl ${className}`}
      />
    );
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center group ${className}`}>
      {fallbackImageUrl ? (
        <>
          <img
            src={fallbackImageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 rounded-2xl"
          />
          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/90 text-white flex items-center justify-center shadow-2xl shadow-blue-600/50 group-hover:scale-110 group-hover:bg-blue-500 transition-all cursor-pointer">
              <Play size={28} className="fill-current ml-1" />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 text-xs font-mono">
          No Video or Cover Image
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
