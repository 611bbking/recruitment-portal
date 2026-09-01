import type { Application, Candidate, Interview, Job, RecruitmentChannel } from '../types/recruitment';

export type RecruitmentDashboardFilter = {
  recruitmentType: '' | RecruitmentChannel;
  jobId: string;
};

export type DistributionItem = {
  label: string;
  count: number;
  percentage: number;
};

const resumePassedStages = new Set(['screening', 'first_interview', 'second_interview', 'interview_passed', 'offer_pending', 'offer', 'pre_onboarding', 'onboarded']);
const interviewStages = new Set(['first_interview', 'second_interview', 'interview_passed', 'offer_pending', 'offer', 'pre_onboarding', 'onboarded']);
const offerStages = new Set(['offer', 'pre_onboarding', 'onboarded']);
const acceptedOfferStages = new Set(['pre_onboarding', 'onboarded']);

export const filterRecruitmentApplications = (applications: Application[], filter: RecruitmentDashboardFilter) => applications.filter((application) => (
  !application.is_deleted
  && (!filter.recruitmentType || application.recruitment_type === filter.recruitmentType)
  && (!filter.jobId || application.job_id === filter.jobId)
));

export const hasPassedResume = (application: Application) => resumePassedStages.has(application.status);
export const hasEnteredInterview = (application: Application) => interviewStages.has(application.status);
export const hasEnteredOffer = (application: Application) => offerStages.has(application.status);

export const getRecruitmentStats = (applications: Application[], interviews: Interview[]) => {
  const active = applications.filter((item) => !item.is_deleted);
  const completedInterviewApplicationIds = new Set(interviews.filter((item) => item.status === 'completed').map((item) => item.application_id));
  const pending = active.filter((item) => item.status === 'new'
    || item.status === 'interview_passed'
    || item.status === 'offer_pending'
    || item.status === 'offer'
    || (item.status === 'second_interview' && completedInterviewApplicationIds.has(item.application_id)));
  return {
    received: active.length,
    resumePassed: active.filter(hasPassedResume).length,
    interviewed: active.filter(hasEnteredInterview).length,
    offers: active.filter(hasEnteredOffer).length,
    pending: pending.length,
  };
};

export const getRecruitmentFunnel = (applications: Application[]) => {
  const active = applications.filter((item) => !item.is_deleted);
  const stages = [
    { key: 'received', label: '收到简历', count: active.length },
    { key: 'resume-passed', label: '简历通过', count: active.filter(hasPassedResume).length },
    { key: 'interview', label: '进入面试', count: active.filter(hasEnteredInterview).length },
    { key: 'offer', label: 'Offer', count: active.filter(hasEnteredOffer).length },
    { key: 'accepted', label: '接受 Offer / 待入职', count: active.filter((item) => acceptedOfferStages.has(item.status)).length },
  ];
  return stages.map((stage, index) => ({
    ...stage,
    conversion: index === 0 ? 100 : stages[index - 1].count === 0 ? 0 : Math.round((stage.count / stages[index - 1].count) * 1000) / 10,
  }));
};

export const getTodoStats = (applications: Application[], interviews: Interview[]) => {
  const active = applications.filter((item) => !item.is_deleted);
  const scheduledIds = new Set(interviews.filter((item) => item.status === 'scheduled').map((item) => item.application_id));
  const completedIds = new Set(interviews.filter((item) => item.status === 'completed').map((item) => item.application_id));
  return [
    { key: 'screening', label: '待筛选简历', count: active.filter((item) => item.status === 'new').length, stage: 'new' },
    { key: 'arrange', label: '待安排面试', count: active.filter((item) => item.status === 'screening' && !scheduledIds.has(item.application_id)).length, stage: 'screening' },
    { key: 'feedback', label: '面试完成待反馈', count: active.filter((item) => item.status === 'second_interview' && completedIds.has(item.application_id)).length, stage: 'second_interview' },
    { key: 'offer', label: '待发 Offer', count: active.filter((item) => item.status === 'offer_pending').length, stage: 'offer_pending' },
    { key: 'onboarding', label: '待确认入职', count: active.filter((item) => item.status === 'pre_onboarding').length, stage: 'pre_onboarding' },
  ];
};

export const getJobStats = (applications: Application[], jobs: Job[]) => jobs.map((job) => {
  const related = applications.filter((item) => !item.is_deleted && item.job_id === job.job_id);
  const passed = related.filter(hasPassedResume).length;
  return {
    jobId: job.job_id,
    jobTitle: job.title,
    received: related.length,
    resumePassed: passed,
    resumePassRate: related.length ? Math.round((passed / related.length) * 1000) / 10 : 0,
    interviews: related.filter(hasEnteredInterview).length,
    offers: related.filter(hasEnteredOffer).length,
  };
});

const buildDistribution = (values: string[], preferredOrder: string[] = []): DistributionItem[] => {
  const counts = values.reduce<Record<string, number>>((result, value) => {
    const label = value || '其他';
    result[label] = (result[label] ?? 0) + 1;
    return result;
  }, {});
  const total = values.length;
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count, percentage: total ? Math.round((count / total) * 1000) / 10 : 0 }))
    .sort((a, b) => {
      const aOrder = preferredOrder.indexOf(a.label);
      const bOrder = preferredOrder.indexOf(b.label);
      if (aOrder >= 0 || bOrder >= 0) return (aOrder < 0 ? 999 : aOrder) - (bOrder < 0 ? 999 : bOrder);
      return b.count - a.count || a.label.localeCompare(b.label, 'zh-CN');
    });
};

export const getCandidateProfileStats = (applications: Application[], candidates: Candidate[]) => {
  const candidateIds = new Set(applications.filter((item) => !item.is_deleted && hasPassedResume(item)).map((item) => item.candidate_id));
  const passedCandidates = candidates.filter((candidate) => candidateIds.has(candidate.candidate_id));
  const sourceByCandidate = new Map<string, string>();
  applications.filter((item) => !item.is_deleted && hasPassedResume(item)).forEach((item) => {
    if (!sourceByCandidate.has(item.candidate_id)) sourceByCandidate.set(item.candidate_id, item.source);
  });
  return {
    total: passedCandidates.length,
    education: buildDistribution(passedCandidates.map((item) => item.highest_degree || '其他'), ['本科', '硕士', '博士', '其他']),
    schoolLevel: buildDistribution(passedCandidates.map((item) => item.school_level), ['985', '211', '双一流', '海外高校', '其他本科', '其他']),
    major: buildDistribution(passedCandidates.map((item) => item.major_category), ['金融/经济', '化工', '数学/统计', '计算机', '工程', '语言', '管理', '其他']),
    graduationYear: buildDistribution(passedCandidates.map((item) => item.graduation_year ? `${item.graduation_year} 届` : '其他')),
    source: buildDistribution(passedCandidates.map((item) => sourceByCandidate.get(item.candidate_id) ?? '其他'), ['官网', '校园宣讲', '内推', '招聘平台', '招聘项目', '其他']),
  };
};
