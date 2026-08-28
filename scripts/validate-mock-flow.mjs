import assert from 'node:assert/strict';

const memory = new Map();
globalThis.window = {};
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value),
  removeItem: (key) => memory.delete(key),
};

const store = await import('../app/lib/mock-store.ts');
const { parseResume } = await import('../app/lib/resume-parser.ts');
const { jobs } = await import('../app/data/jobs.ts');
const { recruitmentProjects } = await import('../app/data/projects.ts');

const researcher = jobs.find((job) => job.job_id === 'researcher');
const sales = jobs.find((job) => job.job_id === 'sales-representative');
const summer = recruitmentProjects.find((project) => project.project_id === 'summer-exploration');
assert(researcher && sales && summer, 'Required mock records must exist');
assert(researcher.related_project_ids.includes(summer.project_id), 'Researcher must be related to Summer Exploration');
assert(summer.related_job_ids.includes(researcher.job_id), 'Project must expose Researcher');

const candidate = store.mockLogin('13800000000');
const file = new File(['mock resume'], 'resume.pdf', { type: 'application/pdf' });
const parsed = await parseResume(file);
store.updateMockCandidate(parsed);
store.saveMockResume(candidate.candidate_id, file, parsed);
const projectApplication = store.createMockApplication(candidate.candidate_id, researcher.job_id, summer.project_id);
assert.equal(projectApplication.project_id, summer.project_id, 'Project application must keep its project source');
assert.throws(() => store.createMockApplication(candidate.candidate_id, researcher.job_id, summer.project_id), /已经申请过/, 'Duplicate job + project must be rejected');

const directApplication = store.createMockApplication(candidate.candidate_id, sales.job_id, null);
assert.equal(directApplication.project_id, null, 'Direct job application must keep project_id null');
const applications = store.getMockApplications();
assert.equal(applications.length, 2, 'Two distinct applications should be stored');
assert(applications.some((item) => item.job_id === 'researcher' && item.project_id === 'summer-exploration'));
assert(applications.some((item) => item.job_id === 'sales-representative' && item.project_id === null));

console.log('Mock flow validation passed: project Researcher + direct Sales Representative.');
