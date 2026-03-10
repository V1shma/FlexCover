import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [platform, setPlatform] = useState('Off-Duty');
  const [coverageRate, setCoverageRate] = useState(0.0);
  const [earnings, setEarnings] = useState(38500.50);
  const [taxSavings, setTaxSavings] = useState(5240.30);
  const [distance, setDistance] = useState(0);
  const [aiInsight, setAiInsight] = useState("Analyzing driving behavior, weather patterns, and local traffic data to dynamically optimize your premium.");
  const [aqi, setAqi] = useState(null);

  // Fetch AQI Data
  useEffect(() => {
    const fetchAQI = async () => {
      try {
        const response = await fetch(`https://api.waqi.info/feed/here/?token=8602c188c627dd045a5fab201c9e6799ce9e4322`);
        const data = await response.json();
        if (data.status === 'ok') {
          setAqi(data.data.aqi);
        }
      } catch (error) {
        console.error("AQI fetch error", error);
      }
    };
    fetchAQI();
    // Refresh AQI every 15 minutes
    const interval = setInterval(fetchAQI, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch AI Insight when platform changes
  useEffect(() => {
    if (!isWorking || platform === 'Off-Duty') {
      setAiInsight("Analyzing driving behavior, weather patterns, and local traffic data to dynamically optimize your premium.");
      return;
    }

    const fetchInsight = async () => {
      try {
        setAiInsight("Generating real-time insight from Gemini...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCdzTVJKqRYIucN-IsCUKUO7ZX67vVThOQ`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an AI risk engine for an Indian gig worker insurance platform. The user is currently active on ${platform}. Keep it under 15 words. Give a specific, localized, real-time risk insight or tip for their safety or efficiency in India. (e.g. "Heavy rain in Bangalore, drive safely" or "High order volume tonight, stay alert"). Do not use quotes or emojis.`
              }]
            }]
          })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
          setAiInsight(data.candidates[0].content.parts[0].text.trim());
        }
      } catch (e) {
        console.error("Gemini API Error", e);
        setAiInsight(`AI monitoring active for ${platform} in your region.`);
      }
    };

    fetchInsight();
  }, [platform, isWorking]);

  // Simulate AI Dynamic Risk Assessment
  useEffect(() => {
    let interval;
    if (isWorking) {
      interval = setInterval(() => {
        setEarnings(prev => prev + 12.50); // simulate earning in INR
        setDistance(prev => prev + 0.05); // simulate driving
        setTaxSavings(prev => prev + 2.50); // simulate tracking tax write-offs
      }, 3000);

      // Randomly switch platforms to simulate gig life
      const platforms = ['Ola', 'Zomato', 'Swiggy', 'UrbanCompany', 'Freelancer'];
      const p = platforms[Math.floor(Math.random() * platforms.length)];
      setPlatform(p);

      if (p === 'Ola' || p === 'Zomato' || p === 'Swiggy') {
        setCoverageRate(3.50); // Higher risk auto liability
      } else {
        setCoverageRate(1.20); // Lower risk local
      }
    } else {
      setPlatform('Off-Duty');
      setCoverageRate(0.0);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #FF9933, #138808)' }}>F</div>
          FlexCover<span className="text-gradient-primary">AI</span> <span style={{ fontSize: '0.8em', color: 'var(--text-muted)', marginLeft: '4px' }}>Bharat</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {aqi !== null && (
            <div className="status-badge" style={{
              background: aqi > 150 ? 'rgba(239, 68, 68, 0.1)' : aqi > 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              borderColor: aqi > 150 ? 'rgba(239, 68, 68, 0.2)' : aqi > 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
              color: aqi > 150 ? '#ef4444' : aqi > 50 ? 'var(--warning)' : 'var(--success)'
            }}>
              <span style={{ fontSize: '1rem', marginRight: '4px' }}>☁️</span>
              AQI: {aqi} {aqi > 150 ? '(Unhealthy)' : aqi > 50 ? '(Moderate)' : '(Good)'}
            </div>
          )}
          <span className="text-sm">Account Balance: <strong style={{ color: 'var(--text-main)' }}>₹3,420.50</strong></span>
          <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #FF9933, #138808)' }}>View Hub</button>
        </div>
      </header>

      <div className="dashboard-grid">

        {/* Main Status Card */}
        <div className="glass col-span-2" style={{ padding: '2rem' }}>
          <div className="card-header">
            <h2 className="card-title">Real-Time Protection Status</h2>
            <div className={`status-badge pulse-ring ${isWorking ? '' : 'neutral'}`}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
              {isWorking ? 'Active' : 'Standby'}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div className="toggle-wrapper">
                <div className="toggle-info">
                  <div style={{ fontWeight: 600 }}>Sync Gig Apps</div>
                  <div className="text-sm">Auto-detect work activity via API</div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={isWorking} onChange={(e) => setIsWorking(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <div>
                <p className="text-sm">Current Active Platform</p>
                <h3 className="card-value" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {platform === 'Ola' ? '🛺' : ''}
                  {platform === 'Zomato' || platform === 'Swiggy' ? '🍲' : ''}
                  {platform === 'UrbanCompany' ? '🛠️' : ''}
                  {platform === 'Freelancer' ? '💻' : ''}
                  {platform === 'Off-Duty' ? '🫖' : ''}
                  {platform}
                </h3>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <p className="text-sm">Dynamic Premium Rate</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className="card-value text-gradient-primary" style={{ fontSize: '2.5rem' }}>
                    ₹{coverageRate.toFixed(2)}
                  </span>
                  <span className="text-sm">/ hr</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--accent)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span> AI optimized for {platform} risk profile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="glass" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="card-title" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>AI Risk Engine</h2>
          <div className="ai-orb"></div>
          <p className="text-sm" style={{ fontStyle: 'italic', fontWeight: '500', minHeight: '40px' }}>{aiInsight}</p>
        </div>

        {/* Income Protection Card */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div className="card-header">
            <h2 className="card-title">Income Smoothing</h2>
            <span className="status-badge">Protected</span>
          </div>
          <p className="text-sm mb-4" style={{ marginBottom: '1rem' }}>30-Day Moving Average</p>
          <div className="card-value">₹{earnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

          <div style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '0.5rem', gap: '4px' }}>
            {/* Mock Chart Bars */}
            {[40, 60, 45, 80, 50, 90, 75, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: h > 70 ? 'var(--primary)' : 'rgba(99,102,241,0.4)', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
            ))}
          </div>
          <p className="text-sm" style={{ marginTop: '1rem' }}>If you are injured today, FlexCover will pay you <strong>₹2,500/day</strong> for up to 30 days based on your recent activity.</p>
        </div>

        {/* Tax & Expenses Assistant (NEW FEATURE) */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div className="card-header">
            <h2 className="card-title">Tax & Expense AI</h2>
            <span className="status-badge" style={{ color: 'var(--accent)', borderColor: 'rgba(20, 184, 166, 0.2)', backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>Tracking</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <p className="text-sm">Est. Write-offs</p>
              <div className="card-value" style={{ fontSize: '1.8rem' }}>₹{taxSavings.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-sm">Tracked Distance</p>
              <div className="card-value" style={{ fontSize: '1.8rem' }}>{distance.toFixed(1)} km</div>
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <p className="text-sm text-gradient-primary" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✨ AI spotted a ₹899 phone bill write-off!
            </p>
          </div>
        </div>

        {/* Instant Micro-Claims (NEW FEATURE) */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div className="card-header">
            <h2 className="card-title">Instant Micro-Claims</h2>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-left">
                <div className="activity-icon text-gradient-primary">📸</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Flat Tire Assistance</div>
                  <div className="text-sm">Approved by AI Vision</div>
                </div>
              </div>
              <div className="card-value" style={{ fontSize: '1.2rem', color: 'var(--success)' }}>+₹1,500</div>
            </div>
            <div className="activity-item">
              <div className="activity-left">
                <div className="activity-icon" style={{ color: 'var(--warning)' }}>🩺</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Urgent Care Visit</div>
                  <div className="text-sm">Processing Note...</div>
                </div>
              </div>
              <div className="card-value" style={{ fontSize: '1.2rem', color: 'var(--warning)' }}>Pend</div>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)' }}>+ File Claim</button>
        </div>


        {/* Active Policies */}
        <div className="glass col-span-3" style={{ padding: '1.5rem' }}>
          <div className="card-header">
            <h2 className="card-title">Smart Policy Matrix</h2>
            <span className="text-sm">Auto-adjusts based on connected platforms</span>
          </div>
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: isActivePolicy(isWorking, platform, 'Auto') ? '1px solid var(--border-glow)' : '1px solid transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600 }}>Commercial Auto Gap</div>
                <div className={`status-badge ${isActivePolicy(isWorking, platform, 'Auto') ? '' : 'neutral'}`}>
                  {isActivePolicy(isWorking, platform, 'Auto') ? 'Active' : 'Paused'}
                </div>
              </div>
              <div className="text-sm border-light">Covers the "Phase 1" insurance gap while waiting for pings across Ola and Zomato.</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: isActivePolicy(isWorking, platform, 'Equipment') ? '1px solid var(--border-glow)' : '1px solid transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600 }}>Equipment & Errors</div>
                <div className={`status-badge ${isActivePolicy(isWorking, platform, 'Equipment') ? '' : 'neutral'}`}>
                  {isActivePolicy(isWorking, platform, 'Equipment') ? 'Active' : 'Paused'}
                </div>
              </div>
              <div className="text-sm">Protects your laptop and generalized liability for remote freelance work like UrbanCompany or Freelancer.</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600 }}>Micro-Health & Injury</div>
                <div className={`status-badge`}>Always On</div>
              </div>
              <div className="text-sm">Coverage for unexpected medical expenses, ER visits, or urgent care regardless of platform.</div>
            </div>
          </div>
        </div>

        {/* Premium Plans (NEW SECTION) */}
        <div className="glass col-span-3" style={{ padding: '2rem', marginTop: '1rem', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(99,102,241,0.05) 100%)' }}>
          <div className="card-header" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
            <h2 className="card-title" style={{ fontSize: '2rem' }}>Choose Your FlexCover <span className="text-gradient-primary">AI</span> Plan</h2>
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

            {/* Starter Plan */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>Starter</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>₹0</span>
                <span className="text-sm">/mo</span>
              </div>
              <p className="text-sm" style={{ marginBottom: '1.5rem', minHeight: '40px' }}>Perfect for part-time gig workers trying out the platform.</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">AI Tax & Expense Tracking</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Basic AI Risk Insights</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--text-muted)' }}>-</span> <span className="text-sm" style={{ color: 'var(--text-muted)' }}>No Income Smoothing</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--text-muted)' }}>-</span> <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Pay-per-gig Micro-Premiums Only</span></li>
              </ul>
              <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)', width: '100%' }}>Get Started</button>
            </div>

            {/* Pro Plan */}
            <div style={{ background: 'rgba(99,102,241,0.1)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-glow)', display: 'flex', flexDirection: 'column', position: 'relative', transform: 'scale(1.05)', zIndex: 1, boxShadow: '0 0 30px rgba(99,102,241,0.2)' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '2rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>MOST POPULAR</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '600' }} className="text-gradient-primary">Pro Flex</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>₹899</span>
                <span className="text-sm">/mo</span>
              </div>
              <p className="text-sm" style={{ marginBottom: '1.5rem', minHeight: '40px' }}>Comprehensive coverage for full-time multi-platform workers.</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Income Smoothing (Up to ₹2,500/day)</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Auto-switching Policy Matrix</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Instant Micro-Claims via AI Vision</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Discounted Hourly Premium Rates</span></li>
              </ul>
              <button className="btn-primary" style={{ width: '100%' }}>Upgrade to Pro</button>
            </div>

            {/* Elite Plan */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '600' }}>Elite</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>₹1,999</span>
                <span className="text-sm">/mo</span>
              </div>
              <p className="text-sm" style={{ marginBottom: '1.5rem', minHeight: '40px' }}>Maximum peace of mind with extensive medical and equipment guarantees.</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Income Smoothing (Up to ₹5,000/day)</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Zero Deductible on Laptop/Vehicle Repair</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Priority Human Support (Under 5 mins)</span></li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}><span style={{ color: 'var(--success)' }}>✓</span> <span className="text-sm">Full Family Health Add-on Access</span></li>
              </ul>
              <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)', width: '100%' }}>Select Elite</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Helper to determine active policy logic
function isActivePolicy(isWorking, platform, type) {
  if (!isWorking) return false;
  if (type === 'Auto' && (platform === 'Ola' || platform === 'Zomato' || platform === 'Swiggy')) return true;
  if (type === 'Equipment' && (platform === 'UrbanCompany' || platform === 'Freelancer')) return true;
  return false;
}

export default App;
