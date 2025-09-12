import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";

type Message = {
  sender: string;
  recipient: string;
  text: string;
  timestamp: number;
  read?: boolean;
};

function ChatModal({ children, onClose }) {
  const [position, setPosition] = useState({ x: 200, y: 100 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = React.useRef({ x: 0, y: 0 });
  const containerRef = React.useRef(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };
    document.body.style.userSelect = "none";
  };

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.userSelect = "";
    };
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return ReactDOM.createPortal(
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 9999,
        width: 400,
        maxWidth: "90vw",
        height: 450, // hauteur réduite
        background: "white",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          cursor: "move",
          background: "#f3f4f6",
          padding: 8,
          fontWeight: "bold",
        }}
        onMouseDown={handleMouseDown}
      >
        Conversation
        <button
          onClick={onClose}
          style={{
            float: "right",
            color: "#e53e3e",
            fontWeight: "bold",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          
          ✕
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>,
    document.body
  );
}

export default function ChatPage() {
  const { id } = useParams(); // id = email de l'utilisateur cible
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const targetUser = users.find((u: { email: string }) => u.email === id);
  const currentEmail = currentUser?.email || "";
  const targetEmail = typeof id === "string" ? id : "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = useState(true);

  // Charger la conversation depuis localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("conversations") || "{}");
    const convoKey = getConversationKey(currentEmail, targetEmail);
    let msgs: Message[] = stored[convoKey] || [];
    // Marquer comme lus tous les messages reçus non lus
    let updated = false;
    msgs = msgs.map((msg: Message) => {
      if (msg.sender !== currentEmail && !msg.read) {
        updated = true;
        return { ...msg, read: true };
      }
      return msg;
    });
    if (updated) {
      stored[convoKey] = msgs;
      localStorage.setItem("conversations", JSON.stringify(stored));
    }
    setMessages(msgs);
  }, [currentEmail, targetEmail]);

  // Sauvegarde la conversation
  const saveConversation = (msgs: Message[]) => {
    const stored = JSON.parse(localStorage.getItem("conversations") || "{}");
    const convoKey = getConversationKey(currentEmail, targetEmail);
    stored[convoKey] = msgs;
    localStorage.setItem("conversations", JSON.stringify(stored));
  };

  // Envoi d’un message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      sender: currentUser.email,
      recipient: targetEmail,
      text: newMessage,
      timestamp: Date.now(),
      read: false,
    };

    const updated = [...messages, msg];
    setMessages(updated);
    saveConversation(updated);
    setNewMessage("");
  };

  if (!open) return null;

  return (
    <ChatModal onClose={() => setOpen(false)}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 text-white flex items-center gap-3 btn btn-warning ">
          {targetUser?.photo || targetUser?.avatar ? (
            <img
              src={targetUser.photo || targetUser.avatar}
              alt={targetUser.name || targetUser.nom || targetUser.email}
              className="w-10 h-10 rounded-full object-cover border border-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
              {targetUser?.name?.[0] || targetUser?.nom?.[0] || targetUser?.email?.[0] || '?'}
            </div>
          )}
          <span className="font-semibold text-lg text-black">
            {targetUser?.prenom && targetUser?.nom
              ? `${targetUser.prenom} ${targetUser.nom}`
              : targetUser?.name || targetUser?.nom || ""}
          </span>
        </div>
        {/* Messages */}
        <div className="flex-1 p-4 bg-black overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                msg.sender === currentUser.email ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs ${
                  msg.sender === currentUser.email
                    ? "bg-yellow-100 text-black"
                    : "bg-black border text-white"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[10px] block mt-1 text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Formulaire */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t flex items-center gap-2 bg-orange-50"
          style={{ position: "sticky", bottom: 0, left: 0, right: 0, zIndex: 10, background: "#fff" }}
        >
          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 border-none rounded-full px-3 py-2 outline-none bg-orange-100 text-black placeholder:text-orange-400 focus:bg-orange-200"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-full hover:bg-orange-500 hover:text-white transition"
          >
            Envoyer
          </button>
        </form>
      </div>
    </ChatModal>
  );
}

// 🔑 Générer une clé unique pour identifier la conversation
function getConversationKey(email1: string, email2: string) {
  return [email1, email2].sort().join("_");
}
