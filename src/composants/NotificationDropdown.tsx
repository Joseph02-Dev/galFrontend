import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import PostCard from "./PostCard";
import { usePosts } from '../hooks/usePosts';
import StoriesViewer from "./StoriesViewer";


export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { likePost, commentPost, sharePost, deletePost } = usePosts();
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [lastSeen, setLastSeen] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosts(JSON.parse(localStorage.getItem("posts") || "[]"));
    setStories(JSON.parse(localStorage.getItem("stories") || "[]"));
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUserId(user?.id || null);
    const notifications = JSON.parse(localStorage.getItem("notifications") || "{}") || {};
    // Toujours prendre la valeur la plus à jour (si la cloche a été cliquée)
    setLastSeen(notifications[user?.email]?.lastSeen || 0);
    // Rafraîchir à chaque ouverture
    const onFocus = () => {
      const notifications = JSON.parse(localStorage.getItem("notifications") || "{}") || {};
      setLastSeen(notifications[user?.email]?.lastSeen || 0);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };
    document.body.style.userSelect = "none";
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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

  // Le contenu de la fenêtre de notification
  const dropdownContent = (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: position.y || undefined,
        left: position.x || undefined,
        right: position.x === 0 ? 0 : undefined,
        zIndex: 1000,
        cursor: dragging ? "grabbing" : "default",
      }}
      className="mt-2 w-80 bg-white rounded-xl shadow-lg border z-[9999] max-h-[70vh] overflow-y-auto fixed top-4 left-72 transition-transform duration-300 ease-out animate-slidein"
    >
      <div
        className="p-4 border-b font-semibold text-gray-700 flex justify-between items-center cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        Notifications
        <button onClick={onClose} className="text-gray-400 hover:text-red-500">✕</button>
      </div>
      {/* Aperçu publication sélectionnée en haut */}
      {selectedPost && (
        <div className="border-b">
          <PostCard
            post={selectedPost}
            onLike={likePost}
            onComment={commentPost}
            onShare={sharePost}
            onDelete={deletePost}
          />
        </div>
      )}
      <div className="divide-y">
        {posts.length === 0 && stories.length === 0 && (
          <div className="p-4 text-gray-500 text-center">Aucune nouvelle publication ou story.</div>
        )}
        {posts.filter((post) => post.userId !== currentUserId).map((post) => {
          const createdAt = typeof post.createdAt === 'string' ? new Date(post.createdAt).getTime() : (post.createdAt?.getTime ? post.createdAt.getTime() : post.createdAt);
          const isUnread = createdAt > lastSeen;
          return (
            <div
              key={post.id}
              className={`p-4 transition cursor-pointer ${isUnread ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedPost({ ...post, createdAt: new Date(post.createdAt) })}
            >
              <div className="flex items-center gap-3">
                <img src={post.userAvatar || "https://i.pravatar.cc/60"} alt="avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-medium text-sm">{post.username} a publié :</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{post.caption || "Nouvelle publication"}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{new Date(post.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
        {stories.filter((story) => story.userId !== currentUserId).map((story, idx, arr) => {
          const createdAt = typeof story.createdAt === 'string' ? new Date(story.createdAt).getTime() : (story.createdAt?.getTime ? story.createdAt.getTime() : story.createdAt);
          const isUnread = createdAt > lastSeen;
          return (
            <div
              key={story.id}
              className={`p-4 transition cursor-pointer ${isUnread ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedStory({ stories: arr, initialIndex: idx, username: story.username, userAvatar: story.userAvatar })}
            >
              <div className="flex items-center gap-3">
                <img src={story.userAvatar || "https://i.pravatar.cc/60"} alt="avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-medium text-sm">{story.username} a ajouté une story</div>
                  <div className="text-[10px] text-gray-400 mt-1">{new Date(story.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedStory && (
        <StoriesViewer
          stories={selectedStory.stories}
          initialIndex={selectedStory.initialIndex}
          onClose={() => setSelectedStory(null)}
          userAvatar={selectedStory.userAvatar}
          username={selectedStory.username}
        />
      )}
    </div>
  );

  // Utilisation du portail pour rendre la fenêtre à la racine du DOM
  return ReactDOM.createPortal(dropdownContent, document.body);
}