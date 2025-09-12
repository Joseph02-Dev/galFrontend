import { useState } from 'react';
import type { Story } from '../types/Story';
import { mockStories } from '../data/stories';

export function useStories() {
  const [stories, setStories] = useState<Story[]>(mockStories);

  const addStory = (partialStory: Partial<Story>) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const story: Story = {
      id: Date.now().toString(),
      userId: user?.id || partialStory.userId || "1",
      username: user ? `${user.firstName} ${user.lastName}` : partialStory.username || "Utilisateur",
      userAvatar: user?.profileImage || partialStory.userAvatar || "https://i.pravatar.cc/150?img=3",
      mediaUrl: partialStory.mediaUrl || "",
      mediaType: partialStory.mediaType || "image",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isOwnStory: true,
    };
    setStories([story, ...stories]);
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
