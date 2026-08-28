# Recruitment Portal

项目简介：长期招聘门户与 HR 招聘管理前端原型，覆盖校园招聘、社会招聘、招聘项目、职位投递、简历解析及 HR 候选人管理等核心流程。当前版本主要用于产品验证和后续 IT 正式化参考。

## 环境依赖

当前版本为前端原型，主要依赖：

* 现代浏览器
* Python 3.x（可选，用于本地启动静态服务）

正式上线后需由 IT 接入：

* 数据库
* 身份认证
* 简历文件存储
* 简历解析服务
* 正式 API

## 部署步骤

1. 克隆仓库

```bash
git clone https://github.com/DelonteWest13/recruitment-portal.git
```

2. 进入项目目录

```bash
cd recruitment-portal
```

3. 启动本地静态服务

```bash
python -m http.server 8000
```

4. 浏览器访问：

```text
http://localhost:8000
```

## 目录结构

```text
├── README.md
├── index.html
├── pages/              # 页面
├── css/                # 样式文件
├── js/                 # 业务逻辑与 Mock 数据
├── assets/             # 图片、图标等静态资源
└── docs/               # 产品与阶段文档
```

实际目录以当前仓库为准。

## 使用说明

当前主要流程：

```text
招聘门户
→ 招聘项目 / 职位
→ 候选人登录
→ 简历上传与 Mock 解析
→ 信息确认
→ 职位投递
→ 我的投递
→ HR 招聘管理后台
```

当前部分数据及认证能力仍使用 Mock 实现，不建议直接用于生产环境。

详细阶段说明见：

`docs/recruitment-portal-stage-summary.md`

## 版本更新

### v0.3.0

* 新增 HR 招聘管理前端
* 新增候选人管理与招聘阶段推进
* 完善招聘项目与职位关联

### v0.2.0

* 新增候选人账号前端
* 新增简历上传与 Mock 解析
* 完成职位投递与我的投递流程

### v0.1.0

* 建立长期招聘门户
* 完成校园招聘、社会招聘、职位中心及招聘项目基础页面
