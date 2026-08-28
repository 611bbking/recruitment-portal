# 招聘门户与 HR 招聘管理阶段总结

## 1. 项目定位

当前项目已经完成：

```text
对外招聘门户
→ 招聘项目 / 职位
→ 候选人账号
→ 简历上传与解析
→ Candidate
→ Application
→ HR 招聘管理后台
```

目标是先由业务端完成可运行的招聘产品原型，后续由 IT 接入正式数据库、认证、简历解析及内部系统。

当前暂不开发面试邀约、Offer、入职及 OA 联动。

---

## 2. 当前已完成

### 对外招聘门户

- 招聘首页
- 校园招聘
- 社会招聘
- 招聘项目
- 职位中心
- 职位详情
- 候选人注册 / 登录前端原型
- 简历上传
- Mock 简历解析
- 信息确认
- 投递成功
- 候选人中心
- 我的投递

网站采用长期招聘门户设计，不固定绑定某一年、春招或秋招。

### 招聘项目

当前预留：

- 暑期探索营：每年约 7 月，为期约一周，具有秋招提前批属性
- 鲲鹏班：与宁波多家大宗企业联合开展，预计 9—10 月
- 未来其他专项招聘项目

项目型招聘流程统一为：

```text
招聘项目
→ 项目详情
→ 选择具体职位
→ 投递
```

---

## 3. 当前职位样例

当前已录入三类校招岗位：

- 研究员
- 业务员
- 商务助理

岗位职责和任职要求使用真实 JD 样例。

部门、业务板块、部分工作地点等未最终确认内容仍属于 Mock 数据。

---

## 4. 简历投递与解析

当前完整链路：

```text
职位详情
→ 登录 / 注册
→ 上传简历
→ Mock 自动解析
→ 候选人确认
→ 确认应聘职位
→ 提交
→ 我的投递
```

自动解析字段：

```text
姓名
手机号
邮箱
性别
出生年月
学校
学历
专业
毕业时间
意向城市
```

“应聘职位”必须由候选人明确确认，不由简历解析自动判断。

未来建议 IT 接入：

```text
POST /api/resumes/parse
```

---

## 5. 核心数据关系

当前已按正式系统思路拆分：

```text
Candidate
Resume
Job
RecruitmentProject
Application
ApplicationActivity
CandidateNote
```

核心关系：

```text
Candidate
    ├─ Resume
    └─ Application
           ├─ Job
           └─ RecruitmentProject
```

关键规则：

- 一个 Candidate 可以投递多个职位
- 每次投递生成独立 Application
- 一个招聘项目可以关联多个职位
- 一个职位也可以关联多个招聘项目
- Candidate 不直接绑定唯一职位
- Resume 独立保存
- 项目来源记录在 Application 中

---

## 6. HR 招聘后台

当前已完成 HR 招聘管理前端原型，主要包括：

- 招聘工作台
- 候选人管理
- 候选人详情
- 职位管理
- 招聘项目管理
- 招聘阶段推进
- HR 内部备注
- 招聘操作时间线

当前招聘阶段：

```text
新投递
→ 简历筛选
→ 初试
→ 复试
→ Offer
→ 待入职
→ 已入职
```

同时支持：

```text
已淘汰
候选人放弃
```

---

## 7. 当前仍属于 Mock 的能力

以下能力尚未正式后端化：

- 候选人账号认证
- Candidate / Application 数据持久化
- Job / RecruitmentProject 数据持久化
- Resume 文件存储
- 真实简历解析
- HR 用户与权限
- 招聘阶段更新
- HR 备注
- 操作日志
- 工作台统计

当前版本主要用于验证产品流程、数据关系及页面交互。

---

## 8. 建议 IT 后续接手内容

建议按以下顺序正式化：

1. 建立数据库：
   - candidates
   - resumes
   - jobs
   - recruitment_projects
   - applications
   - application_activities
   - candidate_notes

2. 接入正式认证和权限：
   - candidate
   - hr
   - admin

3. 接入简历文件存储和简历解析服务。

4. 将前端 Mock 数据切换为正式 API。

5. 根据内部技术规范确认 Candidate / Application / Job / RecruitmentProject 的正式表关系。

6. 后续再评估：
   - Interview
   - 面试邀约
   - Offer
   - Pre-Onboarding
   - OA
   - Employee
   - 人员主数据

---

## 9. 当前阶段建议 IT 重点评审

请优先确认：

1. Candidate 与 Application 的拆分是否合理。
2. Job 与 RecruitmentProject 多对多关系如何落库。
3. 候选人账号采用何种认证方案。
4. HR 权限如何接入公司现有体系。
5. 简历存储及解析采用什么方案。
6. 当前 Mock 前端如何平滑切换为 API。
7. 后续是否继续在本项目上扩展面试、Offer 和入职流程。

当前建议先完成上述技术评审，再进入下一阶段开发。
