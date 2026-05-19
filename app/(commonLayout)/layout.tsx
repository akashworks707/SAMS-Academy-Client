import Footer from '@/components/public-modules/home/footer'
import Navbar from '@/components/shared/Navbar'
import React from 'react'

export default function CommonLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}
