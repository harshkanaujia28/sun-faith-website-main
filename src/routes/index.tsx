import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  Check,
  CircleCheck,
  ClipboardCheck,
  Factory,
  Facebook,
  Headphones,
  Home,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Sun,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroImage from "@/assets/solar-hero.jpg";
import teamImage from "@/assets/solar-team.jpg";
import residentialImage from "@/assets/solar-residential.jpg";
import commercialImage from "@/assets/solar-commercial.jpg";
import industrialImage from "@/assets/solar-industrial.jpg";
import maintenanceImage from "@/assets/solar-maintenance.jpg";

const phoneHref = "tel:+919999999999";
const whatsappHref = "https://wa.me/919999999999?text=Hello%20Sun%20Faith%20Energy%2C%20I%20want%20to%20know%20more%20about%20your%20solar%20solutions.";

const logoSrc = "/sun-faith-energy-logo.png";

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#home"
      aria-label="Sun Faith Energy Solutions - Home"
      className={`group flex shrink-0 items-center ${
        footer
          ? "w-fit rounded-xl  px-4 py-2.5 shadow-lg"
          : "w-[155px] sm:w-[178px]"
      }`}
    >
      <img
        src={logoSrc}
        alt="Sun Faith Energy Solutions"
        width={178}
        height={70}
        loading={footer ? "lazy" : "eager"}
        decoding="async"
        className={`h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02] ${
          footer ? "max-h-16" : "max-h-14"
        }`}
      />
    </a>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sun Faith Energy Solutions | Solar Energy Solutions in Kota" },
      { name: "description", content: "Sun Faith Energy Solutions provides professional solar energy solutions for residential, commercial and industrial requirements in Kota, Rajasthan." },
      { name: "keywords", content: "solar energy Kota, solar company Kota, solar solutions Kota, rooftop solar Kota, solar installation Kota, solar energy solutions" },
      { property: "og:title", content: "Sun Faith Energy Solutions | Solar Energy Solutions in Kota" },
      { property: "og:description", content: "Professional solar energy solutions for homes, businesses and industries in Kota, Rajasthan." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "ProfessionalService"],
        name: "Sun Faith Energy Solutions",
        description: "Solar energy solutions for residential, commercial and industrial requirements.",
        telephone: "+91 9024042324",
        email: "sunfaithenergysolutions@gmail.com",
        address: { "@type": "PostalAddress", streetAddress: "1-C-37 RHB Colony, Kunhari", addressLocality: "Kota", addressRegion: "Rajasthan", addressCountry: "IN" },
        areaServed: "Kota, Rajasthan",
      }),
    }],
  }),
  component: SolarWebsite,
});

const navItems = [
  ["Home", "#home"], ["About", "#about"], ["Services", "#services"],
  ["Why Us", "#why-us"], ["Projects", "#projects"], ["Contact", "#contact"],
] as const;

const services = [
  { icon: Home, title: "Residential Solar", text: "Efficient rooftop solar solutions designed for homes and residential properties." },
  { icon: Building2, title: "Commercial Solar", text: "Reliable solar systems designed to help businesses manage energy costs." },
  { icon: Factory, title: "Industrial Solar", text: "Scalable solar solutions for industrial and large energy requirements." },
  { icon: Wrench, title: "Solar Installation", text: "Professional system installation with attention to safety, performance and quality." },
  { icon: Sparkles, title: "Solar Maintenance", text: "Support and maintenance to help keep your solar system performing efficiently." },
];

const faqs = [
  ["What type of solar systems do you provide?", "We provide rooftop and property-based solar solutions for residential, commercial and industrial energy requirements."],
  ["Is rooftop solar suitable for my property?", "Suitability depends on factors such as available roof area, sunlight exposure, structure and your energy needs. A site assessment helps determine the right approach."],
  ["How does the solar installation process work?", "The process typically includes consultation, site assessment, system planning, professional installation and commissioning."],
  ["How much can solar reduce my electricity dependence?", "The reduction varies with your energy use, system size, roof conditions and available sunlight. Our team can assess your requirements before recommending a solution."],
  ["Do you provide installation support?", "Yes. We provide professional installation and ongoing support to help your solar system operate efficiently."],
  ["How can I request a solar consultation?", "Use the enquiry form, call us, or message us on WhatsApp. Our team will connect with you to understand your needs."],
];

