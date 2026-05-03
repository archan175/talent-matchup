import { useMemo, useState } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type ChatMessage = {
  id: string;
  sender: "user" | "support";
  text: string;
};

const quickPrompts = [
  "I can't login",
  "How do I sign up?",
  "How to post a job?",
  "How to apply for jobs?",
];

function getSupportReply(message: string) {
  const msg = message.toLowerCase();

  if (msg.includes("login") || msg.includes("log in") || msg.includes("sign in")) {
    return "Please go to Login, enter your registered email and password, then submit. If credentials fail, re-check spelling or create a new account from Sign Up.";
  }

  if (msg.includes("signup") || msg.includes("sign up") || msg.includes("register")) {
    return "Open Sign Up, choose role (Freelancer/Recruiter), enter name/email/password, and submit. You will be automatically logged in and redirected to your profile.";
  }

  if (msg.includes("post") || msg.includes("job")) {
    return "Go to Post Job in the header, fill title/description/budget/deadline/skills, then submit. Your job listing will appear in Browse Jobs.";
  }

  if (msg.includes("bid") || msg.includes("apply")) {
    return "Open Browse Jobs, select a job, and submit a bid with your proposal, amount, and delivery timeline.";
  }

  if (msg.includes("profile") || msg.includes("account")) {
    return "Use the profile page to view your account details. If blocked, make sure you are logged in first.";
  }

  return "I can help with login, signup, posting jobs, bidding, and profile issues. Please tell me what problem you are facing in one line.";
}

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "support",
      text: "Hi, I am ERUKA Support. Ask me anything about login, signup, jobs, or bids.",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const sendMessage = (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-u`,
      sender: "user",
      text: cleanText,
    };

    const supportMessage: ChatMessage = {
      id: `${Date.now()}-s`,
      sender: "support",
      text: getSupportReply(cleanText),
    };

    setMessages((prev) => [...prev, userMessage, supportMessage]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <Card className="w-[22rem] border-border/60 shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/50 p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/15 p-1.5">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Live Support</p>
                <p className="text-xs text-success">Online now</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <CardContent className="space-y-3 p-3">
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-md bg-muted/30 p-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                    message.sender === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-card text-foreground border border-border/50"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
            >
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Describe your issue..."
                className="h-9 text-sm"
              />
              <Button type="submit" size="icon" variant="hero" disabled={!canSend}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button
          type="button"
          variant="hero"
          className="h-12 w-12 rounded-full shadow-xl"
          onClick={() => setIsOpen(true)}
          aria-label="Open live support chat"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
