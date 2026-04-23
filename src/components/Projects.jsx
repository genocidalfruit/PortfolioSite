import { useState } from 'react';
import './Projects.css';

const FILE_SYSTEM = {
    name: 'projects',
    type: 'directory',
    children: {
        'vault-ecosystem': {
            type: 'directory',
            accent: 'teal',
            children: {
                'Automated Knowledge Base': {
                    type: 'file',
                    icon: 'fa-database',
                    description: 'A sophisticated PKM system built on Obsidian with automated workflows for metadata integrity, link consistency, and Digital Garden structure. Features include bi-directional linking, backlinking, graph visualization, custom meta properties, and auto-generated tables of content. Built with Python scripting and YAML frontmatter for seamless integration with my personal knowledge base.',
                    github: 'https://github.com/genocidalfruit/THE-VAULT',
                },
                'Knowledge Base Portal': {
                    type: 'file',
                    icon: 'fa-globe',
                    description: 'Public-facing frontend that transforms private Markdown notes into a high-performance, SEO-friendly web interface. Utilizes static site generation with custom theming, full-text search, tag-based navigation, and dark mode support. Built with Astro and React for optimal performance.',
                    github: 'https://github.com/genocidalfruit/VAULT-front',
                },
            },
        },
        'cement-site': {
            type: 'directory',
            accent: 'blue',
            children: {
                'Commercial Inventory UI': {
                    type: 'file',
                    icon: 'fa-boxes-stacked',
                    description: 'Frontend for a commercial inventory management system featuring product cataloging, tracking, dynamic sorting, filtering by category/date/status, bulk import/export via CSV, barcode scanning support, real-time stock alerts, and dashboard analytics with charts. Built with React and Tailwind CSS.',
                    github: 'https://github.com/genocidalfruit/cem-site',
                },
                'Inventory Backend API': {
                    type: 'file',
                    icon: 'fa-server',
                    description: 'Centralized REST API and PostgreSQL database layer with JWT authentication, role-based access control, comprehensive CRUD operations, automated API documentation with Swagger/OpenAPI, rate limiting, and automated testing. Built with Express.js and Sequelize ORM for scalability.',
                    github: 'https://github.com/genocidalfruit/cem-site-api',
                },
            },
        },
        'ai-resume-suite': {
            type: 'directory',
            accent: 'purple',
            children: {
                'AI Recruitment Portal': {
                    type: 'file',
                    icon: 'fa-users',
                    description: 'User-facing portal with interactive dashboards, drag-and-drop resume uploads, real-time application status tracking, recruiter feedback loops with comments and scoring, candidate ranking visualization, and email notifications. Built with React, D3.js for data visualization.',
                    github: 'https://github.com/genocidalfruit/airesume',
                },
                'Intelligence Processing Engine': {
                    type: 'file',
                    icon: 'fa-brain',
                    description: 'Core AI backend integrating the Gemini API for resume parsing, entity extraction (skills, education, experience), candidate scoring algorithms, natural language matching to job descriptions, ATS integration, and recruiter-side analytics dashboard. Built with Python, FastAPI, and LangChain.',
                    github: 'https://github.com/genocidalfruit/flaskapi',
                },
            },
        },
        'Deep Researcher': {
            type: 'file',
            icon: 'fa-search',
            description: 'Autonomous multi-agent research system built with LangChain and LangGraph. Takes a natural language query and produces a fully cited, structured research report with no human intervention. Powered by four specialized agents: a Manager for orchestration, Search Agent for web research, Writer Agent for drafting, and a Critique Agent that fact-checks claims via live web search before accepting the draft. Uses OpenAI function calling and stores research in SQLite for persistence.',
            github: 'https://github.com/genocidalfruit/deep-researcher',
        },
        'Network Intrusion Detection System': {
            type: 'file',
            icon: 'fa-shield-virus',
            description: 'Distributed security framework using a Generative Transformer to synthesize attack data and solve class imbalance using SMOTE. A central server manages global model training using PyTorch DistributedDataParallel and distributes quantized ONNX models to edge nodes via MQTT for low-latency threat detection with sub-10ms inference on edge devices.',
            github: null,
        },
        'Portfolio Risk Simulator': {
            type: 'file',
            icon: 'fa-chart-pie',
            description: 'Quantitative finance tool using stochastic modeling to simulate thousands of market scenarios via Monte Carlo methods and calculate portfolio risk metrics including Value at Risk (VaR), Conditional VaR, Maximum Drawdown, Sharpe Ratio, and Sortino Ratio. Features interactive chart visualizations and historical backtesting. Built with Python, NumPy, and Plotly Dash.',
            github: 'https://github.com/genocidalfruit/MonteCarlo-Finance',
        },
        'Options Pricing Engine': {
            type: 'file',
            icon: 'fa-calculator',
            description: 'Mathematical implementation of the Black-Scholes-Merton formula for European options pricing with support for Greeks sensitivity analysis (Delta, Gamma, Theta, Vega, Rho). Includes binomial tree pricing for American options, implied volatility calculation, and interactive option chain visualization. Built with NumPy and Matplotlib.',
            github: 'https://github.com/genocidalfruit/BlackScholes',
        },
    },
};

