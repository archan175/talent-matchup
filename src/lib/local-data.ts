import { mockBids, mockJobs, type Bid, type Job } from "@/lib/mock-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const JOBS_KEY = "eruka_posted_jobs";
const BIDS_KEY = "eruka_bids";
const MESSAGES_KEY = "eruka_messages";

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getPostedJobs(): Job[] {
  return readJson<Job[]>(JOBS_KEY, []);
}

export async function fetchPostedJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured || !supabase) return getPostedJobs();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return getPostedJobs();

  return data.map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    budgetMin: job.budget_min,
    budgetMax: job.budget_max,
    skills: job.skills || [],
    deadline: job.deadline,
    status: job.status,
    recruiterId: job.recruiter_id,
    recruiterName: job.recruiter_name,
    assignedFreelancerId: job.assigned_freelancer_id || undefined,
    createdAt: job.created_at?.slice(0, 10) || "",
    bidsCount: job.bids_count || 0,
    category: job.category,
  }));
}

export async function savePostedJob(job: Job) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("jobs").insert({
      id: job.id,
      title: job.title,
      description: job.description,
      budget_min: job.budgetMin,
      budget_max: job.budgetMax,
      skills: job.skills,
      deadline: job.deadline,
      status: job.status,
      recruiter_id: job.recruiterId,
      recruiter_name: job.recruiterName,
      assigned_freelancer_id: job.assignedFreelancerId || null,
      bids_count: job.bidsCount,
      category: job.category,
    });

    if (!error) return;
  }

  writeJson(JOBS_KEY, [job, ...getPostedJobs()]);
}

export function getAllJobs(): Job[] {
  return [...getPostedJobs(), ...mockJobs];
}

export function getSavedBids(): Bid[] {
  return readJson<Bid[]>(BIDS_KEY, []);
}

export async function fetchSavedBids(): Promise<Bid[]> {
  if (!isSupabaseConfigured || !supabase) return getSavedBids();

  const { data, error } = await supabase
    .from("bids")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return getSavedBids();

  return data.map((bid) => ({
    id: bid.id,
    jobId: bid.job_id,
    freelancerId: bid.freelancer_id,
    freelancerName: bid.freelancer_name,
    freelancerRating: bid.freelancer_rating,
    freelancerAvatar: bid.freelancer_avatar,
    amount: bid.amount,
    proposal: bid.proposal,
    deliveryTime: bid.delivery_time,
    status: bid.status,
    createdAt: bid.created_at?.slice(0, 10) || "",
  }));
}

export async function saveBid(bid: Bid) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("bids").insert({
      id: bid.id,
      job_id: bid.jobId,
      freelancer_id: bid.freelancerId,
      freelancer_name: bid.freelancerName,
      freelancer_rating: bid.freelancerRating,
      freelancer_avatar: bid.freelancerAvatar,
      amount: bid.amount,
      proposal: bid.proposal,
      delivery_time: bid.deliveryTime,
      status: bid.status,
    });

    if (!error) return;
  }

  // For local fallback, prepend the new bid
  writeJson(BIDS_KEY, [bid, ...getSavedBids()]);

  // simulate acceptance after 10s for realism
  if (bid.status === 'pending') {
    setTimeout(async () => {
      // mark accepted
      const accepted = { ...bid, status: 'accepted' } as Bid;
      await upsertBid(accepted);

      // create a message from client (job owner) to freelancer
      const jobs = getAllJobs();
      const job = jobs.find((j) => j.id === bid.jobId);
      const clientId = job?.recruiterId || 'client';
      const message = {
        id: `msg-${Date.now()}`,
        senderId: clientId,
        receiverId: bid.freelancerId,
        text: `Hi ${bid.freelancerName}, we'd like to accept your bid for ${job?.title || 'the job'}. Let's discuss next steps.`,
        createdAt: new Date().toISOString(),
      };
      // save message
      await saveMessage(message as any);

      // notify UI listeners
      try {
        window.dispatchEvent(new CustomEvent('eruka:bid-updated', { detail: { bidId: bid.id } }));
        window.dispatchEvent(new CustomEvent('eruka:message-inserted', { detail: { messageId: message.id } }));
      } catch {}
    }, 10000);
  }
}

export function getSavedMessages() {
  return readJson<any[]>(MESSAGES_KEY, []);
}

export async function fetchMessagesForUser(userId: string) {
  if (!isSupabaseConfigured || !supabase) return getSavedMessages().filter(m => m.senderId === userId || m.receiverId === userId);

  const { data, error } = await supabase.from('messages').select('*').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`).order('created_at', { ascending: true });
  if (error || !data) return getSavedMessages().filter(m => m.senderId === userId || m.receiverId === userId);
  return data.map((m) => ({ id: m.id, senderId: m.sender_id, receiverId: m.receiver_id, text: m.message, createdAt: m.created_at }));
}

export async function saveMessage(msg: { id: string; senderId: string; receiverId: string; text: string; createdAt?: string }) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('messages').insert({ id: msg.id, sender_id: msg.senderId, receiver_id: msg.receiverId, message: msg.text });
      return;
    } catch {}
  }

  // local fallback
  writeJson(MESSAGES_KEY, [{ id: msg.id, senderId: msg.senderId, receiverId: msg.receiverId, text: msg.text, createdAt: msg.createdAt || new Date().toISOString() }, ...getSavedMessages()]);
}

export async function upsertBid(bid: Bid) {
  if (isSupabaseConfigured && supabase) {
    // use upsert to update existing bids or insert new
    const { error } = await supabase.from("bids").upsert({
      id: bid.id,
      job_id: bid.jobId,
      freelancer_id: bid.freelancerId,
      freelancer_name: bid.freelancerName,
      freelancer_rating: bid.freelancerRating,
      freelancer_avatar: bid.freelancerAvatar,
      amount: bid.amount,
      proposal: bid.proposal,
      delivery_time: bid.deliveryTime,
      status: bid.status,
    });

    if (!error) return;
  }

  // Local storage fallback: replace existing bid by id or add
  const existing = getSavedBids();
  const next = [bid, ...existing.filter((b) => b.id !== bid.id)];
  writeJson(BIDS_KEY, next);
}

export function getAllBids(): Bid[] {
  const saved = getSavedBids();
  // Pick a small random subset of mock bids on each load so the list varies per refresh
  const shuffled = mockBids.slice().sort(() => Math.random() - 0.5);
  const pickCount = Math.min(mockBids.length, Math.max(1, Math.floor(Math.random() * 3) + 1)); // 1-3
  const randomMocks = shuffled.slice(0, pickCount);
  return [...saved, ...randomMocks];
}

export function getLowestStoredBid(jobId: string): number | null {
  const jobBids = getAllBids().filter((bid) => bid.jobId === jobId);
  if (jobBids.length === 0) return null;
  return Math.min(...jobBids.map((bid) => bid.amount));
}
