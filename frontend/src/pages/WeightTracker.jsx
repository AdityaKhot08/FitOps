import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Line } from 'react-chartjs-2';
import { Trash2, Scale, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

export default function WeightTracker() {
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [submitting, setSubmitting] = useState(false);

  const fetchWeights = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.weights.getAll();
      if (res.success) {
        setWeights(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch weight logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!weight || parseFloat(weight) <= 0) {
      alert('Please enter a valid scale weight.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.weights.create(parseFloat(weight), new Date(date));
      if (res.success) {
        setWeights([...weights, res.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
        setWeight('');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to record weight entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this weight entry?')) return;

    try {
      setError(null);
      const res = await api.weights.delete(id);
      if (res.success) {
        setWeights(weights.filter((w) => w._id !== id));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to remove weight entry');
    }
  };

  // Line Chart styling configuration
  const chartLabels = weights.map((w) =>
    new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
  const chartDataValues = weights.map((w) => w.weight);

  const lineChartConfig = {
    labels: chartLabels.length > 0 ? chartLabels : ['Initial'],
    datasets: [
      {
        label: 'Body Weight (kg)',
        data: chartDataValues.length > 0 ? chartDataValues : [70],
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.04)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#00f2fe',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#11131c',
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Outfit' },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#8e94a0', font: { family: 'Outfit' } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#8e94a0', font: { family: 'Outfit' } },
      },
    },
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Weight Log Telemetry</h1>
          <p style={{ color: 'var(--text-muted)' }}>Chronological tracking and trend plotting of your scale weight</p>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 8, 68, 0.1)', color: '#ff0844', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Input Form + Visual Chart */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {/* Left Column: Form to log new weight */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={20} color="var(--primary-cyan)" /> Record Scale Weight
          </h3>
          
          <form onSubmit={handleAddWeight}>
            <div className="form-group">
              <label className="form-label">Body Weight (kg)</label>
              <div style={{ position: 'relative' }}>
                <Scale size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  className="form-control"
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  placeholder="e.g. 72.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Log Date</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="date"
                  className="form-control"
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Recording Entry...' : 'Log Weight Entry'}
            </button>
          </form>
        </div>

        {/* Right Column: Weight Trend Graph */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Chronological Weight Trend</h3>
          <div style={{ position: 'relative', height: '100%', width: '100%', flex: 1 }}>
            <Line data={lineChartConfig} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Historical List */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Historical Weight Entries</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            <RefreshCw className="animate-spin" size={24} style={{ marginBottom: '0.5rem' }} />
            <p>Fetching metrics history...</p>
          </div>
        ) : weights.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No scale logs recorded. Begin entering your stats above!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Log Date</th>
                  <th>Body Weight</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {weights.slice().reverse().map((w) => (
                  <tr key={w._id}>
                    <td style={{ fontWeight: '600' }}>
                      {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ color: 'var(--primary-cyan)', fontWeight: '700' }}>{w.weight} kg</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(w._id)}
                        style={{ padding: '0.4rem', borderRadius: '8px' }}
                        title="Delete Entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
