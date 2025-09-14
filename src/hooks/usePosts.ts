// src/hooks/usePosts.ts
import { useState, useEffect } from "react";
import type { Post } from "../types/Post";
import { api } from "../api";


export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les posts depuis l'API
  useEffect(() => {
    setLoading(true);
    api.get("/posts")
      .then(res => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Ajouter une publication
  const addPost = async (partialPost: Partial<Post>) => {
    const res = await api.post("/posts", partialPost);
    setPosts([res.data, ...posts]);
  };

  // Supprimer une publication
  const deletePost = async (postId: string) => {
    await api.delete(`/posts/${postId}`);
    setPosts(posts => posts.filter(post => post.id !== postId));
  };

  // Liker une publication
  const likePost = async (postId: string) => {
    const res = await api.post(`/posts/${postId}/like`);
    setPosts(posts => posts.map(post => post.id === postId ? res.data : post));
  };

  // Commenter une publication
  const commentPost = async (postId: string, content: string) => {
    const res = await api.post(`/posts/${postId}/comments`, { content });
    setPosts(posts => posts.map(post => post.id === postId ? res.data : post));
  };

  // Partager une publication
  const sharePost = async (postId: string) => {
    const res = await api.post(`/posts/${postId}/share`);
    setPosts(posts => posts.map(post => post.id === postId ? res.data : post));
  };

  return { posts, loading, addPost, deletePost, likePost, commentPost, sharePost };
}
