import AppHeader from "./components/header/header";
import AppFooter from "./components/footer/footer";
import HomePage from "./(protected)/home/page";

export default function Home() {
  return (
    <>
      <AppHeader />
      <HomePage />
      <AppFooter />
    </>
  );
}
