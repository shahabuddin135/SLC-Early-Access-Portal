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
import LandingFooter from "@/components/landing/LandingFooter";
import FlowArt, { FlowSection } from "@/components/story-scroll";

export default function LandingPage() {
  return (
    <>
      <Cursor />
      <WheelNav />
      <SmoothScroll>
        <HeroWhite />

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

        {/* Standalone: complex scroll animations */}
        <FolderSection />
        <SpecGraphSection />
        <ProtocolSection />

        <LandingFooter />
      </SmoothScroll>
    </>
  );
}
