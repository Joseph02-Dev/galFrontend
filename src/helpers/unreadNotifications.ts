// helpers/unreadNotifications.ts
// Renvoie le nombre de nouvelles publications et stories non vues par l'utilisateur courant

export function getUnreadNotificationsCount(currentUserEmail: string): number {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const stories = JSON.parse(localStorage.getItem("stories") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const notifications = JSON.parse(localStorage.getItem("notifications") || "{}") || {};
  const lastSeen = notifications[currentUserEmail]?.lastSeen || 0;
  const currentUser = users.find((u: any) => u.email === currentUserEmail);
  const currentUserId = currentUser?.id;

  // Compter les posts et stories créés après la dernière vue, hors ceux de l'utilisateur courant
  const newPosts = posts.filter((p: any) => {
    const createdAt = typeof p.createdAt === 'string' ? new Date(p.createdAt).getTime() : (p.createdAt?.getTime ? p.createdAt.getTime() : p.createdAt);
    return createdAt > lastSeen && p.userId && p.userId !== currentUserId;
  });
  const newStories = stories.filter((s: any) => {
    const createdAt = typeof s.createdAt === 'string' ? new Date(s.createdAt).getTime() : (s.createdAt?.getTime ? s.createdAt.getTime() : s.createdAt);
    return createdAt > lastSeen && s.userId && s.userId !== currentUserId;
  });
  return newPosts.length + newStories.length;
}

// À appeler quand l'utilisateur clique sur la cloche
export function markNotificationsAsSeen(currentUserEmail: string) {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "{}") || {};
  notifications[currentUserEmail] = { lastSeen: Date.now() };
  localStorage.setItem("notifications", JSON.stringify(notifications));
}
