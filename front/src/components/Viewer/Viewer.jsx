import React, { useEffect, useRef, useState } from "react";
import { Model } from "survey-core";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import "tabulator-tables/dist/css/tabulator.css";
import "survey-analytics/survey.analytics.tabulator.css";

const SurveyAnalyticsTabulator = require("survey-analytics/survey.analytics.tabulator");

const Viewer = ({ id, onSurveyNameLoaded }) => {
  const visContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
    const { fetchWithAuth } = useFetchWithAuth();

  useEffect(() => {
    async function loadSurveyAndResults() {
      try {
        const surveyResponse = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}`);
        if (!surveyResponse.ok) {
          throw new Error("Failed to load survey");
        }
        const surveyData = await surveyResponse.json();

        if (onSurveyNameLoaded) {
          onSurveyNameLoaded(surveyData.name);
        }

        const resultsResponse = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}/results`);
        if (!resultsResponse.ok) {
          throw new Error("Failed to load results");
        }
        const resultsData = await resultsResponse.json();

        if (resultsData.length > 0 && visContainerRef.current) {
          const processedData = resultsData.map((item) =>
            typeof item.data === "string" ? JSON.parse(item.data) : item.data
          );
          const surveyModel = new Model(surveyData.json);

          visContainerRef.current.innerHTML = "";
          const analytics = new SurveyAnalyticsTabulator.Tabulator(
            surveyModel,
            processedData
          );
          analytics.render(visContainerRef.current);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Viewer load error:", error);
        setIsLoading(false);
      }
    }

    loadSurveyAndResults();
  }, [id, onSurveyNameLoaded]);

  if (isLoading) {
    return <div>Loading results...</div>;
  }

  return (
    <div className="sjs-results-content" ref={visContainerRef}>
      <div className="sjs-results-placeholder">
        <span>This survey doesn't have any answers yet</span>
      </div>
    </div>
  );
};

export default Viewer;
