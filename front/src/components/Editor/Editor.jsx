import React, { useEffect, useMemo, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { useTranslation } from "react-i18next";
import "survey-creator-core/survey-creator-core.css";
import "survey-core/i18n/german";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";

const Editor = ({ id }) => {
  const [creator, setCreator] = useState(null);
  const { fetchWithAuth } = useFetchWithAuth();
  const { t } = useTranslation()

  const creatorInstance = useMemo(() => {
    const options = {
      showLogicTab: true,
      showThemeTab: true,
      showTranslationTab: true
    };
    const sc = new SurveyCreator(options);
    sc.isAutoSave = true; 
    return sc;
  }, []);

  useEffect(() => {
    if (!creatorInstance) return;

    creatorInstance.saveSurveyFunc = async (saveNo, callback) => {
      try {
        const response = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            json: creatorInstance.JSON
          })
        });
        if (!response.ok) {
          throw new Error(t("surveys.failUpdate"));
        }
        callback(saveNo, true);
      } catch (error) {
        callback(saveNo, false);
      }
    };

    setCreator(creatorInstance);
  }, [creatorInstance, id]);

  useEffect(() => {
    if (!creator) return;

    (async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}`);
        if (!res.ok) {
          throw new Error(t("surveys.failEditing"));
        }
        const surveyData = await res.json();

        if (typeof surveyData.json === "object") {
          creator.JSON = surveyData.json;
        } else {
          try {
            creator.JSON = JSON.parse(surveyData.json);
          } catch (e) {
            creator.text = surveyData.json;
          }
        }
      } catch (error) {
        console.error(t("surveys.failLoading"), error);
      }
    })();
  }, [creator, id]);

  if (!creator) {
    return <div className="text-black dark:text-white font-bold text-xl">{t("editor.loading")}</div>;
  }

  return (
    <div>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
};

export default Editor;
