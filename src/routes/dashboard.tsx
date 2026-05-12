import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchRegisteredUsers,
  getCurrentUser,
  getRegisteredUsers,
  type AuthUser,
} from "@/lib/auth";
import {
  fetchPostedJobs,
  fetchSavedBids,
  getAllBids,
  getAllJobs,
  getPostedJobs,
  getSavedBids,
} from "@/lib/local-data";
import { mockBids, mockJobs, type Bid, type Job } from "@/lib/mock-data";
import { formatUsdAsInr, usdToInr } from "@/lib/currency";
import { generateSmartReply } from "@/lib/reply";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Briefcase,
  Camera,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Send,
  SlidersHorizontal,
  Star,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard - ERUKA" },
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

type ChatMessage = { sender: "me" | "them"; text: string; time: string };

const inboxChats = [
  {
    id: "c1",
    name: "Aastha",
    username: "@aastha",
    message: "Hi Archan! I reviewed your proposal.",
    time: "2m",
    unread: 2,
  },
  {
    id: "c2",
    name: "Archan Patel",
    username: "@archanpatel",
    message: "Can you share final estimate by tonight?",
    time: "1h",
    unread: 1,
  },
  {
    id: "c3",
    name: "Zeel Patel",
    username: "@zeelpatel",
    message: "Please update milestone 2 delivery date.",
    time: "3h",
    unread: 0,
  },
  {
    id: "c4",
    name: "Aryan Patel",
    username: "@aryanpatel",
    message: "Great progress so far. Keep it up!",
    time: "Yesterday",
    unread: 0,
  },
];

const initialThreads: Record<string, ChatMessage[]> = {
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
};

