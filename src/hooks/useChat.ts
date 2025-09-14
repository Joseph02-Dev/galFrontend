import { useState, useEffect } from "react";
import { api } from "../api";

export function useChat(currentEmail: string, targetEmail: string) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les messages entre deux utilisateurs
  useEffect(() => {
    if (!currentEmail || !targetEmail) return;
    setLoading(true);
    api.get(`/messages?user1=${currentEmail}&user2=${targetEmail}`)
      .then(res => setMessages(res.data))
      .finally(() => setLoading(false));
  }, [currentEmail, targetEmail]);

  // Envoyer un message
  const sendMessage = async (text: string) => {
    const res = await api.post("/messages", {
      sender: currentEmail,
      recipient: targetEmail,
      text,
    });
    setMessages(msgs => [...msgs, res.data]);
  };

  // Marquer tous les messages reçus comme lus (optionnel)
  const markAllAsRead = async () => {
    await api.post(`/messages/markAsRead`, { user1: currentEmail, user2: targetEmail });
    setMessages(msgs => msgs.map(m => ({ ...m, read: true })));
  };

  return { messages, loading, sendMessage, markAllAsRead };
}
