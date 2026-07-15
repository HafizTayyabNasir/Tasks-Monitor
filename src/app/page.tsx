'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from '@/components/ui.module.css'

export default function Home() {
  return (
    <main className={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`${styles.card} glass`}
        style={{ textAlign: 'center' }}
      >
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Session Monitor
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ color: '#a3a3a3', lineHeight: '1.6' }}
        >
          An immersive experience to track and monitor your sessions with state-of-the-art summary generation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
        >
          <Link href="/login" style={{ width: '100%' }}>
            <button className={styles.button} style={{ width: '100%' }}>
              User Login
            </button>
          </Link>
          <Link href="/admin/login" style={{ width: '100%' }}>
            <button 
              className={styles.button} 
              style={{ 
                width: '100%', 
                background: 'transparent', 
                border: '1px solid var(--border)',
                color: 'var(--foreground)'
              }}
            >
              Admin Portal
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
