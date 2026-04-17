import { useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AsciiSmoke from './components/AsciiSmoke';
import AsciiSand from './components/AsciiSand';
import AsciiLiquid from './components/AsciiLiquid';
import SimulationSelector from './components/SimulationSelector';

const SIMULATIONS = {
    smoke: AsciiSmoke,
    sand: AsciiSand,
    liquid: AsciiLiquid,
};

export default function App() {
    const [activeSim, setActiveSim] = useState('smoke');
    const ActiveSimulation = SIMULATIONS[activeSim];

    return (
        <>
            <SimulationSelector active={activeSim} onChange={setActiveSim} />
            <ActiveSimulation className="app-background" />
            <main>
                <Hero />
                <About />
                <Projects />
                <Contact />
            </main>
        </>
    );
}