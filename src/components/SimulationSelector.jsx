import './SimulationSelector.css';

const SIMULATIONS = [
    { id: 'smoke', icon: 'fa-cloud' },
    { id: 'sand', icon: 'fa-mound' },
    { id: 'liquid', icon: 'fa-droplet' },
];

export default function SimulationSelector({ active, onChange }) {
    return (
        <div className="simulation-selector">
            {SIMULATIONS.map((sim) => (
                <button
                    key={sim.id}
                    className={`simulation-btn ${active === sim.id ? 'active' : ''}`}
                    onClick={() => onChange(sim.id)}
                    title={sim.id}
                >
                    <i className={`fa-solid ${sim.icon}`}></i>
                </button>
            ))}
        </div>
    );
}