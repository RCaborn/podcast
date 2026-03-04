import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [pastHero, setPastHero] = useState(!isHome)

  useEffect(() => {
    if (!isHome) {
      setPastHero(true)
      return
    }

    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar hidden={isHome && !pastHero} />
      <main className={`flex-1 ${isHome ? '' : 'pt-16'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
