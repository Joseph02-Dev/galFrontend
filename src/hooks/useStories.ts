import { useState } from 'react';
import type { Story } from '../types/Story';

export function useStories() {
  // À remplacer par un fetch backend
  const [stories, setStories] = useState<Story[]>([]);

  const addStory = (partialStory: Partial<Story>) => {
    // À remplacer par un POST backend
    // setStories([story, ...stories]);
  };

  // Fonction pour obtenir les stories d'un utilisateur spécifique
  const getStoriesByUser = (userId: string) => {
    return stories.filter(story => story.userId === userId);
  };

  // Fonction pour obtenir les stories groupées par utilisateur
  const getStoriesGroupedByUser = () => {
    const grouped = stories.reduce((acc, story) => {
      if (!acc[story.userId]) {
        acc[story.userId] = {
          userId: story.userId,
          username: story.username,
          userAvatar: story.userAvatar,
          stories: []
        };
      }
      acc[story.userId].stories.push(story);
      return acc;
    }, {} as Record<string, { userId: string; username: string; userAvatar: string; stories: Story[] }>);

    // Trier les stories de chaque utilisateur par date de création
    Object.values(grouped).forEach(userStories => {
      userStories.stories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });

    return Object.values(grouped);
  };

  return {
    stories,
    addStory,
    getStoriesByUser,
    getStoriesGroupedByUser,
  };
}
