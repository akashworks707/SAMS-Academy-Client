'use client'

import React, { useState } from 'react'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
   <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <main className="lg:ml-56 mt-16 p-4 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
