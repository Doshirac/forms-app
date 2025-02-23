import React, { useEffect, useState, useContext, useRef, memo } from "react";
import { useParams } from "react-router";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.css";
import "react-comments-section/dist/index.css";
import { FlatDark, FlatLight } from "survey-core/themes";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Likes } from "../../components/Likes/Likes";
import { Comments } from "../../components/Comments/Comments";

const Run = () => {
  const { id } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const { fetchWithAuth } = useFetchWithAuth();
  const { darkTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const response = await fetchWithAuth(`/api/surveys/${id}`);
        if (!response.ok) {
          throw new Error(t("run.errorLoading"));
        }
        const data = await response.json();
        setSurveyData(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadSurvey();
  }, [id]);

  if (!surveyData) {
    return <div>{t("run.loading")}</div>;
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
      const response = await fetchWithAuth(`/api/surveys/${id}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyResult: results
        })
      });
      if (!response.ok) {
        throw new Error(t("results.errorPost"));
      }
    } catch (error) {
      console.error(t("results.errorPost"), error);
    }
  });

  return (
    <div>
      <Likes
        surveyId={id}
        fetchWithAuth={fetchWithAuth}
        darkTheme={darkTheme}
        t={t}
      />
      <Survey model={surveyModel} />
      <div className="mt-8">
        <Comments
          surveyId={id}
          fetchWithAuth={fetchWithAuth}
          darkTheme={darkTheme}
          t={t}
        />
      </div>
    </div>
  );
};

export default Run;
