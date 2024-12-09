
import HeroPanel from "./component/LandingPageComponent/HeroPanel";
import Features from "./component/LandingPageComponent/Features";
import Carousell from "./component/LandingPageComponent/Carousell";
import Keywords from "./component/LandingPageComponent/Keywords";
import Faq from "./component/LandingPageComponent/Faq";
import QrCode from "./component/LandingPageComponent/QrCode";
import { createClient } from "@/lib/supabase/server";
import Education from "./component/LandingPageComponent/Education";
import Testmonial from "./component/LandingPageComponent/Testmonial";

export default async function Home() {

  return (
    <div className="flex flex-col w-screen h-full overflow-y-scroll p-4 bg-white text-black">
      <HeroPanel />
      <Features />
      <Education />
      <Carousell />
      <Keywords />
      <Testmonial />
      <QrCode />
      <Faq />
    </div>
  );
}

