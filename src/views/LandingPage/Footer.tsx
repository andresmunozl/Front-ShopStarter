import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; 

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white/80 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src="/logo.jpg"
              alt={t("brandFooter")}
              className="h-9 w-auto mr-3 rounded-lg shadow"
              onError={e => ((e.target as HTMLImageElement).src = "/fallback-logo.png")}
            />
            <span className="text-xl font-black text-indigo-700 dark:text-indigo-400 tracking-tighter">
              {t("brandFooter")}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-300 text-sm">{t("footerDescription")}</p>
        </div>
        {/* Links section */}
        <div className="flex flex-col md:flex-row md:justify-between items-center border-t pt-6 border-gray-200 dark:border-gray-800">
          <div className="flex space-x-6 mb-3 md:mb-0">
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition">{t("about")}</Link>
            <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition">{t("contact")}</Link>
            <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition">{t("terms")}</Link>
            <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition">{t("privacy")}</Link>
          </div>
          <div className="text-gray-400 dark:text-gray-400 text-xs text-center md:text-right mt-2 md:mt-0">
            <div>
              &copy; 2026 {t("brandFooter")}. {t("copyright")}
            </div>
            <div>
              {t("craftedWith")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;