import { useState, useEffect, useCallback } from "react";
import { Keyboard } from "react-native";
import { VideoProps } from "@/components/cards/GurukulScreen/VideoCard";
import { fetchGurukulVideosService } from "@/services/gurukulService";

export const useGurukulVideos = () => {
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Loading indicators
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce handler for search input modifications
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Unified data acquisition strategy
  const loadVideosData = useCallback(
    async (pageNumber = 1, searchStr = "", isRefresh = false) => {
      try {
        if (pageNumber === 1 && !isRefresh) setIsLoading(true);

        // Call the network abstraction service cleanly
        const payload = await fetchGurukulVideosService(pageNumber, 10, searchStr);
        const newVideos = payload?.docs || [];

        if (isRefresh || pageNumber === 1) {
          setVideos(newVideos);
        } else {
          setVideos((prev) => [...prev, ...newVideos]);
        }

        setHasMore(payload?.hasNextPage ?? false);
        setPage(pageNumber);
      } catch (error) {
        console.error("Failed to load Gurukul video matrix:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsFetchingMore(false);
      }
    },
    []
  );

  // Sync effect coordinates lifecycle with structural filters
  useEffect(() => {
    loadVideosData(1, debouncedSearch);
  }, [debouncedSearch, loadVideosData]);

  // Clean layout context on component destruction
  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  // UI Event Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadVideosData(1, debouncedSearch, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore && !isLoading) {
      setIsFetchingMore(true);
      loadVideosData(page + 1, debouncedSearch);
    }
  };

  const handleVideoPress = (video: VideoProps) => {
    // Operational routing target for video playback viewports
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