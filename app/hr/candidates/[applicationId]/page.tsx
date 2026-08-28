import HrApplicationDetail from '../../../components/HrApplicationDetail';
export default async function HrCandidateDetailPage({ params }: { params: Promise<{ applicationId: string }> }) { return <HrApplicationDetail applicationId={(await params).applicationId} />; }
