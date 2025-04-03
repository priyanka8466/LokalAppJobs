import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { bookmarkJob, isJobBookmarked, removeBookmark } from '../services/database';
import { RootStackParamList } from '../navigation/AppNavigator';

type JobDetailsScreenRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;
type JobDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JobDetails'>;

type Props = {
  route: JobDetailsScreenRouteProp;
  navigation: JobDetailsScreenNavigationProp;
};

const JobDetailsScreen: React.FC<Props> = ({ route }) => {
  const { job } = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Load bookmark status
  useEffect(() => {
    const checkBookmark = async () => {
      const bookmarked = await isJobBookmarked(job.id);
      setIsBookmarked(bookmarked);
    };
    checkBookmark();
  }, [job.id]);

  const handleToggleBookmark = async () => {
    if (isBookmarked) {
      await removeBookmark(job.id);
    } else {
      await bookmarkJob(job);
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <TouchableOpacity onPress={handleToggleBookmark}>
          <Ionicons 
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
            size={24} 
            color={isBookmarked ? 'tomato' : 'black'} 
          />
        </TouchableOpacity>
      </View>

      {job.company_name && (
        <Text style={styles.company}>{job.company_name}</Text>
      )}

      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={18} color="#666" />
        <Text style={styles.detailText}>
          {job.job_location_slug || 'Location not specified'}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="cash-outline" size={18} color="#666" />
        <Text style={styles.detailText}>
          {job.salary_min ? `₹${job.salary_min.toLocaleString('en-IN')}` : 'Salary not specified'}
          {job.salary_max && ` - ₹${job.salary_max.toLocaleString('en-IN')}`}
        </Text>
      </View>

      {job.whatsapp_no && (
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={18} color="#666" />
          <Text style={styles.detailText}>Contact: {job.whatsapp_no}</Text>
        </View>
      )}

      {job.job_role && (
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={18} color="#666" />
          <Text style={styles.detailText}>Role: {job.job_role}</Text>
        </View>
      )}

      {job.description && (
        <>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.sectionContent}>{job.description}</Text>
        </>
      )}

      {job.primary_details?.Experience && (
        <>
          <Text style={styles.sectionTitle}>Experience Required</Text>
          <Text style={styles.sectionContent}>{job.primary_details.Experience}</Text>
        </>
      )}

      {/* Add more sections for other job details as needed */}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#FF6B35', 
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    //color: '#', 
    marginRight: 10,
  },
  company: {
    fontSize: 18,
    //color: '#FF914D', 
    fontWeight: '600',
    marginBottom: 20,
    //backgroundColor: '#FFF0E5',
    padding: 10,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    //backgroundColor: '#FFF0E5',
    borderRadius: 8,
  },
  detailIcon: {
    width: 30,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    //color: '#FF6B35', // Orange shade
    paddingLeft: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    //color: '#4E4E4E',
    //backgroundColor: '#FFF0E5',
    padding: 16,
    borderRadius: 8,
  },
  premiumBadge: {
   // backgroundColor: '#FF914D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  premiumText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  salaryHighlight: {
    //color: '#FF6B35',
    fontWeight: '700',
  },
  contactButton: {
    //backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});


export default JobDetailsScreen;