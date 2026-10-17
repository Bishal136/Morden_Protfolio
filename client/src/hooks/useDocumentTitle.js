import { useEffect } from 'react';

/**
 * Custom hook to dynamically update document title and restore previous on unmount.
 * @param {string} title
 * @param {string} suffix
 */
export const useDocumentTitle = (title, suffix = 'Bishal Biswas — Full-Stack MERN Developer') => {
  useEffect(() => {
    const originalTitle = document.title;
    if (title) {
      document.title = title.includes('Bishal Biswas') ? title : `${title} | ${suffix}`;
    }
    return () => {
      document.title = originalTitle;
    };
  }, [title, suffix]);
};

export default useDocumentTitle;
