import { useState, useCallback, useEffect } from "react";
import { fetchEmployeeDirectory } from "@/services/directoryService";
import { DirectoryEmployee } from "@/components/cards/DirectoryScreen/DirectoryCard";
import { Keyboard } from "react-native";

export const useDirectory = () => {
  const [employees, setEmployees] = useState<DirectoryEmployee[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadDirectory = useCallback(async (pageNum = 1, search = "") => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      const data = await fetchEmployeeDirectory({ page: pageNum, search });

      if (pageNum === 1) {
        // If it's the first page (or a new search), replace the list
        setEmployees(data.employees);
      } else {
        // If it's a subsequent page, append to the existing list
        setEmployees((prev) => [...prev, ...data.employees]);
      }

      setTotalPages(data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch directory:", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  // ── DEBOUNCED SEARCH EFFECT ──
  // Automatically fetches data when the user types, but waits 500ms after they stop typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDirectory(1, searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadDirectory]);

  // ── PAGINATION HANDLER ──
  const loadMore = () => {
    // Only load more if we aren't currently loading and we haven't reached the last page
    if (!isFetchingMore && !isLoading && page < totalPages) {
      loadDirectory(page + 1, searchQuery);
    }
  };

  // ── PULL-TO-REFRESH HANDLER ──
  const handleRefresh = () => {
    loadDirectory(1, searchQuery);
  };

  return {
    state: { employees, isLoading, isFetchingMore, searchQuery },
    actions: { setSearchQuery, loadMore, handleRefresh },
  };
};
