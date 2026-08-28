import { jobs as baseJobs } from '../data/jobs.ts';
import { recruitmentProjects as baseProjects } from '../data/projects.ts';
import { mockHrUsers, seededActivities, seededApplications, seededCandidates, seededInterviews, seededNotes, seededResumes } from '../data/hr-mock.ts';
import type { Application, ApplicationActivity, ApplicationStage, Candidate, CandidateNote, HrUser, Interview, Job, RecruitmentProject, Resume } from '../types/recruitment';
export { mockHrUsers };

const HR_AUTH_KEY = 'grand-careers.mock-hr-auth';
const PORTAL_CANDIDATE_KEY = 'grand-careers.mock-candidate';
const PORTAL_APPLICATIONS_KEY = 'grand-careers.mock-applications';
const PORTAL_RESUMES_KEY = 'grand-careers.mock-resumes';
const APPLICATION_OVERRIDES_KEY = 'grand-careers.hr-application-overrides';
const ACTIVITIES_KEY = 'grand-careers.hr-activities';
const NOTES_KEY = 'grand-careers.hr-notes';
const INTERVIEWS_KEY = 'grand-careers.hr-interviews';
const JOBS_KEY = 'grand-careers.hr-jobs';
const PROJECTS_KEY = 'grand-careers.hr-projects';

const canUseStorage = () => typeof window !== 'undefined';
const read = <T,>(key: string, fallback: T): T => { if (!canUseStorage()) return fallback; try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; } };
const write = <T,>(key: string, value: T) => { if (canUseStorage()) localStorage.setItem(key, JSON.stringify(value)); };
const now = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const applicationStageLabels: Record<ApplicationStage, string> = { new: '新投递', screening: '简历筛选', first_interview: '初试', second_interview: '复试', offer: 'Offer', pre_onboarding: '待入职', onboarded: '已入职', rejected: '已淘汰', withdrawn: '候选人放弃' };
export const applicationStageOrder: ApplicationStage[] = ['new', 'screening', 'first_interview', 'second_interview', 'offer', 'pre_onboarding', 'onboarded'];
export const rejectionReasons = ['岗位匹配度不足', '经验 / 能力不匹配', '学历 / 专业不匹配', '候选人意愿不足', '其他'];
export const withdrawalReasons = ['接受其他 Offer', '个人原因', '岗位意愿变化', '无法联系', '其他'];

export const mockHrLogin = (hrId = 'hr-zhang') => { const user = mockHrUsers.find((item) => item.hr_id === hrId) ?? mockHrUsers[0]; write(HR_AUTH_KEY, user); return user; };
export const getMockHrUser = () => read<HrUser | null>(HR_AUTH_KEY, null);
export const isMockHrAuthenticated = () => Boolean(getMockHrUser());
export const mockHrLogout = () => { if (canUseStorage()) localStorage.removeItem(HR_AUTH_KEY); };

export const getHrCandidates = (): Candidate[] => {
  const portalCandidate = read<Candidate | null>(PORTAL_CANDIDATE_KEY, null);
  return portalCandidate && !seededCandidates.some((item) => item.candidate_id === portalCandidate.candidate_id) ? [...seededCandidates, portalCandidate] : [...seededCandidates];
};

export const getHrResumes = (): Resume[] => [...seededResumes, ...read<Resume[]>(PORTAL_RESUMES_KEY, [])];

export const getHrApplications = (): Application[] => {
  const portal = read<Application[]>(PORTAL_APPLICATIONS_KEY, []);
  const overrides = read<Record<string, Application>>(APPLICATION_OVERRIDES_KEY, {});
  return [...seededApplications, ...portal].map((application) => overrides[application.application_id] ?? application);
};

const saveApplication = (application: Application) => {
  const overrides = read<Record<string, Application>>(APPLICATION_OVERRIDES_KEY, {}); write(APPLICATION_OVERRIDES_KEY, { ...overrides, [application.application_id]: application });
};

export const getApplicationById = (applicationId: string) => getHrApplications().find((item) => item.application_id === applicationId);

export const getActivities = (applicationId?: string): ApplicationActivity[] => {
  const portalActivities = read<Application[]>(PORTAL_APPLICATIONS_KEY, []).map((application) => ({ activity_id: `ACT-${application.application_id}`, application_id: application.application_id, activity_type: 'application_created' as const, description: '候选人通过招聘门户提交职位申请', operator: '候选人', created_at: application.created_at }));
  const all = [...seededActivities, ...portalActivities, ...read<ApplicationActivity[]>(ACTIVITIES_KEY, [])].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return applicationId ? all.filter((item) => item.application_id === applicationId) : all;
};

const addActivity = (activity: Omit<ApplicationActivity, 'activity_id' | 'created_at'>) => {
  const current = read<ApplicationActivity[]>(ACTIVITIES_KEY, []); write(ACTIVITIES_KEY, [...current, { ...activity, activity_id: makeId('ACT'), created_at: now() }]);
};

