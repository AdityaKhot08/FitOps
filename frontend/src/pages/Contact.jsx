import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, User, ShieldAlert } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">FitOps Support Network</h1>
          <p style={{ color: 'var(--text-muted)' }}>Get in touch with engineering support, submit feature requests, or report system issues</p>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
        {/* Left Column: Form */}
        <div className="glass-card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }} className="fade-in">
              <CheckCircle2 size={48} color="#38ef7d" style={{ marginBottom: '1rem', margin: '0 auto 1rem auto' }} />
              <h3>Transmission Received</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Thank you for contacting FitOps Support. An engineering representative will respond shortly to your email.
              </p>
              <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                System Inquiry Form
              </h3>

              <div className="form-group">
                <label className="form-label">Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.75rem', width: '100%' }}
                    placeholder="Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: '2.75rem', width: '100%' }}
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Subject</label>
                <select className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={loading} style={{ background: '#181b28', cursor: 'pointer' }}>
                  <option value="general">General Information</option>
                  <option value="telemetry">Biometrics / Logging Telemetry Issue</option>
                  <option value="ai-coach">AI Coach / Recommendations Bug</option>
                  <option value="devops">DevOps / Docker Orchestration Feedback</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Inquiry Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  style={{ width: '100%', resize: 'none' }}
                  placeholder="Explain details of your request..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
                {loading ? 'Transmitting Inquiries...' : 'Transmit Message'} <Send size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h4 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} color="var(--primary-cyan)" /> Fast Support Channels
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Our DevOps monitoring keeps continuous tabs on all container states. If you run into network failures, reach out here and we'll audit the Nginx ingress rules immediately.
            </p>
          </div>

          <div className="glass-card">
            <h4 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} color="#fc84b6" /> Security Auditing
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              All auth credentials logged into FitOps AI undergo high-rounds bcrypt salt hashing. Session management tokens are cryptographically secured via JSON Web Tokens (JWT).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
