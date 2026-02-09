import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import CopyButton from "@/components/CopyButton";
import { useChatSessions, useChatSession, useCreateChatSession, useChatMessages, useSendMessage, useToast } from "@/hooks/use-images";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Bot,
    Send,
    MessageSquare,
    Plus,
    RefreshCw,
} from "lucide-react";
import { ModelSelector } from "@/components/ModelSelector";

const MODELS = [
    { id: "grok-2", label: "Grok 2" },
    { id: "grok-vision-beta", label: "Grok Vision (beta)" },
    { id: "gpt-4", label: "GPT-4" },
    { id: "claude-sonnet", label: "Claude Sonnet" },
] as const;

export default function Chat() {
    const { toast } = useToast();
    const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const sessionsQuery = useChatSessions();
    const sessionQuery = useChatSession(selectedSessionId);
    const messagesQuery = useChatMessages(selectedSessionId);
    const createSessionMutation = useCreateChatSession();
    const sendMessageMutation = useSendMessage();

    const sessions = sessionsQuery.data || [];
    const currentSession = sessionQuery.data;
    const messages = messagesQuery.data || [];

    const modelLabel = useMemo(
        () => MODELS.find((m) => m.id === currentSession?.model)?.label ?? currentSession?.model,
        [currentSession?.model],
    );

    useEffect(() => {
        if (sessions.length > 0 && !selectedSessionId) {
            setSelectedSessionId(sessions[0].id);
        }
    }, [sessions, selectedSessionId]);

    const handleCreateSession = async () => {
        try {
            const newSession = await createSessionMutation.mutateAsync({
                title: "New Conversation",
                model: "grok-2",
            });
            setSelectedSessionId(newSession.id);
            toast({
                title: "New channel initialized",
                description: "Terminal link established.",
            });
        } catch (error) {
            toast({
                title: "Initialization failed",
                description: error instanceof Error ? error.message : "Handshake error",
                variant: "destructive",
            });
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedSessionId) return;

        const message = newMessage.trim();
        setNewMessage("");
        setIsTyping(true);

        try {
            await sendMessageMutation.mutateAsync({
                sessionId: selectedSessionId,
                content: message,
                model: currentSession?.model || "google/gemini-2.0-flash-exp:free",
            });
        } catch (error) {
            toast({
                title: "Transmission failed",
                description: error instanceof Error ? error.message : "Stream error",
                variant: "destructive",
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <AppShell>
            <Seo
                title="Imagine Studio — Chat Terminal"
                description="Professional neural link for high-bandwidth conversational exchange."
            />

            <TopBar
                title={
                    <span className="font-black text-white uppercase tracking-tighter">
                        NEURAL <span className="text-neutral-500">DISCOURSE</span>
                    </span>
                }
                subtitle="High-bandwidth conversational exchange with integrated free-tier fallback logic."
                right={
                    <div className="hidden md:flex items-center gap-2">
                        {currentSession && (
                            <>
                                <Badge variant="outline" className="rounded-lg border-neutral-700 bg-neutral-800 text-[10px] font-black uppercase text-neutral-300">
                                    {modelLabel}
                                </Badge>
                                <Badge variant="outline" className="rounded-lg border-neutral-700 bg-neutral-800 text-[10px] font-black uppercase text-neutral-500">
                                    {messages.length} Units
                                </Badge>
                            </>
                        )}
                    </div>
                }
            />

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-[800px]">
                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-4 flex flex-col h-full">
                        <Button
                            onClick={handleCreateSession}
                            disabled={createSessionMutation.isPending}
                            className="w-full h-11 rounded-xl bg-neutral-100 hover:bg-white text-neutral-900 font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Channel
                        </Button>

                        <div className="flex-1 space-y-2 overflow-y-auto pr-2 pretty-scroll">
                            {sessions.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/50">
                                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">No history</p>
                                </div>
                            ) : (
                                sessions.map((session) => (
                                    <div key={session.id} className="group relative">
                                        <button
                                            onClick={() => setSelectedSessionId(session.id)}
                                            className={cn(
                                                "w-full text-left p-4 rounded-xl border transition-all duration-300",
                                                selectedSessionId === session.id
                                                    ? "bg-neutral-800 border-neutral-700 shadow-sm"
                                                    : "bg-neutral-900/40 border-neutral-900 hover:border-neutral-800"
                                            )}
                                        >
                                            <div className="font-black text-[11px] uppercase tracking-tight truncate pr-4 text-neutral-200">
                                                {session.title}
                                            </div>
                                            <div className="text-[9px] text-neutral-600 mt-1 font-bold uppercase tracking-widest">
                                                {session.model.split("/").pop()}
                                            </div>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-9 flex flex-col h-full border border-neutral-800 bg-neutral-950 rounded-2xl overflow-hidden shadow-sm">
                        {/* Header */}
                        <div className="p-5 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-neutral-400" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-white">
                                        {currentSession ? currentSession.title : "Neural Link"}
                                    </h3>
                                    <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mt-0.5">
                                        {currentSession ? `Core active: ${modelLabel}` : "Awaiting selection"}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-8 bg-neutral-950/20 pretty-scroll">
                            {!currentSession ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-20">
                                    <MessageSquare className="h-16 w-16 mb-6" />
                                    <h2 className="text-xl font-black uppercase tracking-[0.3em]">Initialize Link</h2>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-20 font-black text-xs uppercase tracking-[0.5em]">
                                    Link clear.
                                </div>
                            ) : (
                                <div className="space-y-10 pb-10">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex flex-col gap-2",
                                                message.role === "user" ? "items-end" : "items-start"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 px-2">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">
                                                    {message.role === "user" ? "SYSTEM_OPERATOR" : "AI_CORE_UNIT"}
                                                </span>
                                            </div>
                                            <div
                                                className={cn(
                                                    "max-w-[85%] rounded-2xl p-6 text-[13px] leading-relaxed shadow-sm transition-all",
                                                    message.role === "user"
                                                        ? "bg-neutral-100 text-neutral-900 font-bold"
                                                        : "bg-neutral-900 border border-neutral-800 text-neutral-300"
                                                )}
                                            >
                                                <div className="whitespace-pre-wrap">{message.content}</div>
                                                {message.role === "assistant" && (
                                                    <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
                                                        <CopyButton text={message.content} className="h-7 w-7 opacity-30 hover:opacity-100 text-neutral-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex flex-col gap-2 items-start">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">
                                                Bit-stream incoming...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-8 border-t border-neutral-800 bg-neutral-900/30">
                            <div className="flex gap-6 items-end">
                                <div className="flex-1 relative">
                                    <Textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter command sequence..."
                                        className="min-h-[60px] max-h-[200px] resize-none border-neutral-800 bg-neutral-950/50 rounded-xl pr-14 text-sm focus-visible:ring-emerald-500/20 h-16 pt-5"
                                        disabled={!currentSession || isTyping || sendMessageMutation.isPending}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() || !currentSession || isTyping || sendMessageMutation.isPending}
                                        size="icon"
                                        className="absolute right-3 bottom-3 h-10 w-10 rounded-lg bg-neutral-100 hover:bg-white text-neutral-900 shadow-xl transition-all"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="w-56 mb-1">
                                    <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-2 block px-1">Logic Core</label>
                                    <ModelSelector
                                        value={currentSession?.model || "google/gemini-2.0-flash-exp:free"}
                                        onValueChange={() => { }}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AppShell>
    );
}