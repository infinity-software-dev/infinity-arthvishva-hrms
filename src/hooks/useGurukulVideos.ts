import { useState, useEffect, useCallback } from "react";
import apiClient from "@/apis/client";
import { VideoProps } from "@/components/cards/GurukulScreen/VideoCard";

export const useGurukulVideos = () => {
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch videos function
  const fetchVideos = useCallback(
    async (pageNumber = 1, searchStr = "", isRefresh = false) => {
      try {
        if (pageNumber === 1 && !isRefresh) setIsLoading(true);

        const response = await apiClient.get(
          `/api/v1/gurukul/videos?page=${pageNumber}&limit=10&search=${searchStr}`,
        );

        const payload = response.data?.data;
        const newVideos = payload?.docs || [];

        if (isRefresh || pageNumber === 1) {
          setVideos(newVideos);
        } else {
          setVideos((prev) => [...prev, ...newVideos]);
        }

        setHasMore(payload?.hasNextPage ?? false);
        setPage(pageNumber);
      } catch (error) {
        console.error("Failed to fetch Gurukul videos:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsFetchingMore(false);
      }
    },
    [],
  );

  // Trigger fetch when debounced search changes
  useEffect(() => {
    fetchVideos(1, debouncedSearch);
  }, [debouncedSearch, fetchVideos]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchVideos(1, debouncedSearch, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore && !isLoading) {
      setIsFetchingMore(true);
      fetchVideos(page + 1, debouncedSearch);
    }
  };

  const handleVideoPress = (video: VideoProps) => {
    // Navigate to your video player screen here in the future
    console.log("Play video:", video.title);
  };

  return {
    state: {
      videos,
      page,
      isLoading,
      isRefreshing,
      isFetchingMore,
      searchQuery,
    },
    actions: {
      setSearchQuery,
      handleRefresh,
      handleLoadMore,
      handleVideoPress,
    },
  };
};
