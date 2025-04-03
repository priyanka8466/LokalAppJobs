import { useState, useEffect } from 'react';
import { Job } from '../types/types';
import { bookmarkJob, getBookmarkedJobs, removeBookmark } from '../services/database';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeBookmarks = async () => {
      try {
        const savedBookmarks = await getBookmarkedJobs();
        const bookmarksWithKeys = savedBookmarks.map((bookmark: Job) => ({
          ...bookmark,
          uniqueKey: bookmark.uniqueKey || `${bookmark.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }));
        setBookmarks(bookmarksWithKeys);
      } catch (err) {
        setError('Failed to load bookmarks');
        console.error('Failed to load bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeBookmarks();
  }, []);

  const toggleBookmark = async (job: Job) => {
    try {
      const exists = bookmarks.some((b) => b.id === job.id);
      if (exists) {
        await removeBookmark(job.id);
        setBookmarks(prev => prev.filter((b) => b.id !== job.id));
      } else {
        await bookmarkJob(job);
        setBookmarks(prev => [
          ...prev,
          {
            ...job,
            uniqueKey: job.uniqueKey || `${job.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          },
        ]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to update bookmark');
      console.error('Failed to update bookmark:', err);
    }
  };

  const isBookmarked = (jobId: string | number) => {
    return bookmarks.some((b) => b.id.toString() === jobId.toString());
  };

  return {
    bookmarks,
    loading,
    error,
    toggleBookmark,
    isBookmarked,
  };
}