// src/hooks/usePosts.ts
import { useState, useEffect } from "react";
import type { Post } from "../types/Post";
import { mockPosts } from "../data/posts";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem("posts");
    return savedPosts
      ? JSON.parse(savedPosts).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt), // ✅ reconvertir en Date
        }))
      : mockPosts;
  });

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const addPost = (partialPost: Partial<Post>) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user?.id || partialPost.userId || "1",
      username: user ? `${user.firstName} ${user.lastName}` : partialPost.username || "Utilisateur",
      userAvatar: user?.profileImage || partialPost.userAvatar || "https://i.pravatar.cc/150?img=3",
      userProfession: partialPost.userProfession || "Producteur",
      isOnline: partialPost.isOnline ?? true,
      mediaUrl: partialPost.mediaUrl || "",
      mediaType: partialPost.mediaType || "image",
      caption: partialPost.caption || "",
      createdAt: new Date(),
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isOwnPost: true,
      likedBy: [],
    };
    setPosts([newPost, ...posts]);
  };

  const deletePost = (postId: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setPosts(posts => posts.filter(post => {
      // Seul le propriétaire peut supprimer
      if (post.id === postId) {
        return post.userId !== user?.id;
      }
      return true;
    }));
  };

  // Liker une publication
  const likePost = (postId: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;
    setPosts(posts => {
      const updated = posts.map(post => {
        if (post.id === postId) {
          const alreadyLiked = (post.likedBy || []).includes(user.id);
          const newLikedBy = alreadyLiked
            ? post.likedBy.filter((id: string) => id !== user.id)
            : [...(post.likedBy || []), user.id];
          return {
            ...post,
            likedBy: newLikedBy,
            likes: newLikedBy.length,
          };
        }
        return post;
      });
      localStorage.setItem("posts", JSON.stringify(updated));
      return updated;
    });
  };

  // Commenter une publication
  const commentPost = (postId: string, content: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return;
    setPosts(posts => {
      const updated = posts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: Date.now().toString(),
            userId: user.id,
            username: `${user.firstName} ${user.lastName}`,
            userAvatar: user.profileImage,
            content,
            createdAt: new Date(),
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      });
      localStorage.setItem("posts", JSON.stringify(updated));
      return updated;
    });
  };

  // Partager une publication
  const sharePost = (postId: string) => {
    setPosts(posts => {
      const updated = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            shares: post.shares + 1,
          };
        }
        return post;
      });
      localStorage.setItem("posts", JSON.stringify(updated));
      return updated;
    });
  };

  return { posts, addPost, deletePost, likePost, commentPost, sharePost };
}
