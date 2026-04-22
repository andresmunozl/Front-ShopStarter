// name=src/views/LandingPage/Home.tsx

import Footer from "./Footer";
import TopBanner from "./TopBanner";
import { Link } from "react-router";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useTranslation } from "react-i18next";


const AnimatedCounter = ({
  targetNumber,
  label,
}: {
  targetNumber: number;
  label: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (targetNumber === 0) return;
    let start = 0;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / targetNumber));
    const increment = targetNumber > 100 ? Math.ceil(targetNumber / 50) : 1;

    const timer = setInterval(() => {
      start += increment;
      if (start > targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetNumber]);

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white">
        {count > 0 ? "+" : ""}
        {count}
      </span>
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({ vendors: 580, products: 1200 });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const prodRes = await api.get("products/catalog/");
        const prodData = prodRes.data;
        const totalProds = Array.isArray(prodData)
          ? prodData.length
          : prodData?.results && Array.isArray(prodData.results)
          ? prodData.results.length
          : prodData?.count || 0;

        const usersRes = await api.get("users/list/");
        const userData = usersRes.data;
        const vendors = Array.isArray(userData)
          ? userData.filter((u: any) => u.role === "VENDEDOR").length
          : 0;

        setMetrics({ vendors, products: totalProds });
      } catch (err) {
        console.error("No metrics (silent)", err);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full opacity-30 pointer-events-none -z-10 dark:opacity-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Main Text */}
        <div className="text-center lg:text-left z-10" data-aos="fade-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold text-sm shadow-sm hover:shadow-md transition">
            <Icon icon="solar:rocket-bold-duotone" className="text-lg" />
            <span>{t("future_of_local_commerce")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-6 leading-[1.1]">
            {t("empower_your")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              {t("local_business")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            {t("connects_buyers")}
            <br />
            {t("digitize_sales")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link
              to="/auth/register"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 overflow-hidden"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative flex items-center gap-2">
                {t("start_free_now")}
                <Icon
                  icon="solar:arrow-right-linear"
                  className="text-xl group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex flex-row items-center justify-center gap-2 px-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition shadow-sm"
            >
              <Icon icon="solar:play-circle-line-duotone" className="text-2xl text-indigo-500" />
              {t("how_it_works")}
            </a>
          </div>
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar 1" />
              <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Avatar 2" />
              <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 object-cover" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80" alt="Avatar 3" />
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                {metrics.vendors > 0 ? `+${metrics.vendors}` : "..."}
              </div>
            </div>
            <div>{t("vendors_registered")}</div>
          </div>
        </div>
        {/* Dynamic Image */}
        <div className="relative relative-group" data-aos="zoom-in" data-aos-delay="200">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <img
            src="https://images.unsplash.com/photo-1555529733-0e670560f8e1?q=80&w=1200&auto=format&fit=crop"
            alt="Comercio local moderno"
            className="relative rounded-[2rem] shadow-2xl w-full h-auto object-cover border-8 border-white/50 dark:border-gray-800/50 backdrop-blur-md transform transition-transform hover:scale-[1.02] duration-500"
            loading="eager"
          />
          <div className="absolute -top-6 -right-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 animate-bounce" style={{ animationDuration: "3s" }}>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-xl text-green-600 dark:text-green-400">
                <Icon icon="solar:box-minimalistic-bold-duotone" className="text-2xl" />
              </div>
              <div>
                <AnimatedCounter targetNumber={metrics.products} label={t("active_products")} />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -left-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 transform transition hover:-translate-y-2 cursor-default">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full text-purple-600 dark:text-purple-400">
                <Icon icon="solar:shop-bold-duotone" className="text-2xl" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{t("your_digital_store")}</div>
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400 truncate w-32">shopstarter.com/tu-link</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const { t } = useTranslation();
  const features = [
    { title: t("interactive_catalog"), desc: t("interactive_catalog_desc"), icon: "solar:bag-3-bold-duotone", color: "from-blue-400 to-blue-600" },
    { title: t("geo_map"), desc: t("geo_map_desc"), icon: "solar:map-point-bold-duotone", color: "from-purple-400 to-purple-600" },
    { title: t("order_management"), desc: t("order_management_desc"), icon: "solar:box-minimalistic-bold-duotone", color: "from-pink-400 to-pink-600" },
    { title: t("simple_stats"), desc: t("simple_stats_desc"), icon: "solar:chart-square-bold-duotone", color: "from-indigo-400 to-indigo-600" },
    { title: t("cloud_scalability"), desc: t("cloud_scalability_desc"), icon: "solar:server-square-bold-duotone", color: "from-teal-400 to-teal-600" },
    { title: t("modern_payment"), desc: t("modern_payment_desc"), icon: "solar:card-send-bold-duotone", color: "from-orange-400 to-orange-600" },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20" data-aos="fade-up">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-extrabold tracking-widest uppercase text-sm mb-2 block">
            {t("boost_your_sales")}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
            {t("all_control_in_hand")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition duration-300 rounded-3xl pointer-events-none"></div>
              <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg text-white transform group-hover:rotate-12 transition duration-300`}>
                <Icon icon={feature.icon} className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();
  return (
    <section id="how-it-works" className="py-32 relative bg-white dark:bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="text-center mb-20" data-aos="zoom-in">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            {t("build_showcase_in")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              {t("minutes")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("process_simplified")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] p-8 border border-indigo-100 dark:border-indigo-800" data-aos="fade-right">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition duration-500 transform group-hover:scale-110">
              <Icon icon="solar:user-circle-bold" className="text-9xl text-indigo-500" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="inline-flex font-mono items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg mb-4 shadow-lg shadow-indigo-600/40">1</span>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{t("create_account")}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-sm leading-relaxed">
                  {t("register_vendor")}
                </p>
              </div>
              <div className="mt-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="h-3 w-1/3 bg-indigo-200 dark:bg-indigo-900/50 rounded-full mb-3"></div>
                <div className="h-3 w-2/3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 relative group overflow-hidden bg-purple-50 dark:bg-purple-900/20 rounded-[2rem] p-8 border border-purple-100 dark:border-purple-800" data-aos="fade-left" data-aos-delay="100">
            <div className="relative z-10">
              <span className="inline-flex font-mono items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg mb-4 shadow-lg shadow-purple-600/40">2</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("add_products")}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t("add_products_desc")}</p>
            </div>
          </div>
          <div className="md:col-span-1 relative group overflow-hidden bg-pink-50 dark:bg-pink-900/20 rounded-[2rem] p-8 border border-pink-100 dark:border-pink-800" data-aos="fade-up" data-aos-delay="200">
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
              <span className="inline-flex font-mono items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-lg mb-4 shadow-lg shadow-pink-500/40">3</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("appear_on_map")}</h3>
              <Icon icon="solar:point-on-map-bold-duotone" className="text-5xl text-pink-500 mt-2" />
            </div>
          </div>
          <div className="md:col-span-1 relative group overflow-hidden bg-green-50 dark:bg-green-900/20 rounded-[2rem] p-8 border border-green-100 dark:border-green-800" data-aos="zoom-in" data-aos-delay="300">
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
              <span className="inline-flex font-mono items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold text-lg mb-4 shadow-lg shadow-green-500/40">4</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("close_sale")}</h3>
              <Icon icon="solar:hand-money-bold-duotone" className="text-5xl text-green-500 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 px-4 relative bg-white dark:bg-darkgray">
      <div className="max-w-6xl mx-auto rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden bg-gray-900" data-aos="fade-up">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover opacity-60 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-[100px] opacity-40 animate-spin-slow"></div>
        </div>
        <h2 className="text-5xl md:text-6xl font-black mb-8 relative z-10 leading-tight">
          {t("make_business_visible")}
        </h2>
        <p className="text-xl text-gray-300 font-medium mb-12 max-w-2xl mx-auto relative z-10">
          {t("stop_local_only")}
        </p>
        <div className="relative z-10 inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full blur opacity-70 animate-pulse"></div>
          <Link
            to="/auth/register"
            className="relative inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform duration-300"
          >
            {t("create_store_free")}
            <Icon icon="solar:shop-2-bold-duotone" className="text-2xl text-indigo-600" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-darkgray font-sans text-gray-900 selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-200 overflow-x-hidden">
      <TopBanner />
      {/* Idioma button at top-right */}
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
      </header>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;