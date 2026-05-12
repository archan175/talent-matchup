import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { fetchMessagesForUser } from "@/lib/local-data";

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
  {
    id: "c1",
    name: "Aastha",
    avatar: "A",
    lastMessage: "Can you start next week?",
    time: "2m ago",
    unread: 2,
  },
  {
    id: "c2",
    name: "Archan Patel",
    avatar: "AP",
    lastMessage: "Thanks for the feedback!",
    time: "1h ago",
    unread: 0,
  },
  {
    id: "c3",
    name: "Zeel Patel",
    avatar: "ZP",
    lastMessage: "I've updated the designs.",
    time: "3h ago",
    unread: 0,
  },
  {
    id: "c4",
    name: "Aryan Patel",
    avatar: "AP",
    lastMessage: "Please update milestone 2.",
    time: "Yesterday",
    unread: 0,
  },
];

// conversation list state can live inside the component if needed

type StoredMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: string;
};

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState("c1");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    void fetchMessagesForUser(currentUser.id || currentUser.email).then((res) => {
      setMessages(res);
    });

    const onInserted = () => {
      void fetchMessagesForUser(currentUser.id || currentUser.email).then(setMessages);
    };
    window.addEventListener("eruka:message-inserted", onInserted);
    return () => window.removeEventListener("eruka:message-inserted", onInserted);
  }, [currentUser]);
  const activeConversation =
    conversations.find((conv) => conv.id === selectedChat) || conversations[0];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>

      <div className="grid min-h-[560px] grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <Card className="overflow-hidden rounded-xl border-border/70 bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="border-b border-border/50 p-4">
              <Input placeholder="Search conversations..." className="bg-white" />
            </div>
            <div className="divide-y divide-border/30">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`flex w-full items-center gap-3 p-4 text-left transition-colors ${
                    selectedChat === conv.id ? "bg-slate-100" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {conv.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{conv.name}</span>
                      <span className="text-[10px] text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{conv.lastMessage}</p>
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
        <Card className="flex min-h-[560px] flex-col overflow-hidden rounded-xl border-border/70 bg-white shadow-sm lg:col-span-2">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-border/50 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
              {activeConversation.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{activeConversation.name}</p>
              <p className="text-[10px] text-success">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === "u1" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 sm:max-w-[70%] ${
                    msg.senderId === "u1"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-slate-100 text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${msg.senderId === "u1" ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border/50 p-4">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setNewMessage("");
              }}
            >
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-white"
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
