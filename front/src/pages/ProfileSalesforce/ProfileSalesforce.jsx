import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchWithAuth } from '../../hooks/useFetchWithAuth';
import { useAuth } from '../../context/AuthContext';
import { NavBar } from '../../components/NavBar/NavBar';
import { Button } from '../../components/Button/Button';

const ProfileSalesforce = () => {
  const { t } = useTranslation();
  const { fetchWithAuth } = useFetchWithAuth();
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');

  const [message, setMessage] = useState('');
  const [accountLink, setAccountLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setAccountLink('');

    if (!email || !firstName || !lastName || !companyName) {
      setMessage(t("sales.fill"));
      return;
    }

    try {
      const response = await fetchWithAuth('/api/sales/create', {
        method: 'POST',
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          companyName,
          phone,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setAccountLink(data.accountLink);
      } else {
        setMessage(data.message || t("sales.errorCreation"));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(t("sales.errorServer"));
    }
  };

  const handleCancel = () => {
    setEmail(user?.email || '');
    setFirstName('');
    setLastName('');
    setCompanyName('');
    setPhone('');
    setMessage('');
    setAccountLink('');
  };

  return (
    <div className="flex flex-col h-[160vh] text-gray-800 dark:text-gray-200">
      <NavBar />
      <div className="flex grow items-center justify-center">
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl w-[26%] h-3/4 flex justify-center items-center shadow-md max-[768px]:w-[80%] max-[768px]:h-[60%]">
          <div className="h-[80%] w-2/3 flex flex-col justify-between items-center">
            <h2 className="text-xl font-bold mb-4">{t("sales.integrate")}</h2>
            {message && (
              <div className="bg-red-100 dark:bg-red-200 text-red-700 p-2 mb-2 rounded w-full text-center">
                {message}
              </div>
            )}
            {accountLink && (
              <div className="mb-2 w-full text-center">
                <a
                  href={accountLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 dark:text-yellow-600 underline"
                >
                  {t("sales.view")}
                </a>
              </div>
            )}
            <form
              className="m-0 w-full h-[94%] flex flex-col justify-between items-center"
              onSubmit={handleSubmit}
            >
              <div className="w-full flex flex-col items-start">
                <div className="w-full h-[82%] flex flex-col items-center">
                  <div className="w-full mb-4">
                    <label className="block mb-1 font-semibold">
                      {t("sales.email")}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        readOnly={!!user?.email}
                        className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600
                                   dark:bg-gray-700 text-gray-800 dark:text-gray-100
                                   rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                  <div className="w-full mb-4">
                    <label className="block mb-1 font-semibold">
                      {t("sales.firstName")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600
                                   dark:bg-gray-700 text-gray-800 dark:text-gray-100
                                   rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                  <div className="w-full mb-4">
                    <label className="block mb-1 font-semibold">
                      {t("sales.lastName")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600
                                   dark:bg-gray-700 text-gray-800 dark:text-gray-100
                                   rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                  <div className="w-full mb-4">
                    <label className="block mb-1 font-semibold">
                      {t("sales.company")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600
                                   dark:bg-gray-700 text-gray-800 dark:text-gray-100
                                   rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="block mb-1 font-semibold">
                      {t("sales.phone")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600
                                   dark:bg-gray-700 text-gray-800 dark:text-gray-100
                                   rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button type="submit" size="large" text={t("sales.creation")} />
              <Button
                type="button"
                text={t("login.btnCancel")}
                size="medium"
                buttonType="secondary"
                onClick={handleCancel}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSalesforce;
