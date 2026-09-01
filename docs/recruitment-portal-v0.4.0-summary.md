# Recruitment Portal v0.4.0 阶段总结

## 1. 本轮新增功能

- HR 候选人列表多选、当前列表全选与取消全选
- 批量推进 Application 招聘阶段
- 批量淘汰，并记录原因、备注、时间和 Mock 操作人
- Application 软删除，正常列表默认隐藏已删除记录
- 招聘核心指标：收到简历、通过简历、面试人数、Offer 人数、待处理候选人
- 动态招聘漏斗与环节转化率
- 可点击的 HR 待办事项，并跳转候选人阶段筛选
- 按招聘类型和岗位联动筛选工作台
- 按 Job ID 聚合的岗位招聘分析和排序
- 仅针对已通过简历候选人的 BG 分析

## 2. 新增 / 修改文件

新增：

- `app/lib/recruitment-analytics.ts`
- `README.md`
- `docs/recruitment-portal-v0.4.0-summary.md`

修改：

- `app/types/recruitment.ts`
- `app/data/hr-mock.ts`
- `app/lib/hr-store.ts`
- `app/lib/mock-store.ts`
- `app/components/HrDashboard.tsx`
- `app/components/HrCandidates.tsx`
- `app/globals.css`
- `scripts/validate-hr-flow.mjs`
- `package.json`
- `package-lock.json`
- `tsconfig.json`

## 3. Mock 数据新增字段

Candidate：

- `school_level`
- `major_category`
- `graduation_year`

Application：

- `recruitment_type`
- `source`
- `rejection_note`
- `rejected_at`
- `rejected_by`
- `is_deleted`
- `deleted_at`

状态体系在保留现有字段兼容性的基础上补充：

- `interview_passed`
- `offer_pending`

旧 localStorage 数据会在读取时补齐默认字段，不要求用户手动清理浏览器数据。

## 4. 主要数据计算逻辑

`app/lib/recruitment-analytics.ts` 独立封装：

- `filterRecruitmentApplications()`：排除软删除记录并应用招聘类型、岗位筛选
- `getRecruitmentStats()`：计算核心招聘指标
- `getRecruitmentFunnel()`：计算漏斗人数和相邻阶段转化率，并处理除零
- `getTodoStats()`：结合 Application 与 Interview 计算 HR 待办
- `getJobStats()`：按 `job_id` 聚合岗位招聘数据
- `getCandidateProfileStats()`：对通过简历的候选人去重后计算 BG 分布

页面数值均从 Mock 数据过滤和聚合生成，未在 HTML 中写死统计结果。

## 5. 当前仍属于 Mock 的能力

- Candidate、Application、Interview、Job 与 RecruitmentProject 持久化
- 候选人和 HR 身份认证
- 批量推进、淘汰与软删除
- 招聘指标、漏斗、待办和候选人画像
- 简历上传、文件保存与解析
- HR 操作人和操作时间线

当前状态保存在种子 Mock 数据与浏览器 localStorage 中，仅适合原型演示。

## 6. 后续 IT 正式化接入

建议正式化时提供：

- Candidate、Application、Job、RecruitmentProject、Interview 数据表
- Application 状态机和批量操作事务 API
- 淘汰原因、软删除与审计日志字段
- HR RBAC 与公司身份认证
- 工作台聚合查询 API，支持招聘类型、岗位、时间范围和负责人筛选
- 简历对象存储、病毒扫描和正式解析服务
- 面试、Offer、入职与 OA 系统的后续集成接口

## 7. 当前已知限制

- 所有操作仅在当前浏览器生效，无法跨设备或多人同步
- 软删除暂未提供回收站和恢复入口
- Mock 状态体系用于验证 ATS 页面逻辑，正式状态机仍需 IT 与招聘团队共同确认
- BG 分类来自标准化 Mock 字段，不会自动从自由文本简历推断
- 岗位分析以 Application 为统计单位；同一候选人的不同职位申请会独立计数
- 暂无时间范围、招聘项目、负责人和部门维度的全局筛选
