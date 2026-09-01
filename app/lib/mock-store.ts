import type { Application, Candidate, ParsedResumeData, Resume } from '../types/recruitment';

const AUTH_KEY = 'grand-careers.mock-auth';
const CANDIDATE_KEY = 'grand-careers.mock-candidate';
const RESUMES_KEY = 'grand-careers.mock-resumes';
const APPLICATIONS_KEY = 'grand-careers.mock-applications';
const HR_APPLICATION_OVERRIDES_KEY = 'grand-careers.hr-application-overrides';

const canUseStorage = () => typeof window !== 'undefined';
const now = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const read = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; }
};

const write = <T,>(key: string, value: T) => {
  if (canUseStorage()) localStorage.setItem(key, JSON.stringify(value));
};

export const isMockAuthenticated = () => read<boolean>(AUTH_KEY, false);

export const getMockCandidate = () => read<Candidate | null>(CANDIDATE_KEY, null);

export const mockLogin = (identifier: string): Candidate => {
  const existing = getMockCandidate();
  const timestamp = now();
  const candidate: Candidate = existing ?? {
    candidate_id: 'C-MOCK-001',
    name: '王晨',
    phone: identifier.includes('@') ? '13800000000' : identifier,
    email: identifier.includes('@') ? identifier : 'wangchen@example.com',
    gender: '', birth_date: '', school: '', school_level: '其他', highest_degree: '', major: '', major_category: '其他', graduation_date: '', graduation_year: '', preferred_city: '', resume_id: null,
    created_at: timestamp, updated_at: timestamp,
  };
  write(AUTH_KEY, true); write(CANDIDATE_KEY, candidate); return candidate;
};

export const mockRegister = (name: string, phone: string, email: string): Candidate => {
  const timestamp = now();
  const candidate: Candidate = { candidate_id: makeId('C'), name, phone, email, gender: '', birth_date: '', school: '', school_level: '其他', highest_degree: '', major: '', major_category: '其他', graduation_date: '', graduation_year: '', preferred_city: '', resume_id: null, created_at: timestamp, updated_at: timestamp };
  write(AUTH_KEY, true); write(CANDIDATE_KEY, candidate); return candidate;
};

export const mockLogout = () => { if (canUseStorage()) localStorage.removeItem(AUTH_KEY); };

export const updateMockCandidate = (data: ParsedResumeData): Candidate => {
  const current = getMockCandidate();
  if (!current) throw new Error('请先登录候选人账号');
  const candidate: Candidate = { ...current, name: data.name, phone: data.phone, email: data.email, gender: data.gender, birth_date: data.birth_date, school: data.school, highest_degree: data.degree, major: data.major, graduation_date: data.graduation_date, graduation_year: data.graduation_date.slice(0, 4), preferred_city: data.preferred_city, updated_at: now() };
  write(CANDIDATE_KEY, candidate); return candidate;
};

export const saveMockResume = (candidateId: string, file: File, parsedData: ParsedResumeData): Resume => {
  const timestamp = now();
  const resume: Resume = { resume_id: makeId('R'), candidate_id: candidateId, file_name: file.name, file_type: file.type || file.name.split('.').pop() || '', file_url: `mock://resumes/${encodeURIComponent(file.name)}`, parsed_data: parsedData, uploaded_at: timestamp, updated_at: timestamp };
  const resumes = read<Resume[]>(RESUMES_KEY, []); write(RESUMES_KEY, [...resumes, resume]);
  const candidate = getMockCandidate(); if (candidate) write(CANDIDATE_KEY, { ...candidate, resume_id: resume.resume_id, updated_at: timestamp });
  return resume;
};

export const getMockApplications = () => {
  const overrides = read<Record<string, Application>>(HR_APPLICATION_OVERRIDES_KEY, {});
  return read<Application[]>(APPLICATIONS_KEY, []).map((application) => overrides[application.application_id] ?? application);
};

export const hasDuplicateApplication = (candidateId: string, jobId: string, projectId: string | null) => getMockApplications().some((application) => application.candidate_id === candidateId && application.job_id === jobId && application.project_id === projectId);

export const createMockApplication = (candidateId: string, jobId: string, projectId: string | null): Application => {
  if (hasDuplicateApplication(candidateId, jobId, projectId)) throw new Error('你已经申请过该职位');
  const timestamp = now();
  const application: Application = { application_id: makeId('A'), candidate_id: candidateId, job_id: jobId, project_id: projectId, recruitment_type: projectId ? 'project' : 'campus', status: 'new', owner_id: 'hr-zhang', owner_name: 'HR 张老师', rejection_reason: null, rejection_note: null, rejected_at: null, rejected_by: null, source: projectId ? '招聘项目' : '官网', is_deleted: false, deleted_at: null, applied_at: timestamp, created_at: timestamp, updated_at: timestamp };
  write(APPLICATIONS_KEY, [...getMockApplications(), application]); return application;
};

export const publicStatusLabels = { new: '已投递', screening: '筛选中', first_interview: '面试中', second_interview: '面试中', interview_passed: '面试中', offer_pending: '面试中', offer: '面试中', pre_onboarding: '面试中', onboarded: '已结束', rejected: '已结束', withdrawn: '已结束' } as const;
