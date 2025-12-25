import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SideBar from '@/components/SideBar';

const MainLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
      <main className="lg:pl-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"
        >
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
          )}
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout; 