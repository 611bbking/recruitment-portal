import type {
  Application,
  ApplicationActivity,
  Candidate,
  CandidateNote,
  HrUser,
  Interview,
  Resume,
} from '../types/recruitment';

export const mockHrUsers: HrUser[] = [
  { hr_id: 'hr-zhang', name: 'HR 张老师', role: 'hr' },
  { hr_id: 'hr-li', name: 'HR 李老师', role: 'hr' },
];

export const seededCandidates: Candidate[] = [
  { candidate_id: 'C-HR-001', name: '张三', phone: '13800001001', email: 'zhangsan@example.com', gender: '男', birth_date: '2003-04', school: '浙江大学', school_level: '985', highest_degree: '硕士', major: '化学工程', major_category: '化工', graduation_date: '2027-06', graduation_year: '2027', preferred_city: '宁波', resume_id: 'R-HR-001', created_at: '2026-08-25T09:20:00+08:00', updated_at: '2026-08-28T14:30:00+08:00' },
  { candidate_id: 'C-HR-002', name: '李雯', phone: '13800001002', email: 'liwen@example.com', gender: '女', birth_date: '2002-11', school: '宁波大学', school_level: '其他本科', highest_degree: '本科', major: '国际经济与贸易', major_category: '金融/经济', graduation_date: '2027-06', graduation_year: '2027', preferred_city: '宁波', resume_id: 'R-HR-002', created_at: '2026-08-26T10:40:00+08:00', updated_at: '2026-08-28T16:15:00+08:00' },
  { candidate_id: 'C-HR-003', name: '陈浩', phone: '13800001003', email: 'chenhao@example.com', gender: '男', birth_date: '2001-08', school: '复旦大学', school_level: '985', highest_degree: '硕士', major: '金融工程', major_category: '金融/经济', graduation_date: '2027-06', graduation_year: '2027', preferred_city: '上海', resume_id: 'R-HR-003', created_at: '2026-08-27T11:10:00+08:00', updated_at: '2026-08-29T09:10:00+08:00' },
  { candidate_id: 'C-HR-004', name: '周雨', phone: '13800001004', email: 'zhouyu@example.com', gender: '女', birth_date: '2001-12', school: '伦敦大学学院', school_level: '海外高校', highest_degree: '硕士', major: '统计学', major_category: '数学/统计', graduation_date: '2026-09', graduation_year: '2026', preferred_city: '上海', resume_id: 'R-HR-004', created_at: '2026-08-27T15:10:00+08:00', updated_at: '2026-08-30T11:20:00+08:00' },
  { candidate_id: 'C-HR-005', name: '王博', phone: '13800001005', email: 'wangbo@example.com', gender: '男', birth_date: '2003-02', school: '北京科技大学', school_level: '211', highest_degree: '本科', major: '计算机科学与技术', major_category: '计算机', graduation_date: '2027-06', graduation_year: '2027', preferred_city: '宁波', resume_id: 'R-HR-005', created_at: '2026-08-28T09:30:00+08:00', updated_at: '2026-08-30T13:40:00+08:00' },
  { candidate_id: 'C-HR-006', name: '孙悦', phone: '13800001006', email: 'sunyue@example.com', gender: '女', birth_date: '2002-06', school: '上海外国语大学', school_level: '双一流', highest_degree: '硕士', major: '英语口译', major_category: '语言', graduation_date: '2026-06', graduation_year: '2026', preferred_city: '宁波', resume_id: 'R-HR-006', created_at: '2026-08-28T11:30:00+08:00', updated_at: '2026-08-31T09:20:00+08:00' },
  { candidate_id: 'C-HR-007', name: '刘洋', phone: '13800001007', email: 'liuyang@example.com', gender: '男', birth_date: '2002-09', school: '浙江工商大学', school_level: '其他本科', highest_degree: '本科', major: '工商管理', major_category: '管理', graduation_date: '2025-06', graduation_year: '2025', preferred_city: '杭州', resume_id: 'R-HR-007', created_at: '2026-08-29T10:15:00+08:00', updated_at: '2026-08-31T10:00:00+08:00' },
  { candidate_id: 'C-HR-008', name: '赵晨', phone: '13800001008', email: 'zhaochen@example.com', gender: '男', birth_date: '2002-03', school: '同济大学', school_level: '985', highest_degree: '硕士', major: '物流工程', major_category: '工程', graduation_date: '2027-03', graduation_year: '2027', preferred_city: '上海', resume_id: 'R-HR-008', created_at: '2026-08-29T14:15:00+08:00', updated_at: '2026-08-31T11:30:00+08:00' },
  { candidate_id: 'C-HR-009', name: '何佳', phone: '13800001009', email: 'heija@example.com', gender: '女', birth_date: '2001-07', school: '曼彻斯特大学', school_level: '海外高校', highest_degree: '硕士', major: '经济学', major_category: '金融/经济', graduation_date: '2026-11', graduation_year: '2026', preferred_city: '宁波', resume_id: 'R-HR-009', created_at: '2026-08-30T09:45:00+08:00', updated_at: '2026-08-31T14:10:00+08:00' },
  { candidate_id: 'C-HR-010', name: '郑宇', phone: '13800001010', email: 'zhengyu@example.com', gender: '男', birth_date: '2003-10', school: '华东理工大学', school_level: '211', highest_degree: '本科', major: '应用化学', major_category: '化工', graduation_date: '2027-06', graduation_year: '2027', preferred_city: '宁波', resume_id: 'R-HR-010', created_at: '2026-08-30T12:45:00+08:00', updated_at: '2026-08-31T15:10:00+08:00' },
];

