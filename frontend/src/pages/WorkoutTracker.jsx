import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Trash2, Edit3, X, RefreshCw, AlertCircle } from 'lucide-react';

const MUSCLE_GROUPS = ['chest', 'legs', 'back', 'shoulders', 'arms', 'core', 'cardio'];

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [exerciseName, setExerciseName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('chest');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weightLifted, setWeightLifted] = useState(0);
  const [duration, setDuration] = useState(45);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.workouts.getAll();
      if (res.success) {
        setWorkouts(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setExerciseName('');
    setMuscleGroup('chest');
    setSets(3);
    setReps(10);
    setWeightLifted(0);
    setDuration(45);
    setDate(new Date().toISOString().substring(0, 10));
    setIsModalOpen(true);
  };

  const openEditModal = (w) => {
    setModalMode('edit');
    setEditingId(w._id);
    setExerciseName(w.exerciseName);
    setMuscleGroup(w.muscleGroup);
    setSets(w.sets);
    setReps(w.reps);
    setWeightLifted(w.weightLifted);
    setDuration(w.duration);
    setDate(new Date(w.date).toISOString().substring(0, 10));
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!exerciseName || !muscleGroup || !sets || !reps || !duration) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      exerciseName,
      muscleGroup,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weightLifted: parseFloat(weightLifted),
      duration: parseInt(duration),
      date: new Date(date),
    };

    try {
      setError(null);
      if (modalMode === 'add') {
        const res = await api.workouts.create(payload);
        if (res.success) {
          setWorkouts([res.data, ...workouts]);
        }
      } else {
        const res = await api.workouts.update(editingId, payload);
        if (res.success) {
          setWorkouts(workouts.map((w) => (w._id === editingId ? res.data : w)));
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save workout log');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this workout log?')) return;

    try {
      setError(null);
      const res = await api.workouts.delete(id);
      if (res.success) {
        setWorkouts(workouts.filter((w) => w._id !== id));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete workout log');
    }
  };

  const filteredWorkouts = filter === 'all'
    ? workouts
    : workouts.filter((w) => w.muscleGroup === filter);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workout logs</h1>
          <p style={{ color: 'var(--text-muted)' }}>Keep track of your training volume and target splits</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Log Workout
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 8, 68, 0.1)', color: '#ff0844', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
          style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
        >
          All splits
        </button>
        {MUSCLE_GROUPS.map((g) => (
          <button
            key={g}
            className={`btn ${filter === g ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(g)}
            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', textTransform: 'capitalize' }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Workouts Grid */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <RefreshCw className="animate-spin" size={32} style={{ marginBottom: '1rem' }} />
            <p>Fetching historical logs...</p>
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p>No workout entries found matching your filter selection. Start by adding one!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Exercise Name</th>
                  <th>Muscle Group</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Weight (kg)</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.map((w) => (
                  <tr key={w._id}>
                    <td style={{ fontWeight: '600' }}>{w.exerciseName}</td>
                    <td>
                      <span className={`tag tag-${w.muscleGroup}`}>{w.muscleGroup}</span>
                    </td>
                    <td>{w.sets} Sets</td>
                    <td>{w.reps} Reps</td>
                    <td>{w.weightLifted > 0 ? `${w.weightLifted} kg` : 'Bodyweight'}</td>
                    <td>{w.duration} mins</td>
                    <td>{new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => openEditModal(w)}
                          style={{ padding: '0.4rem', borderRadius: '8px' }}
                          title="Edit Log"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(w._id)}
                          style={{ padding: '0.4rem', borderRadius: '8px' }}
                          title="Delete Log"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <button
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
              {modalMode === 'add' ? 'Log Workout Session' : 'Modify Workout Session'}
            </h3>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Exercise Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Incline Bench Press"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Muscle Split</label>
                <select
                  className="form-control"
                  value={muscleGroup}
                  onChange={(e) => setMuscleGroup(e.target.value)}
                  style={{ background: '#181b28', cursor: 'pointer' }}
                >
                  {MUSCLE_GROUPS.map((g) => (
                    <option key={g} value={g} style={{ textTransform: 'capitalize' }}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Sets</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reps</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Weight Lifted (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.5"
                    placeholder="0 for Bodyweight"
                    value={weightLifted}
                    onChange={(e) => setWeightLifted(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (mins)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Workout Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Log Session' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
