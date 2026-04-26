import React from 'react';
export default function UserLayout({children}:{children:React.ReactNode}){
  return <div>
    <h2>User Dashboard</h2>
    <div>{children}</div>
  </div>;
}
