'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import styles from '@/components/ui.module.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login')
      }
      
      router.push(data.redirect)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <main className={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`${styles.card} glass`}
        style={{ borderTop: '4px solid var(--danger)' }}
      >
        <h1 className={styles.title} style={{ background: 'linear-gradient(to right, #fca5a5, #ef4444)', WebkitBackgroundClip: 'text' }}>Admin Portal</h1>
        <p style={{ textAlign: 'center', color: '#a3a3a3', marginBottom: '1rem' }}>
          Authorized personnel only
        </p>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Username</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Admin ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Admin Password</label>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button} style={{ background: 'var(--danger)' }}>
            Access Portal
          </button>
        </form>
      </motion.div>
    </main>
  )
}
