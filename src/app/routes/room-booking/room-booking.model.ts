export interface CreateBookedRoomType {
  roomId: string;
  clerkId: string;
  numberOfPeople: number;
  bookedDate: Date;
}

export interface GetBookingHistoryType {
  clerkId: string;
  page: number;
  limit: number;
  searchKeywords: string | undefined;
}

export interface GetBookedInfoType {
  roomId: string;
  status: string;
  page: number;
  limit: number;
  searchKeywords: string | undefined;
}