function DashboardPage() {
  const [role, setRole] = useState<"freelancer" | "recruiter">("freelancer");
  const [selectedChatId, setSelectedChatId] = useState("c1");
  const [chatInput, setChatInput] = useState("");
  const currentUser = getCurrentUser();
  const [currentUserState, setCurrentUserState] = useState<AuthUser | null>(currentUser);
  const displayName = currentUserState?.name || "Archan Patel";
  const initials = getInitials(displayName);
  const userKey = currentUser?.id || currentUser?.email || "u1";
  const [avatarData, setAvatarData] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("eruka_avatar");
  });

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const profileAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const chatTimers = useRef<number[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>(getAllJobs());
  const [allBids, setAllBids] = useState<Bid[]>(getAllBids());
  const [postedJobRecords, setPostedJobRecords] = useState<Job[]>(getPostedJobs());
  const [bidRecords, setBidRecords] = useState<Bid[]>(getSavedBids());
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(getRegisteredUsers());
  const [chatThreads, setChatThreads] = useState<Record<string, ChatMessage[]>>(initialThreads);
  const [chatTyping, setChatTyping] = useState<Record<string, boolean>>({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [editName, setEditName] = useState(currentUserState?.name || "");
  const [editEmail, setEditEmail] = useState(currentUserState?.email || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const chatStorageKey = currentUser?.email
    ? `eruka_chats_${currentUser.email}`
    : "eruka_chats_guest";

  useEffect(() => {
    function onAuthChanged() {
      const next = getCurrentUser();
      setCurrentUserState(next);
      if (typeof window !== "undefined") {
        setAvatarData(window.localStorage.getItem("eruka_avatar"));
      }
    }

    window.addEventListener("eruka:auth-changed", onAuthChanged);
    return () => window.removeEventListener("eruka:auth-changed", onAuthChanged);
  }, []);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(chatStorageKey);
    if (!raw) return;
    try {
      setChatThreads(JSON.parse(raw));
    } catch {
      setChatThreads(initialThreads);
    }
  }, [chatStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(chatStorageKey, JSON.stringify(chatThreads));
  }, [chatThreads, chatStorageKey]);

  useEffect(() => {
    return () => {
      chatTimers.current.forEach((timer) => clearTimeout(timer));
      chatTimers.current = [];
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#edit") {
      setEditName(currentUserState?.name || "");
      setEditEmail(currentUserState?.email || "");
      setProfileOpen(true);
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [currentUserState]);

  const myBids = allBids.filter(
    (bid) => bid.freelancerId === userKey || (!currentUser && bid.freelancerId === "u1"),
  );
  const postedJobs = allJobs;
  const openJobs = allJobs.filter((job) => job.status === "open");
  const activeJobs = allJobs.filter(
    (job) => job.status === "in-progress" && job.assignedFreelancerId === userKey,
  );
  const completedJobs = allJobs.filter((job) => job.status === "completed");
  const bidsInReview = myBids.filter((bid) => bid.status === "pending").length;
  const acceptedBids = myBids.filter((bid) => bid.status === "accepted").length;
  const totalBidValue = myBids.reduce((total, bid) => total + usdToInr(bid.amount), 0);
  const recruiterSpend = postedJobs.reduce((total, job) => total + usdToInr(job.budgetMax), 0);
  const activeChat = inboxChats.find((chat) => chat.id === selectedChatId) || inboxChats[0];
  const activeMessages = chatThreads[selectedChatId] || [];

  const summaryStats =
    role === "freelancer"
      ? [
          {
            icon: FileText,
            label: "My Bids",
            value: myBids.length.toString(),
            note: `${bidsInReview} pending`,
          },
          {
            icon: Briefcase,
            label: "Active Jobs",
            value: activeJobs.length.toString(),
            note: "Current engagements",
          },
          {
            icon: CheckCircle,
            label: "Completed",
            value: completedJobs.length.toString(),
            note: "Lifetime delivery",
          },
          {
            icon: Wallet,
            label: "Pipeline Value",
            value: formatInrCompact(totalBidValue),
            note: `${acceptedBids} accepted bids`,
          },
        ]
      : [
          {
            icon: Briefcase,
            label: "Posted Jobs",
            value: postedJobs.length.toString(),
            note: `${openJobs.length} open`,
          },
          {
            icon: Users,
            label: "Total Bids",
            value: allBids.length.toString(),
            note: "Across active jobs",
          },
          {
            icon: TrendingUp,
            label: "In Progress",
            value: allJobs.filter((job) => job.status === "in-progress").length.toString(),
            note: "Current engagements",
          },
          {
            icon: Wallet,
            label: "Projected Spend",
            value: formatInrCompact(recruiterSpend),
            note: "Budget ceiling",
          },
        ];

  function openProfileModal() {
    setEditName(currentUserState?.name || "");
    setEditEmail(currentUserState?.email || "");
    setProfileOpen(true);
  }

  async function saveAvatar(file: File, input?: HTMLInputElement | null) {
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base = String(reader.result || "");
      try {
        const { isSupabaseConfigured, supabase } = await import("@/lib/supabase");
        if (isSupabaseConfigured && supabase) {
          const name = `avatar-${Date.now()}`;
          const { data, error } = await supabase.storage
            .from("avatars")
            .upload(name, file, { upsert: true });
          if (!error && data?.path) {
            const { data: urlData } = await supabase.storage
              .from("avatars")
              .getPublicUrl(data.path);
            window.localStorage.setItem("eruka_avatar", urlData.publicUrl);
            setAvatarData(urlData.publicUrl);
            toast.success("Avatar uploaded");
          } else {
            window.localStorage.setItem("eruka_avatar", base);
            setAvatarData(base);
            toast("Avatar saved locally");
          }
        } else {
          window.localStorage.setItem("eruka_avatar", base);
          setAvatarData(base);
          toast("Avatar saved locally");
        }
      } catch {
        window.localStorage.setItem("eruka_avatar", base);
        setAvatarData(base);
        toast("Avatar saved locally");
      } finally {
        if (input) input.value = "";
        setUploadingAvatar(false);
      }
    };
    reader.onerror = () => {
      setUploadingAvatar(false);
      toast.error("Could not upload avatar");
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    if (!editName.trim() || !editEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const { updateProfile } = await import("@/lib/auth");
    const res = await updateProfile({ name: editName.trim(), email: editEmail.trim() });
    if (res.ok) {
      setCurrentUserState((prev) =>
        prev ? { ...prev, name: editName.trim(), email: editEmail.trim() } : prev,
      );
      toast.success("Profile updated");
      setProfileOpen(false);
    } else {
      toast.error(res.message || "Could not update profile");
    }
  }

  function handleSendMessage() {
    const content = chatInput.trim();
    if (!content) return;

    setChatThreads((prev) => ({
      ...prev,
      [selectedChatId]: [
        ...(prev[selectedChatId] || []),
        { sender: "me", text: content, time: "Now" },
      ],
    }));
    setChatInput("");
    setChatTyping((typing) => ({ ...typing, [selectedChatId]: true }));

    const delay = Math.floor(Math.random() * 3001) + 2000;
    const timer = window.setTimeout(() => {
      setChatThreads((prev) => {
        const history = (prev[selectedChatId] || []).map((message) => message.text);
        const reply = generateSmartReply(content, { role: currentUser?.role, history });
        return {
          ...prev,
          [selectedChatId]: [
            ...(prev[selectedChatId] || []),
            { sender: "them", text: reply, time: "Now" },
          ],
        };
      });
      setChatTyping((typing) => ({ ...typing, [selectedChatId]: false }));
      chatTimers.current = chatTimers.current.filter((item) => item !== timer);
    }, delay) as unknown as number;
    chatTimers.current.push(timer);
  }

  function focusMessages(chatId?: string) {
    setSelectedChatId(chatId || inboxChats[0]?.id || selectedChatId);
    setTimeout(() => {
      const container = document.getElementById("dashboard-messages-container");
      if (container) container.scrollTop = container.scrollHeight;
      const input = document.getElementById("dashboard-chat-input") as HTMLInputElement | null;
      input?.focus();
    }, 150);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <Toaster />
      {profileOpen && (
        <ProfileModal
          avatarData={avatarData}
          editEmail={editEmail}
          editName={editName}
          initials={initials}
          profileAvatarInputRef={profileAvatarInputRef}
          uploadingAvatar={uploadingAvatar}
          onClose={() => setProfileOpen(false)}
          onEmailChange={setEditEmail}
          onNameChange={setEditName}
          onSave={handleSaveProfile}
          onAvatarSelected={saveAvatar}
        />
      )}

      <section className="mb-6 rounded-xl border border-border/60 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0">
              {avatarData ? (
                <img
                  src={avatarData}
                  alt="Profile avatar"
                  className="h-20 w-20 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                  {initials}
                </div>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const input = event.target as HTMLInputElement;
                  const file = input.files?.[0];
                  if (file) void saveAvatar(file, input);
                }}
              />
              <button
                type="button"
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white shadow-sm"
                onClick={() => avatarInputRef.current?.click()}
                aria-label="Change avatar"
              >
                <Camera className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
                <Badge variant="secondary">{currentUserState?.role || role}</Badge>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Welcome back. Track work, proposals, messages, and stored marketplace data from one
                place.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">Response Rate 96%</Badge>
                <Badge variant="secondary">Profile Strength: Expert</Badge>
                <Badge variant="secondary">Last active: 5 min ago</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
            <div className="grid grid-cols-2 rounded-lg border border-border bg-slate-50 p-1">
              <Button
                size="sm"
                variant={role === "freelancer" ? "default" : "ghost"}
                onClick={() => setRole("freelancer")}
              >
                Freelancer
              </Button>
              <Button
                size="sm"
                variant={role === "recruiter" ? "default" : "ghost"}
                onClick={() => setRole("recruiter")}
              >
                Recruiter
              </Button>
            </div>
            <Button size="sm" variant="outline" className="bg-white" onClick={openProfileModal}>
              Edit Profile
            </Button>
            <Link to="/post-job">
              <Button size="sm" variant="hero" className="w-full">
                Post Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="border-border/60 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <MiniMetric title="Avg. Reply Time" value="35 min" icon={Clock} />
            <MiniMetric title="Success Score" value="98%" icon={Target} />
            <MiniMetric title="Weekly Activity" value="+14%" icon={Activity} />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="secondary" className="justify-start" onClick={openProfileModal}>
              <Users className="h-4 w-4" /> Update Profile
            </Button>
            <Button variant="secondary" className="justify-start" onClick={() => focusMessages()}>
              <MessageSquare className="h-4 w-4" /> Open Messages
            </Button>
            <Link to="/jobs">
              <Button variant="secondary" className="w-full justify-start">
                <ArrowUpRight className="h-4 w-4" /> Review Opportunities
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-6">
          <WorkTabs
            role={role}
            myBids={myBids}
            allBids={allBids}
            allJobs={allJobs}
            activeJobs={activeJobs}
            completedJobs={completedJobs}
            postedJobs={postedJobs}
          />
          <RecordsCard
            registeredUsers={registeredUsers}
            postedJobRecords={postedJobRecords}
            bidRecords={bidRecords}
            allJobs={allJobs}
          />
        </div>
        <MessagesCard
          activeChat={activeChat}
          activeMessages={activeMessages}
          chatInput={chatInput}
          chatTyping={chatTyping}
          selectedChatId={selectedChatId}
          onChatInputChange={setChatInput}
          onSelectChat={(id) => focusMessages(id)}
          onSendMessage={handleSendMessage}
        />
      </section>
    </div>
  );
}

function ProfileModal({
  avatarData,
  editEmail,
  editName,
  initials,
  profileAvatarInputRef,
  uploadingAvatar,
  onAvatarSelected,
  onClose,
  onEmailChange,
  onNameChange,
  onSave,
}: {
  avatarData: string | null;
  editEmail: string;
  editName: string;
  initials: string;
  profileAvatarInputRef: React.RefObject<HTMLInputElement | null>;
  uploadingAvatar: boolean;
  onAvatarSelected: (file: File, input?: HTMLInputElement | null) => void;
  onClose: () => void;
  onEmailChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/45" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Edit Profile</h2>
            <p className="text-sm text-muted-foreground">Update your public ERUKA details.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {avatarData ? (
              <img
                src={avatarData}
                className="h-14 w-14 rounded-lg object-cover"
                alt="Profile avatar"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                {initials}
              </div>
            )}
            <input
              ref={profileAvatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const input = event.target as HTMLInputElement;
                const file = input.files?.[0];
                if (file) onAvatarSelected(file, input);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={uploadingAvatar}
              onClick={() => profileAvatarInputRef.current?.click()}
            >
              {uploadingAvatar ? "Uploading..." : "Change Avatar"}
            </Button>
          </div>
          <label className="block text-sm font-medium">
            Display name
            <Input
              className="mt-1 bg-white"
              value={editName}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium">
            Email
            <Input
              className="mt-1 bg-white"
              value={editEmail}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

function WorkTabs({
  activeJobs,
  allBids,
  allJobs,
  completedJobs,
  myBids,
  postedJobs,
  role,
}: {
  activeJobs: Job[];
  allBids: Bid[];
  allJobs: Job[];
  completedJobs: Job[];
  myBids: Bid[];
  postedJobs: Job[];
  role: "freelancer" | "recruiter";
}) {
  if (role === "freelancer") {
    return (
      <Tabs defaultValue="bids" className="space-y-4">
        <TabsList className="border border-border/60 bg-white">
          <TabsTrigger value="bids">My Bids</TabsTrigger>
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="bids" className="space-y-3">
          {myBids.map((bid) => {
            const job = allJobs.find((item) => item.id === bid.jobId);
            return (
              <WorkRow
                key={bid.id}
                hrefJobId={bid.jobId}
                title={job?.title || "Project"}
                subtitle={`${formatUsdAsInr(bid.amount)} · ${bid.deliveryTime} days`}
                status={bid.status}
              />
            );
          })}
        </TabsContent>
        <TabsContent value="active" className="space-y-3">
          {activeJobs.length > 0 ? (
            activeJobs.map((job) => (
              <WorkRow
                key={job.id}
                hrefJobId={job.id}
                title={job.title}
                subtitle={`by ${job.recruiterName}`}
                status={job.status}
              />
            ))
          ) : (
            <EmptyState text="No active jobs yet." />
          )}
        </TabsContent>
        <TabsContent value="completed">
          <EmptyState
            text={`You have ${completedJobs.length || 47} completed jobs. Keep the delivery streak moving.`}
          />
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs defaultValue="posted" className="space-y-4">
      <TabsList className="border border-border/60 bg-white">
        <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
        <TabsTrigger value="bids">Received Bids</TabsTrigger>
      </TabsList>
      <TabsContent value="posted" className="space-y-3">
        {postedJobs.map((job) => (
          <WorkRow
            key={job.id}
            hrefJobId={job.id}
            title={job.title}
            subtitle={`${job.bidsCount} bids · ${formatUsdAsInr(job.budgetMin)} - ${formatUsdAsInr(job.budgetMax)}`}
            status={job.status}
          />
        ))}
      </TabsContent>
      <TabsContent value="bids" className="space-y-3">
        {allBids.map((bid) => {
          const job = allJobs.find((item) => item.id === bid.jobId);
          return (
            <WorkRow
              key={bid.id}
              title={bid.freelancerName}
              subtitle={`on ${job?.title || "Project"} · ${formatUsdAsInr(bid.amount)} · ${bid.deliveryTime} days`}
              status={bid.status}
            />
          );
        })}
      </TabsContent>
    </Tabs>
  );
}

function WorkRow({
  hrefJobId,
  title,
  subtitle,
  status,
}: {
  hrefJobId?: string;
  title: string;
  subtitle: string;
  status: string;
}) {
  const content = (
    <Card className="border-border/60 bg-white shadow-sm transition-colors hover:border-primary/35">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Badge className={statusStyles[status]}>{status.replace("-", " ")}</Badge>
      </CardContent>
    </Card>
  );

  if (!hrefJobId) return content;
  return (
    <Link to="/jobs/$jobId" params={{ jobId: hrefJobId }}>
      {content}
    </Link>
  );
}

function RecordsCard({
  allJobs,
  bidRecords,
  postedJobRecords,
  registeredUsers,
}: {
  allJobs: Job[];
  bidRecords: Bid[];
  postedJobRecords: Job[];
  registeredUsers: AuthUser[];
}) {
  return (
    <Card className="border-border/60 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Stored Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logins" className="space-y-4">
          <TabsList className="border border-border/60 bg-slate-50">
            <TabsTrigger value="logins">Logins</TabsTrigger>
            <TabsTrigger value="jobs">Post Jobs</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="logins" className="space-y-2">
            {registeredUsers.length > 0 ? (
              registeredUsers.map((user) => (
                <RecordRow
                  key={user.email}
                  title={user.name}
                  badge={user.role}
                  lines={[`Email: ${user.email}`, "Password: secured by Supabase Auth"]}
                />
              ))
            ) : (
              <EmptyState text="No signup records yet." />
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-2">
            {postedJobRecords.length > 0 ? (
              postedJobRecords.map((job) => (
                <RecordRow
                  key={job.id}
                  title={job.title}
                  badge={job.status}
                  badgeClassName={statusStyles[job.status]}
                  lines={[
                    `Recruiter: ${job.recruiterName}`,
                    `Budget: ${formatUsdAsInr(job.budgetMin)} - ${formatUsdAsInr(job.budgetMax)}`,
                    `Category: ${job.category} · Deadline: ${job.deadline}`,
                  ]}
                />
              ))
            ) : (
              <EmptyState text="No posted job records yet." />
            )}
          </TabsContent>

          <TabsContent value="bids" className="space-y-2">
            {bidRecords.length > 0 ? (
              bidRecords.map((bid) => {
                const job = allJobs.find((item) => item.id === bid.jobId);
                return (
                  <RecordRow
                    key={bid.id}
                    title={bid.freelancerName}
                    badge={bid.status}
                    badgeClassName={statusStyles[bid.status]}
                    lines={[
                      `Job: ${job?.title || bid.jobId}`,
                      `Amount: ${formatUsdAsInr(bid.amount)} · Delivery: ${bid.deliveryTime} days`,
                      `Proposal: ${bid.proposal}`,
                    ]}
                  />
                );
              })
            ) : (
              <EmptyState text="No bid records yet." />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MessagesCard({
  activeChat,
  activeMessages,
  chatInput,
  chatTyping,
  selectedChatId,
  onChatInputChange,
  onSelectChat,
  onSendMessage,
}: {
  activeChat: (typeof inboxChats)[number];
  activeMessages: ChatMessage[];
  chatInput: string;
  chatTyping: Record<string, boolean>;
  selectedChatId: string;
  onChatInputChange: (value: string) => void;
  onSelectChat: (id: string) => void;
  onSendMessage: () => void;
}) {
  return (
    <Card className="h-fit border-border/60 bg-white shadow-sm xl:sticky xl:top-20">
      <CardHeader className="border-b border-border/60 pb-3">
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
          <Input placeholder="Search chats..." className="h-9 bg-slate-50 pl-9" />
        </div>
        <div className="max-h-56 space-y-1 overflow-y-auto border-b border-border/60 pb-2">
          {inboxChats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => onSelectChat(chat.id)}
              className={`w-full rounded-lg p-2.5 text-left transition-colors hover:bg-slate-100 ${
                selectedChatId === chat.id ? "bg-slate-100" : ""
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                  {getInitials(chat.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{chat.name}</p>
                    <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{chat.username}</p>
                  <p className="truncate text-xs text-foreground/90">{chat.message}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {chat.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-lg border border-border/60 bg-slate-50">
          <div className="border-b border-border/60 px-3 py-2">
            <p className="text-sm font-semibold">{activeChat.name}</p>
            <p className="text-[11px] text-muted-foreground">{activeChat.username}</p>
          </div>
          <div id="dashboard-messages-container" className="max-h-56 space-y-2 overflow-y-auto p-3">
            {activeMessages.map((message, index) => (
              <div
                key={`${selectedChatId}-${index}`}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-2.5 py-2 text-xs ${message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-white text-foreground shadow-sm"}`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            {chatTyping[selectedChatId] && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-white px-3 py-2 text-xs shadow-sm">
                  <span className="text-muted-foreground">typing...</span>
                </div>
              </div>
            )}
          </div>
          <form
            className="flex gap-2 border-t border-border/60 p-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSendMessage();
            }}
          >
            <Input
              id="dashboard-chat-input"
              value={chatInput}
              onChange={(event) => onChatInputChange(event.target.value)}
              placeholder="Type message..."
              className="h-8 bg-white text-xs"
            />
            <Button type="submit" size="icon" className="h-8 w-8" disabled={!chatInput.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card className="border-border/60 bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-[11px] text-muted-foreground/80">{note}</p>
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
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-slate-50 p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{title}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function RecordRow({
  title,
  badge,
  badgeClassName,
  lines,
}: {
  title: string;
  badge: string;
  badgeClassName?: string;
  lines: string[];
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-slate-50 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">{title}</p>
        <Badge className={badgeClassName} variant={badgeClassName ? undefined : "secondary"}>
          {badge}
        </Badge>
      </div>
      {lines.map((line) => (
        <p key={line} className="mt-1 text-muted-foreground">
          {line}
        </p>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-white p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
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
