import React, { useState, useEffect } from 'react';
import {
  Activity, Shield, Zap, TrendingUp, Compass, Target, Calendar,
  BarChart2, Lightbulb, Grid, Settings, Bell, RefreshCw, CheckCircle,
  XCircle, ThumbsUp, ThumbsDown, Plus, Search, Radio, Cpu, Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [dailyIdeas, setDailyIdeas] = useState<any[]>([]);
  const [brandOpportunities, setBrandOpportunities] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [myIdeas, setMyIdeas] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [whatWorks, setWhatWorks] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newIdeaInput, setNewIdeaInput] = useState('');
  const [newCompetitor, setNewCompetitor] = useState({ username: '', platform: 'tiktok', displayName: '' });
  const [manualAnalytics, setManualAnalytics] = useState({ platform: 'tiktok', views: '', likes: '', comments: '', shares: '' });

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dashRes, trendsRes, ideasRes, oppRes, compRes, myIdeasRes, catRes, analRes, wwRes, calRes] = await Promise.all([
        fetch('/api/v1/dashboard').then(r => r.json()).catch(() => null),
        fetch('/api/v1/trends').then(r => r.json()).catch(() => []),
        fetch('/api/v1/content/daily').then(r => r.json()).catch(() => []),
        fetch('/api/v1/brand-comment/opportunities').then(r => r.json()).catch(() => []),
        fetch('/api/v1/competitors').then(r => r.json()).catch(() => []),
        fetch('/api/v1/my-ideas').then(r => r.json()).catch(() => []),
        fetch('/api/v1/categories').then(r => r.json()).catch(() => []),
        fetch('/api/v1/analytics').then(r => r.json()).catch(() => []),
        fetch('/api/v1/what-works').then(r => r.json()).catch(() => []),
        fetch('/api/v1/calendar').then(r => r.json()).catch(() => []),
      ]);

      setDashboardData(dashRes);
      setTrends(trendsRes.trends || []);
      setDailyIdeas(ideasRes);
      setBrandOpportunities(oppRes);
      setCompetitors(compRes);
      setMyIdeas(myIdeasRes);
      setCategories(catRes);
      setAnalytics(analRes);
      setWhatWorks(wwRes);
      setCalendar(calRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleIdeaStatus = async (id: string, status: string) => {
    await fetch(`/api/v1/content/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAllData();
  };

  const handleRateComment = async (oppId: string, commentIndex: number, rating: boolean) => {
    await fetch(`/api/v1/brand-comment/${oppId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentIndex, rating })
    });
    fetchAllData();
  };

  const handleAddUserIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaInput.trim()) return;
    await fetch('/api/v1/my-ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalIdea: newIdeaInput })
    });
    setNewIdeaInput('');
    fetchAllData();
  };

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitor.username.trim()) return;
    await fetch('/api/v1/competitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCompetitor)
    });
    setNewCompetitor({ username: '', platform: 'tiktok', displayName: '' });
    fetchAllData();
  };

  const handleAddAnalytics = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/v1/analytics/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manualAnalytics)
    });
    setManualAnalytics({ platform: 'tiktok', views: '', likes: '', comments: '', shares: '' });
    fetchAllData();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-cyan-400 font-mono flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* JARVIS HEADER */}
      <header className="border-b border-cyan-500/30 bg-[#020617]/95 backdrop-blur-xl sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-ping status-pulse"></div>
          <span className="font-bold tracking-widest text-base text-[#00f0ff] glow-cyan">
            JARVIS // TIGER MARKET INTELLIGENCE COMMAND
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff]">
            SYSTEM ONLINE
          </span>
        </div>

        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2 text-cyan-400/90">
            <Radio className="w-4 h-4 text-[#00f0ff] animate-pulse" />
            <span>AI: Z.ai GLM-4.7-Flash</span>
          </div>
          <button
            onClick={fetchAllData}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded btn-hud font-bold text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC DATA</span>
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 border-r border-cyan-500/30 bg-[#020617]/90 p-4 flex flex-col space-y-1.5 overflow-y-auto">
          <div className="text-[10px] text-cyan-600 uppercase tracking-widest px-3 py-1 mb-1">
            Intelligence Modules
          </div>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'daily-ideas', label: 'Daily Ideas', icon: Lightbulb },
            { id: 'trends', label: 'Trends Radar', icon: Compass },
            { id: 'brand-comment', label: 'Brand Comment Radar', icon: Target },
            { id: 'competitors', label: 'Competitors', icon: Shield },
            { id: 'my-ideas', label: 'My Ideas', icon: Cpu },
            { id: 'calendar', label: 'Content Calendar', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: BarChart2 },
            { id: 'what-works', label: 'What Works', icon: Award },
            { id: 'categories', label: 'Categories', icon: Grid },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded text-xs transition text-left font-mono relative overflow-hidden ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-500/60 text-cyan-100 shadow-[0_0_20px_rgba(0,240,255,0.3)] font-bold'
                    : 'text-cyan-500 hover:text-cyan-300 hover:bg-cyan-5/10 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00f0ff]' : 'text-cyan-600'}`} />
                <span className="tracking-wider">{item.label}</span>
                {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]"></div>}
              </button>
            );
          })}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 bg-[#020617] relative tech-grid">
          {/* ==================== DASHBOARD ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 max-w-7xl mx-auto">
              {/* TOP ROW: Left Center Right Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* LEFT: Performance Metrics */}
                <div className="jarvis-panel-left jarvis-hud p-5 rounded-lg space-y-4">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-cyan-500 mb-3 font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Performance Intelligence
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-black/40 rounded border border-cyan-500/20">
                        <div className="text-[10px] text-cyan-600 tracking-wider">TIKTOK FOLLOWERS</div>
                        <div className="text-2xl font-bold text-cyan-200 mt-1">{dashboardData?.stats?.followers?.toLocaleString() || '14,250'}</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded border border-cyan-500/20">
                        <div className="text-[10px] text-cyan-600 tracking-wider">VIEWS (7 DAYS)</div>
                        <div className="text-2xl font-bold text-cyan-200 mt-1">{dashboardData?.stats?.viewsLast7Days?.toLocaleString() || '450,200'}</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded border border-cyan-500/20">
                        <div className="text-[10px] text-cyan-600 tracking-wider">ENGAGEMENT RATE</div>
                        <div className="text-2xl font-bold text-cyan-200 mt-1">{dashboardData?.stats?.engagementRate || '6.8%'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CENTER: JARVIS CORE */}
                <div className="jarvis-core jarvis-hud p-6 rounded-lg flex flex-col items-center justify-center min-h-[320px]">
                  {/* Radar Animation */}
                  <div className="relative w-56 h-56 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 radar-sweep"></div>
                    <div className="absolute inset-4 rounded-full border border-cyan-500/60 hud-pulse"></div>
                    <div className="absolute inset-8 rounded-full bg-[#020617]/95 backdrop-blur-xl border-2 border-cyan-400 flex flex-col items-center justify-center text-center p-4">
                      <Cpu className="w-10 h-10 text-[#00f0ff] mb-2 animate-pulse" />
                      <div className="text-sm font-bold text-white tracking-widest">JARVIS CORE</div>
                      <div className="text-[10px] text-cyan-400 mt-1 font-bold">ONLINE & ACTIVE</div>
                      <div className="mt-3 text-[10px] px-3 py-1 bg-cyan-500/20 border border-cyan-400 rounded text-cyan-100 font-bold">
                        {dashboardData?.todayIdeas?.length || 0} IDEAS READY
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-cyan-500 tracking-widest uppercase font-bold">
                      AI RESEARCH ENGINE ACTIVE
                    </span>
                  </div>
                </div>

                {/* RIGHT: Intelligence Alerts */}
                <div className="jarvis-panel-right jarvis-hud p-5 rounded-lg space-y-4">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-cyan-500 mb-3 font-bold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#00f0ff]" />
                      Current Intelligence
                    </h3>
                    <div className="space-y-3">
                      {dashboardData?.topTrends?.slice(0, 5).map((trend: any) => (
                        <div key={trend.id} className="p-3 bg-black/40 rounded border border-cyan-500/20 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-cyan-200">{trend.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/80 border border-red-500/60 text-red-400 font-bold">
                              {trend.status}
                            </span>
                          </div>
                          <p className="text-cyan-400/80 line-clamp-2">{trend.whyTrending}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM: Top 3 Ideas */}
              <div className="jarvis-panel-bottom jarvis-hud p-6 rounded-lg">
                <h3 className="text-sm uppercase tracking-widest text-cyan-500 mb-4 font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#00f0ff]" />
                  Today's Top 3 Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData?.todayIdeas?.slice(0, 3).map((idea: any, idx: number) => (
                    <div key={idea.id} className="p-4 rounded border border-cyan-500/40 bg-black/70 hover:border-cyan-400 transition group">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-cyan-500 font-bold">#{idx + 1}</span>
                        <span className="text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40 text-[10px]">
                          {idea.advertising}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-2 group-hover:text-cyan-400 transition">
                        {idea.title}
                      </h4>
                      <p className="text-xs text-cyan-400/80 mb-3 line-clamp-3">{idea.descriptionDe}</p>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-cyan-500/20">
                        <span className="text-cyan-600">Score: {idea.trendScore}/100</span>
                        <span className="text-cyan-500">Virality: {idea.virality}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== DAILY IDEAS ==================== */}
          {activeTab === 'daily-ideas' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div>
                <h2 className="text-xl font-bold tracking-widest text-cyan-400 mb-2">DAILY CONTENT IDEAS</h2>
                <p className="text-xs text-cyan-600">Curated by Z.ai GLM-4.7-Flash research engine</p>
              </div>

              <div className="space-y-4">
                {dailyIdeas.map((idea: any, idx: number) => (
                  <div key={idea.id} className="jarvis-hud jarvis-panel-left p-6 rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 text-xs text-cyan-500 mb-2">
                          <span>IDEA #{idx + 1}</span>
                          <span>•</span>
                          <span>Type: {idea.contentType}</span>
                          <span>•</span>
                          <span>Advertising: {idea.advertising}</span>
                        </div>
                        <h3 className="font-bold text-cyan-200">{idea.title}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleIdeaStatus(idea.id, 'APPROVED')}
                          className="px-3 py-1.5 rounded border border-cyan-500 text-xs text-cyan-300 hover:bg-cyan-500/20"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleIdeaStatus(idea.id, 'REJECTED')}
                          className="px-3 py-1.5 rounded border border-red-500 text-xs text-red-400 hover:bg-red-500/20"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-cyan-600 uppercase block mb-1">Beschreibung</span>
                        <p className="text-cyan-300">{idea.descriptionDe}</p>
                      </div>
                      <div>
                        <span className="text-cyan-600 uppercase block mb-1">Warum jetzt</span>
                        <p className="text-cyan-300">{idea.whyNowDe}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-cyan-600 uppercase block mb-1">Anleitung</span>
                        <p className="text-cyan-300">{idea.howToMakeDe}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TRENDS RADAR ==================== */}
          {activeTab === 'trends' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold tracking-widest text-cyan-400 mb-2">TRENDS RADAR</h2>
                <p className="text-xs text-cyan-600">Real-time intelligence across 8 platforms</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trends.map((trend: any) => (
                  <div key={trend.id} className="jarvis-hud p-5 rounded-lg space-y-3">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-cyan-600 uppercase">{trend.platform} // {trend.type}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 border border-cyan-500 text-cyan-400 font-bold">
                        {trend.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-cyan-200 text-sm">{trend.name}</h3>
                    <p className="text-xs text-cyan-400/80">{trend.whyTrending}</p>
                    <div className="flex justify-between text-xs pt-3 border-t border-cyan-500/20 space-x-4">
                      <div>
                        <span className="text-cyan-600">Virality</span>
                        <span className="text-cyan-300 font-bold ml-1">{trend.viralityScore}/100</span>
                      </div>
                      <div>
                        <span className="text-cyan-600">Relevance</span>
                        <span className="text-cyan-300 font-bold ml-1">{trend.tigerRelevance}/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== BRAND COMMENT RADAR ==================== */}
          {activeTab === 'brand-comment' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div>
                <h2 className="text-xl font-bold tracking-widest text-cyan-400 mb-2">BRAND COMMENT RADAR</h2>
                <p className="text-xs text-cyan-600">Visual radar detecting viral video opportunities</p>
              </div>

              {/* Radar Visualization */}
              <div className="jarvis-core jarvis-hud p-8 rounded-lg flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-full border border-cyan-500/30"></div>
                  <div className="absolute inset-12 rounded-full border border-cyan-500/40"></div>
                  <div className="absolute inset-24 rounded-full border border-cyan-500/50"></div>
                  <div className="absolute inset-0 w-full h-[1px] bg-cyan-500/20"></div>
                  <div className="absolute inset-0 h-full w-[1px] bg-cyan-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400 radar-sweep"></div>

                  {brandOpportunities.slice(0, 5).map((opp, idx) => (
                    <div
                      key={opp.id}
                      className="absolute w-3 h-3 bg-red-400 rounded-full animate-ping"
                      style={{
                        top: `${20 + idx * 15}%`,
                        left: `${30 + idx * 10}%`,
                        animationDelay: `${idx * 0.5}s`
                      }}
                    />
                  ))}
                </div>

                <div className="text-center mt-4 space-y-1">
                  <Target className="w-8 h-8 text-[#00f0ff] mx-auto animate-pulse" />
                  <div className="text-sm font-bold text-cyan-200">ACTIVE RADAR SWEEP</div>
                  <div className="text-xs text-cyan-600">{brandOpportunities.length} opportunities detected</div>
                </div>
              </div>

              {/* Opportunities List */}
              <div className="space-y-4">
                {brandOpportunities.map((opp: any) => (
                  <div key={opp.id} className="jarvis-hud jarvis-panel-right p-6 rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-cyan-500 mb-1">
                          {opp.platform.toUpperCase()} // VIRAL OPPORTUNITY
                        </div>
                        <h3 className="font-bold text-cyan-200 text-lg">{opp.title}</h3>
                        <p className="text-xs text-cyan-400/80 mt-1">{opp.description}</p>
                      </div>
                      <a
                        href={opp.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded btn-hud text-xs font-bold"
                      >
                        Open Video
                      </a>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>Views: <span className="text-cyan-300 font-bold">{opp.viewCount?.toLocaleString()}</span></div>
                      <div>Likes: <span className="text-cyan-300 font-bold">{opp.likeCount?.toLocaleString()}</span></div>
                      <div>Comments: <span className="text-cyan-300 font-bold">{opp.commentCount?.toLocaleString()}</span></div>
                      <div>Shares: <span className="text-cyan-300 font-bold">{opp.shareCount?.toLocaleString()}</span></div>
                    </div>

                    {/* Suggested Comments */}
                    <div className="space-y-2 pt-3 border-t border-cyan-500/20">
                      <span className="text-xs text-cyan-500 font-bold">Suggested Tiger Comments:</span>
                      <div className="space-y-2">
                        {opp.suggestedComments.map((sug: any, sIdx: number) => (
                          <div key={sIdx} className="flex items-center justify-between p-3 bg-black/60 rounded border border-cyan-500/30 text-xs">
                            <span className="text-cyan-200">"{sug.text}"</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleRateComment(opp.id, sIdx, true)}
                                className="p-1 rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRateComment(opp.id, sIdx, false)}
                                className="p-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/20"
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs would follow same pattern... */}
          {activeTab === 'competitors' && (
            <div className="max-w-5xl mx-auto">
              <div className="jarvis-hud p-6 rounded-lg mb-6">
                <form onSubmit={handleAddCompetitor} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-cyan-600 block mb-1">Username</label>
                    <input
                      type="text"
                      value={newCompetitor.username}
                      onChange={e => setNewCompetitor({ ...newCompetitor, username: e.target.value })}
                      className="w-full bg-black border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-300 focus:border-cyan-400"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-cyan-600 block mb-1">Platform</label>
                    <select
                      value={newCompetitor.platform}
                      onChange={e => setNewCompetitor({ ...newCompetitor, platform: e.target.value })}
                      className="w-full bg-black border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-300"
                    >
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="x">X/Twitter</option>
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2 rounded btn-hud text-xs font-bold">
                    + Add
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitors.map((comp: any) => (
                  <div key={comp.id} className="jarvis-hud p-5 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-200">@{comp.username}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        comp.isApproved
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                          : 'bg-yellow-950 text-yellow-300 border-yellow-500'
                      }`}>
                        {comp.isApproved ? 'MONITORED' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs... */}
          {activeTab !== 'dashboard' && activeTab !== 'daily-ideas' && activeTab !== 'trends' &&
           activeTab !== 'brand-comment' && activeTab !== 'competitors' && (
            <div className="max-w-5xl mx-auto">
              <div className="jarvis-hud p-8 rounded-lg text-center text-cyan-500">
                <h2 className="text-xl font-bold mb-4">{activeTab.replace('-', ' ').toUpperCase()}</h2>
                <p className="text-xs">This module is under development...</p>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <div className="jarvis-hud p-6 rounded-lg space-y-4">
                <h2 className="text-xl font-bold tracking-widest text-cyan-400 mb-4">SYSTEM SETTINGS</h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-cyan-500 uppercase block mb-1">AI Provider</label>
                    <input
                      type="text"
                      value="Z.ai GLM-4.7-Flash"
                      disabled
                      className="w-full bg-black border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-cyan-500 uppercase block mb-1">Database</label>
                    <input
                      type="text"
                      value="PostgreSQL"
                      disabled
                      className="w-full bg-black border border-cyan-500/30 rounded px-3 py-2 text-xs text-cyan-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-cyan-500 uppercase block mb-1">Buffer API</label>
                    <div className="flex items-center justify-between p-3 bg-black/40 rounded border border-cyan-500/30">
                      <span className="text-cyan-300 text-xs">Connected (Manual Fallback Active)</span>
                      <button className="px-3 py-1 rounded btn-hud text-xs">Configure</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
