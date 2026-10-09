import Hero from './sections/Hero.jsx';
import Motto from './sections/Motto.jsx';
import Stats from './sections/Stats.jsx';
import Values from './sections/Values.jsx';
import Finale from './sections/Finale.jsx';
import Congrats from './sections/Congrats.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <Motto />
        <Stats />
        <Values />
        <Finale />
        <Congrats />
      </main>
      <Footer />
    </>
  );
}
