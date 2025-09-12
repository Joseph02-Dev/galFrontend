export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: Date;
  expiresAt: Date;
  isViewed?: boolean;
  isOwnStory?: boolean;
}

export interface StoryViewer {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  viewedAt: Date;
}

export interface StoryViewer {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  viewedAt: Date;
}
