import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job } from '../types/types';

const BOOKMARKS_KEY = 'bookmarked_jobs';

export const initDatabase = async (): Promise<void> => {
  // AsyncStorage doesn't need initialization
  console.log('AsyncStorage ready');
};

export const bookmarkJob = async (job: Job): Promise<void> => {
  try {
    const bookmarks = await getBookmarkedJobs();
    const existingIndex = bookmarks.findIndex(b => b.id === job.id);
    
    if (existingIndex >= 0) {
      bookmarks[existingIndex] = job;
    } else {
      bookmarks.push({ ...job, isBookmarked: true });
    }
    
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error bookmarking job:', error);
    throw error;
  }
};

export const removeBookmark = async (jobId: number): Promise<void> => {
  try {
    const bookmarks = await getBookmarkedJobs();
    const updatedBookmarks = bookmarks.filter(job => job.id !== jobId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const getBookmarkedJobs = async (): Promise<Job[]> => {
  try {
    const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};

export const isJobBookmarked = async (jobId: number): Promise<boolean> => {
  try {
    const bookmarks = await getBookmarkedJobs();
    return bookmarks.some(job => job.id === jobId);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    throw error;
  }
};