import { LandingContent } from "@/components/landing-content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <>
      <Header user={null} />
      <LandingContent />
      <Footer />
    </>
  );
}
