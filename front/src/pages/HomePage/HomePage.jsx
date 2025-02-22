import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button/Button";

export const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4 
                             bg-clip-text text-transparent 
                             bg-gradient-to-r from-green-600 to-blue-600
                             dark:from-yellow-400 dark:to-red-500
                             max-[768px]:text-4xl">
                    {t("home.title")}
                </h1>
                <h2 className="text-2xl mb-6 text-gray-700 dark:text-gray-300
                             max-[768px]:text-xl">
                    {t("home.subtitle")}
                </h2>
                <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600 dark:text-gray-400
                             max-[768px]:text-base">
                    {t("home.description")}
                </p>
                {!isAuthenticated && (
                    <div className="flex gap-4 justify-center mt-8">
                        <Button
                            buttonType="primary"
                            size="medium"
                            onClick={() => navigate('/login')}
                            text={t("home.getStarted")}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

