/**
 * Parses and identifies the video type (YouTube, Vimeo, direct MP4/WebM/upload, or generic embed)
 */
export const parseVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return { type: 'none', url: '' };

  const trimmed = url.trim();

  // 1. YouTube (watch?v=, youtu.be/, embed/, shorts/)
  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
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

export default parseVideoUrl;