const application = (
  input: Pick<Application, 'application_id' | 'candidate_id' | 'job_id' | 'project_id' | 'recruitment_type' | 'status' | 'source' | 'applied_at'> &
    Partial<Pick<Application, 'owner_id' | 'owner_name' | 'rejection_reason' | 'rejection_note' | 'rejected_at' | 'rejected_by' | 'is_deleted' | 'deleted_at' | 'created_at' | 'updated_at'>>,
): Application => ({
  owner_id: 'hr-zhang',
  owner_name: 'HR 张老师',
  rejection_reason: null,
  rejection_note: null,
  rejected_at: null,
  rejected_by: null,
  is_deleted: false,
  deleted_at: null,
  created_at: input.applied_at,
  updated_at: input.applied_at,
  ...input,
});

export const seededApplications: Application[] = [
  application({ application_id: 'A-HR-001', candidate_id: 'C-HR-001', job_id: 'researcher', project_id: 'summer-exploration', recruitment_type: 'project', status: 'new', source: '招聘项目', applied_at: '2026-08-28T10:20:00+08:00' }),
  application({ application_id: 'A-HR-002', candidate_id: 'C-HR-001', job_id: 'sales-representative', project_id: null, recruitment_type: 'campus', status: 'screening', source: '官网', owner_id: 'hr-li', owner_name: 'HR 李老师', applied_at: '2026-08-27T13:10:00+08:00', updated_at: '2026-08-28T14:30:00+08:00' }),
  application({ application_id: 'A-HR-003', candidate_id: 'C-HR-002', job_id: 'business-assistant', project_id: 'kunpeng-program', recruitment_type: 'project', status: 'first_interview', source: '招聘项目', applied_at: '2026-08-26T10:40:00+08:00', updated_at: '2026-08-28T16:15:00+08:00' }),
  application({ application_id: 'A-HR-004', candidate_id: 'C-HR-003', job_id: 'researcher', project_id: 'kunpeng-program', recruitment_type: 'project', status: 'second_interview', source: '招聘项目', owner_id: 'hr-li', owner_name: 'HR 李老师', applied_at: '2026-08-27T11:10:00+08:00', updated_at: '2026-08-29T09:10:00+08:00' }),
  application({ application_id: 'A-HR-005', candidate_id: 'C-HR-004', job_id: 'researcher', project_id: null, recruitment_type: 'campus', status: 'interview_passed', source: '校园宣讲', applied_at: '2026-08-27T15:10:00+08:00', updated_at: '2026-08-30T11:20:00+08:00' }),
  application({ application_id: 'A-HR-006', candidate_id: 'C-HR-005', job_id: 'sales-representative', project_id: null, recruitment_type: 'social', status: 'offer_pending', source: '内推', applied_at: '2026-08-28T09:30:00+08:00', updated_at: '2026-08-30T13:40:00+08:00' }),
  application({ application_id: 'A-HR-007', candidate_id: 'C-HR-006', job_id: 'business-assistant', project_id: null, recruitment_type: 'social', status: 'offer', source: '招聘平台', applied_at: '2026-08-28T11:30:00+08:00', updated_at: '2026-08-31T09:20:00+08:00' }),
  application({ application_id: 'A-HR-008', candidate_id: 'C-HR-007', job_id: 'sales-representative', project_id: 'summer-exploration', recruitment_type: 'project', status: 'pre_onboarding', source: '招聘项目', owner_id: 'hr-li', owner_name: 'HR 李老师', applied_at: '2026-08-29T10:15:00+08:00', updated_at: '2026-08-31T10:00:00+08:00' }),
  application({ application_id: 'A-HR-009', candidate_id: 'C-HR-008', job_id: 'researcher', project_id: null, recruitment_type: 'campus', status: 'onboarded', source: '内推', applied_at: '2026-08-29T14:15:00+08:00', updated_at: '2026-08-31T11:30:00+08:00' }),
  application({ application_id: 'A-HR-010', candidate_id: 'C-HR-009', job_id: 'business-assistant', project_id: null, recruitment_type: 'campus', status: 'rejected', source: '官网', rejection_reason: '地点不匹配', rejection_note: '候选人期望长期在北京发展。', rejected_at: '2026-08-31T14:10:00+08:00', rejected_by: 'HR 张老师', applied_at: '2026-08-30T09:45:00+08:00', updated_at: '2026-08-31T14:10:00+08:00' }),
  application({ application_id: 'A-HR-011', candidate_id: 'C-HR-010', job_id: 'researcher', project_id: null, recruitment_type: 'social', status: 'new', source: '招聘平台', owner_id: 'hr-li', owner_name: 'HR 李老师', applied_at: '2026-08-30T12:45:00+08:00' }),
  application({ application_id: 'A-HR-012', candidate_id: 'C-HR-006', job_id: 'researcher', project_id: 'summer-exploration', recruitment_type: 'project', status: 'screening', source: '招聘项目', applied_at: '2026-08-31T10:30:00+08:00' }),
];

