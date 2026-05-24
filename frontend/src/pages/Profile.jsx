import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { User, Shield, Mail, Scale, Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [currentWeight, setCurrentWeight] = useState(70);
  const [targetWeight, setTargetWeight] = useState(70);
  const [gender, setGender] = useState('male');
  const [fitnessGoal, setFitnessGoal] = useState('maintenance');
  const [activityLevel, setActivityLevel] = useState('moderate');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.auth.getProfile();
      if (res.success) {
        const user = res.data;
        setName(user.name);
        setEmail(user.email);
        if (user.profile) {
          setAge(user.profile.age || 25);
          setHeight(user.profile.height || 175);
          setCurrentWeight(user.profile.currentWeight || 70);
          setTargetWeight(user.profile.targetWeight || 70);
          setGender(user.profile.gender || 'male');
          setFitnessGoal(user.profile.fitnessGoal || 'maintenance');
          setActivityLevel(user.profile.activityLevel || 'moderate');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch profile biometrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name || !email || !age || !height || !targetWeight) {
      alert('Please fill out all required stats.');
      return;
    }

    try {
      setSubmitting(true);
      setSuccess(false);
      setError(null);

      const payload = {
        name,
        email,
        profile: {
          age: parseInt(age),
          height: parseFloat(height),
          currentWeight: parseFloat(currentWeight),
          targetWeight: parseFloat(targetWeight),
          gender,
          fitnessGoal,
          activityLevel,
        },
      };

      const res = await api.auth.updateProfile(payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update biometrics');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '1rem' }}>
        <RefreshCw className="animate-spin" size={32} color="#00f2fe" />
        <p style={{ color: 'var(--text-muted)' }}>Retrieving profile biometrics...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Biometric Profile</h1>
          <p style={{ color: 'var(--text-muted)' }}>Adjust your vitals and activity factors to tune your AI recommendation algorithms</p>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 8, 68, 0.1)', color: '#ff0844', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(56, 239, 125, 0.1)', color: '#38ef7d', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
          <Check size={16} />
          <span>Profile biometrics synchronized successfully!</span>
        </div>
      )}

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleUpdate}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
            Personal Credentials
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
            Biometrics Telemetry
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Age (Years)</label>
              <input
                type="number"
                className="form-control"
                min="10"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                className="form-control"
                min="50"
                max="280"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Weight (kg)</label>
              <input
                type="number"
                className="form-control"
                value={currentWeight}
                style={{ opacity: 0.6 }}
                disabled={true}
                title="Update current weight via the Weight Tracker"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>* Synced via Weight Tracker logs</span>
            </div>

            <div className="form-group">
              <label className="form-label">Target Weight (kg)</label>
              <input
                type="number"
                className="form-control"
                min="30"
                max="300"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="form-group">
              <label className="form-label">Biological Gender</label>
              <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} disabled={submitting} style={{ background: '#181b28', cursor: 'pointer' }}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Non-Binary</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Active Fitness Target</label>
              <select className="form-control" value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)} disabled={submitting} style={{ background: '#181b28', cursor: 'pointer' }}>
                <option value="maintenance">Maintenance (Balanced Metabolic)</option>
                <option value="weight-loss">Weight Loss (Caloric Deficit)</option>
                <option value="muscle-gain">Muscle Gain (Caloric Surplus)</option>
                <option value="endurance">Endurance & Cardiovascular Stamina</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Activity Multiplier</label>
              <select className="form-control" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} disabled={submitting} style={{ background: '#181b28', cursor: 'pointer' }}>
                <option value="sedentary">Sedentary (Office job / desk work)</option>
                <option value="light">Lightly Active (1-2 light workouts/wk)</option>
                <option value="moderate">Moderately Active (3-5 intense workouts/wk)</option>
                <option value="active">Very Active (6+ heavy workouts/wk)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }} disabled={submitting}>
              {submitting ? 'Saving Biometrics...' : 'Synchronize Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
