import type { ParsedResumeData } from '../types/recruitment';

const allowedExtensions = ['pdf', 'doc', 'docx'];

export async function parseResume(file: File): Promise<ParsedResumeData> {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!allowedExtensions.includes(extension)) throw new Error('请上传 PDF、DOC 或 DOCX 格式的简历');

  // Mock implementation of POST /api/resumes/parse. Replace only this function
  // with the production API client; the application UI consumes the same shape.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    name: '王晨', phone: '13800000000', email: 'wangchen@example.com', gender: '男', birth_date: '2003-05',
    school: '宁波大学（Mock）', degree: '本科', major: '国际经济与贸易（Mock）', graduation_date: '2027-06', preferred_city: '宁波',
  };
}
