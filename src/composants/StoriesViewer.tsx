import React, { useState, useEffect, useRef } from 'react';
import type { Story } from '../types/Story';

interface StoriesViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
  username?: string;
  userAvatar?: string;
}

export default function StoriesViewer({ 
  stories, 
  initialIndex, 
  onClose, 
  onStoryViewed,
  username,
  userAvatar
}: StoriesViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const progressIntervalRef = useRef<number | null>(null);
  const storyDuration = 5000; // 5 secondes par story

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (isPlaying && currentStory) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + (100 / (storyDuration / 100));
        });
      }, 100);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentStory]);

  useEffect(() => {
    if (onStoryViewed && currentStory) {
      onStoryViewed(currentStory.id);
    }
  }, [currentIndex, onStoryViewed]);

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const previousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleStoryClick = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center" >
      {/* Barre de progression en haut */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
        <div className="h-full bg-black transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>

      {/* Boutons de navigation */}
      <button
        onClick={previousStory}
        disabled={currentIndex === 0}
        className="absolute left-1 xs:left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 xs:w-8 xs:h-8 sm:w-12 sm:h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        ‹
      </button>

      <button
        onClick={nextStory}
        className="absolute right-1 xs:right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 xs:w-8 xs:h-8 sm:w-12 sm:h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 z-10"
      >
        ›
      </button>

      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-1 xs:top-2 sm:top-4 right-1 xs:right-2 sm:right-4 w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 z-10"
      >
        ✕
      </button>

      {/* Bouton play/pause */}
      <button
        onClick={togglePlayPause}
        className="absolute top-1 xs:top-2 sm:top-4 left-1 xs:left-2 sm:left-4 w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 z-10"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Contenu de la story */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.caption || 'Story'}
          className="w-full h-full object-cover"
        />
        {/* Overlay debug forçé */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(255,0,0,0.8)',
            zIndex: 99999,
            pointerEvents: 'auto'
          }}
        >
          <span style={{ color: 'white', fontSize: 32 }}>OVERLAY DEBUG</span>
        </div>
        {/* Overlay avec informations, au-dessus */}
        <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-6 z-20">
          {/* En-tête avec avatar et nom */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-2 xs:mb-3 sm:mb-4">
            <img
              src={userAvatar || currentStory.userAvatar}
              alt={username || currentStory.username}
              className="w-6 h-6 xs:w-8 xs:h-8 sm:w-12 sm:h-12 rounded-full border-2 border-white"
            />
            <div className="text-white">
              <div className="font-semibold text-xs xs:text-sm sm:text-base text-white">{username || currentStory.username}</div>
              <div className="text-xs opacity-80 text-white">
                {Math.floor((Date.now() - currentStory.createdAt.getTime()) / (1000 * 60))}m
              </div>
            </div>
          </div>

          {/* Légende */}
          {currentStory.caption && (
            <p className="text-white text-sm xs:text-base sm:text-lg mb-2 xs:mb-3 sm:mb-4">{currentStory.caption}</p>
          )}
        </div>
      </div>

      {/* Indicateurs de stories en bas */}
      <div className="absolute bottom-1 xs:bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-0.5 xs:gap-1 sm:gap-2">
        {stories.map((story, index) => (
          <button
            key={story.id || index}
            onClick={() => handleStoryClick(index)}
            className={`w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white'
                : index < currentIndex
                ? 'bg-gray-400'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
