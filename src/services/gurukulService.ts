import apiClient from "@/apis/client";
import { VideoProps } from "@/components/cards/GurukulScreen/VideoCard";

export interface GurukulVideosPayload {
  docs: VideoProps[];
  hasNextPage: boolean;
  totalDocs?: number;
  limit?: number;
  page?: number;
  totalPages?: number;
}

/**
 * Fetches paginated and filtered video assets from the Gurukul portal.
 */
export const fetchGurukulVideosService = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<GurukulVideosPayload> => {
  const response = await apiClient.get(`/api/app/gurukul/videos`, {
    params: {
      page,
      limit,
      search: search || undefined, // Avoid sending empty search string parameters
    },
  });
  // Extract nested data payload according to standard backend response envelopes
  return response.data?.data || { docs: [], hasNextPage: false };
};