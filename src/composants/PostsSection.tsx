import React, { useState } from 'react';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import { usePosts } from '../hooks/usePosts';

export default function PostsSection() {
  const { posts, addPost, likePost, commentPost, sharePost, deletePost } = usePosts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handlePostCreated = (newPost: any) => {
    addPost(newPost);
  };

  return (
    <>
      {/* En-tête de la section */}
  <div className="bg-white rounded-2xl p-1 xs:p-2 mb-2 xs:mb-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-xs xs:text-sm">Publications</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 xs:px-4 py-1.5 xs:py-2 text-white rounded-lg btn btn-soft btn-warning hover: --color-info-content transition-colors text-xs xs:text-sm font-medium"
          >
            + Nouvelle publication
          </button>
        </div>
      </div>

      {/* Liste des publications */}
  <div className="space-y-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={likePost}
            onComment={commentPost}
            onShare={sharePost}
            onDelete={deletePost}
          />
        ))}
      </div>

      {/* Modal de création de publication */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  );
}
