import Header from "./_components/Header";
import Categories from "./_components/Categories";
import Pizza from "./_components/Pizza";

export default function Home() {
  return (
    <div className="container py-4">
        <Header/>
        <Categories/>
        <Pizza/>
    </div>
  );
}