function SectionTitle({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy?: string; light?: boolean }) {
  return (
    <div className={`reveal max-w-2xl ${light ? "text-on-dark" : ""}`}>
      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-7 bg-primary" />{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {copy && <p className={`mt-5 text-base leading-7 ${light ? "text-on-dark-muted" : "text-muted-foreground"}`}>{copy}</p>}
    </div>
  );
}

function SolarWebsite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").replace(/\s/g, "");
    const email = String(data.get("email") || "").trim();
    const requirement = String(data.get("requirement") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name) next["name"] = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(phone)) next["phone"] = "Enter a valid 10-digit Indian mobile number.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next["email"] = "Enter a valid email address.";
    if (!requirement) next["requirement"] = "Please select your requirement.";
    if (!message) next["message"] = "Please tell us a little about your requirement.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/92 shadow-[0_8px_30px_rgba(23,35,49,0.06)] backdrop-blur-2xl">
        <nav className="site-container flex h-[76px] items-center justify-between gap-5" aria-label="Main navigation">
          <BrandLogo />
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="group relative rounded-full px-3.5 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:text-foreground"
              >
                {label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={phoneHref}
              className="hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5 xl:flex"
            >
              <Phone className="size-4 text-primary" />
              <span>+91 90240 42324</span>
            </a>
            <Button asChild className="hidden h-11 rounded-full px-5 shadow-sm sm:inline-flex">
              <a href="#contact">Get a Quote <ArrowRight /></a>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>
        {menuOpen && (
          <div className="border-t border-border/70 bg-white/98 px-5 py-5 shadow-2xl lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 font-semibold transition hover:bg-muted"
                >
                  {label}
                  <ArrowRight className="size-4 text-primary" />
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" className="h-11 rounded-xl">
                  <a href={phoneHref} onClick={() => setMenuOpen(false)}><Phone /> Call</a>
                </Button>
                <Button asChild className="h-11 rounded-xl">
                  <a href="#contact" onClick={() => setMenuOpen(false)}>Get a Quote</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="hero-section relative flex min-h-[760px] scroll-mt-20 items-center overflow-hidden pt-[76px]">
          <img src={heroImage} alt="Rooftop solar panels on a modern home" width={1600} height={1008} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101a27]/95 via-[#101a27]/75 to-[#101a27]/25" />
          <div className="solar-grid absolute inset-0 opacity-15" />
          <div className="absolute -left-24 top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 bottom-10 size-80 rounded-full bg-white/10 blur-3xl" />
          <div className="site-container relative z-10 py-20">
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
              <div className="max-w-3xl text-on-dark">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
                  <Sun className="size-4" /> Solar energy • Kota, Rajasthan
                </div>
                <h1 className="font-display max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.7rem]">
                  Power Your Future With <span className="text-primary">Clean Solar Energy.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-on-dark-muted sm:text-xl">
                  Smart, reliable and sustainable solar solutions for homes, businesses and industries — planned around your energy requirements.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="h-13 rounded-full px-7 text-base shadow-[0_12px_35px_rgba(249,197,21,0.22)]">
                    <a href="#contact">Get a Free Quote <ArrowRight /></a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="hero-outline h-13 rounded-full px-7 text-base">
                    <a href={phoneHref}><Phone /> Talk to Us</a>
                  </Button>
                </div>
                <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 border-t border-white/15 pt-6 sm:grid-cols-3">
                  {["Reliable Solutions", "Expert Installation", "Long-Term Support"].map((point) => (
                    <span key={point} className="flex items-center gap-2 text-sm font-semibold text-white/90">
                      <CircleCheck className="size-4 shrink-0 text-primary" />{point}
                    </span>
                  ))}
                </div>
              </div>
              {/* <div className="hidden justify-end lg:flex">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -inset-5 rounded-[2rem] border border-primary/20 bg-primary/5 blur-sm" />
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-md">
                    <img src={heroImage} alt="" width={900} height={700} className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" aria-hidden="true" />
                    <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/15 bg-[#101a27]/80 p-4 backdrop-blur-xl">
                      <div className="flex items-center gap-3">
                        <span className="grid size-11 place-items-center rounded-xl bg-primary text-[#172331]"><Sun className="size-5" /></span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Our focus</p>
                          <p className="mt-0.5 font-bold text-white">Smarter, cleaner energy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-16 w-36 bg-primary [clip-path:polygon(45%_100%,100%_0,100%_100%)] sm:h-24 sm:w-64" />
        </section>

        <section id="about" className="section-pad scroll-mt-20 bg-background">
          <div className="site-container grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            <div className="reveal relative">
              <div className="image-frame relative overflow-hidden rounded-[1.5rem] shadow-2xl">
                <img src={teamImage} alt="Solar engineers assessing a rooftop panel installation" loading="lazy" width={1200} height={912} className="aspect-[4/3] w-full object-cover" />
              </div>
              <div className="absolute -bottom-6 right-4 max-w-[300px] rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur sm:right-[-18px]">
                <div className="mb-3 flex items-center gap-2 text-primary"><Award className="size-5" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Technical expertise</span></div>
                <p className="font-bold">Mohammad Usama</p><p className="text-sm text-muted-foreground">M. Tech. (Solar Energy)</p>
                <div className="my-3 h-px bg-border" />
                <p className="font-bold">Ali Akbar</p><p className="text-sm text-muted-foreground">B.Tech Electrical and electronics</p>
              </div>
            </div>
            <div className="pt-8 lg:pt-0">
              <SectionTitle eyebrow="About us" title="About Sun Faith Energy Solutions" />
              <p className="reveal mt-7 text-lg leading-8 text-muted-foreground">Sun Faith Energy Solutions is focused on delivering dependable and efficient solar energy solutions designed to help homes, businesses and organizations reduce their dependence on conventional power and move towards cleaner energy.</p>
              <p className="reveal mt-5 leading-7 text-muted-foreground">Our technical team brings focused knowledge in solar energy and electronics to every consultation, helping shape thoughtful solutions around each property and its energy requirements.</p>
              <div className="reveal mt-8 flex items-start gap-4 border-l-4 border-primary bg-muted p-5">
                <Sun className="mt-1 size-7 shrink-0 text-primary" />
                <div><p className="font-bold">Built around your energy needs</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Clear guidance, careful planning and quality-focused execution from assessment to support.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section-pad scroll-mt-20 bg-muted">
          <div className="site-container">
            <SectionTitle eyebrow="What we do" title="Our Solar Solutions" copy="Practical solar services shaped for homes, growing businesses and large energy requirements." />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => <article key={service.title} className={`service-card group reveal ${index === 4 ? "lg:col-span-2" : ""}`}>
                <div className="icon-tile mb-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2"><service.icon /></div>
                <p className="mb-3 text-xs font-bold tracking-[0.16em] text-primary">0{index + 1}</p>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{service.text}</p>
                <div className="mt-6 h-1 w-10 bg-primary transition-all duration-300 group-hover:w-20" />
              </article>)}
            </div>
          </div>
        </section>

        <section id="why-us" className="section-pad scroll-mt-20 bg-background">
          <div className="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div><SectionTitle eyebrow="The Sun Faith difference" title="Why Choose Sun Faith Energy?" copy="A grounded approach to solar, combining technical understanding with dependable service at every stage." /></div>
            <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
              {[
                [Award, "Professional Technical Team", "Relevant technical knowledge guides planning and execution."],
                [ShieldCheck, "Quality-Focused Solutions", "Every recommendation considers safety, performance and fit."],
                [Wrench, "Reliable Installation", "Careful workmanship supports dependable system operation."],
                [Headphones, "Customer-Focused Support", "Clear communication and useful support throughout your journey."],
              ].map(([Icon, title, text]) => {
                const FeatureIcon = Icon as typeof Award;
                return <article key={String(title)} className="reveal bg-card p-7 transition-colors hover:bg-muted sm:p-9"><FeatureIcon className="mb-6 size-8 text-primary" /><h3 className="text-lg font-bold">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{String(text)}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section className="section-pad bg-foreground text-on-dark">
          <div className="site-container">
            <SectionTitle eyebrow="Your solar journey" title="Simple Steps to Go Solar" light />
            <div className="process-line relative mt-14 grid gap-8 md:grid-cols-4">
              {[
                ["01", "Consultation", "Understand your energy requirements."],
                ["02", "Site Assessment", "Evaluate your property and solar requirements."],
                ["03", "Installation", "Install the solar system professionally."],
                ["04", "Start Saving", "Start generating clean solar energy."],
              ].map(([number, title, text]) => <article key={number} className="reveal relative z-10"><span className="grid size-14 place-items-center rounded-full border-4 border-foreground bg-primary font-bold text-primary-foreground">{number}</span><h3 className="mt-6 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-on-dark-muted">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="benefits-section section-pad relative overflow-hidden bg-secondary">
          <div className="site-container relative z-10 grid items-center gap-12 lg:grid-cols-2">
            <SectionTitle eyebrow="Brighter possibilities" title="Make the Switch to Solar" copy="A considered solar investment can help you use cleaner energy today while building toward a more sustainable future." />
            <div className="grid gap-4 sm:grid-cols-2">
              {[[Leaf,"Clean & Renewable Energy"],[Zap,"Reduced Electricity Dependence"],[PiggyBank,"Smart Long-Term Investment"],[Sun,"Sustainable Energy Future"]].map(([Icon,label]) => { const BenefitIcon = Icon as typeof Leaf; return <div key={String(label)} className="reveal flex min-h-32 items-start gap-4 rounded-md border border-border bg-background p-5 shadow-sm"><span className="icon-tile shrink-0"><BenefitIcon /></span><h3 className="pt-2 font-bold leading-6">{String(label)}</h3></div>})}
            </div>
          </div>
        </section>

        <section id="projects" className="section-pad scroll-mt-20 bg-background">
          <div className="site-container">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionTitle eyebrow="Installation gallery" title="Our Solar Work" copy="A visual look at residential, commercial and industrial solar installation environments." /><p className="max-w-sm text-sm leading-6 text-muted-foreground">Illustrative solar installation imagery. Project-specific portfolio details can be added when available.</p></div>
            <div className="mt-12 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                [residentialImage,"Rooftop solar panels on an Indian residence"], [commercialImage,"Commercial rooftop solar installation"], [industrialImage,"Industrial solar panel array at sunset"],
                [teamImage,"Solar engineers inspecting rooftop panels"], [maintenanceImage,"Technician maintaining a solar installation"], [heroImage,"Modern home powered by rooftop solar panels"],
              ].map(([src, alt], index) => <figure key={alt} className={`gallery-item reveal group relative overflow-hidden rounded-md ${index === 0 || index === 5 ? "sm:row-span-2" : ""}`}><img src={src} alt={alt} loading="lazy" width={1200} height={912} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-image-caption p-5"><span className="text-sm font-semibold text-on-dark">Solar installation</span></div></figure>)}
            </div>
          </div>
        </section>

        <section className="section-pad bg-muted">
          <div className="site-container">
            <SectionTitle eyebrow="Service values" title="What Our Customers Value" copy="The qualities we focus on in every conversation and every installation." />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[[MessageCircle,"Reliable communication","Clear, timely information so you understand each stage."],[ClipboardCheck,"Professional approach","Thoughtful assessment and a respectful, organized process."],[ShieldCheck,"Quality-focused execution","Careful attention to installation quality and long-term performance."]].map(([Icon,title,text]) => { const ValueIcon = Icon as typeof MessageCircle; return <article key={String(title)} className="reveal rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"><ValueIcon className="size-8 text-primary"/><h3 className="mt-7 text-xl font-bold">{String(title)}</h3><p className="mt-3 leading-7 text-muted-foreground">{String(text)}</p></article>})}
            </div>
          </div>
        </section>

        <section className="section-pad bg-background">
          <div className="site-container grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <SectionTitle eyebrow="Common questions" title="Solar, made clearer" copy="Straightforward answers to help you plan your next step with confidence." />
            <Accordion type="single" collapsible className="reveal overflow-hidden rounded-2xl border border-border bg-card px-5 shadow-sm sm:px-7">
              {faqs.map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`}><AccordionTrigger className="py-6 text-base hover:no-underline">{question}</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 leading-7 text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}
            </Accordion>
          </div>
        </section>

        <section className="relative overflow-hidden bg-foreground py-20 text-on-dark">
          <div className="solar-grid absolute inset-0 opacity-20"/><div className="absolute -right-16 bottom-0 h-44 w-80 rotate-[-12deg] bg-primary/90"/>
          <div className="site-container relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Start your solar journey</p><h2 className="font-display text-4xl font-bold sm:text-5xl">Ready to Switch to Solar?</h2><p className="mt-4 text-lg text-on-dark-muted">Talk to our team and explore the right solar solution for your energy needs.</p></div>
            <div className="flex flex-wrap gap-3"><Button asChild size="lg" className="h-13"><a href="#contact">Get a Free Quote <ArrowRight/></a></Button><Button asChild size="lg" variant="outline" className="hero-outline h-13"><a href={phoneHref}><Phone/>Call Now</a></Button></div>
          </div>
        </section>

        <section id="contact" className="section-pad scroll-mt-20 bg-background">
          <div className="site-container">
            <SectionTitle eyebrow="Get in touch" title="Let's Talk Solar" copy="Share your requirement and our team will connect with you to discuss a suitable solar solution." />
            <div className="mt-12 grid gap-8 lg:grid-cols-[.82fr_1.18fr]">
              <div className="space-y-6">
                <div className="rounded-[1.5rem] bg-foreground p-7 text-on-dark shadow-2xl sm:p-9">
                  <h3 className="text-xl font-bold">Contact information</h3>
                  <div className="mt-7 space-y-6">
                    <a href={phoneHref} className="contact-row"><Phone/><span><small>Phone</small>+91 9024042324</span></a>
                    <a href="mailto:sunfaithenergysolutions@gmail.com" className="contact-row break-all"><Mail/><span><small>Email</small>sunfaithenergysolutions@gmail.com</span></a>
                    <div className="contact-row"><MapPin/><span><small>Address</small>1-C-37 RHB Colony, Kunhari, Kota (Raj)</span></div>
                  </div>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=Kunhari%2C%20Kota%2C%20Rajasthan" target="_blank" rel="noreferrer" className="map-card group block rounded-md border border-border bg-muted p-6">
                  <div className="solar-grid h-28 rounded-md bg-secondary"><span className="grid h-full place-items-center"><MapPin className="size-10 text-primary transition-transform group-hover:-translate-y-1"/></span></div>
                  <div className="mt-4 flex items-center justify-between gap-4"><div><p className="font-bold">Kunhari, Kota, Rajasthan</p><p className="mt-1 text-sm text-muted-foreground">Open location in Google Maps</p></div><ArrowRight className="size-5 text-primary"/></div>
                </a>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-xl sm:p-9">
                {submitted ? <div className="flex min-h-[480px] flex-col items-center justify-center text-center" role="status"><span className="grid size-16 place-items-center rounded-full bg-success-soft text-success"><Check className="size-8"/></span><h3 className="mt-6 text-2xl font-bold">Thank you for your enquiry</h3><p className="mt-3 max-w-sm leading-7 text-muted-foreground">Your details have been noted in this demo. Please call or WhatsApp us for an immediate conversation.</p><Button className="mt-7" onClick={() => setSubmitted(false)}>Send another enquiry</Button></div> :
                <form onSubmit={submitForm} noValidate>
                  <h3 className="text-2xl font-bold">Request a consultation</h3><p className="mt-2 text-sm text-muted-foreground">Fields marked with * are required.</p>
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name *" error={errors["name"]}><Input name="name" autoComplete="name" aria-invalid={Boolean(errors["name"])} placeholder="Your full name" /></Field>
                    <Field label="Phone Number *" error={errors["phone"]}><Input name="phone" type="tel" inputMode="numeric" autoComplete="tel" aria-invalid={Boolean(errors["phone"])} placeholder="10-digit mobile number" /></Field>
                    <Field label="Email" error={errors["email"]}><Input name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors["email"])} placeholder="you@example.com" /></Field>
                    <Field label="Requirement *" error={errors["requirement"]}><select name="requirement" defaultValue="" aria-invalid={Boolean(errors["requirement"])} className="form-control"><option value="" disabled>Select a solution</option><option>Residential Solar</option><option>Commercial Solar</option><option>Industrial Solar</option><option>Installation</option><option>Maintenance</option><option>General Consultation</option></select></Field>
                    <div className="sm:col-span-2"><Field label="Message *" error={errors["message"]}><Textarea name="message" aria-invalid={Boolean(errors["message"])} placeholder="Tell us about your property and energy requirement" className="min-h-32" /></Field></div>
                  </div>
                  <Button type="submit" size="lg" className="mt-6 h-12 w-full sm:w-auto">Submit Enquiry <ArrowRight/></Button>
                </form>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#101a27] text-on-dark">
        <div className="site-container grid gap-10 py-14 md:grid-cols-[1.4fr_.7fr_1fr]">
          <div><BrandLogo footer /><p className="mt-5 max-w-sm text-sm leading-7 text-on-dark-muted">Today's choice Tomorrow's shines</p><div className="mt-6 flex gap-2"><SocialLink href="#" label="Facebook"><Facebook/></SocialLink><SocialLink href="#" label="Instagram"><Instagram/></SocialLink><SocialLink href={whatsappHref} label="WhatsApp"><MessageCircle/></SocialLink></div></div>
          <div><h3 className="font-bold">Quick Links</h3><div className="mt-5 flex flex-col gap-3">{navItems.filter((_,i) => i !== 3).map(([label,href]) => <a key={href} href={href} className="text-sm text-on-dark-muted hover:text-primary">{label}</a>)}</div></div>
          <div><h3 className="font-bold">Contact</h3><div className="mt-5 space-y-3 text-sm leading-6 text-on-dark-muted"><a href={phoneHref} className="block hover:text-primary">+91 9024042324</a><a href="mailto:sunfaithenergysolutions@gmail.com" className="block break-all hover:text-primary">sunfaithenergysolutions@gmail.com</a><p>1-C-37 RHB Colony, Kunhari, Kota (Raj)</p></div></div>
        </div>
        <div className="border-t border-on-dark/10"><div className="site-container py-5 text-center text-xs text-on-dark-muted sm:text-left">© 2026 Sun Faith Energy Solutions. All rights reserved.</div></div>
      </footer>

      <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:right-6">
        <a href={phoneHref} className="floating-call" aria-label="Call Sun Faith Energy Solutions"><Phone /></a>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="floating-whatsapp" aria-label="Chat with Sun Faith Energy Solutions on WhatsApp"><MessageCircle fill="currentColor" /></a>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error: string | undefined; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold"><span className="mb-2 block">{label}</span>{children}{error && <span className="mt-1.5 block text-xs font-medium text-destructive">{error}</span>}</label>;
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <a href={href} target={href === "#" ? undefined : "_blank"} rel={href === "#" ? undefined : "noreferrer"} aria-label={label} className="grid size-10 place-items-center rounded-md border border-on-dark/20 text-on-dark-muted transition hover:border-primary hover:text-primary [&_svg]:size-4">{children}</a>;
}