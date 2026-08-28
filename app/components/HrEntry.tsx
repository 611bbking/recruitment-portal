'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isMockHrAuthenticated } from '../lib/hr-store';

export default function HrEntry() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setVisible(isMockHrAuthenticated()), 0); return () => window.clearTimeout(timer); }, []);
  return visible ? <Link className="hr-entry" href="/hr">HR 后台</Link> : null;
}
