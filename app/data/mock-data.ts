import { jobs } from './jobs';
import { recruitmentProjects } from './projects';

export const heroContent = { eyebrow: 'GRAND RESOURCES · CAREERS', title: '和优秀的人一起', highlight: '走进大宗商品的真实世界', description: '在市场、产业与全球贸易的交汇处，理解真实业务，解决真实问题，创造真实价值。', channels: ['校园招聘', '社会招聘', '项目招聘'] };

export const recruitmentChannels = [
  { id: 'campus', number: '01', label: 'CAMPUS', title: '校园招聘', description: '面向应届毕业生与在校生的长期招聘通道', actionLabel: '探索校招机会', href: '/jobs?type=校园招聘', tone: 'red' },
  { id: 'social', number: '02', label: 'EXPERIENCED', title: '社会招聘', description: '寻找理解产业、敢于行动的专业人才', actionLabel: '查看社会职位', href: '/jobs?type=社会招聘', tone: 'navy' },
  { id: 'projects', number: '03', label: 'PROGRAMS', title: '招聘项目', description: '探索营、鲲鹏班及其他专项人才项目', actionLabel: '探索重点项目', href: '/projects', tone: 'light' },
];

export const featuredJobs = jobs;
export const featuredProjects = recruitmentProjects;

export const campusRecruitmentStructure = {
  recruitmentType: '校园招聘',
  batches: [{ id: 'spring', name: '春季招聘', kind: '常规批次', isActive: false }, { id: 'autumn', name: '秋季招聘', kind: '常规批次', isActive: false }, { id: 'early', name: '提前批', kind: '提前批次', isActive: true }],
  projectIds: ['summer-exploration', 'kunpeng-program', 'future-program'],
};

export const companyProfile = {
  eyebrow: 'ABOUT GRAND RESOURCES',
  title: '连接资源与产业，服务真实的商品世界',
  description: '远大物产长期专注大宗商品产业链服务，以产业和客户为核心，在贸易、物流、研究交易与风险管理等领域持续创造价值。',
  facts: [{ label: '产业领域', value: '能源化工 · 金属 · 农产品 · 软商品' }, { label: '业务能力', value: '贸易 · 物流 · 研究交易 · 风险管理' }, { label: '业务布局', value: '立足全国 · 连接海外市场' }, { label: '人才平台', value: '在真实产业场景中学习与成长' }],
};

export const recruitmentProcess = [
  { id: 'apply', number: '01', title: '职位申请', description: '选择适合的职位并提交申请' }, { id: 'screening', number: '02', title: '简历筛选', description: '招聘团队进行综合评估' }, { id: 'interview', number: '03', title: '面试交流', description: '围绕能力与彼此期待深入沟通' }, { id: 'offer', number: '04', title: 'Offer', description: '确认录用意向与相关安排' }, { id: 'onboarding', number: '05', title: '加入远大', description: '开启新的职业旅程' },
];
