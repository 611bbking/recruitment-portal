import type { Application, ApplicationActivity, Candidate, CandidateNote, HrUser, Interview, Resume } from '../types/recruitment';

export const mockHrUsers: HrUser[] = [
  { hr_id: 'hr-zhang', name: 'HR 张老师', role: 'hr' },
  { hr_id: 'hr-li', name: 'HR 李老师', role: 'hr' },
];

export const seededCandidates: Candidate[] = [
  { candidate_id: 'C-HR-001', name: '张三', phone: '13800001001', email: 'zhangsan@example.com', gender: '男', birth_date: '2003-04', school: '浙江大学', highest_degree: '硕士', major: '化学工程', graduation_date: '2027-06', preferred_city: '宁波', resume_id: 'R-HR-001', created_at: '2026-08-25T09:20:00+08:00', updated_at: '2026-08-28T14:30:00+08:00' },
  { candidate_id: 'C-HR-002', name: '李雯', phone: '13800001002', email: 'liwen@example.com', gender: '女', birth_date: '2002-11', school: '宁波大学', highest_degree: '本科', major: '国际经济与贸易', graduation_date: '2027-06', preferred_city: '宁波', resume_id: 'R-HR-002', created_at: '2026-08-26T10:40:00+08:00', updated_at: '2026-08-28T16:15:00+08:00' },
  { candidate_id: 'C-HR-003', name: '陈浩', phone: '13800001003', email: 'chenhao@example.com', gender: '男', birth_date: '2001-08', school: '复旦大学', highest_degree: '硕士', major: '金融工程', graduation_date: '2027-06', preferred_city: '上海', resume_id: 'R-HR-003', created_at: '2026-08-27T11:10:00+08:00', updated_at: '2026-08-29T09:10:00+08:00' },
];

export const seededApplications: Application[] = [
  { application_id: 'A-HR-001', candidate_id: 'C-HR-001', job_id: 'researcher', project_id: 'summer-exploration', status: 'new', owner_id: 'hr-zhang', owner_name: 'HR 张老师', rejection_reason: null, applied_at: '2026-08-28T10:20:00+08:00', created_at: '2026-08-28T10:20:00+08:00', updated_at: '2026-08-28T10:20:00+08:00' },
  { application_id: 'A-HR-002', candidate_id: 'C-HR-001', job_id: 'sales-representative', project_id: null, status: 'screening', owner_id: 'hr-li', owner_name: 'HR 李老师', rejection_reason: null, applied_at: '2026-08-27T13:10:00+08:00', created_at: '2026-08-27T13:10:00+08:00', updated_at: '2026-08-28T14:30:00+08:00' },
  { application_id: 'A-HR-003', candidate_id: 'C-HR-002', job_id: 'business-assistant', project_id: 'kunpeng-program', status: 'first_interview', owner_id: 'hr-zhang', owner_name: 'HR 张老师', rejection_reason: null, applied_at: '2026-08-26T10:40:00+08:00', created_at: '2026-08-26T10:40:00+08:00', updated_at: '2026-08-28T16:15:00+08:00' },
  { application_id: 'A-HR-004', candidate_id: 'C-HR-003', job_id: 'researcher', project_id: 'kunpeng-program', status: 'second_interview', owner_id: 'hr-li', owner_name: 'HR 李老师', rejection_reason: null, applied_at: '2026-08-27T11:10:00+08:00', created_at: '2026-08-27T11:10:00+08:00', updated_at: '2026-08-29T09:10:00+08:00' },
];

export const seededResumes: Resume[] = seededCandidates.map((candidate, index) => ({
  resume_id: candidate.resume_id!, candidate_id: candidate.candidate_id, file_name: `${candidate.name}-简历.pdf`, file_type: 'application/pdf', file_url: `mock://hr-resumes/${candidate.resume_id}`,
  parsed_data: { name: candidate.name, phone: candidate.phone, email: candidate.email, gender: candidate.gender, birth_date: candidate.birth_date, school: candidate.school, degree: candidate.highest_degree, major: candidate.major, graduation_date: candidate.graduation_date, preferred_city: candidate.preferred_city },
  uploaded_at: `2026-08-${25 + index}T09:20:00+08:00`, updated_at: candidate.updated_at,
}));

export const seededInterviews: Interview[] = [
  { interview_id: 'I-HR-001', application_id: 'A-HR-003', candidate_id: 'C-HR-002', job_id: 'business-assistant', round: '初试', scheduled_at: '2026-09-01T14:00:00+08:00', interviewer: '王经理', location: '远大中心 8F 会议室', meeting_type: '线下', status: 'scheduled', notes: '重点了解英文沟通与细节处理能力。', created_at: '2026-08-28T16:15:00+08:00', updated_at: '2026-08-28T16:15:00+08:00' },
  { interview_id: 'I-HR-002', application_id: 'A-HR-004', candidate_id: 'C-HR-003', job_id: 'researcher', round: '复试', scheduled_at: '2026-09-02T10:30:00+08:00', interviewer: '赵总监', location: 'https://meeting.example/mock-room', meeting_type: '线上', status: 'scheduled', notes: '讨论产业研究案例。', created_at: '2026-08-29T09:10:00+08:00', updated_at: '2026-08-29T09:10:00+08:00' },
];

export const seededActivities: ApplicationActivity[] = [
  { activity_id: 'ACT-001', application_id: 'A-HR-001', activity_type: 'application_created', description: '候选人通过暑期探索营投递研究员', operator: '候选人', created_at: '2026-08-28T10:20:00+08:00' },
  { activity_id: 'ACT-002', application_id: 'A-HR-002', activity_type: 'application_created', description: '候选人通过职位中心投递业务员', operator: '候选人', created_at: '2026-08-27T13:10:00+08:00' },
  { activity_id: 'ACT-003', application_id: 'A-HR-002', activity_type: 'stage_changed', description: 'HR 将状态更新为简历筛选', operator: 'HR 李老师', created_at: '2026-08-28T14:30:00+08:00' },
  { activity_id: 'ACT-004', application_id: 'A-HR-003', activity_type: 'interview_scheduled', description: '安排初试：王经理 · 线下', operator: 'HR 张老师', created_at: '2026-08-28T16:15:00+08:00' },
  { activity_id: 'ACT-005', application_id: 'A-HR-004', activity_type: 'interview_scheduled', description: '安排复试：赵总监 · 线上', operator: 'HR 李老师', created_at: '2026-08-29T09:10:00+08:00' },
];

export const seededNotes: CandidateNote[] = [
  { note_id: 'N-HR-001', application_id: 'A-HR-004', content: '研究能力较强，对期货市场有兴趣。', created_by: 'HR 李老师', created_at: '2026-08-29T09:05:00+08:00' },
  { note_id: 'N-HR-002', application_id: 'A-HR-003', content: '英语沟通良好，做事细致。', created_by: 'HR 张老师', created_at: '2026-08-28T16:10:00+08:00' },
];
