
import axios from 'axios';
import { Job } from '../types/types';

const API_URL = 'https://testapi.getlokalapp.com/common/jobs';

export const fetchJobs = async (page: number, limit: number): Promise<Job[]> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page,
        limit,
      },
      timeout: 15000,
    });

    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Invalid API response format');
    }

    return response.data.results.map((job: any) => ({
      id: job.id?.toString() || Math.random().toString(),
      title: job.title || 'No title available',
      company_name: job.company_name,
      job_location_slug: job.job_location_slug,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      whatsapp_no: job.whatsapp_no,
      job_role: job.job_role,
      description: job.description,
      is_premium: job.is_premium,
      primary_details: {
        Place: job.primary_details?.Place || job.job_location_slug || 'Not specified',
        Salary: job.primary_details?.Salary || 
          (job.salary_min ? `₹${job.salary_min.toLocaleString('en-IN')}` : 'Not specified') +
          (job.salary_max ? ` - ₹${job.salary_max.toLocaleString('en-IN')}` : ''),
        Experience: job.primary_details?.Experience || 'Not specified',
      },
    }));
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch jobs. Please try again later.');
  }
};
