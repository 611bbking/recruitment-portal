# Recruitment Portal

长期招聘门户与 HR 招聘管理前端原型。

## 当前范围

已完成：

- 招聘门户首页
- 校园招聘 / 社会招聘
- 招聘项目
- 职位中心与职位详情
- 候选人注册 / 登录前端原型
- 简历上传与 Mock 解析
- 候选人信息确认
- 我的投递
- HR 招聘工作台
- 候选人管理
- 职位管理
- 招聘项目管理
- 招聘阶段推进

当前招聘项目已预留：

- 暑期探索营
- 鲲鹏班
- 其他专项招聘项目

## 核心数据关系

```text
Candidate
├─ Resume
└─ Application
   ├─ Job
   └─ RecruitmentProject
```

一个候选人可以投递多个职位，每次投递生成独立 `Application`。

## 当前技术状态

当前版本主要用于产品和业务流程验证，部分能力仍使用 Mock 数据，包括：

- 候选人认证
- 简历解析
- 数据持久化
- HR 权限
- 招聘状态更新

正式上线前需要由 IT 接入数据库、认证、文件存储及正式 API。

## 项目文档

详细阶段说明见：

`docs/recruitment-portal-stage-summary.md`

## 后续方向

后续可继续扩展：

```text
Interview
→ Offer
→ Pre-Onboarding
→ OA
→ Employee
```

当前暂不开发面试邀约联动。
