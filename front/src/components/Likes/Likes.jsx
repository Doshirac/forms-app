import React, { useState, memo } from 'react';
import { Heart } from 'lucide-react';
import { usePolling } from "../../hooks/usePolling"

export const Likes = memo(({ surveyId, fetchWithAuth, darkTheme, t }) => {
  const [totalLikes, setTotalLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const fetchLikes = async () => {
    try {
      const response = await fetchWithAuth(`/api/surveys/${surveyId}/likes`);
      if (!response.ok) throw new Error(t("likes.loadingError"));
      const data = await response.json();
      setTotalLikes(data.totalLikes);
      setHasLiked(data.hasLiked);
    } catch (error) {
      console.error(t("likes.loadingError"), error);
    }
  };

  usePolling(fetchLikes, 3000, [surveyId]);

  const handleLikeClick = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      const method = hasLiked ? "DELETE" : "POST";
      const endpoint = `/api/surveys/${surveyId}/like`;
      const response = await fetchWithAuth(endpoint, { method });
      if (!response.ok) throw new Error(t("likes.update"));
      setHasLiked(!hasLiked);
      setTotalLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
      await fetchLikes();
    } catch (error) {
      console.error(t("likes.update"), error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={handleLikeClick}
        disabled={isLikeLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          darkTheme
            ? hasLiked
              ? "bg-yellow-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            : hasLiked
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
        <span>{totalLikes}</span>
      </button>
    </div>
  );
});