export interface CreateFeedbackType {
  roomId: string;
  clerkId: string;
  rating: number;
  comment: string;
}

export interface GetFeedbacksByRoomType {
  page: number;
  limit: number;
  roomId: string;
}
