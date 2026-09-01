import assert from 'node:assert/strict';

const memory = new Map();
globalThis.window = {};
globalThis.localStorage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };

const hr = await import('../app/lib/hr-store.ts');
const analytics = await import('../app/lib/recruitment-analytics.ts');
hr.mockHrLogin('hr-zhang');
assert.equal(hr.getMockHrUser().role, 'hr');

const initial = hr.getHrApplications();
const sameCandidateApplications = initial.filter((item) => item.candidate_id === 'C-HR-001');
assert.equal(sameCandidateApplications.length, 2, 'One Candidate must retain two independent Applications');
assert.notEqual(sameCandidateApplications[0].job_id, sameCandidateApplications[1].job_id);

hr.updateApplicationStage('A-HR-001', 'screening');
assert.equal(hr.getApplicationById('A-HR-001').status, 'screening');

const interview = hr.scheduleInterview({ application_id: 'A-HR-001', candidate_id: 'C-HR-001', job_id: 'researcher', round: '初试', scheduled_at: '2026-09-03T14:00:00+08:00', interviewer: '王经理', location: '远大中心 8F 会议室', meeting_type: '线下', notes: 'Mock 验收面试' });
assert.equal(hr.getApplicationById('A-HR-001').status, 'first_interview');
assert(hr.getHrInterviews().some((item) => item.interview_id === interview.interview_id));

const invite = hr.buildInterviewInvitePayload(interview);
assert.equal(invite.application_id, 'A-HR-001');
assert.equal(invite.name, '张三');
assert.equal(invite.job_title, '研究员');
assert.equal(invite.interview_round, '初试');

hr.updateApplicationStage('A-HR-001', 'second_interview');
hr.addCandidateNote('A-HR-001', '研究能力较强，对产业研究有兴趣。');
assert.equal(hr.getApplicationById('A-HR-001').status, 'second_interview');
assert(hr.getCandidateNotes('A-HR-001').some((item) => item.content.includes('研究能力较强')));
assert(hr.getActivities('A-HR-001').some((item) => item.activity_type === 'interview_scheduled'));
assert(hr.getActivities('A-HR-001').filter((item) => item.activity_type === 'stage_changed').length >= 3);

hr.bulkUpdateApplicationStage(['A-HR-011'], 'screening');
assert.equal(hr.getApplicationById('A-HR-011').status, 'screening');

hr.bulkRejectApplications(['A-HR-011'], '专业/背景不匹配', 'Mock 批量淘汰验收');
const rejected = hr.getApplicationById('A-HR-011');
assert.equal(rejected.status, 'rejected');
assert.equal(rejected.rejection_note, 'Mock 批量淘汰验收');
assert.ok(rejected.rejected_at);

hr.softDeleteApplications(['A-HR-010']);
assert.equal(hr.getApplicationById('A-HR-010').is_deleted, true);

const applications = analytics.filterRecruitmentApplications(hr.getHrApplications(), { recruitmentType: '', jobId: '' });
const stats = analytics.getRecruitmentStats(applications, hr.getHrInterviews());
const funnel = analytics.getRecruitmentFunnel(applications);
const jobs = analytics.getJobStats(applications, hr.getManagedJobs());
const profile = analytics.getCandidateProfileStats(applications, hr.getHrCandidates());
assert.equal(stats.received, applications.length);
assert.equal(funnel[0].count, applications.length);
assert(jobs.some((item) => item.jobId === 'researcher' && item.received > 0));
assert(profile.total > 0);

console.log('HR flow validation passed: individual flow, bulk actions, soft delete and dynamic analytics.');
