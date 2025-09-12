import React, { useState, useRef } from 'react';
import type { Post } from '../types/Post';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isLiked' | 'isOwnPost'>) => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mediaFile) return;

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const newPost: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isLiked' | 'isOwnPost'> = {
      userId: user?.id || '1',
      username: user ? `${user.firstName} ${user.lastName}` : 'Utilisateur',
      userAvatar: user?.profileImage || 'https://i.pravatar.cc/60?img=12',
      userProfession: 'Producteur',
      isOnline: true,
      mediaUrl: mediaPreview,
      mediaType,
      caption: caption.trim() || '',
    };

    onPostCreated(newPost);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setMediaFile(null);
    setMediaPreview('');
    setCaption('');
    setMediaType('image');
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 xs:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-1 xs:mx-2">
        {/* En-tête */}
        <div className="flex items-center justify-between p-3 xs:p-4 border-b">
          <button className="text-base xs:text-lg font-semibold btn btn-soft btn-warning">Créer une publication</button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full btn btn-soft btn-warning flex items-center justify-center hover: --color-info-content"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 xs:p-4 space-y-3 xs:space-y-4">
          {/* Zone de sélection de média */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Média (image ou vidéo)
            </label>
            
            {!mediaPreview ? (
                             <div
                 onClick={openFileSelector}
                 className="border-2 border-dashed border-gray-300 rounded-lg p-4 xs:p-6 sm:p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
               >
                 <div className="text-2xl xs:text-3xl sm:text-4xl mb-2">📷</div>
                 <p className="text-gray-600 text-xs xs:text-sm sm:text-base">Cliquez pour sélectionner une image ou vidéo</p>
                 <p className="text-xs sm:text-sm text-gray-500 mt-1">JPG, PNG, MP4 jusqu'à 10MB</p>
               </div>
            ) : (
              <div className="relative">
                {mediaType === 'image' ? (
                                     <img
                     src={mediaPreview}
                     alt="Aperçu"
                     className="w-full h-48 xs:h-56 sm:h-64 object-cover rounded-lg"
                   />
                 ) : (
                   <video
                     src={mediaPreview}
                     controls
                     className="w-full h-48 xs:h-56 sm:h-64 object-cover rounded-lg"
                   />
                 )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreview('');
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Légende */}
          <div className="space-y-2">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
              Légende
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Décrivez votre publication..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {caption.length}/500
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!mediaFile}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
