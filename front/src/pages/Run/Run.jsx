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

const Run = () => {
  const { id } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const { fetchWithAuth } = useFetchWithAuth();
  const { darkTheme } = useContext(ThemeContext);
  const { i18n } = useTranslation();

  useEffect(() => {
    async function loadSurvey() {
      try {
        const response = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}`);
        if (!response.ok) {
          throw new Error("Failed to load survey");
        }
        const data = await response.json();
        console.log("Survey data loaded:", data);
        setSurveyData(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadSurvey();
  }, [id]);

  async function loadComments() {
    try {
      setLoadingComments(true);
      const res = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}/comments`);
      if (!res.ok) {
        throw new Error("Failed to load comments");
      }
      const data = await res.json();
      setComments(data.comments || []);
      setLoadingComments(false);
    } catch (error) {
      console.error("Comments error:", error);
      setLoadingComments(false);
    }
  }
  useEffect(() => {
    loadComments();
  }, [id]);

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
      if (!res.ok) {
        throw new Error("Failed to create comment");
      }
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]); 
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
      if (!response.ok) {
        throw new Error("Failed to post results");
      }
      console.log("Survey results posted successfully");
    } catch (error) {
      console.error("Error posting results:", error);
    }
  });

  return (
    <div>
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
