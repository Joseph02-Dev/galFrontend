export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  userProfession: string;
  isOnline: boolean;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isOwnPost: boolean;
  likedBy: string[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}

export interface PostInteraction {
  postId: string;
  userId: string;
  type: 'like' | 'comment' | 'share';
  timestamp: Date;
}
