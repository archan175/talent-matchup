import { mockBids, mockJobs, type Bid, type Job } from "@/lib/mock-data";

const JOBS_KEY = "eruka_posted_jobs";
const BIDS_KEY = "eruka_bids";

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

export function savePostedJob(job: Job) {
  writeJson(JOBS_KEY, [job, ...getPostedJobs()]);
}

export function getAllJobs(): Job[] {
  return [...getPostedJobs(), ...mockJobs];
}

export function getSavedBids(): Bid[] {
  return readJson<Bid[]>(BIDS_KEY, []);
}

export function saveBid(bid: Bid) {
  writeJson(BIDS_KEY, [bid, ...getSavedBids()]);
}

export function getAllBids(): Bid[] {
  return [...getSavedBids(), ...mockBids];
}

export function getLowestStoredBid(jobId: string): number | null {
  const jobBids = getAllBids().filter((bid) => bid.jobId === jobId);
  if (jobBids.length === 0) return null;
  return Math.min(...jobBids.map((bid) => bid.amount));
}
