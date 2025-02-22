import React, { useEffect, useRef, useState } from "react";
import { Model } from "survey-core";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { useTranslation } from "react-i18next";
import "tabulator-tables/dist/css/tabulator.css";
import "survey-analytics/survey.analytics.tabulator.css";

const SurveyAnalyticsTabulator = require("survey-analytics/survey.analytics.tabulator");

const Viewer = ({ id, onSurveyNameLoaded }) => {
  const visContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchWithAuth } = useFetchWithAuth();
  const { t } = useTranslation()

  useEffect(() => {
    async function loadSurveyAndResults() {
      try {
        const surveyResponse = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}`);
        if (!surveyResponse.ok) {
          throw new Error(t("surveys.failLoading"));
        }
        const surveyData = await surveyResponse.json();

        if (onSurveyNameLoaded) {
          onSurveyNameLoaded(surveyData.name);
        }

        const resultsResponse = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}/results`);
        if (!resultsResponse.ok) {
          throw new Error(t("results.failLoading"));
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
        setIsLoading(false);
      }
    }

    loadSurveyAndResults();
  }, [id, onSurveyNameLoaded]);

  if (isLoading) {
    return <div>{t("results.loading")}</div>;
  }

  return (
    <div ref={visContainerRef}>
      <div>
        <span className="text-black dark:text-white">{t("viewer.noResults")}</span>
      </div>
    </div>
  );
};

export default Viewer;
