import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Flame, Scale, Activity, CheckCircle, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ setCurrentPage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.analytics.getDashboardData();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
        <RefreshCw className="animate-spin" size={40} color="#00f2fe" />
        <p style={{ color: 'var(--text-muted)' }}>Assembling dashboard intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card fade-in" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(255, 8, 68, 0.2)' }}>
        <AlertCircle size={48} color="#ff0844" style={{ marginBottom: '1rem' }} />
        <h3>System Sync Issue</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    streak = 0,
    bmi = 22.0,
    totalCaloriesBurned = 0,
    totalWorkouts = 0,
    userProfile = {},
    userName = 'User',
    recentActivities = [],
    muscleDistribution = {},
    weightHistory = { labels: [], data: [] },
    goalsProgress = { percentage: 0, completed: 0, total: 0 },
  } = data || {};

  // BMI Category Evaluator
  const getBmiCategory = (val) => {
    const num = parseFloat(val);
    if (num < 18.5) return { category: 'Underweight', color: '#ffb199' };
    if (num < 25.0) return { category: 'Healthy Weight', color: '#00f2fe' };
    if (num < 30.0) return { category: 'Overweight', color: '#fc84b6' };
    return { category: 'Obese', color: '#ff0844' };
  };

  const bmiMeta = getBmiCategory(bmi);

  // Chart configuration: Weight logs Line Chart
  const weightChartConfig = {
    labels: weightHistory.labels,
    datasets: [
      {
        label: 'Body Weight (kg)',
        data: weightHistory.data,
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.05)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00f2fe',
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
      },
    ],
  };

  const weightChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#11131c',
        titleFont: { family: 'Outfit', size: 13 },
        bodyFont: { family: 'Outfit', size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
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

  // Chart configuration: Muscle split Doughnut Chart
  const muscleGroups = Object.keys(muscleDistribution);
  const muscleCounts = Object.values(muscleDistribution);
  const hasMuscleData = muscleCounts.some((v) => v > 0);

  const doughnutChartConfig = {
    labels: muscleGroups.map((g) => g.charAt(0).toUpperCase() + g.slice(1)),
    datasets: [
      {
        data: hasMuscleData ? muscleCounts : [1], // If no data, show a grey placeholder ring
        backgroundColor: hasMuscleData
          ? ['#00f2fe', '#b19ffb', '#fc84b6', '#ffb199', '#38ef7d', '#ffe600', '#ff0844']
          : ['rgba(255, 255, 255, 0.05)'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#f5f6fa',
          font: { family: 'Outfit', size: 11 },
          padding: 12,
        },
      },
      tooltip: {
        enabled: hasMuscleData,
        backgroundColor: '#11131c',
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Outfit' },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="fade-in">
      {/* Header section */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            Welcome back, {userName}!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Biometrics: <strong style={{ color: '#fff' }}>{userProfile.height}cm</strong> /{' '}
            <strong style={{ color: '#fff' }}>{userProfile.currentWeight}kg</strong> • Goal:{' '}
            <span style={{ textTransform: 'capitalize', color: 'var(--primary-cyan)', fontWeight: '600' }}>
              {userProfile.fitnessGoal?.replace('-', ' ')}
            </span>
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={fetchDashboardData}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(177, 159, 251, 0.1)', color: '#b19ffb' }}>
            <Flame size={28} />
          </div>
          <div className="metric-info">
            <span className="metric-value" style={{ color: '#b19ffb' }}>
              {streak} Days
            </span>
            <span className="metric-label">Active Streak</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--primary-cyan)' }}>
            <Scale size={28} />
          </div>
          <div className="metric-info">
            <span className="metric-value">
              {userProfile.currentWeight} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {userProfile.targetWeight} kg</span>
            </span>
            <span className="metric-label">Scale Weight</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(252, 132, 182, 0.1)', color: '#fc84b6' }}>
            <Activity size={28} />
          </div>
          <div className="metric-info">
            <span className="metric-value">{totalCaloriesBurned}</span>
            <span className="metric-label">Calories Burned</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(56, 239, 125, 0.1)', color: '#38ef7d' }}>
            <CheckCircle size={28} />
          </div>
          <div className="metric-info">
            <span className="metric-value">
              {goalsProgress.completed} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {goalsProgress.total}</span>
            </span>
            <span className="metric-label">Completed Goals</span>
          </div>
        </div>
      </div>

      {/* Main Charts Dashboard */}
      <div className="dashboard-grid">
        {/* Left Column: Weight Progression Graph */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Weight Progression Trend</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Latest weight logs</span>
          </div>
          <div style={{ position: 'relative', height: '280px', width: '100%', flex: 1 }}>
            <Line data={weightChartConfig} options={weightChartOptions} />
          </div>
        </div>

        {/* Right Column: BMI Gauge Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Body Mass Index</h3>
          
          <div className="bmi-circle" style={{ borderColor: bmiMeta.color }}>
            <span className="bmi-value" style={{ color: bmiMeta.color }}>{bmi}</span>
            <span className="bmi-status" style={{ color: bmiMeta.color }}>BMI</span>
          </div>
          
          <h4 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{bmiMeta.category}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '200px', margin: '0 auto 1.5rem auto' }}>
            Calculated from your height of {userProfile.height}cm. Keep tracking to see improvements.
          </p>

          <button className="btn btn-secondary" onClick={() => setCurrentPage('profile')} style={{ width: '100%' }}>
            Update Biometrics
          </button>
        </div>
      </div>

      {/* Lower Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Activities */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Gym Activities</h3>
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentPage('workouts')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Log Workout <ChevronRight size={14} />
            </button>
          </div>

          {recentActivities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <p>No workouts logged yet. Begin your journey today!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Muscle Group</th>
                    <th>Volume (S x R)</th>
                    <th>Lifted</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((w) => (
                    <tr key={w._id}>
                      <td style={{ fontWeight: '600' }}>{w.exerciseName}</td>
                      <td>
                        <span className={`tag tag-${w.muscleGroup}`}>{w.muscleGroup}</span>
                      </td>
                      <td>{w.sets} x {w.reps}</td>
                      <td>{w.weightLifted > 0 ? `${w.weightLifted} kg` : 'Bodyweight'}</td>
                      <td>{w.duration} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Training Splits */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Muscle Group Splits</h3>
          <div style={{ position: 'relative', height: '180px', width: '100%', flex: 1 }}>
            <Doughnut data={doughnutChartConfig} options={doughnutChartOptions} />
          </div>
          {!hasMuscleData && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>
              Log workouts to visualize your active splits.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
