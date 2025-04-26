"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10
      setPrevScrollPos(currentScrollPos)
      setVisible(isVisible)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos])

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
          backdropFilter: "blur(10px)",
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md"
      >
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-cyan-500"
              >
                ConsumerCompass
              </Link>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/scan"
                className="text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Scan
              </Link>
              <Link
                href="/analytics"
                className="text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Analytics
              </Link>
            </div>

            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-slate-900 shadow-md md:hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="py-2 px-4 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/scan"
                className="py-2 px-4 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Scan
              </Link>
              <Link
                href="/analytics"
                className="py-2 px-4 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analytics
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
