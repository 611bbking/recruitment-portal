# Recruitment Portal

长期招聘门户与 HR 招聘管理前端原型，覆盖校园招聘、社会招聘、招聘项目、职位投递、Mock 简历解析，以及面向 HR 的招聘工作台和 Application 管理流程。

当前版本为 `v0.4.0 HR 招聘工作台增强`，主要用于产品验证和后续 IT 正式化评审，不建议直接用于生产环境。

## 环境依赖

- Node.js 22.13 或更高版本
- 现代浏览器

## 本地运行

1. 克隆并进入项目：

```bash
git clone https://github.com/DelonteWest13/recruitment-portal.git
cd recruitment-portal
```

2. 安装依赖并启动：

```bash
npm install
npm run dev
```

3. 默认访问：

```text
招聘门户：http://localhost:3000
HR 后台：http://localhost:3000/hr/login
```

HR Mock 登录验证码为 `123456`。

常用检查命令：

```bash
npm run lint
npm run test:flow
npm run test:hr
npm run build
```

## 目录结构

```text
app/                # Next/Vinext 页面、组件、数据模型与 Mock 数据层
docs/               # 阶段总结和 IT 评审文档
public/             # 品牌与社交预览资源
scripts/            # Mock 流程自动验证脚本
.openai/            # Sites 项目配置
```

## 当前主要流程

```text
招聘门户
→ 招聘项目 / 职位
→ 候选人登录
→ 简历上传与 Mock 解析
→ 信息确认
→ 职位投递
→ 我的投递
→ HR 招聘工作台
→ 候选人阶段管理
```

Candidate、Resume、Job、RecruitmentProject 与 Application 已按独立业务实体拆分。同一候选人可以产生多条独立 Application。

## 版本更新

### v0.4.0

- 新增 HR 招聘工作台
- 新增招聘核心指标与招聘漏斗
- 新增岗位维度招聘数据分析
- 新增通过简历候选人 BG 分析
- 新增 HR 待办事项统计
- 新增候选人多选及批量操作
- 新增批量淘汰候选人
- 新增批量推进招聘阶段
- 新增候选人软删除机制
- 新增候选人淘汰原因记录

### v0.3.0

- 新增 HR 招聘管理前端
- 新增候选人管理与招聘阶段推进
- 完善招聘项目与职位关联

### v0.2.0

- 新增候选人账号前端
- 新增简历上传与 Mock 解析
- 完成职位投递与我的投递流程

### v0.1.0

- 建立长期招聘门户
- 完成校园招聘、社会招聘、职位中心及招聘项目基础页面

## 文档

- [当前阶段总结](docs/recruitment-portal-stage-summary.md)
- [v0.4.0 阶段总结](docs/recruitment-portal-v0.4.0-summary.md)

## Mock 边界与正式化方向

候选人账号、HR 权限、简历文件、招聘数据、批量操作、指标分析和状态持久化仍为浏览器端 Mock。

正式上线前需由 IT 接入：

- 数据库与正式 API
- 身份认证和权限控制
- 简历文件存储与解析服务
- 服务端操作审计
- 内部招聘、面试及入职系统集成
