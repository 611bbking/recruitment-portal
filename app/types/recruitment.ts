export type RecruitmentType = '校园招聘' | '社会招聘' | '招聘项目';
export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';
export type ApplicationStage = 'new' | 'screening' | 'first_interview' | 'second_interview' | 'offer' | 'pre_onboarding' | 'onboarded' | 'rejected' | 'withdrawn';

export type Job = {
  job_id: string;
  title: string;
  recruitment_type: RecruitmentType;
  job_category: string;
  department: string;
  business_unit: string;
  location: string;
  education_requirement: string;
  major_requirement: string;
  responsibilities: string[];
  requirements: string[];
  related_project_ids: string[];
  status: JobStatus;
  created_at: string;
  updated_at: string;
  is_mock: boolean;
};

export type RecruitmentProject = {
  project_id: string;
  project_name: string;
  project_type: string;
  recruitment_type: RecruitmentType;
  description: string;
  target_group: string;
  expected_time: string;
  status: 'coming_soon' | 'open' | 'ongoing' | 'closed' | 'following';
  status_label: string;
  is_featured: boolean;
  partner_organizations: string[];
  related_job_ids: string[];
  detail_href: string;
  brand_role: string;
};

export type ParsedResumeData = {
  name: string;
  phone: string;
  email: string;
  gender: string;
  birth_date: string;
  school: string;
  degree: string;
  major: string;
  graduation_date: string;
  preferred_city: string;
};

export type Candidate = {
  candidate_id: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  birth_date: string;
  school: string;
  highest_degree: string;
  major: string;
  graduation_date: string;
  preferred_city: string;
  resume_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Resume = {
  resume_id: string;
  candidate_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  parsed_data: ParsedResumeData;
  uploaded_at: string;
  updated_at: string;
};

export type Application = {
  application_id: string;
  candidate_id: string;
  job_id: string;
  project_id: string | null;
  status: ApplicationStage;
  owner_id: string;
  owner_name: string;
  rejection_reason: string | null;
  applied_at: string;
  created_at: string;
  updated_at: string;
};

export type Interview = {
  interview_id: string;
  application_id: string;
  candidate_id: string;
  job_id: string;
  round: '初试' | '复试' | '终试' | '其他';
  scheduled_at: string;
  interviewer: string;
  location: string;
  meeting_type: '线下' | '线上';
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
};

export type ApplicationActivity = {
  activity_id: string;
  application_id: string;
  activity_type: 'application_created' | 'stage_changed' | 'interview_scheduled' | 'interview_updated' | 'note_added';
  description: string;
  operator: string;
  created_at: string;
};

export type CandidateNote = {
  note_id: string;
  application_id: string;
  content: string;
  created_by: string;
  created_at: string;
};

export type HrUser = {
  hr_id: string;
  name: string;
  role: 'hr';
};
