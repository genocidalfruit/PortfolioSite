import './Projects.css';

const LINKED_GROUPS = [
    {
        label: 'VAULT Ecosystem',
        accent: 'teal',
        projects: [
            {
                title: 'Automated Knowledge Base',
                description: 'A sophisticated PKM system built on Obsidian with automated workflows for metadata integrity, link consistency, and Digital Garden structure.',
                tags: ['Obsidian', 'YAML', 'GitHub Actions', 'Shell'],
                icon: <i className="fa-solid fa-brain"></i>,
                github: 'https://github.com/genocidalfruit/THE-VAULT',
            },
            {
                title: 'Knowledge Base Portal',
                description: 'Public-facing frontend that transforms private Markdown notes into a high-performance, SEO-friendly web interface.',
                tags: ['Astro', 'TypeScript', 'Tailwind CSS', 'Netlify'],
                icon: <i className="fa-solid fa-globe"></i>,
                link: '#',
                github: 'https://github.com/genocidalfruit/VAULT-front',
            },
        ],
    },
    {
        label: 'Cement Site Project',
        accent: 'blue',
        projects: [
            {
                title: 'Commercial Inventory UI',
                description: 'Frontend for a commercial inventory management system featuring product cataloging, tracking, and dynamic sorting & filtering.',
                tags: ['React.js', 'JavaScript', 'SASS', 'CSS3'],
                icon: <i className="fa-solid fa-boxes-stacked"></i>,
                link: '#',
                github: 'https://github.com/genocidalfruit/cem-site',
            },
            {
                title: 'Inventory Backend API',
                description: 'Centralized REST API and database layer with secure auth, CRUD operations, and schema design.',
                tags: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
                icon: <i className="fa-solid fa-server"></i>,
                github: 'https://github.com/genocidalfruit/cem-site-api',
            },
        ],
    },
    {
        label: 'AI Resume Suite',
        accent: 'purple',
        projects: [
            {
                title: 'AI Recruitment Portal',
                description: 'User-facing portal with interactive dashboards, resume uploads, and real-time recruiter feedback loops.',
                tags: ['React.js', 'JavaScript', 'Tailwind CSS'],
                icon: <i className="fa-solid fa-id-card"></i>,
                link: '#',
                github: 'https://github.com/genocidalfruit/airesume',
            },
            {
                title: 'Intelligence Processing Engine',
                description: 'Core AI backend integrating the Gemini API to perform resume parsing, candidate scoring, and recruiter-side analytics.',
                tags: ['Python', 'Flask', 'Gemini API', 'MongoDB'],
                icon: <i className="fa-solid fa-microchip"></i>,
                github: 'https://github.com/genocidalfruit/flaskapi',
            },
        ],
    },
];

const STANDALONE = [
    {
        title: 'Network Intrusion Detection System',
        description: 'Distributed security framework using a Generative Transformer to synthesize attack data and solve class imbalance. A central server manages global model training and distributes quantized models to edge nodes for low-latency threat detection.',
        tags: ['PyTorch', 'Python', 'Transformers', 'Scipy', 'Socket Programming'],
        icon: <i className="fa-solid fa-shield-halved"></i>,
        github: '#',
    },
    {
        title: 'Portfolio Risk Simulator',
        description: 'Quantitative finance tool using stochastic modeling to simulate thousands of market scenarios and calculate portfolio risk metrics like VaR.',
        tags: ['Python', 'NumPy', 'Pandas', 'Streamlit'],
        icon: <i className="fa-solid fa-chart-pie"></i>,
        github: 'https://github.com/genocidalfruit/MonteCarlo-Finance',
    },
    {
        title: 'Options Pricing Engine',
        description: 'Mathematical implementation of the Black-Scholes-Merton formula for European options pricing with Greeks sensitivity analysis.',
        tags: ['Python', 'SciPy', 'NumPy', 'Plotly'],
        icon: <i className="fa-solid fa-calculator"></i>,
        github: 'https://github.com/genocidalfruit/BlackScholes',
    },
];

function LinkIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    );
}

function ProjectCard({ project }) {
    return (
        <article className="projects__card card">
            <div className="projects__card-top">
                <span className="projects__card-icon">{project.icon}</span>
                <div className="projects__card-actions">
                    <a href={project.github} className="projects__card-action" aria-label="GitHub">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                    </a>
                    {project.link && (
                        <a href={project.link} className="projects__card-action" aria-label="Live">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </a>
                    )}
                </div>
            </div>
            <h3 className="projects__card-title">{project.title}</h3>
            <p className="projects__card-desc">{project.description}</p>
            <div className="projects__card-tags">
                {project.tags.map((tag) => (
                    <span key={tag} className="projects__tag">{tag}</span>
                ))}
            </div>
        </article>
    );
}

export default function Projects() {
    return (
        <section className="section projects" id="projects">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">// projects</span>
                    <h2 className="section-title">Featured Work</h2>
                </div>

                <div className="projects__layout">
                    {/* Standalone projects */}
                    <div className="projects__standalone">
                        {STANDALONE.map((project) => (
                            <ProjectCard key={project.title} project={project} />
                        ))}
                    </div>

                    {/* Linked pairs */}
                    {LINKED_GROUPS.map((group) => (
                        <div key={group.label} className={`projects__group projects__group--${group.accent}`}>
                            <div className="projects__group-header">
                                <span className="projects__group-badge">
                                    <LinkIcon />
                                    {group.label}
                                </span>
                                <div className="projects__group-line" />
                            </div>
                            <div className="projects__group-cards">
                                {group.projects.map((project) => (
                                    <ProjectCard key={project.title} project={project} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
