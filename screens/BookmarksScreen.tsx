/*import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { getBookmarkedJobs, removeBookmark } from '../services/database';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../types/types';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';

// Correct navigation prop type for BookmarksScreen
type BookmarksScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Bookmarks'>,
  StackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: BookmarksScreenNavigationProp;
};

const BookmarksScreen: React.FC<Props> = ({ navigation }) => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobs = await getBookmarkedJobs();
      setBookmarkedJobs(jobs.map(job => ({ ...job, isBookmarked: true })));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadBookmarks();
    }
  }, [isFocused]);

  const handleRemoveBookmark = async (jobId: number) => {
    try {
      await removeBookmark(jobId);
      setBookmarkedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      setError('Failed to remove bookmark. Please try again.');
    }
  };

  const renderItem = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleRemoveBookmark(item.id)}>
          <Ionicons name="bookmark" size={24} color="tomato" />
        </TouchableOpacity>
      </View>
      <Text style={styles.jobLocation}>{item.job_location_slug}</Text>
      <Text style={styles.jobSalary}>{item.salary_max}</Text>
      <Text style={styles.jobPhone}>{item.whatsapp_no}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadBookmarks}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (bookmarkedJobs.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No bookmarked jobs</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarkedJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: '600',
    color: 'green',
    marginBottom: 4,
  },
  jobPhone: {
    fontSize: 14,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryText: {
    color: 'tomato',
    fontWeight: 'bold',
  },
});

export default BookmarksScreen;*/
import React from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookmarks } from '../hooks/useBookmarks';
import { Job } from '../types/types';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F9FA',
  },
  emptyIcon: {
    opacity: 0.3,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#4E4E4E',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
    paddingLeft: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: '600',
    color: 'green',
    marginBottom: 4,
  },
});

export default function BookmarksScreen() {
  const { bookmarks, loading, toggleBookmark, isBookmarked } = useBookmarks();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>My Shortlist</Text>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="bookmark-outline"
          size={64}
          color="#1A1A2E"
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>Your Shortlist is Empty</Text>
        <Text style={styles.emptyText}>
          Save interesting positions by tapping the bookmark icon
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Shortlist ({bookmarks.length})</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.uniqueKey || item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => toggleBookmark(item)}>
                <Ionicons name="bookmark" size={24} color="tomato" />
              </TouchableOpacity>
            </View>
            <Text style={styles.jobLocation}>{item.job_location_slug}</Text>
            <Text style={styles.jobSalary}>
              {item.salary_min ? `₹${item.salary_min.toLocaleString('en-IN')}` : 'Salary not specified'}
              {item.salary_max && ` - ₹${item.salary_max.toLocaleString('en-IN')}`}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}