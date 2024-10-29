import styles from "./App.module.css";
import { Contact } from "./components/Contact/Contact";
import { Features } from "./components/Features/features";
import { Developers } from "./components/Developers/Developers";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Projects } from "./components/Projects/Projects";
import Wave from "./components/Waves/Wave";


function App() {
  return (
    <div className={styles.App}>
      <Navbar />
      <Wave />
      <Hero />
      <Features />
      <Developers />
      <Projects />
      <Contact />
    </div>
  );
}

export default App;
