import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se da click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const changeLanguage = (lng: "es" | "en") => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-white border border-gray-300 rounded-md px-3 py-2 shadow text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex gap-2 items-center"
        aria-label={t("choose_language") || "Seleccionar idioma"}
      >
        🌐
        <span className="capitalize">{t(i18n.language === "es" ? "spanish" : "english")}</span>
        <svg className={`ml-1 h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 8 6">
          <path d="M0 0l4 6 4-6" fill="currentColor"/>
        </svg>
      </button>
      {open && (
        <div
          className="absolute left-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-50"
        >
          <button
            onClick={() => changeLanguage("es")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${i18n.language === "es" ? "font-bold text-indigo-600" : ""}`}
          >
            {t("spanish") || "Español"}
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${i18n.language === "en" ? "font-bold text-indigo-600" : ""}`}
          >
            {t("english") || "English"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;