function FolderIcon() {
    return (
        <i className="fa-solid fa-folder" style={{ fontSize: '28px' }}></i>
    );
}

function FileIcon({ icon }) {
    return (
        <i className={`fa-solid ${icon}`} style={{ fontSize: '32px' }}></i>
    );
}

function ChevronIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
        </svg>
    );
}

function getCurrentDirectory(pathStack) {
    let current = FILE_SYSTEM;
    for (const segment of pathStack) {
        current = current.children?.[segment];
        if (!current || current.type !== 'directory') return null;
    }
    return current;
}

function getPathString(pathStack) {
    if (pathStack.length === 0) return '~/projects';
    return `~/projects/${pathStack.join('/')}`;
}

function getDetailPathString(pathStack, projectName) {
    if (pathStack.length === 0) return `~/projects/${projectName}`;
    return `~/projects/${pathStack.join('/')}/${projectName}`;
}

export default function Projects() {
    const [pathStack, setPathStack] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const currentDir = getCurrentDirectory(pathStack);

    const handleFolderClick = (folderName) => {
        setPathStack((prev) => [...prev, folderName]);
    };

    const handleBackClick = () => {
        setPathStack((prev) => prev.slice(0, -1));
    };

    const handleBackToGrid = () => {
        setSelectedProject(null);
    };

    const handleFileClick = (fileName) => {
        const current = getCurrentDirectory(pathStack);
        const file = current?.children?.[fileName];
        if (file?.type === 'file') {
            setSelectedProject({ name: fileName, ...file });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleBackToGrid();
    };

    if (!currentDir) {
        return null;
    }

    const entries = Object.entries(currentDir.children || {});
    const sortedEntries = [...entries].sort((a, b) => a[0].localeCompare(b[0]));

    return (
        <section className="section projects" id="projects" onKeyDown={handleKeyDown}>
            <div className="container">
                <div className="section-header">
                    <span className="section-label">// projects</span>
                    <h2 className="section-title">Featured Work</h2>
                </div>
                <div className="file-browser">
                    <div className="file-browser__header">
                        <div className="file-browser__path">
                            {selectedProject ? (
                                <button className="file-browser__back" onClick={handleBackToGrid}>
                                    <ChevronIcon />
                                </button>
                            ) : pathStack.length > 0 ? (
                                <button className="file-browser__back" onClick={handleBackClick}>
                                    <ChevronIcon />
                                </button>
                            ) : null}
                            <span className="file-browser__current">
                                {selectedProject ? getDetailPathString(pathStack, selectedProject.name) : getPathString(pathStack)}
                            </span>
                        </div>
                    </div>

                    <div className="file-browser__content">
                        {selectedProject ? (
                            <div className="project-detail">
                                <div className="project-detail__header">
                                    <span className="project-detail__icon">
                                        <i className={`fa-solid ${selectedProject.icon}`} style={{ fontSize: '20px' }}></i>
                                    </span>
                                    <h3 className="project-detail__title">{selectedProject.name}</h3>
                                    {selectedProject.github && (
                                        <a
                                            href={selectedProject.github}
                                            className="project-detail__link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="View on GitHub"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                                <p className="project-detail__description">{selectedProject.description}</p>
                            </div>
                        ) : (
                            <div className="file-browser__grid">
                                {sortedEntries.map(([name, item]) => (
                                    item.type === 'directory' ? (
                                        <button
                                            key={name}
                                            className="file-grid-item file-grid-item--folder"
                                            onClick={() => handleFolderClick(name)}
                                        >
                                            <span className="file-grid-item__icon">
                                                <FolderIcon />
                                            </span>
                                            <span className="file-grid-item__name">{name}</span>
                                        </button>
                                    ) : (
                                        <button
                                            key={name}
                                            className="file-grid-item file-grid-item--file"
                                            onClick={() => handleFileClick(name)}
                                        >
                                            <span className="file-grid-item__icon">
                                                <FileIcon icon={item.icon} />
                                            </span>
                                            <span className="file-grid-item__name">{name}</span>
                                        </button>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="file-browser__footer">
                        <span className="file-browser__count">
                            {selectedProject ? '\u00A0' : `${entries.length} items`}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}