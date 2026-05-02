import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — ERUKA" },
      { name: "description", content: "Chat with freelancers and recruiters on ERUKA." },
    ],
  }),
  component: ChatPage,
});

const conversations = [
  { id: "c1", name: "Sarah Miller", avatar: "SM", lastMessage: "Can you start next week?", time: "2m ago", unread: 2 },
  { id: "c2", name: "James Wilson", avatar: "JW", lastMessage: "Thanks for the feedback!", time: "1h ago", unread: 0 },
  { id: "c3", name: "Maria Garcia", avatar: "MG", lastMessage: "I've updated the designs.", time: "3h ago", unread: 0 },
];

const messages = [
  { id: "m1", senderId: "u2", text: "Hi Alex! I saw your bid on the e-commerce project.", time: "10:30 AM" },
  { id: "m2", senderId: "u1", text: "Hi Sarah! Yes, I'm very interested. I have extensive experience building e-commerce platforms.", time: "10:32 AM" },
  { id: "m3", senderId: "u2", text: "Your portfolio looks great. Can you share more details about the tech stack you'd use?", time: "10:35 AM" },
  { id: "m4", senderId: "u1", text: "Sure! I'd use React with TypeScript for the frontend, Node.js backend, and MongoDB for the database. For payments, I'll integrate Stripe.", time: "10:38 AM" },
  { id: "m5", senderId: "u2", text: "That sounds perfect. Can you start next week?", time: "10:40 AM" },
];

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState("c1");
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ height: "calc(100vh - 16rem)" }}>
        {/* Conversations List */}
        <Card className="gradient-card border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border/50">
              <Input placeholder="Search conversations..." className="bg-input/50" />
            </div>
            <div className="divide-y divide-border/30">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                    selectedChat === conv.id ? "bg-accent/50" : "hover:bg-accent/30"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary shrink-0">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{conv.name}</span>
                      <span className="text-[10px] text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {conv.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="gradient-card border-border/50 lg:col-span-2 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-border/50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              SM
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Sarah Miller</p>
              <p className="text-[10px] text-success">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === "u1" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                  msg.senderId === "u1"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-accent text-accent-foreground rounded-bl-sm"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`mt-1 text-[10px] ${msg.senderId === "u1" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border/50 p-4">
            <form
              className="flex gap-2"
              onSubmit={(e) => { e.preventDefault(); setNewMessage(""); }}
            >
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-input/50"
              />
              <Button variant="hero" size="icon" type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
