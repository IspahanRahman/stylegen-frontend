import React from 'react';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2>Admin</h2>
      <div>{children}</div>
    </div>
  );
}
