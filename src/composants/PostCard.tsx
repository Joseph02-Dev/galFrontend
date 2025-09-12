import React, { useState } from 'react';
import type { Post, Comment } from '../types/Post';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [showShareConfirm, setShowShareConfirm] = useState(false);
  const [showLikesList, setShowLikesList] = useState(false);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `${diffInHours}H`;
    return `${Math.floor(diffInHours / 24)}J`;
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleLike = () => {
    setLikeAnimating(true);
    onLike(post.id);
    setTimeout(() => setLikeAnimating(false), 400);
  };

  const handleShare = () => {
    setShowShareConfirm(true);
    onShare(post.id);
    setTimeout(() => setShowShareConfirm(false), 1200);
  };

  const handleDelete = () => {
    onDelete(post.id);
    setShowDeleteConfirm(false);
  };

  return (
  <div className="bg-white rounded-2xl border mb-3 shadow-sm overflow-hidden post-card text-xs">
      {/* En-tête de la publication */}
      <div className="p-1 xs:p-2 border-b">
        <div className="flex items-center gap-1 xs:gap-2">
          {/* Avatar avec indicateur en ligne */}
          <div className="relative">
            <img 
              src={post.userAvatar} 
              alt={post.username}
              className="w-7 h-7 xs:w-8 xs:h-8 rounded-full object-cover"
            />
            {post.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-2 h-2 xs:w-2.5 xs:h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          {/* Informations utilisateur */}
          <div className="flex-1">
            <div className="font-semibold text-gray-800 text-xs xs:text-sm">{post.username}</div>
            <div className="text-[10px] xs:text-xs text-gray-500">{post.userProfession}</div>
          </div>

          {/* Timestamp et menu */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] xs:text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
            
            {/* Menu pour supprimer ses propres publications */}
            {post.isOwnPost && (
              <div className="relative">
                <button
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-xs"
                >
                  ⋯
                </button>
                
                {showDeleteConfirm && (
                  <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[80px]">
                    <button
                      onClick={handleDelete}
                      className="w-full px-2 py-1 text-left text-red-600 hover:bg-red-50 rounded-lg text-xs"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Légende */}
      {post.caption && (
        <div className="px-2 xs:px-3 py-1 xs:py-2 border-b">
          <p className="text-gray-800 text-[11px] xs:text-xs leading-relaxed">{post.caption}</p>
        </div>
      )}

      {/* Image/Media avec navigation */}
      <div className="relative">
        <img
          src={post.mediaUrl}
          alt={post.caption || 'Publication'}
          className="w-full h-36 xs:h-44 sm:h-52 object-cover"
        />
        {/* Flèches de navigation (semi-transparentes) */}
        <button className="absolute left-1 xs:left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 xs:w-7 xs:h-7 bg-black bg-opacity-30 text-white rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all text-xs">
          ‹
        </button>
        <button className="absolute right-1 xs:right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 xs:w-7 xs:h-7 bg-black bg-opacity-30 text-white rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all text-xs">
          ›
        </button>
      </div>

      {/* Barre d'interactions */}
      <div className="p-1 xs:p-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 xs:gap-3">
            {/* Likes */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:opacity-80 transition-opacity ${
                (post.likedBy || []).includes(JSON.parse(localStorage.getItem('user') || '{}').id) ? 'text-red-500' : 'text-gray-600'
              } text-xs relative select-none`}
            >
              <span className={`text-base xs:text-lg transition-transform duration-300 ${likeAnimating ? 'scale-150' : ''}`}>{(post.likedBy || []).includes(JSON.parse(localStorage.getItem('user') || '{}').id) ? '❤️' : '🤍'}</span>
              <span className="text-[11px] xs:text-xs font-medium transition-colors duration-300">{(post.likedBy ? post.likedBy.length : 0).toLocaleString()}</span>
              {likeAnimating && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-red-400 animate-bounce pointer-events-none">+1</span>
              )}
            </button>

            {/* Commentaires */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-gray-600 hover:opacity-80 transition-opacity text-xs"
            >
              <span className="text-base xs:text-lg">💬</span>
              <span className="text-[11px] xs:text-xs font-medium">{post.comments.length}</span>
            </button>

            {/* Partages */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-gray-600 hover:opacity-80 transition-opacity text-xs relative select-none"
            >
              <span className="text-base xs:text-lg">↗️</span>
              <span className="text-[11px] xs:text-xs font-medium">{post.shares}</span>
              {showShareConfirm && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] shadow animate-fade-in pointer-events-none">Partagé !</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Section des commentaires */}
      {showComments && (
        <div className="px-2 xs:px-3 py-1 xs:py-2 border-b bg-gray-50">
          <div className="space-y-1 xs:space-y-2 max-h-32 overflow-y-auto">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2 xs:gap-3">
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  className="w-6 h-6 xs:w-8 xs:h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 xs:gap-2">
                    <span className="font-medium text-xs xs:text-sm text-gray-800">{comment.username}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs xs:text-sm text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zone de saisie de commentaire */}
      <div className="p-3 xs:p-4">
        <form onSubmit={handleSubmitComment} className="flex items-center gap-2 xs:gap-3">
          <img
            src={JSON.parse(localStorage.getItem('user') || '{}').profileImage || "https://i.pravatar.cc/60?img=12"}
            alt="Votre avatar"
            className="w-6 h-6 xs:w-8 xs:h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Qu'en pensez-vous ?"
              className="w-full px-2 xs:px-3 py-1.5 xs:py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs xs:text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5 xs:gap-2">
            <button
              type="button"
              className="w-6 h-6 xs:w-8 xs:h-8 text-gray-500 hover:text-gray-700 transition-colors text-sm xs:text-base"
            >
              📎
            </button>
            <button
              type="button"
              className="w-6 h-6 xs:w-8 xs:h-8 text-gray-500 hover:text-gray-700 transition-colors text-sm xs:text-base"
            >
              🖼️
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