export const updateApplicationStage = (applicationId: string, stage: ApplicationStage, reason?: string) => {
  const application = getApplicationById(applicationId); if (!application) throw new Error('未找到申请记录');
  const operator = getMockHrUser()?.name ?? 'Mock HR';
  const updated: Application = { ...application, status: stage, rejection_reason: stage === 'rejected' || stage === 'withdrawn' ? reason ?? null : null, updated_at: now() };
  saveApplication(updated); addActivity({ application_id: applicationId, activity_type: 'stage_changed', description: `HR 将状态更新为${applicationStageLabels[stage]}${reason ? `：${reason}` : ''}`, operator }); return updated;
};

export const assignApplicationOwner = (applicationId: string, ownerId: string) => {
  const application = getApplicationById(applicationId); const owner = mockHrUsers.find((item) => item.hr_id === ownerId); if (!application || !owner) throw new Error('负责人更新失败');
  const updated = { ...application, owner_id: owner.hr_id, owner_name: owner.name, updated_at: now() }; saveApplication(updated); return updated;
};

export const getCandidateNotes = (applicationId?: string): CandidateNote[] => {
  const all = [...seededNotes, ...read<CandidateNote[]>(NOTES_KEY, [])].sort((a, b) => b.created_at.localeCompare(a.created_at)); return applicationId ? all.filter((item) => item.application_id === applicationId) : all;
};

export const addCandidateNote = (applicationId: string, content: string) => {
  const operator = getMockHrUser()?.name ?? 'Mock HR'; const note: CandidateNote = { note_id: makeId('N'), application_id: applicationId, content, created_by: operator, created_at: now() };
  write(NOTES_KEY, [...read<CandidateNote[]>(NOTES_KEY, []), note]); addActivity({ application_id: applicationId, activity_type: 'note_added', description: '新增一条 HR 内部备注', operator }); return note;
};

export const getHrInterviews = () => read<Interview[]>(INTERVIEWS_KEY, seededInterviews);

export const scheduleInterview = (input: Omit<Interview, 'interview_id' | 'status' | 'created_at' | 'updated_at'>) => {
  const timestamp = now(); const interview: Interview = { ...input, interview_id: makeId('I'), status: 'scheduled', created_at: timestamp, updated_at: timestamp };
  write(INTERVIEWS_KEY, [...getHrInterviews(), interview]); const operator = getMockHrUser()?.name ?? 'Mock HR'; addActivity({ application_id: input.application_id, activity_type: 'interview_scheduled', description: `安排${input.round}：${input.interviewer} · ${input.meeting_type}`, operator });
  const application = getApplicationById(input.application_id); if (application && input.round === '初试' && ['new', 'screening'].includes(application.status)) updateApplicationStage(input.application_id, 'first_interview'); if (application && input.round === '复试' && application.status !== 'second_interview') updateApplicationStage(input.application_id, 'second_interview');
  return interview;
};

export const updateInterviewStatus = (interviewId: string, status: Interview['status']) => {
  const interviews = getHrInterviews(); const target = interviews.find((item) => item.interview_id === interviewId); if (!target) throw new Error('未找到面试记录'); const updated = { ...target, status, updated_at: now() };
  write(INTERVIEWS_KEY, interviews.map((item) => item.interview_id === interviewId ? updated : item)); addActivity({ application_id: target.application_id, activity_type: 'interview_updated', description: `面试状态更新为${status === 'completed' ? '已完成' : status === 'cancelled' ? '已取消' : '已安排'}`, operator: getMockHrUser()?.name ?? 'Mock HR' }); return updated;
};

export const getManagedJobs = (): Job[] => read<Job[]>(JOBS_KEY, baseJobs);
export const saveManagedJobs = (jobs: Job[]) => write(JOBS_KEY, jobs);
export const getManagedProjects = (): RecruitmentProject[] => read<RecruitmentProject[]>(PROJECTS_KEY, baseProjects);
export const saveManagedProjects = (projects: RecruitmentProject[]) => write(PROJECTS_KEY, projects);

export const INTERVIEW_INVITE_URL = process.env.NEXT_PUBLIC_INTERVIEW_INVITE_URL ?? '';
export const buildInterviewInvitePayload = (interview: Interview) => {
  const candidate = getHrCandidates().find((item) => item.candidate_id === interview.candidate_id); const job = getManagedJobs().find((item) => item.job_id === interview.job_id);
  return { candidate_id: interview.candidate_id, application_id: interview.application_id, name: candidate?.name ?? '', phone: candidate?.phone ?? '', email: candidate?.email ?? '', job_title: job?.title ?? '', interview_round: interview.round, interview_time: interview.scheduled_at, interviewer: interview.interviewer, location: interview.location };
};
