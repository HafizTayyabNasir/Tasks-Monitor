'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import styles from '@/components/dashboard.module.css'
import uiStyles from '@/components/ui.module.css'

export default function UserDashboard() {
  const [activeSession, setActiveSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const startSession = async () => {
    setLoading(true)
    const res = await fetch('/api/sessions', { method: 'POST' })
    if (res.ok) {
      setActiveSession(await res.json())
    }
    setLoading(false)
  }

  const endSession = async () => {
    setLoading(true)
    const summary = `════════════════════════════════════════════════════════════════
   🖥  FULL ACTIVITY REPORT  —  1-Minute Session
   Recorded : ${new Date().toLocaleString()}
   Platform : Windows
════════════════════════════════════════════════════════════════

━━  📋  SESSION OVERVIEW
  • Duration              : 60s
  • Active mouse time     : 46.6s   |   Idle: 13.4s
  • Total keystrokes      : 100
  • Apps switched to      : 2
  • Unique websites       : 4

━━  💻  SOFTWARE / APPS USED
  • chrome                            58s    97%  █████████████████████████████
  • Code                               3s     5%  █

━━  🌐  WEBSITES VISITED  (from browser window titles)
  • YouTube                           44s    73%  ██████████████████████
  • Netflix                            8s    13%  ████
  • New Tab                            4s     7%  ██
  • ai-client-hunting-backend          2s     3%  █

━━  🖱  MOUSE — MOVEMENT
  • Total distance        : 16,527 px
  • Average speed         : 1742 px/s
  • Peak speed            : 8658 px/s

━━  🖱  MOUSE — CLICKS & SCROLLS
  • Left clicks           : 15
  • Right clicks          : 0
  • Scroll up / down      : 0 / 0

━━  ⌨️  KEYBOARD
  • Characters typed      : 14
  • Estimated WPM         : ~3
  • Chars per minute      : 14
  • Backspaces (edits)    : 0
  • Enter presses         : 2
  • Ctrl / Shift uses     : 2 / 0

━━  ⌨️  TOP 5 KEYS
  1. ' '  ×2
  2. 't'  ×2
  3. 'y'  ×1
  4. 'o'  ×1
  5. 'u'  ×1

━━  ⌨️  TYPING BURSTS
  • Burst #1: 7 keys in 1.2s  (~350 KPM)
  • Burst #2: 38 keys in 3.3s  (~691 KPM)
  • Burst #3: 50 keys in 10.3s  (~291 KPM)

━━  💤  IDLE GAPS  (≥ 3s no mouse/keyboard activity)
  • Gap #1: 4.61s
  • Gap #2: 8.77s

━━  ▶️  YOUTUBE VIDEOS WATCHED
  • Class-04: Your First AI Employee: Master Open      38s

━━  📝  WORKING SUMMARY
  • Most-used application : chrome (58s)
  • Most-visited site     : YouTube (44s)
  • Typing profile        : Minimal typing — mostly mouse-driven work.
  • Shortcut usage        : Light.

━━  📊  PRODUCTIVITY & ENTERTAINMENT SUMMARY
  • Total Free/Idle Time  : 13s
  • Productive Work Time  : 0s
    - Work Tools Used     : ai-client-hunting-backend, Code, New Tab
  • Learning Time         : 38s
    - Watched (Learning)  : Class-04: Your First AI Employ
  • Entertainment Time    : 14s
    - Platforms Used      : Netflix, YouTube (Browsing)

════════════════════════════════════════════════════════════════`
    
    const res = await fetch(`/api/sessions/${activeSession.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary })
    })
    
    if (res.ok) {
      setActiveSession(null)
      alert("Session ended successfully. Summary uploaded.")
    }
    setLoading(false)
  }

  return (
    <main className={styles.dashboard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <header className={styles.header} style={{ width: '100%', maxWidth: '800px' }}>
        <h1 className={uiStyles.title} style={{ fontSize: '1.8rem' }}>User Dashboard</h1>
        <button onClick={handleLogout} className={uiStyles.button} style={{ marginTop: 0, padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <AnimatePresence mode="wait">
          {!activeSession ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className={`${uiStyles.card} glass`}
              style={{ textAlign: 'center' }}
            >
              <h2 style={{ marginBottom: '1rem' }}>Ready to start?</h2>
              <p style={{ color: '#888', marginBottom: '2rem' }}>Click the button below to start noticing everything in a new session.</p>
              <button 
                onClick={startSession} 
                disabled={loading}
                className={uiStyles.button}
                style={{ background: 'var(--success)', padding: '1.5rem', fontSize: '1.2rem', borderRadius: '50px' }}
              >
                {loading ? 'Starting...' : 'Start Session'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`${uiStyles.card} glass`}
              style={{ textAlign: 'center', borderColor: 'var(--primary)', boxShadow: '0 0 40px rgba(79, 70, 229, 0.4)' }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                  margin: '0 auto 2rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%' }}></div>
              </motion.div>
              
              <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Session is Active</h2>
              <p style={{ color: '#888', marginBottom: '2rem' }}>Noticing everything. Your activity is being monitored.</p>
              
              <button 
                onClick={endSession} 
                disabled={loading}
                className={uiStyles.button}
                style={{ background: 'var(--danger)', width: '100%' }}
              >
                {loading ? 'Ending...' : 'End Session & Save Summary'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
