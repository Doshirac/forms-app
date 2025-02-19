import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.css";
import { FlatDark, FlatLight } from "survey-core/themes";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { ThemeContext } from "../../context/ThemeContext";

const Run = () => {
  const { id } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const { fetchWithAuth } = useFetchWithAuth();
  const { darkTheme } = useContext(ThemeContext);

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

  if (!surveyData) {
    return <div>Loading survey...</div>;
  }

  const surveyModel = new Model(surveyData.json);

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
    </div>
  );
};

export default Run;
