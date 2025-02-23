import React, { useState, memo } from 'react';
import { CommentSection } from "react-comments-section";
import { usePolling } from '../../hooks/usePolling';

export const Comments = memo(({ surveyId, fetchWithAuth, darkTheme, t }) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await fetchWithAuth(`/api/surveys/${surveyId}/comments`);
      if (!res.ok) throw new Error(t("comments.loadingError"));
      const data = await res.json();
      setComments(data.comments || []);
      setLoadingComments(false);
    } catch (error) {
      console.error(t("comments.loadingError"), error);
      setLoadingComments(false);
    }
  };

  usePolling(fetchComments, 4000, [surveyId]);

  const handleSubmitAction = async (data) => {
    const { text, parentId } = data;
    try {
      const res = await fetchWithAuth(
        `/api/surveys/${surveyId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            parentId: parentId || null,
          }),
        }
      );
      if (!res.ok) throw new Error(t("comments.creation"));
      await fetchComments();
    } catch (error) {
      console.error(t("comments.errorCreation"), error);
    }
  };

  if (loadingComments) {
    return <div>{t("comments.loading")}</div>;
  }

  return (
    <div className={darkTheme ? "text-white" : "text-black"}>
      <CommentSection
        currentUser={{
          currentUserId: "01",
          currentUserImg: "https://ui-avatars.com/api/?name=Me",
          currentUserProfile: "",
          currentUserFullName: "My Name",
        }}
        commentData={comments}
        onSubmitAction={handleSubmitAction}
        titleStyle={darkTheme ? { color: "white" } : { color: "black" }}
        inputStyle={{ color: "black" }}
        submitBtnStyle={
          darkTheme
            ? {
                border: "none",
                backgroundColor: "rgb(234 179 8 / var(--tw-text-opacity, 1))",
              }
            : {
                border: "none",
                backgroundColor: "rgb(34 197 94 / var(--tw-text-opacity, 1))",
              }
        }
        cancelBtnStyle={
          darkTheme
            ? {
                border: "1px solid #4b5563",
                backgroundColor: "#374151",
                color: "white",
              }
            : { border: "1px solid gray", backgroundColor: "gray", color: "white" }
        }
        replyInputStyle={
          darkTheme
            ? { borderBottom: "1px solid #4b5563", color: "white" }
            : { borderBottom: "1px solid black", color: "black" }
        }
      />
    </div>
  );
});