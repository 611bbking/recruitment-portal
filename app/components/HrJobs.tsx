"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  getHrApplications,
  getManagedJobs,
  saveManagedJobs,
} from "../lib/hr-store";
import type { Job } from "../types/recruitment";

export default function HrJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editor, setEditor] = useState<Job | "new" | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = getManagedJobs();
      setJobs(next);
      const applications = getHrApplications();
      setCounts(
        Object.fromEntries(
          next.map((job) => [
            job.job_id,
            applications.filter((item) => item.job_id === job.job_id).length,
          ]),
        ),
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function persist(next: Job[]) {
    setJobs(next);
    saveManagedJobs(next);
  }
  function changeStatus(jobId: string, status: Job["status"]) {
    persist(
      jobs.map((job) =>
        job.job_id === jobId
          ? { ...job, status, updated_at: new Date().toISOString() }
          : job,
      ),
    );
  }
  function saveJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const existing = editor !== "new" ? editor : null;
    const timestamp = new Date().toISOString();
    const job: Job = {
      job_id: existing?.job_id ?? `mock-job-${Date.now()}`,
      title: String(form.get("title")),
      recruitment_type: "校园招聘",
      job_category: String(form.get("category")),
      department: String(form.get("department")),
      business_unit: String(form.get("business_unit")),
      location: String(form.get("location")),
      education_requirement: String(form.get("education")),
      major_requirement: String(form.get("major")),
      responsibilities: existing?.responsibilities ?? [
        "岗位职责待业务补充（Mock）",
      ],
      requirements: existing?.requirements ?? ["任职要求待业务补充（Mock）"],
      related_project_ids: existing?.related_project_ids ?? [],
      status: existing?.status ?? "draft",
      created_at: existing?.created_at ?? timestamp,
      updated_at: timestamp,
      is_mock: true,
    };
    persist(
      existing
        ? jobs.map((item) => (item.job_id === job.job_id ? job : item))
        : [...jobs, job],
    );
    setEditor(null);
  }
  return (
    <>
      <div className="hr-page-title">
        <div>
          <p>JOB MANAGEMENT</p>
          <h1>职位管理</h1>
          <span>复用门户 Job 数据，支持基础编辑与状态控制</span>
        </div>
        <button className="hr-primary-button" onClick={() => setEditor("new")}>
          ＋ 新增 Mock 职位
        </button>
      </div>
      <div className="management-grid">
        {jobs.map((job) => (
          <article className="management-card" key={job.job_id}>
            <div>
              <span className={`job-state state-${job.status}`}>
                {job.status === "open"
                  ? "开放中"
                  : job.status === "paused"
                    ? "已暂停"
                    : job.status === "closed"
                      ? "已关闭"
                      : "草稿"}
              </span>
              <small>{job.is_mock ? "MOCK" : "OFFICIAL"}</small>
            </div>
            <h2>{job.title}</h2>
            <p>
              {job.job_category} · {job.location}
            </p>
            <dl>
              <div>
                <dt>业务 / 部门</dt>
                <dd>
                  {job.business_unit}
                  <br />
                  {job.department}
                </dd>
              </div>
              <div>
                <dt>申请人数</dt>
                <dd>{counts[job.job_id] ?? 0}</dd>
              </div>
            </dl>
            <div className="management-actions">
              <Link href={`/jobs/${job.job_id}`}>门户预览</Link>
              <button onClick={() => setEditor(job)}>编辑</button>
              {job.status !== "open" && (
                <button onClick={() => changeStatus(job.job_id, "open")}>
                  开放
                </button>
              )}
              {job.status === "open" && (
                <button onClick={() => changeStatus(job.job_id, "paused")}>
                  暂停
                </button>
              )}
              {job.status !== "closed" && (
                <button onClick={() => changeStatus(job.job_id, "closed")}>
                  关闭
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {editor && (
        <div className="hr-drawer-backdrop" onMouseDown={() => setEditor(null)}>
          <aside
            className="hr-drawer"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="drawer-close" onClick={() => setEditor(null)}>
              ×
            </button>
            <div className="drawer-title">
              <p>JOB EDITOR</p>
              <h2>{editor === "new" ? "新增 Mock 职位" : "编辑职位"}</h2>
            </div>
            <form className="job-editor" onSubmit={saveJob}>
              <label>
                <span>职位名称</span>
                <input
                  name="title"
                  defaultValue={editor === "new" ? "" : editor.title}
                  required
                />
              </label>
              <label>
                <span>岗位方向</span>
                <input
                  name="category"
                  defaultValue={editor === "new" ? "" : editor.job_category}
                  required
                />
              </label>
              <label>
                <span>业务板块</span>
                <input
                  name="business_unit"
                  defaultValue={
                    editor === "new"
                      ? "业务板块（Mock，待确认）"
                      : editor.business_unit
                  }
                />
              </label>
              <label>
                <span>部门</span>
                <input
                  name="department"
                  defaultValue={
                    editor === "new"
                      ? "招聘部门（Mock，待确认）"
                      : editor.department
                  }
                />
              </label>
              <label>
                <span>工作地点</span>
                <input
                  name="location"
                  defaultValue={
                    editor === "new" ? "宁波（Mock，待确认）" : editor.location
                  }
                />
              </label>
              <label>
                <span>学历要求</span>
                <input
                  name="education"
                  defaultValue={
                    editor === "new"
                      ? "本科及以上"
                      : editor.education_requirement
                  }
                />
              </label>
              <label>
                <span>专业要求</span>
                <textarea
                  name="major"
                  defaultValue={
                    editor === "new"
                      ? "专业不限（Mock，待确认）"
                      : editor.major_requirement
                  }
                />
              </label>
              <button className="hr-primary-button">保存职位</button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
