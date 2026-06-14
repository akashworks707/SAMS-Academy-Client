import Footer from '@/components/public-modules/home/footer'
import Navbar from '@/components/shared/Navbar'
import ReduxProvider from '@/providers/ReduxProvider'
import React from 'react'

export default function CommonLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ReduxProvider>
                <Navbar />
                {children}
                <Footer />
            </ReduxProvider>
        </div>
    )
}
