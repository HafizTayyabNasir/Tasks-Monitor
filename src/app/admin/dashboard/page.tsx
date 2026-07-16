'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import styles from '@/components/dashboard.module.css'
import uiStyles from '@/components/ui.module.css'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [expandedDate, setExpandedDate] = useState<string | null>(null)
  const router = useRouter()

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
  }

  useEffect(() => {
    fetchUsers()
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
    
    const data = await res.json().catch(() => null)

    if (res.ok) {
      setNewUsername('')
      setNewPassword('')
      setNewName('')
      fetchUsers()
    } else {
      alert(`Failed to add user: ${data?.error || 'Unknown error'}`)
    }
  }

  const handleDeleteUser = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if(!confirm('Are you sure you want to delete this user?')) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) fetchUsers()
  }

  // Generate last 14 days
  const getRecentDates = () => {
    const dates = []
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const dates = getRecentDates()

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={uiStyles.title} style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
        <button onClick={handleLogout} className={uiStyles.button} style={{ marginTop: 0, background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
          Logout
        </button>
      </header>

      <div className={styles.grid}>
        {/* Sidebar: Add User */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`${styles.section} glass`}>
          <h2>Add New User</h2>
          <form onSubmit={handleAddUser} className={styles.form}>
            <input className={uiStyles.input} placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} required />
            <input className={uiStyles.input} placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
            <input className={uiStyles.input} type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <button className={uiStyles.button} type="submit">Create User</button>
          </form>
        </motion.div>

        {/* Main: User Activity Reports */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${styles.section} glass`}>
          <h2>Employee Activity Reports</h2>
          
          <div className={styles.list}>
            {users.map((user: any) => (
              <div key={user.id} className={styles.listItem}>
                <div 
                  className={styles.userHeader} 
                  onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                >
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{user.name}</strong> 
                    <span style={{ color: '#888', marginLeft: '0.5rem' }}>(@{user.username})</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: '#a3a3a3', fontSize: '0.9rem' }}>
                      {expandedUser === user.id ? '▼ Close' : '▶ View Dates'}
                    </span>
                    <button onClick={(e) => handleDeleteUser(user.id, e)} className={styles.dangerBtn}>Remove</button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedUser === user.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className={styles.dateList}>
                        {dates.map(dateStr => {
                          const daySessions = user.sessions?.filter((s: any) => s.startTime.startsWith(dateStr)) || []
                          const isPresent = daySessions.length > 0
                          const expandId = `${user.id}-${dateStr}`
                          
                          return (
                            <div key={dateStr} className={styles.dateItem}>
                              <div 
                                className={styles.dateHeader}
                                onClick={() => isPresent && setExpandedDate(expandedDate === expandId ? null : expandId)}
                                style={{ cursor: isPresent ? 'pointer' : 'default' }}
                              >
                                <strong>{new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                                <span className={`${styles.badge} ${isPresent ? styles.badgePresent : styles.badgeAbsent}`}>
                                  {isPresent ? 'Present' : 'Absent'}
                                </span>
                              </div>
                              
                              <AnimatePresence>
                                {isPresent && expandedDate === expandId && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }} 
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden' }}
                                  >
                                    {daySessions.map((session: any, idx: number) => (
                                      <div key={idx} className={styles.summary}>
                                        {session.summary ? session.summary : 'No detailed report uploaded for this session.'}
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {users.length === 0 && <p style={{ color: '#888' }}>No users added yet.</p>}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
