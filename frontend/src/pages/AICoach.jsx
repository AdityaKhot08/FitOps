import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Cpu, Send, Sparkles, RefreshCw, BookOpen, Apple, Heart, AlertCircle } from 'lucide-react';

export default function AICoach() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Greetings! I'm your FitOps AI Personal Coach. I have analyzed your fitness profile and activity logs. Ask me any questions regarding your workout schedules, training volume, target macros, or recovery guidelines!",
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchLatestRecommendation = async () => {
    try {
      setHistoryLoading(true);
      setError(null);
      const res = await api.ai.getHistory();
      if (res.success && res.data.length > 0) {
        setRecommendation(res.data[0]); // Load latest recommendation
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve recommendation history');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRecommendation();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.ai.generateRecommendation();
      if (res.success) {
        setRecommendation(res.data);
        
        // Add notification to chat
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'assistant',
            text: `Sparkles: I have just generated a brand new routine for you: "${res.data.title}". Let me know if you would like me to explain any of these exercises!`,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userInput,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const query = userInput.toLowerCase();
    setUserInput('');
    setChatLoading(true);

    // Dynamic, simulated smart coaching response based on profile context
    setTimeout(() => {
      let replyText = "That's a great question! For optimal results, ensure you perform each repetition with a controlled 2-second negative phase. Consistency, adequate sleep (7-8 hours), and progressive overload are the core pillars of growth.";

      const userProfile = api.auth.getCurrentUser()?.profile || {};
      const goal = userProfile.fitnessGoal || 'maintenance';
      const weight = userProfile.currentWeight || 70;

      if (query.includes('protein') || query.includes('diet') || query.includes('eat') || query.includes('calorie')) {
        const proteinTarget = Math.round(weight * 2);
        if (goal === 'muscle-gain') {
          replyText = `To support your muscle gain goal, aim for a daily caloric surplus of ~300 kcal (~${Math.round(weight * 38)} total kcal). Target at least ${proteinTarget}g of daily protein (~2.0g per kg of bodyweight). Focus on clean protein sources like chicken breast, lean beef, fish, egg whites, and whey protein.`;
        } else if (goal === 'weight-loss') {
          replyText = `For fat loss, aim for a caloric deficit of -500 kcal (~${Math.round(weight * 26)} total kcal). Keep protein elevated at ~${Math.round(weight * 1.8)}g to prevent muscle breakdown. Combine with fiber-rich complex carbs to maximize satiety.`;
        } else {
          replyText = `For maintenance, target about ${Math.round(weight * 32)} kcal daily. Keep protein around ${proteinTarget}g, and balance carbs and healthy fats (avocados, nuts, olive oil) evenly.`;
        }
      } else if (query.includes('squat') || query.includes('leg') || query.includes('knee')) {
        replyText = "When executing lower-body movements, prioritize deep squats to engage the glutes and hamstrings. Keep your heels firmly planted and your chest upright. If you have knee strain, swap barbell squats for leg press or goblet squats, keeping reps high (12-15) and loads moderate.";
      } else if (query.includes('bench') || query.includes('chest') || query.includes('push')) {
        replyText = "For chest development, prioritize incline dumbell presses (around 30 degrees) to develop the upper pectorals. Retract your scapula during the bench setup to protect your rotator cuffs and focus the mechanical tension on your chest.";
      } else if (query.includes('streak') || query.includes('miss') || query.includes('motivate') || query.includes('routine')) {
        replyText = "Don't stress about a missed workout! Fitness is a lifetime journey. Focus on locking in your next scheduled session. Consistency doesn't require perfection; it requires returning to your routine after disruptions.";
      } else if (query.includes('cardio') || query.includes('run') || query.includes('lose weight')) {
        replyText = "To boost endurance or assist fat loss, integrate 20-30 minutes of low-intensity steady-state (LISS) cardio, or 10-15 minutes of high-intensity intervals (HIIT), immediately following your weight training. Fasted cardio in the morning is also highly effective.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: replyText,
        },
      ]);
      setChatLoading(false);
    }, 800);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Performance Coach</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tailored routine engineering and recovery insights derived from your biometrics</p>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 8, 68, 0.1)', color: '#ff0844', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="ai-coach-banner">
        <div className="ai-coach-avatar">
          <Cpu color="#090a0f" size={36} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Interactive Biometric Optimization <Sparkles size={18} color="var(--primary-cyan)" />
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '800px', marginBottom: '1.25rem' }}>
            Click the generator below to trigger our AI Coach engine. It scans your logged training distributions over the last 14 days, spots muscular imbalances, checks weight stalls, and prescribes exact training volumes.
          </p>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? <RefreshCw className="animate-spin" size={16} /> : 'Generate Customized Routine'}
          </button>
        </div>
      </div>

      {/* Main recommendation display */}
      <div className="dashboard-grid" style={{ alignItems: 'start' }}>
        {/* Left Column: Recommendations details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {historyLoading ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <RefreshCw className="animate-spin" size={28} style={{ marginBottom: '1rem' }} />
              <p>Scanning coach logs...</p>
            </div>
          ) : !recommendation ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Sparkles size={32} style={{ color: 'var(--primary-cyan)', marginBottom: '1rem' }} />
              <h3>Plan Generation Pending</h3>
              <p style={{ marginTop: '0.5rem' }}>No AI recommendations generated yet. Click the optimization trigger above!</p>
            </div>
          ) : (
            <div className="glass-card fade-in" style={{ padding: '2rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <span className="tag tag-chest" style={{ marginBottom: '0.5rem' }}>AI Prescribed</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{recommendation.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Generated on {new Date(recommendation.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Routine exercises */}
              <div className="ai-routine-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} color="var(--primary-cyan)" /> Target Training Splits
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="logs-table">
                    <thead>
                      <tr>
                        <th>Exercise Name</th>
                        <th>Muscle Focus</th>
                        <th>Target Sets</th>
                        <th>Target Reps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendation.workoutRoutine?.map((ex, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '600' }}>{ex.exerciseName}</td>
                          <td>
                            <span className={`tag tag-${ex.muscleGroup}`}>{ex.muscleGroup}</span>
                          </td>
                          <td>{ex.sets} Sets</td>
                          <td>{ex.reps} Reps</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
                    <Apple size={16} color="#38ef7d" /> Nutrition Strategy
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {recommendation.nutritionalAdvice}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
                    <Heart size={16} color="#fc84b6" /> Recovery & Lifestyle
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {recommendation.lifestyleTips}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Simulated Coach Chat */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '520px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            Chat with Coach
          </h3>

          <div className="chat-messages" style={{ flex: 1, padding: '0.5rem', overflowY: 'auto' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="chat-bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <RefreshCw className="animate-spin" size={14} />
                <span>Coach is thinking...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-area" style={{ margin: '0 -0.75rem -0.75rem -0.75rem', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
            <input
              type="text"
              className="form-control"
              style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.9rem' }}
              placeholder="Ask about diet, bench, legs, sleep..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={chatLoading}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem' }} disabled={chatLoading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
