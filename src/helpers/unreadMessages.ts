type Message = {
  sender: string;
  text: string;
  timestamp: number;
  read?: boolean;
  recipient: string;
};
// helpers/unreadMessages.ts
// Renvoie le nombre de messages non lus pour l'utilisateur courant
export function getUnreadMessagesCount(currentUserEmail: string): number {
  const conversations = JSON.parse(localStorage.getItem("conversations") || "{}") || {};
  let count = 0;
  Object.values(conversations).forEach((msgs) => {
    if (Array.isArray(msgs)) {
      (msgs as Message[]).forEach((msg) => {
        if (msg.recipient === currentUserEmail && !msg.read) {
          count++;
        }
      });
    }
  });
  return count;
}
