import '@/styles/global.css';

import React from 'react';

import { Header } from '@/components';

function ProcedureLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default ProcedureLayout;
