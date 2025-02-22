import React, { useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import Viewer from "../../components/Viewer/Viewer";

const Results = () => {
  const { id } = useParams();
  const { t } = useTranslation()
  const [surveyName, setSurveyName] = useState("");

  return (
    <>
      <h1 className="text-black dark:text-white text-xl font-bold">
        {surveyName 
          ? `'${surveyName}' ${t("results.output")}` 
          : t("results.loading")
        }
      </h1>
      <div>
        <Viewer id={id} onSurveyNameLoaded={setSurveyName} />
      </div>
    </>
  );
};

export default Results;
