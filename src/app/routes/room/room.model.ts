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
  imageUrls?: string[]
  ownerId?: string;
  serviceIDs?: string[];
}
