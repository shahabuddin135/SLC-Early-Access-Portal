import SmoothScroll from "@/components/landing/SmoothScroll";
import Cursor from "@/components/landing/Cursor";
import HeroWhite from "@/components/landing/HeroWhite";
import WheelNav from "@/components/landing/WheelNav";
import ProblemSection from "@/components/landing/ProblemSection";
import CoreIdeaSection from "@/components/landing/CoreIdeaSection";
import InsightSection from "@/components/landing/InsightSection";
import FrameworkSection from "@/components/landing/FrameworkSection";
import TokenSection from "@/components/landing/TokenSection";
import SpecGraphSection from "@/components/landing/SpecGraphSection";
import ProtocolSection from "@/components/landing/ProtocolSection";
import FolderSection from "@/components/landing/FolderSection";
import CompatibilitySection from "@/components/landing/CompatibilitySection";
import ProofSection from "@/components/landing/ProofSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import LandingFooter from "@/components/landing/LandingFooter";
import FlowArt, { FlowSection } from "@/components/story-scroll";

export default function LandingPage() {
  return (
    <>
      <Cursor />
      <WheelNav />
      <SmoothScroll>
        <HeroWhite />

        {/* Social proof: every agent SLC runs inside */}
        <CompatibilitySection />

        {/* Card stack: Problem → Syntax */}
        <FlowArt>
          <FlowSection style={{ padding: 0 }}>
            <ProblemSection />
          </FlowSection>
          <FlowSection style={{ padding: 0 }}>
            <CoreIdeaSection />
          </FlowSection>
        </FlowArt>

        {/* Standalone: has its own GSAP scroll-pin */}
        <InsightSection />

        {/* Card stack: Framework → Token math */}
        <FlowArt>
          <FlowSection style={{ padding: 0 }}>
            <FrameworkSection id="framework" />
          </FlowSection>
          <FlowSection style={{ padding: 0 }}>
            <TokenSection />
          </FlowSection>
        </FlowArt>

        {/* Proven in production — and why the token math holds by architecture */}
        <ProofSection />

        {/* Standalone: complex scroll animations */}
        <FolderSection />
        <SpecGraphSection />

        {/* The research head-to-head — SLC vs the field */}
        <ComparisonSection />

        <ProtocolSection />

        <LandingFooter />
      </SmoothScroll>
    </>
  );
}
