/*export type Job = {
  id: number;
  title: string;
  advertiser?: number;
  company_name?: string;
  city_location?: number;
  job_location_slug?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  whatsapp_no?: string;
  custom_link?: string;
  description?: string;
  isBookmarked?: boolean;
  job_category?: string;
  job_role?: string;
  other_details?: string;
  openings_count?: number;
  num_applications?: number;
  job_hours?: string;
  job_type?: number;
  is_premium?: boolean;
  is_applied?: boolean;
  // Add other fields you need from the API response
  [key: string]: any; // Allow additional dynamic properties
};
export type JobsResponse = {
  data: Job[];
  current_page: number;
  last_page: number;
  total?: number;
};*/
/*
export type Job = {
  id: number;  // Make id more flexible
  title: string;
  advertiser?: number;
  company_name?: string;
  city_location?: number;
  job_location_slug?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  whatsapp_no?: string;
  custom_link?: string;
  description?: string;
  isBookmarked?: boolean;
  job_category?: string;
  job_role?: string;
  other_details?: string;
  openings_count?: number;
  num_applications?: number;
  job_hours?: string;
  job_type?: number;
  is_premium?: boolean;
  is_applied?: boolean;
  primary_details?: {
    Place?: string;
    Salary?: string;
    Experience?: string;
  };
};

// Add this type for navigation params
export type RootStackParamList = {
  MainTabs: undefined;
  JobDetails: { jobId: string | number };  // Match Job's id type
  // Add other screens as needed
};*/

export interface Job {
  id: number;
  title: string;
  company_name?: string;
  job_location_slug?: string;
  salary_min?: number;
  salary_max?: number;
  whatsapp_no?: string;
  job_role?: string;
  description?: string;
  is_premium?: boolean;
  isBookmarked?: boolean;
  primary_details?: {
    Place?: string;
    Salary?: string;
    Experience?: string;
  };
  uniqueKey?: string;
}