import React, { useState, useRef, useEffect } from 'react';
import type { Story } from '../types/Story';
import { useStories } from '../hooks/useStories';
import CreateStoryModal from './CreateStoryModal';
import StoriesViewer from './StoriesViewer';

export default function StoriesSection() {
  const { stories, addStory, getStoriesGroupedByUser } = useStories();
  const [selectedUserStories, setSelectedUserStories] = useState<{ userId: string; username: string; userAvatar: string; stories: Story[] } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  const handleStoryClick = (userId: string) => {
    const userStories = getStoriesGroupedByUser().find(group => group.userId === userId);
    if (userStories) {
      setSelectedUserStories(userStories);
    }
  };

  const closeStory = () => {
    setSelectedUserStories(null);
  };

  const handleCreateStory = (newStory: Omit<Story, 'id' | 'createdAt' | 'expiresAt'>) => {
    addStory(newStory);
  };

  // Fonctions de navigation
  const scrollLeft = () => {
    if (storiesContainerRef.current) {
      const container = storiesContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll de 80% de la largeur
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    }
  };

  const scrollRight = () => {
    if (storiesContainerRef.current) {
      const container = storiesContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll de 80% de la largeur
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(scrollPosition + scrollAmount);
    }
  };

  // Vérifier si on peut naviguer
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = () => {
    if (storiesContainerRef.current) {
      const container = storiesContainerRef.current;
      return container.scrollLeft < container.scrollWidth - container.clientWidth;
    }
    return false;
  };

  // Mettre à jour la position de scroll
  useEffect(() => {
    const container = storiesContainerRef.current;
    if (container) {
      const handleScroll = () => {
        setScrollPosition(container.scrollLeft);
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <>
      {/* Section des stories - barre horizontale */}
  <div className="bg-white rounded-2xl p-1 xs:p-2 sm:p-2 mb-2 xs:mb-2 sm:mb-3 shadow-sm">
        <div className="flex items-center justify-between mb-1 xs:mb-2 sm:mb-2">
          <h2 className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">Stories</h2>
          <button className="text-xs text-green-600 hover:text-green-700 font-medium">
            Voir tout
          </button>
        </div>

        {/* Stories horizontales avec navigation */}
        <div className="relative">
          {/* Flèche gauche */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-200 backdrop-blur-sm bg-white/90 stories-nav-button"
              aria-label="Voir les stories précédentes"
            >
              <span className="text-gray-700 text-lg font-bold">‹</span>
            </button>
          )}

          {/* Flèche droite */}
          {canScrollRight() && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-200 backdrop-blur-sm bg-white/90 stories-nav-button"
              aria-label="Voir les stories suivantes"
            >
              <span className="text-gray-700 text-lg font-bold">›</span>
            </button>
          )}

          {/* Conteneur des stories */}
          <div 
            ref={storiesContainerRef}
            className="flex gap-1 xs:gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar px-1 min-h-[80px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
          {/* Bouton "Ajouter une story" */}
          <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-shrink-0 w-10 xs:w-12 sm:w-14 text-center cursor-pointer group"
          >
            <div className="mx-auto w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-xs xs:text-sm sm:text-base text-green-600">+</span>
              </div>
            </div>
            <p className="text-[10px] mt-0.5 text-gray-600 font-medium group-hover:text-green-600">
              Ajouter
            </p>
          </div>

          {/* Stories existantes - groupées par utilisateur */}
          {getStoriesGroupedByUser().map((userGroup) => (
            <div
              key={userGroup.userId}
              onClick={() => handleStoryClick(userGroup.userId)}
              className="flex-shrink-0 w-10 xs:w-12 sm:w-14 text-center cursor-pointer group"
            >
              <div className="mx-auto w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full p-0.5 bg-gradient-to-tr from-yellow-300 via-red-400 to-pink-500 relative">
                <img
                  src={userGroup.userAvatar}
                  alt={userGroup.username}
                  className="w-full h-full rounded-full border-2 border-white object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Indicateur du nombre de stories */}
                {userGroup.stories.length > 1 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white font-bold">
                    {userGroup.stories.length}
                  </div>
                )}
              </div>
              <p className="text-[10px] mt-0.5 text-gray-800 truncate group-hover:text-gray-600">
                {userGroup.username}
              </p>
              <p className="text-[10px] text-gray-500">
                {formatTimeAgo(userGroup.stories[0].createdAt)}
              </p>
            </div>
          ))}
           </div>
         </div>
       </div>

      {/* Viewer des stories en plein écran */}
      {selectedUserStories && (
        <StoriesViewer
          stories={selectedUserStories.stories}
          initialIndex={0}
          onClose={closeStory}
          username={selectedUserStories.username}
          userAvatar={selectedUserStories.userAvatar}
        />
      )}

      {/* Modal de création de story */}
      <CreateStoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onStoryCreated={handleCreateStory}
      />
    </>
  );
}
