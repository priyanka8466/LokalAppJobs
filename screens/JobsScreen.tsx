import React, { useState, useEffect, useCallback } from 'react';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Button
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchJobs } from '../services/api';
import { useBookmarks } from '../hooks/useBookmarks';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Job } from '../types/types';

const PAGE_SIZE = 10;

const JobsScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const fetchJobData = useCallback(async (currentPage: number) => {
    try {
      const newJobs = await fetchJobs(currentPage, PAGE_SIZE);
      if (newJobs.length === 0 || newJobs.length < PAGE_SIZE) {
        setHasMore(false);
      }
      return newJobs;
    } catch (err) {
      //setError(err.message || 'Failed to load jobs');
      throw err;
    }
  }, []);

  const loadJobs = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newJobs = await fetchJobData(page);
      if (newJobs.length === 0 || newJobs.length < PAGE_SIZE) {
        setHasMore(false);
        console.log('No more jobs available');
      }
      setJobs((prevJobs) => [...prevJobs, ...newJobs]);
      setPage((prevPage) => prevPage + 1);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchJobData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    try {
      const newJobs = await fetchJobData(1);
      setJobs(newJobs);
    } finally {
      setRefreshing(false);
    }
  }, [fetchJobData]);

  useEffect(() => {
    loadJobs();
  }, []);

  const handleEndReached = useCallback(() => {
    if (!loading && hasMore) {
      loadJobs();
    }
  }, [loading, hasMore, loadJobs]);
  const renderItem = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      {item.is_premium && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>
      )}
      
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title || 'No title available'}</Text>
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleBookmark(item);
          }}
        >
          <Ionicons 
            name={isBookmarked(item.id) ? 'bookmark' : 'bookmark-outline'} 
            size={22} 
            color={isBookmarked(item.id) ? 'tomato':'Gray'} 
          />
        </TouchableOpacity>
      </View>
      
      {item.company_name && (
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={16} color="#6D6D6D" />
          </View>
          <Text style={styles.jobCompany}>{item.company_name}</Text>
        </View>
      )}
      
      <View style={styles.detailRow}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={16} color="#6D6D6D" />
        </View>
        <Text style={styles.jobLocation}>
          {item.job_location_slug || 'Location not specified'}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={16} color="#6D6D6D" />
        </View>
        <Text style={styles.jobSalary}>
          {item.salary_min ? `₹${item.salary_min.toLocaleString('en-IN')}` : 'Salary not specified'}
          {item.salary_max && ` - ₹${item.salary_max.toLocaleString('en-IN')}`}
        </Text>
      </View>
      
      {item.whatsapp_no && (
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="call-outline" size={16} color="#6D6D6D" />
          </View>
          <Text style={styles.jobPhone}>{item.whatsapp_no}</Text>
        </View>
      )}
      
      {item.job_role && (
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={16} color="#6D6D6D" />
          </View>
          <Text style={styles.jobRole}>{item.job_role}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  /*const renderItem = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title || 'No title available'}</Text>
        <TouchableOpacity onPress={() => toggleBookmark(item)}>
          <Ionicons 
            name={isBookmarked(item.id) ? 'bookmark' : 'bookmark-outline'} 
            size={24} 
            color={isBookmarked(item.id) ? 'tomato' : 'black'} 
          />
        </TouchableOpacity>
      </View>
      
      {item.company_name && (
        <Text style={styles.jobCompany}>{item.company_name}</Text>
      )}
      
      <Text style={styles.jobLocation}>
        {item.job_location_slug || 'Location not specified'}
      </Text>
      
      <Text style={styles.jobSalary}>
        {item.salary_min ? `₹${item.salary_min.toLocaleString('en-IN')}` : 'Salary not specified'}
        {item.salary_max && ` - ₹${item.salary_max.toLocaleString('en-IN')}`}
      </Text>
      
      {item.whatsapp_no && (
        <Text style={styles.jobPhone}>Contact: {item.whatsapp_no}</Text>
      )}
      
      {item.job_role && (
        <Text style={styles.jobRole}>Role: {item.job_role}</Text>
      )}
    </View>*/
  

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Retry"
          onPress={() => {
            setError(null);
            loadJobs();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item, index) => `job-${item.id}-${index}`}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && hasMore ? (
            <ActivityIndicator size="large" color="tomato" style={styles.loader} />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['tomato']}
            tintColor="tomato"
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.emptyContainer}>
              <Text>No jobs found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headingContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 14,
    color: '#6D6D6D',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  loader: {
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#E94560',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    color: '#16213E',
    lineHeight: 24,
  },
  jobCompany: {
    fontSize: 14,
    color: '#4A4A4A',
    marginTop: 2,
    marginBottom: 8,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  jobLocation: {
    fontSize: 14,
    color: '#5E5E5E',
  },
  jobSalary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32', // Darker green
  },
  jobPhone: {
    fontSize: 14,
    color: '#424242',
  },
  jobRole: {
    fontSize: 14,
    color: '#5E5E5E',
    fontStyle: 'italic',
  },
  premiumBadge: {
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  premiumText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    color: '#A0A0A0',
  },
  emptyText: {
    color: '#6D6D6D',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  bookmarkButton: {
    padding: 4,
    marginLeft: 8,
  },
});
export default JobsScreen;