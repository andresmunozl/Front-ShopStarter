import React from 'react';
import Footer from './Footer';
import TopBanner from './TopBanner';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}
interface Stat {
  value: string;
  label: string;
}

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-indigo-600 tracking-tight">shop_starter</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition">{t("navbarHome")}</a>
            <a href="/about" className="text-indigo-600 font-medium transition">{t("navbarAbout")}</a>
            <a href="#team" className="text-gray-600 hover:text-indigo-600 font-medium transition">{t("navbarTeam")}</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 font-medium transition">{t("navbarContact")}</a>
          </div>
          <div>
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-md">
              {t("navbarStartNow")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-end mb-8"><LanguageSelector /></div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 whitespace-pre-line">
          {t("heroTitle")}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t("heroSubtitle")}
        </p>
      </div>
    </section>
  );
};

const Mission = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("missionTitle")}</h2>
          <p className="text-gray-600 text-lg mb-6">{t("missionParagraph1")}</p>
          <p className="text-gray-600 text-lg mb-6">{t("missionParagraph2")}</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">{t("missionOpenSource")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">{t("missionCommunity")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">{t("missionSupport")}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
            <span className="text-6xl">🚀</span>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-indigo-600">{t("missionFounded")}</div>
            <div className="text-gray-600 text-sm">{t("missionFoundedLabel")}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const { t } = useTranslation();
  const stats: Stat[] = [
    { value: '10,000+', label: t('statsDownloads') },
    { value: '500+', label: t('statsStores') },
    { value: '98%', label: t('statsSatisfaction') },
    { value: '24/7', label: t('statsSupport') },
  ];
  return (
    <section className="py-20 bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-indigo-200 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const { t } = useTranslation();
  const team: TeamMember[] = [
    {
      name: t("team_0_name"),
      role: t("team_0_role"),
      image: 'https://i.pravatar.cc/150?img=1',
      bio: t("team_0_bio")
    },
    {
      name: t("team_1_name"),
      role: t("team_1_role"),
      image: 'https://i.pravatar.cc/150?img=11',
      bio: t("team_1_bio")
    },
    {
      name: t("team_2_name"),
      role: t("team_2_role"),
      image: 'https://i.pravatar.cc/150?img=5',
      bio: t("team_2_bio")
    },
    {
      name: t("team_3_name"),
      role: t("team_3_role"),
      image: 'https://i.pravatar.cc/150?img=13',
      bio: t("team_3_bio")
    },
  ];
  return (
    <section id="team" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("teamTitle")}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t("teamSubtitle")}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <div key={index} className="text-center group">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-indigo-100 group-hover:border-indigo-600 transition">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
            <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
            <p className="text-gray-600 text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Timeline = () => {
  const { t } = useTranslation();
  const events = [
    {
      year: t("event_0_year"),
      title: t("event_0_title"),
      desc: t("event_0_desc")
    },
    {
      year: t("event_1_year"),
      title: t("event_1_title"),
      desc: t("event_1_desc")
    },
    {
      year: t("event_2_year"),
      title: t("event_2_title"),
      desc: t("event_2_desc")
    },
    {
      year: t("event_3_year"),
      title: t("event_3_title"),
      desc: t("event_3_desc")
    },
  ];
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("timelineTitle")}</h2>
          <p className="text-gray-600">{t("timelineSubtitle")}</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200"></div>
          {events.map((event, index) => (
            <div 
              key={index} 
              className={`relative mb-12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8 md:ml-auto'} md:w-1/2`}
            >
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative z-10">
                <div className="text-indigo-600 font-bold text-lg mb-2">{event.year}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.desc}</p>
              </div>
              <div className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { t } = useTranslation();
  return (
    <section id="contact" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("contactTitle")}</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">{t("contactSubtitle")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition">
              {t("contactJobs")}
            </button>
            <button className="bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition border border-indigo-500">
              {t("contactContact")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <TopBanner />
      {/* Si usas el Navbar doble, déjalo, pero TopBanner puede hacer ese trabajo */}
      {/* <Navbar /> */}
      <main>
        <Hero />
        <Mission />
        <Stats />
        <Team />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default About;