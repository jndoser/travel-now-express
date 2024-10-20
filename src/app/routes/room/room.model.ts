export interface GetRoomType {
  page: number;
  limit: number;
  searchKeywords: string | undefined;
  clerkId: string | undefined;
  status: string;
}

export interface CreateRoomType {
  title: string;
  description: string;
  address: string;
  capacity: number;
  price: number;
  imageUrls: string[];
  ownerId: string;
  serviceIds: string[];
}

export interface UpdateRoomType {
  title?: string;
  description?: string;
  address?: string;
  capacity?: number;
  price?: number;
  imageUrls?: string[];
  ownerId?: string;
  serviceIDs?: string[];
}

export interface SavedRoomType {
  roomId: string;
  clerkId: string;
}

export interface UnsavedRoomType {
  roomId: string;
  clerkId: string;
}
