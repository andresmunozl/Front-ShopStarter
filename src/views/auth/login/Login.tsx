import { useState } from "react";
import api from "src/utils/axios";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import { Link, useNavigate } from "react-router";
import { useAuth } from "src/context/AuthContext";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

const gradientStyle = {
  background:
    "linear-gradient(45deg, rgb(238, 119, 82,0.2), rgb(231, 60, 126,0.2), rgb(35, 166, 213,0.2), rgb(35, 213, 171,0.2))",
  backgroundSize: "400% 400%",
  animation: "gradient 15s ease infinite",
  height: "100vh",
};

const Login = () => {
  const { t } = useTranslation("loginAndRegisterTrad");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMsg(t("login.error.required"));
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/auth/login/", {
        email: cleanEmail,
        password,
      });

      const { access_token, user } = response.data;

      login(user, access_token);

      if (user.role === 'VENDEDOR') {
        navigate("/vendedor/dashboard");
      } else if (user.role === 'CLIENTE') {
        navigate("/cliente/home");
      } else {
        navigate("/");
      }

    } catch (error: any) {
      if (error.response) {
        const data = error.response.data;
        const msg =
          data?.message ||
          data?.detail ||
          (typeof data === 'string' ? data : null) ||
          t("login.error.invalid");
        setErrorMsg(msg);
      } else if (error.request) {
        setErrorMsg(t("login.error.noserver"));
      } else {
        setErrorMsg(t("login.error.unexpected"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={gradientStyle} className="relative overflow-hidden h-screen">
      <div className="flex h-full justify-center items-center px-4">
        <div className="rounded-lg shadow-2xl bg-white dark:bg-darkgray p-8 w-full md:w-[400px] border-none">
          <div className="flex flex-col gap-2 p-0 w-full">
            <div className="mx-auto">
              <FullLogo />
            </div>

            <p className="text-sm text-center text-dark my-3">{t("login.title")}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">{t("login.email.label")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.email.placeholder")}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-primary transition"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">{t("login.password.label")}</label>
                  <Link to="/auth/forgot-password" className="text-primary text-xs font-medium">
                    {t("login.forgot")}
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.password.placeholder")}
                  className="w-full border rounded-md px-3 py-2 outline-none focus:border-primary transition"
                  autoComplete="current-password"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                {t("login.remember")}
              </label>

              {errorMsg && (
                <div className={`p-3 border rounded-lg text-xs font-bold animate-fade-in ${
                  errorMsg.includes("REVISADA")
                    ? "bg-amber-50 border-amber-200 text-amber-700 shadow-sm"
                    : "bg-red-50 border-red-100 text-red-600 shadow-sm"
                }`}>
                  <div className="flex items-center gap-2">
                    <Icon icon={errorMsg.includes("REVISADA") ? "solar:clock-circle-bold" : "solar:danger-bold"} height={16} />
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white rounded-md py-2.5 font-bold hover:bg-indigo-700 transition disabled:opacity-60 shadow-md hover:shadow-lg mt-2"
              >
                {loading ? t("login.loading") : t("login.submit")}
              </button>
            </form>

            <div className="flex gap-2 text-sm font-medium mt-6 items-center justify-center">
              <p className="text-gray-500">{t("login.new")}</p>
              <Link to="/auth/register" className="text-primary font-bold hover:underline">
                {t("login.register")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;