import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { Button } from "../../components/Button/Button";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { ReactComponent as PlayIcon } from "../../assets/images/play.svg";
import { ReactComponent as EditIcon } from "../../assets/images/edit.svg";
import { ReactComponent as DeleteIcon } from "../../assets/images/delete.svg";
import { Typography } from "@mui/material";

const DashboardPage = () => {
  const { fetchWithAuth } = useFetchWithAuth();
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [surveys, setSurveys] = useState([]);
  const [popularSurveys, setPopularSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth("http://localhost:5000/api/surveys");
        if (!response.ok) {
          throw new Error(t("dashboard.failLoadingLatest"));
        }
        const surveysData = await response.json();

        const surveysWithResponses = await Promise.all(
          surveysData.map(async (survey) => {
            if (isAdmin || survey.created_by === survey.user_id) {
              try {
                const res = await fetchWithAuth(`http://localhost:5000/api/surveys/${survey.id}/results`);
                if (res.ok) {
                  const results = await res.json();
                  return { ...survey, responsesCount: results.length };
                }
              } catch (error) {
                console.error(`Skipping responses for survey ${survey.id} - no access`);
              }
            }
            return { ...survey, responsesCount: 0 };
          })
        );

        setSurveys(surveysWithResponses);

        const topPopular = [...surveysWithResponses]
          .filter(survey => isAdmin || survey.created_by === survey.user_id)
          .sort((a, b) => b.responsesCount - (a.responsesCount || 0))
          .slice(0, 5);
        setPopularSurveys(topPopular);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [t, isAdmin]);

  const handleRun = (id) => {
    navigate(`/dashboard/run/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const handleRemove = async (id) => {
    if (window.confirm(t("dashboard.confirmDelete"))) {
      try {
        const response = await fetchWithAuth(`http://localhost:5000/api/surveys/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(t("surveys.failDeletion"));
        }
        setSurveys((prev) => prev.filter((survey) => survey.id !== id));
        setPopularSurveys((prev) => prev.filter((survey) => survey.id !== id));
      } catch (error) {
        console.error(t("surveys.failDeletion"), error);
      }
    }
  };

  if (loading) {
    return <div>{t("dashboard.loading")}</div>;
  }

  return (
    <div className="p-4">
      <Typography variant="h4" className="text-2xl font-bold mb-4 text-green-500 dark:text-yellow-500">
        {t("dashboard.title")}
      </Typography>
      <section className="mb-8">
        <Typography variant="h5" className="text-xl font-semibold mb-2 text-green-700 dark:text-yellow-500">
          {t("dashboard.latestTemplates")}
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {surveys.map((template) => (
            <div key={template.id} className="border p-4 rounded-md shadow-md">
              <h3 className="font-bold text-lg text-dark dark:text-white">{template.name}</h3>
              <p className="text-sm text-gray-600">
                {template.description || t("dashboard.noDescription")}
              </p>
              <p className="text-xs text-gray-500">
                {t("dashboard.author")}: {template.user_name || template.created_by}
              </p>
              {(isAdmin || template.created_by === template.user_id) && (
                <p className="text-xs text-gray-500">
                  {t("dashboard.responses")}: {template.responsesCount}
                </p>
              )}
              <div className="mt-2 flex gap-2">
                <Button
                  buttonType="primary"
                  size="small"
                  onClick={() => handleRun(template.id)}
                  text={<PlayIcon className="w-1/2 h-1/2 m-auto" />}
                />
                {(isAdmin || template.created_by === template.user_id) && (
                  <>
                    <Button
                      buttonType="primary"
                      size="small"
                      onClick={() => handleEdit(template.id)}
                      text={<EditIcon className="w-1/2 h-1/2 m-auto" />}
                    />
                    <Button
                      onClick={() => handleRemove(template.id)}
                      text={<DeleteIcon className="w-1/2 h-1/2 m-auto" />}
                      buttonType="tertiary"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <Typography variant="h5" className="text-xl font-bold mb-2 text-green-500 dark:text-yellow-500">
          {t("dashboard.topPopularTemplates")}
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {popularSurveys.map((template, index) => (
            <div key={template.id} className="border p-4 rounded-md shadow-md flex flex-col justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {t("dashboard.rank")}: {index + 1}
                </p>
                <h3 className="font-bold text-lg">{template.name}</h3>
                <p className="text-sm text-gray-600">
                  {template.description || t("dashboard.noDescription")}
                </p>
                <p className="text-xs text-gray-500">
                  {t("dashboard.responses")}: {template.responsesCount}
                </p>
                <p className="text-xs text-gray-500">
                  {t("dashboard.author")}: {template.user_name || template.created_by}
                </p>
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  buttonType="primary"
                  size="small"
                  onClick={() => handleRun(template.id)}
                  text={<PlayIcon className="w-1/2 h-1/2 m-auto" />}
                />
                {(isAdmin || template.created_by === template.user_id) && (
                  <>
                    <Button
                      buttonType="primary"
                      size="small"
                      onClick={() => handleEdit(template.id)}
                      text={<EditIcon className="w-1/2 h-1/2 m-auto" />}
                    />
                    <Button
                      onClick={() => handleRemove(template.id)}
                      text={<DeleteIcon className="w-1/2 h-1/2 m-auto" />}
                      buttonType="tertiary"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;