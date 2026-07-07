import FAQ from "./components/FAQ";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Preview from "./components/Preview";
import Pricing from "./components/Pricing";

function LandingPage() {
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="text-2xl font-bold text-slate-900">
          Task<span className="text-primary">Flow</span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <li><a href="#features" className="transition hover:text-primary">Features</a></li>
          <li><a href="#preview" className="transition hover:text-primary">Preview</a></li>
          <li><a href="#pricing" className="transition hover:text-primary">Pricing</a></li>
          <li><a href="#faq" className="transition hover:text-primary">FAQ</a></li>
        </ul>

        <div className="flex items-center gap-3">
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Login
          </button>
          <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition text-white transition hover:opacity-90">
            Get Started
          </button>
        </div>
      </div>
    </nav>

      <main className="bg-white text-slate-900">
        <section className="relative overflow-hidden"><Hero/></section>
        <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24"><Features/></section>
        <section id="preview" className="bg-slate-50 scroll-mt-24 py-24"><Preview/></section>
        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24"><Pricing/></section>
        <section id="faq" className="bg-slate-50 scroll-mt-24 py-24"><FAQ/></section>
      </main>

      <Footer/>
    </>
  );
}

export default LandingPage;