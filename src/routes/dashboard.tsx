import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchRegisteredUsers, getCurrentUser, getRegisteredUsers, type AuthUser } from "@/lib/auth";
import { fetchPostedJobs, fetchSavedBids, getAllBids, getAllJobs, getPostedJobs, getSavedBids } from "@/lib/local-data";
import { mockBids, mockJobs, type Bid, type Job } from "@/lib/mock-data";
import { formatUsdAsInr, usdToInr } from "@/lib/currency";
import {
  Briefcase,
  FileText,
  CheckCircle,
  Clock,
  
  TrendingUp,
  Users,
  ArrowUpRight,
  Activity,
  Target,
  Search,
  Bell,
  SlidersHorizontal,
  Send,
} from "lucide-react";
import { generateSmartReply } from "@/lib/reply";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ERUKA" },
      { name: "description", content: "Manage your jobs, bids, and freelance career on ERUKA." },
    ],
  }),
  component: DashboardPage,
});

const statusStyles: Record<string, string> = {
  open: "bg-success/15 text-success border-success/30",
  "in-progress": "bg-warning/15 text-warning border-warning/30",
  completed: "bg-muted text-muted-foreground border-border",
  pending: "bg-warning/15 text-warning border-warning/30",
  accepted: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

function DashboardPage() {
  const [role, setRole] = useState<"freelancer" | "recruiter">("freelancer");
  const [selectedChatId, setSelectedChatId] = useState("c1");
  const [chatInput, setChatInput] = useState("");
  const currentUser = getCurrentUser();
  const [currentUserState, setCurrentUserState] = useState<AuthUser | null>(currentUser);
  const displayName = currentUserState?.name || "Archan Patel";
  const [avatarData, setAvatarData] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("eruka_avatar");
  });
  // keep avatar and current user in sync when auth/profile updates elsewhere
  useEffect(() => {
    function onAuthChanged(e: any) {
      try {
        const next = getCurrentUser();
        setCurrentUserState(next);
        if (typeof window !== 'undefined') {
          setAvatarData(window.localStorage.getItem('eruka_avatar'));
        }
      } catch (err) {
        // ignore
      }
    }
    window.addEventListener('eruka:auth-changed', onAuthChanged);
    return () => window.removeEventListener('eruka:auth-changed', onAuthChanged);
  }, []);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const profileAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>(getAllJobs());
  const [allBids, setAllBids] = useState<Bid[]>(getAllBids());
  const [postedJobRecords, setPostedJobRecords] = useState<Job[]>(getPostedJobs());
  const [bidRecords, setBidRecords] = useState<Bid[]>(getSavedBids());
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(getRegisteredUsers());
  const userKey = currentUser?.id || currentUser?.email || "u1";

  useEffect(() => {
    void fetchRegisteredUsers().then(setRegisteredUsers);

    void fetchPostedJobs().then((postedJobs) => {
      const postedIds = new Set(postedJobs.map((job) => job.id));
      setPostedJobRecords(postedJobs);
      setAllJobs([...postedJobs, ...mockJobs.filter((job) => !postedIds.has(job.id))]);
    });

    void fetchSavedBids().then((savedBids) => {
      const savedIds = new Set(savedBids.map((bid) => bid.id));
      setBidRecords(savedBids);
      setAllBids([...savedBids, ...mockBids.filter((bid) => !savedIds.has(bid.id))]);
    });
  }, []);

  const myBids = allBids.filter((b) => b.freelancerId === userKey || (!currentUser && b.freelancerId === "u1"));
  const postedJobs = allJobs;
  const activeJobs = allJobs.filter((j) => j.status === "in-progress" && j.assignedFreelancerId === userKey);
  const completedJobs = allJobs.filter((j) => j.status === "completed");
  const bidsInReview = myBids.filter((bid) => bid.status === "pending").length;
  const totalBidValue = myBids.reduce((total, bid) => total + usdToInr(bid.amount), 0);
  const recruiterSpend = postedJobs.reduce((total, job) => total + usdToInr(job.budgetMax), 0);
  const inboxChats = [
    { id: "c1", name: "Aastha", username: "@aastha", message: "Hi Archan! I reviewed your proposal.", time: "2m", unread: 2 },
    { id: "c2", name: "Archan Patel", username: "@archanpatel", message: "Can you share final estimate by tonight?", time: "1h", unread: 1 },
    { id: "c3", name: "Zeel Patel", username: "@zeelpatel", message: "Please update milestone 2 delivery date.", time: "3h", unread: 0 },
    { id: "c4", name: "Aryan Patel", username: "@aryanpatel", message: "Great progress so far. Keep it up!", time: "Yesterday", unread: 0 },
  ];
  const [chatThreads, setChatThreads] = useState<Record<string, Array<{ sender: "me" | "them"; text: string; time: string }>>>({
    c1: [
      { sender: "them", text: "Hi Archan! I reviewed your proposal.", time: "2:10 PM" },
      { sender: "me", text: "Great, thanks. Happy to start immediately.", time: "2:12 PM" },
    ],
    c2: [
      { sender: "them", text: "Can you share final estimate by tonight?", time: "12:45 PM" },
      { sender: "me", text: "Yes, I will send a detailed estimate in an hour.", time: "12:47 PM" },
    ],
    c3: [{ sender: "them", text: "Please update milestone 2 delivery date.", time: "10:05 AM" }],
    c4: [{ sender: "them", text: "Great progress so far. Keep it up!", time: "Yesterday" }],
  });
  const CHAT_STORAGE_KEY = currentUser?.email ? `eruka_chats_${currentUser.email}` : 'eruka_chats_guest';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) {
      try {
        setChatThreads(JSON.parse(raw));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatThreads));
  }, [chatThreads]);
  const activeChat = inboxChats.find((chat) => chat.id === selectedChatId) || inboxChats[0];
  const activeMessages = chatThreads[selectedChatId] || [];

  // typing and reply timers for inbox chat simulation
  const [chatTyping, setChatTyping] = useState<Record<string, boolean>>({});
  const chatTimers = useRef<number[]>([]);

  // profile modal
  const [profileOpen, setProfileOpen] = useState(false);
  const [editName, setEditName] = useState(currentUserState?.name || "");
  const [editEmail, setEditEmail] = useState(currentUserState?.email || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    return () => {
      chatTimers.current.forEach((t) => clearTimeout(t));
      chatTimers.current = [];
    };
  }, []);

  // open profile modal if URL hash indicates edit
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#edit') {
      setEditName(currentUserState?.name || '');
      setEditEmail(currentUserState?.email || '');
      setProfileOpen(true);
      // clear the hash so it doesn't reopen on navigation
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [currentUserState]);

  const handleSendMessage = () => {
    const content = chatInput.trim();
    if (!content) return;

    setChatThreads((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), { sender: "me", text: content, time: "Now" }],
    }));
    setChatInput("");
    // schedule an automated reply from the other participant after 8-12s
    // show typing for the selected chat
    setChatTyping((t) => ({ ...t, [selectedChatId]: true }));
    // shorter, more responsive delay
    const min = 2000;
    const max = 5000;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    const timer = window.setTimeout(() => {
      // use functional updater to get latest history
      setChatThreads((prev) => {
        const history = (prev[selectedChatId] || []).map((m) => m.text);
        const reply = generateSmartReply(content, { role: currentUser?.role, history });
        const replyMessage: { sender: "me" | "them"; text: string; time: string } = { sender: "them", text: reply, time: "Now" };
        const next = { ...prev } as Record<string, { sender: "me" | "them"; text: string; time: string }[]>;
        next[selectedChatId] = [...(prev[selectedChatId] || []), replyMessage];
        // persist to localStorage
        if (typeof window !== 'undefined') window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      setChatTyping((t) => ({ ...t, [selectedChatId]: false }));
      chatTimers.current = chatTimers.current.filter((x) => x !== (timer as number));
    }, delay) as unknown as number;
    chatTimers.current.push(timer as number);
  };

  // Quick action handlers
  const handleQuickUpdateProfile = () => {
    setEditName(currentUserState?.name || '');
    setEditEmail(currentUserState?.email || '');
    setProfileOpen(true);
    // move focus to modal after a tiny delay
    setTimeout(() => {
      const el = document.getElementById('profile-avatar-input');
      if (el) (el as HTMLElement).focus?.();
    }, 120);
  };

  const handleQuickOpenMessages = (chatId?: string) => {
    const id = chatId || inboxChats[0]?.id || selectedChatId;
    if (!id) return;
    setSelectedChatId(id);
    // ensure messages container and input are focused/visible
    setTimeout(() => {
      const container = document.getElementById('dashboard-messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
      const inputEl = document.getElementById('dashboard-chat-input') as HTMLInputElement | null;
      inputEl?.focus?.();
    }, 150);
  };

  const handleQuickReviewOpportunities = () => {
    window.location.href = '/jobs';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {displayName}. Track work, finances, and activity in one place.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">Response Rate 96%</Badge>
            <Badge variant="secondary">Profile Strength: Expert</Badge>
            <Badge variant="secondary">Last active: 5 min ago</Badge>
          </div>
          
          {/* Inline editable profile card */}
          <div className="mt-4">
            <Card className="w-full max-w-sm">
              <CardContent className="flex gap-4 items-center">
                <div>
                  {avatarData ? (
                    <img src={avatarData} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">{(currentUserState?.name || "U").split(" ").map(p=>p[0]).join("").slice(0,2)}</div>
                  )}
                  <input ref={avatarInputRef} id="avatar" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const input = e.target as HTMLInputElement;
                    const file = input.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const base = String(reader.result || "");
                      try {
                        window.localStorage.setItem('eruka_avatar', base);
                        setAvatarData(base);
                      } catch (err) {
                        // ignore storage errors
                      }
                      // clear the input so the same file can be selected again
                      try { input.value = ''; } catch (e) {}
                    };
                    reader.readAsDataURL(file);
                  }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{currentUserState?.name || "Your Name"}</div>
                  <div className="text-xs text-muted-foreground">{currentUserState?.email || "you@example.com"}</div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => avatarInputRef.current?.click() }>Change Avatar</Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      setEditName(currentUserState?.name || "");
                      setEditEmail(currentUserState?.email || "");
                      setProfileOpen(true);
                    }}>Edit Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={role === "freelancer" ? "default" : "secondary"}
            onClick={() => setRole("freelancer")}
          >
            Freelancer
          </Button>
          <Button size="sm" variant={role === "recruiter" ? "default" : "secondary"} onClick={() => setRole("recruiter")}>
            Recruiter
          </Button>
          <Link to="/jobs">
            <Button size="sm" variant="outline" className="gap-1">
              Browse Jobs <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/post-job">
            <Button size="sm" variant="hero">
              Post Job
            </Button>
          </Link>
          <Button size="sm" variant="ghost" onClick={async () => {
            const newName = prompt('Enter your display name', currentUserState?.name || '');
            const newEmail = prompt('Enter your email', currentUserState?.email || '');
            if (newName == null || newEmail == null) return;
            const { updateProfile } = await import('@/lib/auth');
            const res = await updateProfile({ name: newName, email: newEmail });
            if (res.ok) setCurrentUserState((prev) => prev ? { ...prev, name: newName, email: newEmail } : prev);
            else alert(res.message || 'Could not update profile');
          }}>Edit Profile</Button>
        </div>
      </div>

  {/* Top stats */}
  <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Jobs</div>
          <div className="text-2xl font-bold text-foreground">{allJobs.length}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Open · {allJobs.filter(j=>j.status==='open').length}</div>
        </div>
            {/* Edit profile modal */}
            {profileOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setProfileOpen(false)} />
                <div className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                  <h3 className="text-lg font-semibold">Edit Profile</h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-sm">Display name</label>
                      <input className="mt-1 w-full rounded-md border px-3 py-2" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm">Email</label>
                      <input className="mt-1 w-full rounded-md border px-3 py-2" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm">Avatar</label>
                      <div className="mt-2 flex items-center gap-3">
                        {avatarData ? <img src={avatarData} className="h-12 w-12 rounded-full object-cover" alt="avatar" /> : <div className="h-12 w-12 rounded-full bg-muted" />}
                        <input ref={profileAvatarInputRef} id="profile-avatar-input" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingAvatar(true);
                          try {
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const base = String(reader.result || "");
                              // if Supabase configured, upload to storage
                              const { isSupabaseConfigured, supabase } = await import('@/lib/supabase');
                              if (isSupabaseConfigured && supabase) {
                                try {
                                  const name = `avatar-${Date.now()}`;
                                  const { data, error } = await (supabase.storage as any).from('avatars').upload(name, file, { upsert: true });
                                  if (!error) {
                                    const { data: urlData } = await supabase.storage.from('avatars').getPublicUrl(data.path);
                                    window.localStorage.setItem('eruka_avatar', urlData.publicUrl);
                                    setAvatarData(urlData.publicUrl);
                                    toast.success('Avatar uploaded');
                                    try { (profileAvatarInputRef.current as HTMLInputElement).value = ''; } catch(e) {}
                                  } else {
                                    // fallback to base64
                                    window.localStorage.setItem('eruka_avatar', base);
                                    setAvatarData(base);
                                    toast('Avatar saved locally');
                                    try { (profileAvatarInputRef.current as HTMLInputElement).value = ''; } catch(e) {}
                                  }
                                } catch (err) {
                                  window.localStorage.setItem('eruka_avatar', base);
                                  setAvatarData(base);
                                  toast('Avatar saved locally');
                                  try { (profileAvatarInputRef.current as HTMLInputElement).value = ''; } catch(e) {}
                                }
                              } else {
                                window.localStorage.setItem('eruka_avatar', base);
                                setAvatarData(base);
                                toast('Avatar saved locally');
                                try { (profileAvatarInputRef.current as HTMLInputElement).value = ''; } catch(e) {}
                              }
                              setUploadingAvatar(false);
                            };
                            reader.readAsDataURL(file);
                          } catch (e) {
                            setUploadingAvatar(false);
                            toast.error('Could not upload avatar');
                          }
                        }} />
                        <button className="rounded-md border px-3 py-1" onClick={() => profileAvatarInputRef.current?.click() }>Change</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button className="rounded-md px-3 py-2 border" onClick={() => setProfileOpen(false)}>Cancel</button>
                    <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground" onClick={async () => {
                      if (!editName.trim() || !editEmail.trim()) { toast.error('Name and email are required'); return; }
                      const { updateProfile } = await import('@/lib/auth');
                      const res = await updateProfile({ name: editName.trim(), email: editEmail.trim() });
                      if (res.ok) {
                        setCurrentUserState((prev) => prev ? { ...prev, name: editName.trim(), email: editEmail.trim() } : prev);
                        toast.success('Profile updated');
                        setProfileOpen(false);
                      } else {
                        toast.error(res.message || 'Could not update profile');
                      }
                    }}>Save</button>
                  </div>
                </div>
              </div>
            )}

            <Toaster />
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Applications</div>
          <div className="text-2xl font-bold text-foreground">{allBids.length}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{myBids.length} yours</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Earnings</div>
          <div className="text-2xl font-bold text-foreground">{formatInrCompact(totalBidValue)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Projected</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Rating</div>
          <div className="text-2xl font-bold text-foreground">4.8</div>
          <div className="text-[11px] text-muted-foreground mt-1">Based on reviews</div>
        </div>
      </div>

      {/* Recent Activity & Jobs */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(chatThreads.c1 || []).slice(-3).reverse().map((m, i) => (
                  <div key={`act-${i}`} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{m.sender === 'me' ? 'ME' : 'AS'}</div>
                    <div>
                      <div className="text-sm text-foreground">{m.text}</div>
                      <div className="text-xs text-muted-foreground">{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allJobs.slice(0,4).map((job) => (
                  <div key={job.id} className="flex items-center justify-between rounded-md p-3 bg-card/30">
                    <div>
                      <div className="font-medium text-sm">{job.title}</div>
                      <div className="text-xs text-muted-foreground">{job.recruiterName} · {job.category}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{job.bidsCount} bids</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-lg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link to="/post-job"><Button variant="hero" className="w-full">Post Job</Button></Link>
                <Link to="/jobs"><Button variant="outline" className="w-full">Browse Jobs</Button></Link>
                <Button variant="ghost" className="w-full" onClick={() => { const el = document.getElementById('avatar'); el?.click(); }}>Update Avatar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        {role === "freelancer" ? (
          <>
            <StatCard icon={FileText} label="My Bids" value={myBids.length.toString()} note={`${bidsInReview} pending`} />
            <StatCard icon={Briefcase} label="Active Jobs" value={activeJobs.length.toString()} note="Across 2 categories" />
            <StatCard icon={CheckCircle} label="Completed" value={completedJobs.length.toString()} note="Lifetime delivery" />
            <StatCard icon={TrendingUp} label="Bid Value (INR)" value={formatInrCompact(totalBidValue)} note="Current pipeline" />
          </>
        ) : (
          <>
            <StatCard icon={Briefcase} label="Posted Jobs" value={postedJobs.length.toString()} note="All time" />
            <StatCard icon={Users} label="Total Bids" value={allBids.length.toString()} note="Across active jobs" />
            <StatCard
              icon={TrendingUp}
              label="In Progress"
              value={allJobs.filter((j) => j.status === "in-progress").length.toString()}
              note="Current engagements"
            />
            <StatCard icon={Target} label="Projected Spend" value={formatInrCompact(recruiterSpend)} note="Budget ceiling" />
          </>
        )}


      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="gradient-card border-border/50 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <MiniMetric title="Avg. Reply Time" value="35 min" icon={Clock} />
            <MiniMetric title="Success Score" value="98%" icon={Target} />
            <MiniMetric title="Weekly Activity" value="+14%" icon={Activity} />
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full justify-start" onClick={() => handleQuickUpdateProfile()}>
              Update Profile
            </Button>
            <Button variant="secondary" className="w-full justify-start" onClick={() => handleQuickOpenMessages()}>
              Open Messages
            </Button>
            <Button variant="secondary" className="w-full justify-start" onClick={() => handleQuickReviewOpportunities()}>
              Review Opportunities
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="gradient-card border-border/50 mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Stored Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jobs" className="space-y-4">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="jobs">Post Jobs</TabsTrigger>
              <TabsTrigger value="bids">Bids</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <div className="space-y-2">
                {postedJobRecords.length > 0 ? postedJobRecords.map((job) => (
                  <div key={job.id} className="rounded-lg border border-border/50 bg-card/40 p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{job.title}</p>
                      <Badge className={statusStyles[job.status]}>{job.status}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">Recruiter: {job.recruiterName}</p>
                    <p className="text-muted-foreground">
                      Budget: {formatUsdAsInr(job.budgetMin)} - {formatUsdAsInr(job.budgetMax)}
                    </p>
                    <p className="text-muted-foreground">Category: {job.category} · Deadline: {job.deadline}</p>
                  </div>
                )) : (
                  <p className="rounded-lg border border-border/50 bg-card/40 p-4 text-sm text-muted-foreground">
                    No posted job records yet.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bids">
              <div className="space-y-2">
                {bidRecords.length > 0 ? bidRecords.map((bid) => {
                  const job = allJobs.find((item) => item.id === bid.jobId);
                  return (
                    <div key={bid.id} className="rounded-lg border border-border/50 bg-card/40 p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">{bid.freelancerName}</p>
                        <Badge className={statusStyles[bid.status]}>{bid.status}</Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">Job: {job?.title || bid.jobId}</p>
                      <p className="text-muted-foreground">
                        Amount: {formatUsdAsInr(bid.amount)} · Delivery: {bid.deliveryTime} days
                      </p>
                      <p className="text-muted-foreground">Proposal: {bid.proposal}</p>
                    </div>
                  );
                }) : (
                  <p className="rounded-lg border border-border/50 bg-card/40 p-4 text-sm text-muted-foreground">
                    No bid records yet.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          {role === "freelancer" ? (
            <Tabs defaultValue="bids" className="space-y-6">
              <TabsList className="bg-card border border-border/50">
                <TabsTrigger value="bids">My Bids</TabsTrigger>
                <TabsTrigger value="active">Active Jobs</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="bids">
                <div className="space-y-3">
                  {myBids.map((bid) => {
                    const job = allJobs.find((j) => j.id === bid.jobId);
                    return (
                      <Link key={bid.id} to="/jobs/$jobId" params={{ jobId: bid.jobId }}>
                        <Card className="gradient-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{job?.title}</h3>
                              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">₹{formatUsdAsInr(bid.amount)}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{bid.deliveryTime} days</span>
                              </div>
                            </div>
                            <Badge className={statusStyles[bid.status]}>{bid.status}</Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="active">
                <div className="space-y-3">
                  {activeJobs.length > 0 ? activeJobs.map((job) => (
                    <Link key={job.id} to="/jobs/$jobId" params={{ jobId: job.id }}>
                      <Card className="gradient-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                        <CardContent className="p-5 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{job.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">by {job.recruiterName}</p>
                          </div>
                          <Badge className={statusStyles[job.status]}>{job.status.replace("-", " ")}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  )) : (
                    <Card className="gradient-card border-border/50">
                      <CardContent className="p-8 text-center text-muted-foreground">No active jobs yet.</CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <Card className="gradient-card border-border/50">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    You have completed 47 jobs. Keep up the great work!
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue="posted" className="space-y-6">
              <TabsList className="bg-card border border-border/50">
                <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
                <TabsTrigger value="bids">Received Bids</TabsTrigger>
              </TabsList>

              <TabsContent value="posted">
                <div className="space-y-3">
                  {postedJobs.map((job) => (
                    <Link key={job.id} to="/jobs/$jobId" params={{ jobId: job.id }}>
                      <Card className="gradient-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                        <CardContent className="p-5 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{job.title}</h3>
                            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{job.bidsCount} bids</span>
                              <span>{formatUsdAsInr(job.budgetMin)} – {formatUsdAsInr(job.budgetMax)}</span>
                            </div>
                          </div>
                          <Badge className={statusStyles[job.status]}>{job.status.replace("-", " ")}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bids">
                <div className="space-y-3">
                  {allBids.map((bid) => {
                    const job = allJobs.find((j) => j.id === bid.jobId);
                    return (
                      <Card key={bid.id} className="gradient-card border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{bid.freelancerName}</h3>
                            <p className="text-sm text-muted-foreground">on {job?.title} · {formatUsdAsInr(bid.amount)} · {bid.deliveryTime} days</p>
                          </div>
                          <Badge className={statusStyles[bid.status]}>{bid.status}</Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <Card className="gradient-card border-border/50 h-fit xl:sticky xl:top-20">
          <CardHeader className="border-b border-border/50 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Messages</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search chats..." className="h-9 pl-9 bg-input/50" />
            </div>
            <div className="max-h-56 space-y-1 overflow-y-auto border-b border-border/50 pb-2">
              {inboxChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full rounded-lg p-2.5 text-left transition-colors hover:bg-accent/40 ${
                    selectedChatId === chat.id ? "bg-accent/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{chat.name}</p>
                        <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{chat.username}</p>
                      <p className="truncate text-xs text-foreground/90">{chat.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {chatTyping[chat.id] && (
                        <div className="text-[11px] text-muted-foreground">typing…</div>
                      )}
                      {chat.unread > 0 && (
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-border/50 bg-card/30">
              <div className="border-b border-border/50 px-3 py-2">
                <p className="text-sm font-semibold">{activeChat.name}</p>
                <p className="text-[11px] text-muted-foreground">{activeChat.username}</p>
              </div>
              <div id="dashboard-messages-container" className="max-h-56 space-y-2 overflow-y-auto p-3">
                {activeMessages.map((message, index) => (
                  <div key={`${selectedChatId}-${index}`} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-2.5 py-2 text-xs ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`mt-1 text-[10px] ${message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
                {chatTyping[selectedChatId] && (
                  <div className="flex justify-start">
                    <div className="max-w-[60%] rounded-lg px-3 py-2 text-xs bg-muted text-foreground">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-75" />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150" />
                        <div className="ml-2 text-[11px] text-muted-foreground">typing...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <form
                className="flex gap-2 border-t border-border/50 p-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  id="dashboard-chat-input"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Type message..."
                  className="h-8 bg-input/50 text-xs"
                />
                <Button type="submit" size="icon" className="h-8 w-8" disabled={!chatInput.trim()}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card className="gradient-card border-border/50">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-[11px] text-muted-foreground/80">{note}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniMetric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/40 p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{title}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatInrCompact(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
