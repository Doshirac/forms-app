import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { Button } from "../../components/Button/Button";

const Surveys = () => {
  const { fetchWithAuth } = useFetchWithAuth();
  const [surveys, setSurveys] = useState([]);
  const [status, setStatus] = useState("idle");

  async function loadSurveys() {
    try {
      setStatus("loading");
      const response = await fetchWithAuth("http://localhost:5000/api/surveys");
      if (!response.ok) throw new Error("Failed to load surveys");

      const data = await response.json();
      setSurveys(data);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  async function addSurvey() {
    try {
      const response = await fetchWithAuth("http://localhost:5000/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "New Survey",
          json: "{}"
        })
      });
      if (!response.ok) throw new Error("Failed to create survey");

      await loadSurveys();
    } catch (error) {
      console.error("Add survey error:", error);
    }
  }

  async function removeSurvey(id) {
    try {
      const response = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to remove survey");
      setSurveys((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Remove survey error:", error);
    }
  }

  useEffect(() => {
    if (status === "idle") {
      loadSurveys();
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading surveys...</div>;
  }
  if (status === "error") {
    return <div>Error loading surveys.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-200 p-4">
      <div className="w-full max-w-4xl">
        <table className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-900">
            <tr>
              <th className="p-4 text-left">Survey Name</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr 
                key={survey.id} 
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="p-4">{survey.name}</td>
                <td className="p-4 flex gap-4">
                  <Link to={`run/${survey.id}`}>
                    <Button 
                      size="medium" 
                      buttonType="primary" 
                      text="Run" 
                    />
                  </Link>
                  <Link to={`edit/${survey.id}`}>
                    <Button 
                      size="medium" 
                      buttonType="primary" 
                      text="Edit" 
                    />
                  </Link>
                  <Link to={`results/${survey.id}`}>
                    <Button 
                      size="medium" 
                      buttonType="primary" 
                      text="Results" 
                    />
                  </Link>
                  <Button
                    size="medium"
                    buttonType="tertiary"
                    text="Remove"
                    onClick={() => removeSurvey(survey.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <Button
            size="medium"
            buttonType="secondary"
            onClick={addSurvey}
            text="Add Survey"
          />
        </div>
      </div>
    </div>
  );
};

export default Surveys;
