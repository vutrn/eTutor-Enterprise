import React from 'react'
import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router';

const AdminLayout = () => {
  return (
    <div >
      <Navbar />
      {/* Add additional admin layout components here */}
      {/* Consider adding a main content area or sidebar if necessary */}
      <main>
        <Outlet /> {/* Render child routes here */}
      </main>
    </div>
  );
}

export default AdminLayout