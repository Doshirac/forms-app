import React, { useState } from "react";
import { useParams } from "react-router";
import Viewer from "../../components/Viewer/Viewer";

const Results = () => {
  const { id } = useParams();
  const [surveyName, setSurveyName] = useState("");

  return (
    <>
      <h1>
        {surveyName 
          ? `'${surveyName}' results` 
          : "Loading results..."
        }
      </h1>
      <div className="sjs-results-container">
        <Viewer id={id} onSurveyNameLoaded={setSurveyName} />
      </div>
    </>
  );
};

export default Results;
