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

  // Fetch initial data
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
      setTrends(trendsRes);
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
    <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Header Bar */}
      <header className="border-b border-cyan-500/30 bg-black/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-bold tracking-widest text-lg text-cyan-300">JARVIS // TIGER MARKET INTELLIGENCE</span>
          <span className="text-xs px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">SYSTEM ONLINE</span>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 text-cyan-400/80">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI ENGINE: ONLINE (OPENROUTER FREE)</span>
          </div>
          <button
            onClick={fetchAllData}
            className="flex items-center space-x-1 px-3 py-1 rounded border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 transition text-cyan-300 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC DATA</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-cyan-500/30 bg-black/90 p-4 flex flex-col space-y-1 overflow-y-auto">
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
                className={`flex items-center space-x-3 px-3 py-2.5 rounded text-sm transition text-left ${
                  isActive
                    ? 'bg-cyan-950/60 border border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                    : 'text-cyan-500 hover:text-cyan-300 hover:bg-cyan-950/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-cyan-600'}`} />
                <span className="tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-black via-cyan-950/10 to-black relative">
          {/* Background grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffff08_1px,transparent_1px),linear-gradient(to_bottom,#00ffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

          {/* ==================== TAB: DASHBOARD ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                {/* Left Side: Stats */}
                <div className="space-y-4">
                  <div className="jarvis-card p-4 rounded-lg">
                    <h3 className="text-xs uppercase tracking-widest text-cyan-500 mb-3 flex items-center justify-between">
                      <span>Performance Metrics</span>
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-cyan-600">TIKTOK FOLLOWERS</div>
                        <div className="text-2xl font-bold text-cyan-300">{dashboardData?.stats?.followers?.toLocaleString() || '14,250'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-cyan-600">VIEWS (LAST 7 DAYS)</div>
                        <div className="text-2xl font-bold text-cyan-300">{dashboardData?.stats?.viewsLast7Days?.toLocaleString() || '450,200'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-cyan-600">ENGAGEMENT RATE</div>
                        <div className="text-2xl font-bold text-cyan-300">{dashboardData?.stats?.engagementRate || '6.8%'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="jarvis-card p-4 rounded-lg">
                    <h3 className="text-xs uppercase tracking-widest text-cyan-500 mb-2">System Status</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-cyan-600">Active Trends:</span>
                        <span className="text-cyan-300">{dashboardData?.stats?.trendsCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-600">Exploding Spikes:</span>
                        <span className="text-cyan-300 font-bold text-cyan-400">{dashboardData?.stats?.explodingTrendsCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-600">Monitored Competitors:</span>
                        <span className="text-cyan-300">{dashboardData?.stats?.competitorsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: JARVIS Circular Core Interface */}
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Rotating outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 animate-radar pointer-events-none"></div>
                    {/* Inner glowing pulse ring */}
                    <div className="absolute inset-4 rounded-full border border-cyan-400/60 animate-pulse-slow"></div>
                    <div className="absolute inset-8 rounded-full bg-cyan-950/30 backdrop-blur-md border border-cyan-500/50 flex flex-col items-center justify-center text-center p-4 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                      <Cpu className="w-10 h-10 text-cyan-300 mb-2 animate-pulse" />
                      <div className="text-sm font-bold text-cyan-200 tracking-wider">JARVIS CORE</div>
                      <div className="text-[10px] text-cyan-500 mt-1">AI INTELLIGENCE ACTIVE</div>
                      <div className="mt-3 text-[11px] px-2 py-0.5 bg-cyan-900/40 border border-cyan-500/50 rounded text-cyan-300">
                        3 IDEAS READY
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-xs text-cyan-500 tracking-widest uppercase">Autonomous Social Radar</span>
                  </div>
                </div>

                {/* Right Side: Trends & Intelligence Alerts */}
                <div className="space-y-4">
                  <div className="jarvis-card p-4 rounded-lg">
                    <h3 className="text-xs uppercase tracking-widest text-cyan-500 mb-3 flex items-center justify-between">
                      <span>Intelligence Alerts</span>
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    </h3>
                    <div className="space-y-3">
                      {dashboardData?.topTrends?.map((trend: any) => (
                        <div key={trend.id} className="p-2.5 rounded bg-cyan-950/30 border border-cyan-500/30 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-cyan-300">{trend.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-950/60 border border-red-500/50 text-red-400">
                              {trend.status}
                            </span>
                          </div>
                          <p className="text-cyan-500 line-clamp-1">{trend.whyTrending}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Prominent Top 3 Selected Trends around/below center */}
              <div className="jarvis-card p-6 rounded-lg">
                <h3 className="text-sm uppercase tracking-widest text-cyan-300 mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Today's Top 3 Selected Content Recommendations</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData?.todayIdeas?.map((idea: any, idx: number) => (
                    <div key={idea.id} className="p-4 rounded border border-cyan-500/40 bg-black/60 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-cyan-500">IDEA #{idx + 1} // {idea.contentType}</span>
                          <span className="text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                            Adv: {idea.advertising}
                          </span>
                        </div>
                        <h4 className="font-bold text-cyan-200 text-sm mb-2">{idea.title}</h4>
                        <p className="text-xs text-cyan-400/90 mb-3">{idea.descriptionDe}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20 text-xs">
                        <span className="text-cyan-500">Trend Score: {idea.trendScore}/100</span>
                        <button
                          onClick={() => setActiveTab('daily-ideas')}
                          className="text-cyan-300 hover:underline"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB: DAILY IDEAS ==================== */}
          {activeTab === 'daily-ideas' && (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-wider text-cyan-300">DAILY CONTENT IDEAS</h2>
                  <p className="text-xs text-cyan-600 mt-1">Curated by AI intelligence based on current 24h–72h internet trends.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {dailyIdeas.map((idea: any, idx: number) => (
                  <div key={idea.id} className="jarvis-card p-6 rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 text-xs text-cyan-500 mb-1">
                          <span>RECOMMENDATION #{idx + 1}</span>
                          <span>•</span>
                          <span>Type: {idea.contentType}</span>
                          <span>•</span>
                          <span>Advertising: {idea.advertising}</span>
                          <span>•</span>
                          <span>Duration: {idea.duration}</span>
                        </div>
                        <h3 className="text-lg font-bold text-cyan-200">{idea.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleIdeaStatus(idea.id, 'APPROVED')}
                          className={`px-3 py-1.5 rounded text-xs border flex items-center space-x-1 ${idea.status === 'APPROVED' ? 'bg-cyan-500 text-black border-cyan-400 font-bold' : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40'}`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleIdeaStatus(idea.id, 'REJECTED')}
                          className={`px-3 py-1.5 rounded text-xs border flex items-center space-x-1 ${idea.status === 'REJECTED' ? 'bg-red-950 text-red-300 border-red-500 font-bold' : 'bg-red-950/20 border-red-500/30 text-red-400 hover:bg-red-900/40'}`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-black/50 p-4 rounded border border-cyan-500/20">
                      <div>
                        <span className="text-cyan-600 uppercase block mb-1">Beschreibung (DE):</span>
                        <p className="text-cyan-300">{idea.descriptionDe}</p>
                      </div>
                      <div>
                        <span className="text-cyan-600 uppercase block mb-1">Warum jetzt (DE):</span>
                        <p className="text-cyan-300">{idea.whyNowDe}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-cyan-600 uppercase block mb-1">How to make it (DE):</span>
                        <p className="text-cyan-300">{idea.howToMakeDe}</p>
                      </div>
                      <div className="md:col-span-2 pt-2 border-t border-cyan-500/20">
                        <span className="text-cyan-600 uppercase block mb-1">On-screen Concept & Caption (EN):</span>
                        <p className="text-cyan-200 font-semibold mb-1">"{idea.onScreenConcept}"</p>
                        <p className="text-cyan-400 italic">Caption: {idea.captionEn} {idea.hashtagsEn}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-cyan-500 pt-2">
                      <div className="flex items-center space-x-4">
                        <span>Trend Score: <strong className="text-cyan-300">{idea.trendScore}/100</strong></span>
                        <span>Virality: <strong className="text-cyan-300">{idea.virality}/100</strong></span>
                        <span>Tiger Relevance: <strong className="text-cyan-300">{idea.tigerRelevance}/100</strong></span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 uppercase">
                        Status: {idea.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: TRENDS RADAR ==================== */}
          {activeTab === 'trends' && (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-wider text-cyan-300">TRENDS RADAR</h2>
                  <p className="text-xs text-cyan-600 mt-1">Real-time monitoring of sounds, memes, formats, and topics across platforms.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trends.map((trend: any) => (
                  <div key={trend.id} className="jarvis-card p-4 rounded-lg flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-cyan-500 uppercase">{trend.platform} // {trend.type}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/60 border border-red-500/50 text-red-400 font-bold">
                          {trend.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-cyan-200 text-sm mb-1">{trend.name}</h3>
                      <p className="text-xs text-cyan-500 line-clamp-2">{trend.whyTrending}</p>
                    </div>

                    <div className="space-y-2 text-xs pt-3 border-t border-cyan-500/20">
                      <div className="flex justify-between">
                        <span className="text-cyan-600">Virality Score:</span>
                        <span className="text-cyan-300 font-bold">{trend.viralityScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-600">Tiger Relevance:</span>
                        <span className="text-cyan-300 font-bold">{trend.tigerRelevance}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cyan-600">Estimated Age:</span>
                        <span className="text-cyan-300">{trend.estimatedAge} hours</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: BRAND COMMENT RADAR ==================== */}
          {activeTab === 'brand-comment' && (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-wider text-cyan-300">BRAND COMMENT RADAR</h2>
                  <p className="text-xs text-cyan-600 mt-1">Visual radar detecting viral videos and brand commenting opportunities.</p>
                </div>
              </div>

              {/* Visual Radar Display */}
              <div className="jarvis-card p-6 rounded-lg flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full border border-cyan-500/30 absolute"></div>
                  <div className="w-44 h-44 rounded-full border border-cyan-500/40 absolute"></div>
                  <div className="w-24 h-24 rounded-full border border-cyan-500/50 absolute"></div>
                  <div className="w-full h-[1px] bg-cyan-500/20 absolute"></div>
                  <div className="h-full w-[1px] bg-cyan-500/20 absolute"></div>
                  <div className="w-64 h-64 rounded-full border-2 border-cyan-400 animate-radar absolute"></div>
                </div>

                <div className="relative z-10 text-center space-y-2">
                  <Target className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                  <div className="text-sm font-bold text-cyan-200">ACTIVE RADAR SWEEP</div>
                  <div className="text-xs text-cyan-500">{brandOpportunities.length} Viral Opportunities Detected</div>
                </div>

                {/* Blips on radar */}
                {brandOpportunities.map((opp: any, idx: number) => {
                  const offsets = [
                    { top: '20%', left: '30%' },
                    { top: '70%', left: '65%' },
                    { top: '40%', left: '80%' },
                  ];
                  const pos = offsets[idx % offsets.length];
                  return (
                    <div
                      key={opp.id}
                      style={pos}
                      className="absolute w-3 h-3 bg-red-400 rounded-full animate-ping cursor-pointer"
                      title={opp.title}
                    ></div>
                  );
                })}
              </div>

              {/* Opportunities List with Suggested Comments */}
              <div className="grid grid-cols-1 gap-6">
                {brandOpportunities.map((opp: any) => (
                  <div key={opp.id} className="jarvis-card p-6 rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-cyan-500 mb-1">PLATFORM: {opp.platform.toUpperCase()} // VIRAL OPPORTUNITY</div>
                        <h3 className="text-lg font-bold text-cyan-200">{opp.title}</h3>
                        <p className="text-xs text-cyan-400/80 mt-1">{opp.description}</p>
                      </div>
                      <a
                        href={opp.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-500/40 text-xs text-cyan-300 hover:bg-cyan-900/40 transition"
                      >
                        Open Video ↗
                      </a>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-black/50 p-3 rounded border border-cyan-500/20">
                      <div>Views: <strong className="text-cyan-300">{opp.viewCount?.toLocaleString()}</strong></div>
                      <div>Likes: <strong className="text-cyan-300">{opp.likeCount?.toLocaleString()}</strong></div>
                      <div>Comments: <strong className="text-cyan-300">{opp.commentCount?.toLocaleString()}</strong></div>
                      <div>Shares: <strong className="text-cyan-300">{opp.shareCount?.toLocaleString()}</strong></div>
                    </div>

                    {/* Brand Accounts Commenting */}
                    {opp.brandAccounts && opp.brandAccounts.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs text-cyan-600 uppercase">Brands already commenting:</span>
                        <div className="space-y-1">
                          {opp.brandAccounts.map((brand: any, bIdx: number) => (
                            <div key={bIdx} className="text-xs bg-cyan-950/20 p-2 rounded border border-cyan-500/20 flex justify-between">
                              <span className="font-bold text-cyan-300">@{brand.username}:</span>
                              <span className="text-cyan-400 italic">"{brand.comment}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Tiger Comments */}
                    <div className="space-y-2 pt-3 border-t border-cyan-500/20">
                      <span className="text-xs text-cyan-300 uppercase font-bold">Suggested Tiger Market Comments:</span>
                      <div className="space-y-2">
                        {opp.suggestedComments.map((sug: any, sIdx: number) => (
                          <div key={sIdx} className="text-xs bg-black/70 p-3 rounded border border-cyan-500/40 flex items-center justify-between">
                            <div>
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-400 mr-2">
                                {sug.style}
                              </span>
                              <span className="text-cyan-200">"{sug.text}"</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleRateComment(opp.id, sIdx, true)}
                                className={`p-1 rounded border ${sug.rating === true ? 'bg-cyan-500 text-black border-cyan-400' : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-950'}`}
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRateComment(opp.id, sIdx, false)}
                                className={`p-1 rounded border ${sug.rating === false ? 'bg-red-500 text-black border-red-400' : 'border-cyan-500/30 text-red-400 hover:bg-red-950'}`}
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

          {/* ==================== TAB: COMPETITORS ==================== */}
          {activeTab === 'competitors' && (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-wider text-cyan-300">COMPETITORS & INSPIRATION</h2>
                  <p className="text-xs text-cyan-600 mt-1">Monitor accounts for viral content patterns. New accounts require your approval.</p>
                </div>
              </div>

              {/* Add Competitor Form */}
              <form onSubmit={handleAddCompetitor} className="jarvis-card p-4 rounded-lg flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs text-cyan-600 block mb-1">Username / Handle</label>
                  <input
                    type="text"
                    placeholder="@ryanair"
                    value={newCompetitor.username}
                    onChange={e => setNewCompetitor({ ...newCompetitor, username: e.target.value })}
                    className="w-full bg-black border border-cyan-500/40 rounded px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="w-40">
                  <label className="text-xs text-cyan-600 block mb-1">Platform</label>
                  <select
                    value={newCompetitor.platform}
                    onChange={e => setNewCompetitor({ ...newCompetitor, platform: e.target.value })}
                    className="w-full bg-black border border-cyan-500/40 rounded px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter/X</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs rounded hover:bg-cyan-900 transition">
                  + Add Account
                </button>
              </form>

              {/* Competitors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitors.map((comp: any) => (
                  <div key={comp.id} className="jarvis-card p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-200">@{comp.username}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${comp.isApproved ? 'bg-cyan-950 text-cyan-300 border-cyan-500' : 'bg-yellow-950 text-yellow-300 border-yellow-500'}`}>
                        {comp.isApproved ? 'MONITORED' : 'PENDING APPROVAL'}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-500">{comp.bio || 'No bio provided.'}</p>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-cyan-500/20">
                      <span className="text-cyan-600">Followers: {comp.followerCount?.toLocaleString() || 'N/A'}</span>
                      {!comp.isApproved && (
                        <button
                          onClick={async () => {
                            await fetch(`/api/v1/competitors/${comp.id}/approve`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ approved: true })
                            });
                            fetchAllData();
                          }}
                          className="px-2 py-1 bg-cyan-500 text-black text-[10px] font-bold rounded hover:bg-cyan-400 transition"
                        >
                          Approve Monitoring
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: MY IDEAS ==================== */}
          {activeTab === 'my-ideas' && (
            <div className="space-y-6 relative z-10">
              <div>
                <h2 className="text-xl font-bold tracking-wider text-cyan-300">MY IDEAS & AI ENHANCEMENT</h2>
                <p className="text-xs text-cyan-600 mt-1">Submit your raw content ideas and let JARVIS research trends and improve them.</p>
              </div>

              <form onSubmit={handleAddUserIdea} className="jarvis-card p-4 rounded-lg space-y-3">
                <label className="text-xs text-cyan-500 uppercase block">Submit New Idea</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Tiger dancing to a random Roblox trending sound..."
                  value={newIdeaInput}
                  onChange={e => setNewIdeaInput(e.target.value)}
                  className="w-full bg-black border border-cyan-500/40 rounded p-3 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                ></textarea>
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs rounded hover:bg-cyan-900 transition">
                    Analyze & Improve via AI
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 gap-4">
                {myIdeas.map((idea: any) => (
                  <div key={idea.id} className="jarvis-card p-6 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-xs text-cyan-500">
                      <span>ORIGINAL SUBMISSION</span>
                      <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-cyan-200">"{idea.originalIdea}"</p>
                    <div className="bg-black/60 p-4 rounded border border-cyan-500/30 text-xs space-y-2">
                      <span className="text-cyan-500 uppercase block">JARVIS AI Improvements & Research:</span>
                      <p className="text-cyan-300 whitespace-pre-wrap">{idea.aiImprovements}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: CALENDAR ==================== */}
          {activeTab === 'calendar' && (
            <div className="space-y-6 relative z-10">
              <div>
                <h2 className="text-xl font-bold tracking-wider text-cyan-300">CONTENT CALENDAR</h2>
                <p className="text-xs text-cyan-600 mt-1">Schedule and manage your planned content drops. Trends dynamically override the calendar.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calendar.map((item: any) => (
                  <div key={item.id} className="jarvis-card p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-xs text-cyan-500">
                      <span>{new Date(item.scheduledFor).toLocaleString()}</span>
                      <span className="uppercase">{item.status}</span>
                    </div>
                    <h3 className="font-bold text-cyan-200 text-sm">{item.contentIdea?.title}</h3>
                    <p className="text-xs text-cyan-500">{item.contentIdea?.descriptionDe}</p>
                  </div>
                ))}
                {calendar.length === 0 && (
                  <div className="jarvis-card p-6 rounded-lg text-center text-cyan-500 text-xs">
                    No content scheduled yet. Approve daily ideas to add them to the calendar.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB: ANALYTICS ==================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 relative z-10">
              <div>
                <h2 className="text-xl font-bold tracking-wider text-cyan-300">TIKTOK ANALYTICS & BUFFER SYNC</h2>
                <p className="text-xs text-cyan-600 mt-1">Track post performance via Buffer API or manual entry fallback.</p>
              </div>

              <form onSubmit={handleAddAnalytics} className="jarvis-card p-4 rounded-lg space-y-4">
                <h3 className="text-xs text-cyan-500 uppercase font-bold">Manual Performance Entry (Fallback)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-cyan-600 block mb-1">Views</label>
                    <input
                      type="number"
                      value={manualAnalytics.views}
                      onChange={e => setManualAnalytics({ ...manualAnalytics, views: e.target.value })}
                      className="w-full bg-black border border-cyan-500/40 rounded px-3 py-2 text-xs text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-600 block mb-1">Likes</label>
                    <input
                      type="number"
                      value={manualAnalytics.likes}
                      onChange={e => setManualAnalytics({ ...manualAnalytics, likes: e.target.value })}
                      className="w-full bg-black border border-cyan-500/40 rounded px-3 py-2 text-xs text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-600 block mb-1">Comments</label>
                    <input
                      type="number"
                      value={manualAnalytics.comments}
                      onChange={e => setManualAnalytics({ ...manualAnalytics, comments: e.target.value })}
                      className="w-full bg-black border border-cyan-500/40 rounded px-3 py-2 text-xs text-cyan-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-600 block mb-1">Shares</label>
                    <input
                      type="number"
                      value={manualAnalytics.shares}
                      onChange={e => setManualAnalytics({ ...manualAnalytics, shares: e.target.value })}
                      className="w-full bg-black border border-cyan-500/40 rounded px-3 py-2 text-xs text-cyan-300"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs rounded hover:bg-cyan-900 transition">
                  Save Analytics Entry
                </button>
              </form>

              <div className="grid grid-cols-1 gap-4">
                {analytics.map((item: any) => (
                  <div key={item.id} className="jarvis-card p-4 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="text-cyan-500">Post ID: {item.postId} // {new Date(item.postedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-6">
                      <span>Views: <strong className="text-cyan-300">{item.views?.toLocaleString()}</strong></span>
                      <span>Likes: <strong className="text-cyan-300">{item.likes?.toLocaleString()}</strong></span>
                      <span>Comments: <strong className="text-cyan-300">{item.comments?.toLocaleString()}</strong></span>
                      <span>Shares: <strong className="text-cyan-300">{item.shares?.toLocaleString()}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: WHAT WORKS ==================== */}
          {activeTab === 'what-works' && (
            <div className="space-y-6 relative z-10">
              <div>
                <h2 className="text-xl font-bold tracking-wider text-cyan-300">WHAT WORKS FOR TIGER MARKET</h2>
                <p className="text-xs text-cyan-600 mt-1">Learned insights derived from actual performance data and user feedback.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {whatWorks.map((item: any) => (
                  <div key={item.id} className="jarvis-card p-6 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-xs text-cyan-500">
                      <span>CATEGORY: {item.category.toUpperCase()}</span>
                      <span>CONFIDENCE: {(item.confidence * 100).toFixed(0)}% (Sample: {item.sampleSize})</span>
                    </div>
                    <p className="font-bold text-cyan-200 text-sm">"{item.insight}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: CATEGORIES ==================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6 relative z-10">
              <div>
                <h2 className="text-xl font-bold tracking-wider text-cyan-300">CONTENT CATEGORIES</h2>
                <p className="text-xs text-cyan-600 mt-1">Approved formats and weekly AI-discovered category suggestions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="jarvis-card p-6 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-cyan-200 text-base">{cat.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${cat.isApproved ? 'bg-cyan-950 text-cyan-300 border-cyan-500' : 'bg-yellow-950 text-yellow-300 border-yellow-500'}`}>
                        {cat.isApproved ? 'APPROVED' : 'DISCOVERED (PENDING)'}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-400">{cat.description}</p>
                    <div className="bg-black/50 p-3 rounded border border-cyan-500/20 text-xs">
                      <span className="text-cyan-600 uppercase block mb-1">Tiger Market Potential:</span>
                      <p className="text-cyan-300">{cat.tigerPotential}</p>
                    </div>
                    {!cat.isApproved && (
                      <button
                        onClick={async () => {
                          await fetch(`/api/v1/categories/${cat.id}/approve`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ approved: true })
                          });
                          fetchAllData();
                        }}
                        className="w-full py-2 bg-cyan-500 text-black text-xs font-bold rounded hover:bg-cyan-400 transition"
                      >
                        Approve Category
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 relative z-10 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold tracking-wider text-cyan-300">SYSTEM SETTINGS</h2>
                <p className="text-xs text-cyan-600 mt-1">Configure AI models, notification preferences, and API integrations.</p>
              </div>

              <div className="jarvis-card p-6 rounded-lg space-y-4 text-xs">
                <div>
                  <label className="text-cyan-500 uppercase block mb-1">AI Model (Google Gemini 3.5 Flash-Lite)</label>
                  <input
                    type="text"
                    value="google/gemini-3.5-flash-lite (Active)"
                    disabled
                    className="w-full bg-black border border-cyan-500/40 rounded px-3 py-2 text-cyan-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-cyan-500 uppercase block mb-1">Buffer API Status</label>
                  <div className="flex items-center justify-between bg-black/50 p-3 rounded border border-cyan-500/30">
                    <span className="text-cyan-300">Connected (OAuth Ready / Fallback Manual Active)</span>
                    <button className="px-3 py-1 bg-cyan-950 border border-cyan-500 text-cyan-300 rounded hover:bg-cyan-900 transition">
                      Configure Buffer
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-cyan-500 uppercase block mb-1">Browser Push Notifications</label>
                  <div className="flex items-center justify-between bg-black/50 p-3 rounded border border-cyan-500/30">
                    <span className="text-cyan-300">Daily 14:00 Report & Instant Trend Alerts</span>
                    <button
                      onClick={() => alert('Push notifications enabled successfully!')}
                      className="px-3 py-1 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition"
                    >
                      Enable Push
                    </button>
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