export const seededResumes: Resume[] = seededCandidates.map((candidate, index) => ({
  resume_id: candidate.resume_id!, candidate_id: candidate.candidate_id, file_name: `${candidate.name}-Mock简历.pdf`, file_type: 'application/pdf', file_url: `mock://hr-resumes/${candidate.resume_id}`,
  parsed_data: { name: candidate.name, phone: candidate.phone, email: candidate.email, gender: candidate.gender, birth_date: candidate.birth_date, school: candidate.school, degree: candidate.highest_degree, major: candidate.major, graduation_date: candidate.graduation_date, preferred_city: candidate.preferred_city },
  uploaded_at: `2026-08-${String(20 + index).padStart(2, '0')}T09:20:00+08:00`, updated_at: candidate.updated_at,
}));

export const seededInterviews: Interview[] = [
  { interview_id: 'I-HR-001', application_id: 'A-HR-003', candidate_id: 'C-HR-002', job_id: 'business-assistant', round: '初试', scheduled_at: '2026-09-01T14:00:00+08:00', interviewer: '王经理', location: '远大中心 8F 会议室', meeting_type: '线下', status: 'scheduled', notes: '重点了解英文沟通与细节处理能力。', created_at: '2026-08-28T16:15:00+08:00', updated_at: '2026-08-28T16:15:00+08:00' },
  { interview_id: 'I-HR-002', application_id: 'A-HR-004', candidate_id: 'C-HR-003', job_id: 'researcher', round: '复试', scheduled_at: '2026-09-02T10:30:00+08:00', interviewer: '赵总监', location: 'https://meeting.example/mock-room', meeting_type: '线上', status: 'completed', notes: '讨论产业研究案例，等待业务反馈。', created_at: '2026-08-29T09:10:00+08:00', updated_at: '2026-09-02T11:30:00+08:00' },
  { interview_id: 'I-HR-003', application_id: 'A-HR-005', candidate_id: 'C-HR-004', job_id: 'researcher', round: '初试', scheduled_at: '2026-08-30T10:00:00+08:00', interviewer: '陈经理', location: '线上会议室', meeting_type: '线上', status: 'completed', notes: '面试通过。', created_at: '2026-08-29T13:00:00+08:00', updated_at: '2026-08-30T11:00:00+08:00' },
];

export const seededActivities: ApplicationActivity[] = [
  { activity_id: 'ACT-001', application_id: 'A-HR-001', activity_type: 'application_created', description: '候选人通过暑期探索营投递研究员', operator: '候选人', created_at: '2026-08-28T10:20:00+08:00' },
  { activity_id: 'ACT-002', application_id: 'A-HR-002', activity_type: 'application_created', description: '候选人通过职位中心投递业务员', operator: '候选人', created_at: '2026-08-27T13:10:00+08:00' },
  { activity_id: 'ACT-003', application_id: 'A-HR-002', activity_type: 'stage_changed', description: 'HR 将状态更新为简历通过', operator: 'HR 李老师', created_at: '2026-08-28T14:30:00+08:00' },
  { activity_id: 'ACT-004', application_id: 'A-HR-003', activity_type: 'interview_scheduled', description: '安排初试：王经理 · 线下', operator: 'HR 张老师', created_at: '2026-08-28T16:15:00+08:00' },
  { activity_id: 'ACT-005', application_id: 'A-HR-004', activity_type: 'interview_scheduled', description: '安排复试：赵总监 · 线上', operator: 'HR 李老师', created_at: '2026-08-29T09:10:00+08:00' },
];

export const seededNotes: CandidateNote[] = [
  { note_id: 'N-HR-001', application_id: 'A-HR-004', content: '研究能力较强，对期货市场有兴趣。', created_by: 'HR 李老师', created_at: '2026-08-29T09:05:00+08:00' },
  { note_id: 'N-HR-002', application_id: 'A-HR-003', content: '英语沟通良好，做事细致。', created_by: 'HR 张老师', created_at: '2026-08-28T16:10:00+08:00' },
];
