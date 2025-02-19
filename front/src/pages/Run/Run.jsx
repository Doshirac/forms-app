import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Model, StylesManager } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.css";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";

StylesManager.applyTheme("defaultV2");

const Run = () => {
  const { id } = useParams();
  const [surveyData, setSurveyData] = useState(null);
    const { fetchWithAuth } = useFetchWithAuth();

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
      <h1>{surveyData.name}</h1>
      <Survey model={surveyModel} />
    </div>
  );
};

export default Run;
