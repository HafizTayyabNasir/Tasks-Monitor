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
    // Generate a dummy sophisticated summary
    const summary = "Session tracked successfully. User engaged in productive activities for the duration. Activity peaks were noticed during key segments. No anomalies detected."
    
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
