import React, { useState, useRef, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout.jsx'
import { Avatar } from '../../components/ui/index.jsx'
import { mockConversations } from '../../utils/mockData.js'
import '../seeker/Seeker.css'

export default function MessagesPage() {
  const [convos, setConvos] = useState(mockConversations)
  const [active, setActive] = useState(convos[0])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [active])

  const send = () => {
    if (!input.trim()) return
    const newMsg = { from: 'me', text: input, time: 'Just now' }
    setConvos(cs => cs.map(c =>
      c.id === active.id
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: input }
        : c
    ))
    setActive(a => ({ ...a, messages: [...a.messages, newMsg] }))
    setInput('')
  }

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Messages</h1>
          <p>Direct conversations with hiring teams.</p>
        </div>
      </div>

      <div className="messages-layout">
        {/* Sidebar */}
        <div className="conversation-list">
          {convos.map(c => (
            <div
              key={c.id}
              className={`conversation-item ${active?.id === c.id ? 'conversation-item--active' : ''}`}
              onClick={() => setActive(c)}
            >
              <Avatar name={c.with} size="sm" />
              <div className="conversation-item__meta">
                <div className="conversation-item__name">{c.with}</div>
                <div className="conversation-item__last">{c.lastMessage}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span className="conversation-item__time">{c.time}</span>
                {c.unread > 0 && (
                  <span style={{ background: 'var(--clr-primary)', color: 'white', borderRadius: 99, padding: '0 6px', fontSize: '0.6875rem', fontWeight: 700 }}>{c.unread}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat window */}
        {active ? (
          <div className="chat-window">
            <div className="chat-header">
              <Avatar name={active.with} size="sm" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{active.with}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--clr-success)', fontWeight: 600 }}>● Online</div>
              </div>
            </div>
            <div className="chat-messages">
              {active.messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'me' ? 'flex-end' : 'flex-start', gap: 4 }}>
                  <div className={`chat-bubble chat-bubble--${msg.from}`}>{msg.text}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>{msg.time}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="chat-input-bar">
              <input
                className="form-input"
                placeholder="Type a message…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                style={{ flex: 1 }}
              />
              <button className="btn btn--primary" onClick={send}>Send →</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--clr-text-muted)' }}>
            Select a conversation
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
