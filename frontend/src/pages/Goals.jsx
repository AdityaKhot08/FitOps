import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, CheckCircle2, Trophy, Clock, X, RefreshCw, AlertCircle } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('workout-count');
  const [targetValue, setTargetValue] = useState(10);
  const [currentValue, setCurrentValue] = useState(0);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [submitting, setSubmitting] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.goals.getAll();
      if (res.success) {
        setGoals(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch active goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!title || !type || !targetValue || !deadline) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.goals.create({
        title,
        type,
        targetValue: parseFloat(targetValue),
        currentValue: parseFloat(currentValue) || 0,
        deadline: new Date(deadline),
      });
      if (res.success) {
        setGoals([...goals, res.data]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create goal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleIncrement = async (goal) => {
    const newVal = goal.currentValue + 1;
    try {
      const res = await api.goals.update(goal._id, {
        currentValue: newVal,
        targetValue: goal.targetValue, // Include to trigger auto-achieved logic
      });
      if (res.success) {
        setGoals(goals.map((g) => (g._id === goal._id ? res.data : g)));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update goal progress');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this goal?')) return;

    try {
      setError(null);
      const res = await api.goals.delete(id);
      if (res.success) {
        setGoals(goals.filter((g) => g._id !== id));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to remove goal');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fitness Target Board</h1>
          <p style={{ color: 'var(--text-muted)' }}>Configure specific milestones to drive consistent progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Establish Goal
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 8, 68, 0.1)', color: '#ff0844', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '40vh', gap: '1rem' }}>
          <RefreshCw className="animate-spin" size={32} color="#00f2fe" />
          <p style={{ color: 'var(--text-muted)' }}>Synching target dashboard...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Trophy size={48} style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.08)' }} />
          <h3>No Active Goals</h3>
          <p style={{ margin: '0.5rem 0 1.5rem 0' }}>Establish measurable training targets to keep yourself motivated!</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Establish First Goal
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
            const isCompleted = g.status === 'achieved';

            return (
              <div key={g._id} className="glass-card fade-in" style={{ borderLeft: isCompleted ? '4px solid #38ef7d' : '4px solid var(--primary-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                      {g.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>
                      Type: {g.type?.replace('-', ' ')}
                    </span>
                  </div>
                  <button
                    className="btn"
                    style={{ background: 'none', border: 'none', color: '#ffb199', cursor: 'pointer', padding: '0.25rem' }}
                    onClick={() => handleDelete(g._id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  <span>Progress:</span>
                  <span style={{ fontWeight: '700', color: isCompleted ? '#38ef7d' : '#fff' }}>
                    {g.currentValue} / {g.targetValue} ({pct}%)
                  </span>
                </div>

                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: isCompleted
                        ? 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)'
                        : 'var(--primary-gradient)',
                    }}
                  ></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> Deadline:{' '}
                    {new Date(g.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  {isCompleted ? (
                    <span className="tag" style={{ background: 'rgba(56, 239, 125, 0.1)', color: '#38ef7d', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trophy size={10} /> Completed
                    </span>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleIncrement(g)}
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px' }}
                    >
                      + Progress
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal creation modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <button
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Establish Target Goal</h3>

            <form onSubmit={handleCreateGoal}>
              <div className="form-group">
                <label className="form-label">Goal Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Cut to 10% Body Fat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Goal Metric Category</label>
                <select className="form-control" value={type} onChange={(e) => setType(e.target.value)} style={{ background: '#181b28', cursor: 'pointer' }}>
                  <option value="workout-count">Workout Count (Sessions)</option>
                  <option value="weight">Body Weight Milestone (kg)</option>
                  <option value="duration">Total Training Duration (mins)</option>
                  <option value="strength">Peak Lift Resistance (kg)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Goal Value</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Value</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Target Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving Goal...' : 'Establish Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
