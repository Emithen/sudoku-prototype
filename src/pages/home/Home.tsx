import { Logo } from "./Logo";
import { MenuSection } from "./MenuSection";

export const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center bg-white">
      <Logo />
      <MenuSection />
    </div>
  );
};
