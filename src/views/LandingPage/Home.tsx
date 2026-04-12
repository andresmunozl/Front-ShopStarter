import Footer from "./Footer";
import TopBanner from "./TopBanner";
import { Link } from "react-router";

// En src/pages/Home.tsx - dentro del componente Hero
const Hero = () => (
  <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Texto */}
      <div className="text-center lg:text-left">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100">
          🚀 con paciencia y esfuerzo nos ganaremos el almuerzo 
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Empodera a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            vendedores locales
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          shop_starter ayuda a vendedores ambulantes a digitalizar sus negocios 
          y llegar a más clientes sin complicaciones técnicas.
        </p>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
          <Link 
            to="/auth/register"
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition text-center"
          >
            Comenzar Gratis
          </Link>
          <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition">
            Ver Casos de Éxito
          </button>
        </div>
      </div>
      
      {/* ✅ Imagen de vendedores ambulantes */}
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-3xl blur-2xl opacity-30"></div>
        <img 
          src="https://clipground.com/images/hawker-clipart-11.jpg"
          alt="Vendedor ambulante atendiendo a clientes en un mercado local"
          className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border-4 border-white"
          loading="eager"
        />
        {/* Badge decorativo */}
        <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
          <div>
            <div className="font-bold text-gray-900">+500 vendedores</div>
            <div className="text-sm text-gray-500">ya confían en nosotros</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
      
const Features = () => {
  const features = [
    { title: 'Panel de Admin', desc: 'Gestiona productos, órdenes y clientes con una interfaz intuitiva.', icon: '📊' },
    { title: 'SEO Optimizado', desc: 'Meta tags, sitemaps y estructura semántica para rankear en Google.', icon: '🔍' },
    { title: 'Modo Oscuro', desc: 'Incluye soporte nativo para dark mode sin configuración extra.', icon: '🌙' },
    { title: 'Autenticación', desc: 'Login y registro seguros con NextAuth o Firebase integrados.', icon: '🔒' },
    { title: 'Despliegue Fácil', desc: 'Conecta con Vercel o Netlify y despliega en segundos.', icon: '☁️' },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Características</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Todo lo que necesitas para escalar
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ Sección "Cómo Funciona" - Reemplaza a Pricing
const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Registra tu Puesto',
      description: 'Completa un formulario simple con la información de tu negocio. ¡Toma menos de 5 minutos!',
      icon: '📝'
    },
    {
      number: '02',
      title: 'Personaliza tu Tienda',
      description: 'Elige un diseño, agrega tus productos y configura tus métodos de pago preferidos.',
      icon: '🎨'
    },
    {
      number: '03',
      title: 'Comparte tu Enlace',
      description: 'Obtén tu enlace único y compártelo por WhatsApp o imprime un código QR para tu puesto.',
      icon: '🔗'
    },
    {
      number: '04',
      title: 'Vende',
      description: 'Tus clientes pueden ver tus productosy gestiona todo desde tu celular.',
      icon: '💰'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100">
            Proceso Simple
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            ¿Cómo funciona shop_starter?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            De la idea a tu primera venta digital en 4 sencillos pasos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition text-center">
              <div className="w-14 h-14 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
                {step.icon}
              </div>
              <span className="text-indigo-600 font-bold text-sm">Paso {step.number}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="py-20 px-4">
    <div className="max-w-5xl mx-auto bg-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Título */}
      <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
        ¿Listo para digitalizar tu puesto?
      </h2>
      
      {/* Párrafo */}
      <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
        Únete a más de 500 vendedores ambulantes que ya aumentaron sus ventas 
        con shop_starter. ¡Tu negocio merece crecer!
      </p>
      
      {/* Botón CTA */}
      <Link 
        to="/auth/register"
        className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg relative z-10 mb-10 text-center"
      >
        Comenzar Gratis Ahora
      </Link>
      
      {/* ✅ 3 Imágenes de Vendedores Ambulantes */}
      <div className="relative z-10">
        <p className="text-indigo-200 text-sm mb-4">Confia en nosotros</p>
        
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {/* Imagen 1 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition"></div>
            <img 
              src="https://static.theclinic.cl/media/2024/04/26-224515_ivs6_A_UNO_1449498.jpg"
              alt="Vendedor de comida callejera en México"
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg transform group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              🌮
            </div>
          </div>

          {/* Imagen 2 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition"></div>
            <img 
              src="https://png.pngtree.com/png-vector/20240501/ourmid/pngtree-cute-cartoon-street-vendor-art-on-transparent-background-png-image_12348900.png"
              alt="Vendedora de frutas frescas en mercado"
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg transform group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              🍎
            </div>
          </div>

          {/* Imagen 3 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition"></div>
            <img 
              src="https://img.freepik.com/premium-photo/smiling-old-caribbean-man-black-senior-selling-cigars-street-tobacco-shop-south-america-cuba_100800-26471.jpg"
              alt="Artesano vendiendo productos hechos a mano"
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white shadow-lg transform group-hover:scale-105 transition duration-300"
              loading="lazy"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
              🎨
            </div>
          </div>
        </div>

        {/* Texto de confianza debajo de las imágenes */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-indigo-200">
          <span className="flex items-center gap-1">
            <span className="text-yellow-300">✓</span> +500 vendedores
          </span>
          <span className="flex items-center gap-1">

          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-300">✓</span> 4.9/5 calificación
          </span>
        </div>
      </div>
      
    </div>
  </section>
);
// --- Componente Principal Home ---

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-800">
      <TopBanner/>
      <main>
        <Hero />
        <Features />
        <HowItWorks />  {/* ✅ Nueva sección en lugar de Pricing */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;