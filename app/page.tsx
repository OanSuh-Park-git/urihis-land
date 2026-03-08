import Hero from "./components/Hero";
import About from "./components/About";
import ContentPreview from "./components/ContentPreview";
import Author from "./components/Author";
import Subscribe from "./components/Subscribe";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <ContentPreview />
      <Author />
      <Subscribe />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
