'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import styles from '@/components/dashboard.module.css'
import uiStyles from '@/components/ui.module.css'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [sessions, setSessions] = useState([])
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const router = useRouter()

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
  }

  const fetchSessions = async () => {
    const res = await fetch('/api/admin/sessions')
    if (res.ok) setSessions(await res.json())
  }

  useEffect(() => {
    fetchUsers()
    fetchSessions()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword, name: newName })
    })
    if (res.ok) {
      setNewUsername('')
      setNewPassword('')
      setNewName('')
      fetchUsers()
    } else {
      alert('Failed to add user')
    }
  }

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) fetchUsers()
  }

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={uiStyles.title} style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
        <button onClick={handleLogout} className={uiStyles.button} style={{ marginTop: 0, background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
          Logout
        </button>
      </header>

      <div className={styles.grid}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`${styles.section} glass`}>
          <h2>Manage Users</h2>
          <form onSubmit={handleAddUser} className={styles.form}>
            <input className={uiStyles.input} placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} required />
            <input className={uiStyles.input} placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
            <input className={uiStyles.input} type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <button className={uiStyles.button} type="submit">Add User</button>
          </form>

          <div className={styles.list}>
            {users.map((user: any) => (
              <div key={user.id} className={styles.listItem}>
                <div>
                  <strong>{user.name}</strong> (@{user.username})
                </div>
                <button onClick={() => handleDeleteUser(user.id)} className={styles.dangerBtn}>Remove</button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${styles.section} glass`}>
          <h2>Recent Sessions</h2>
          <div className={styles.list}>
            {sessions.map((session: any) => (
              <div key={session.id} className={styles.sessionCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{session.user?.name} (@{session.user?.username})</strong>
                  <span className={styles.badge}>{session.endTime ? 'Completed' : 'Active'}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#888' }}>
                  Started: {new Date(session.startTime).toLocaleString()}
                </div>
                {session.endTime && (
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>
                    Ended: {new Date(session.endTime).toLocaleString()}
                  </div>
                )}
                {session.summary && (
                  <div className={styles.summary}>
                    <strong>Summary:</strong><br />
                    {session.summary}
                  </div>
                )}
              </div>
            ))}
            {sessions.length === 0 && <p style={{ color: '#888' }}>No sessions recorded yet.</p>}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
