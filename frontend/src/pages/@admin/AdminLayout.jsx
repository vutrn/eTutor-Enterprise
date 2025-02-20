import React from 'react'
import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router';

const AdminLayout = () => {
  return (
    <div >
      <Navbar />
      {/* Add additional admin layout components here */}
      {/* Consider adding a main content area or sidebar if necessary */}
    
        <Outlet /> {/* Render child routes here */}
    
    </div>
  );
}

export default AdminLayout