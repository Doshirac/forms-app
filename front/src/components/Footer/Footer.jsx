import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          © {currentYear} {t('footer.copyright')}
        </div>
        
        <nav className="flex gap-6 mt-4 md:mt-0">
          <Link 
            to="/privacy" 
            className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm"
          >
            {t('footer.privacy')}
          </Link>
          <Link 
            to="/terms" 
            className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm"
          >
            {t('footer.terms')}
          </Link>
          <a 
            href="mailto:support@example.com"
            className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 text-sm"
          >
            {t('footer.contact')}
          </a>
        </nav>
      </div>
    </footer>
  );
};
