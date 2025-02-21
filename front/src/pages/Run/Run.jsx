import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.css";
import "react-comments-section/dist/index.css";
import { CommentSection } from "react-comments-section";
import { FlatDark, FlatLight } from "survey-core/themes";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import usePolling from "../../hooks/usePolling";

const Run = () => {
  const { id } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { fetchWithAuth } = useFetchWithAuth();
  const { darkTheme } = useContext(ThemeContext);
  const { i18n } = useTranslation();

  useEffect(() => {
    async function loadSurvey() {
      try {
        const response = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}`);
        if (!response.ok) throw new Error("Failed to load survey");
        const data = await response.json();
        setSurveyData(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadSurvey();
  }, [id]);

  const fetchLikes = async () => {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}/likes`);
      if (!response.ok) throw new Error("Failed to load likes");
      const data = await response.json();
      setTotalLikes(data.totalLikes);
      setHasLiked(data.hasLiked);
    } catch (error) {
      console.error("Error loading likes:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}/comments`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data.comments || []);
      setLoadingComments(false);
    } catch (error) {
      console.error("Comments error:", error);
      setLoadingComments(false);
    }
  };

  usePolling(fetchLikes, 3000);
  usePolling(fetchComments, 4000);

  const handleLikeClick = async () => {
    if (isLikeLoading) return;
    
    setIsLikeLoading(true);
    try {
      const method = hasLiked ? 'DELETE' : 'POST';
      const endpoint = `http://localhost:5000/api/surveys/${id}/like`;
      
      const response = await fetchWithAuth(endpoint, { method });
      if (!response.ok) throw new Error("Failed to update like");
      
      setHasLiked(!hasLiked);
      setTotalLikes(prev => hasLiked ? prev - 1 : prev + 1);
      
      await fetchLikes();
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  async function handleSubmitAction(data) {
    const { text, parentId } = data;

    try {
      const res = await fetchWithAuth(
        `http://localhost:5000/api/surveys/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            parentId: parentId || null
          })
        }
      );
      if (!res.ok) throw new Error("Failed to create comment");
      
      await fetchComments();
    } catch (error) {
      console.error("Submit comment error:", error);
    }
  }

  if (!surveyData) {
    return <div>Loading survey...</div>;
  }

  const surveyModel = new Model(surveyData.json);
  surveyModel.locale = i18n.language;

  if (darkTheme) {
    surveyModel.applyTheme(FlatDark);
  } else {
    surveyModel.applyTheme(FlatLight);
  }

  surveyModel.onComplete.add(async (sender) => {
    const results = sender.data;
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyResult: results
        })
      });
      if (!response.ok) throw new Error("Failed to post results");
      console.log("Survey results posted successfully");
    } catch (error) {
      console.error("Error posting results:", error);
    }
  });

  return (
    <div>
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
          <Heart
            className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`}
          />
          <span>{totalLikes}</span>
        </button>
      </div>
      <Survey model={surveyModel} />
      <div className="mt-8">
        {loadingComments ? (
          <div>Loading comments...</div>
        ) : (
          <div className={darkTheme ? "text-white" : "text-black"}>
            <CommentSection
              currentUser={{
                currentUserId: "01",
                currentUserImg: "https://ui-avatars.com/api/?name=Me",
                currentUserProfile: "",
                currentUserFullName: "My Name"
              }}
              commentData={comments}
              onSubmitAction={handleSubmitAction}
              titleStyle={
                darkTheme 
                ? { color: "white" } 
                : { color: "black" }}
              inputStyle={{color: "black" }}
              submitBtnStyle={
                darkTheme
                ? { border: "none", backgroundColor: "rgb(234 179 8 / var(--tw-text-opacity, 1))" }
                : { border: "none", backgroundColor: "rgb(34 197 94 / var(--tw-text-opacity, 1))" }
              }
              cancelBtnStyle={
                darkTheme
                ? { border: "1px solid #4b5563", backgroundColor: "#374151", color: "white" }
                : { border: "1px solid gray", backgroundColor: "gray", color: "white" }
              }
              replyInputStyle={
                darkTheme 
                ? { borderBottom: "1px solid #4b5563", color: "white" }
                : { borderBottom: "1px solid black", color: "black" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Run;