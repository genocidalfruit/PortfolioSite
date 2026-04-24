import { useState, useRef, useEffect, useCallback } from 'react';
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
    return <i className="fa-solid fa-folder" style={{ fontSize: '28px' }}></i>;
}

function FileIcon({ icon }) {
    return <i className={`fa-solid ${icon}`} style={{ fontSize: '32px' }}></i>;
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

const AVAILABLE_COMMANDS = [
    { name: 'cd', description: 'Change directory (cd <folder>, cd .., cd ~)' },
    { name: 'ls', description: 'List directory contents' },
    { name: 'cat', description: 'Display file contents (cat )' },
    { name: 'help', description: 'Show available commands' },
    { name: 'clear', description: 'Clear terminal' },
    { name: 'exit', description: 'Close terminal' },
];

function getTerminalContent(currentPath) {
    const cleanPath = currentPath.replace(/^~\//, '').replace(/^projects\//, '');
    const pathStack = cleanPath === 'projects' ? [] : cleanPath.split('/').filter(Boolean);
    let current = FILE_SYSTEM;
    for (const segment of pathStack) {
        current = current.children?.[segment];
        if (!current || current.type !== 'directory') return { exists: false };
    }
    if (!current || current.type !== 'directory') return { exists: false };
    return { exists: true, entry: current };
}

function getCompletions(partial, pathStack) {
    const content = getTerminalContent(getTerminalPathString(pathStack));
    if (!content.exists) return [];
    const entries = Object.keys(content.entry.children || {});
    if (!partial) return entries;
    return entries.filter(name => 
        name.toLowerCase().startsWith(partial.toLowerCase())
    );
}

function extractTarget(args) {
    if (args.length === 0) return '';
    const raw = args.join(' ');
    const trimmed = raw.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
    }
    if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}

function getTerminalPathString(pathStack) {
    if (pathStack.length === 0) return '~/projects';
    return `~/projects/${pathStack.join('/')}`;
}

export default function Projects() {
    const [pathStack, setPathStack] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [mode, setMode] = useState('browser');
    const [terminalPath, setTerminalPath] = useState([]);
    const [terminalHistory, setTerminalHistory] = useState([
        { type: 'output', content: 'Welcome to Terminal. Type "help" for available commands.' },
    ]);
    const [terminalInput, setTerminalInput] = useState('');
    const [tabCompletions, setTabCompletions] = useState([]);
    const [activeCompIdx, setActiveCompIdx] = useState(-1);
    const [cmdHistory, setCmdHistory] = useState([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const terminalInputRef = useRef(null);
    const terminalOutputRef = useRef(null);
    const completionsRef = useRef(null);

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

    const openTerminal = (e) => {
        if (e) e.preventDefault();
        setMode('terminal');
        setTerminalPath([]);
        setTerminalHistory([
            { type: 'output', content: 'Welcome to Terminal. Type "help" for available commands.' },
        ]);
        setTerminalInput('');
    };

    const closeTerminal = (e) => {
        if (e) e.preventDefault();
        setMode('browser');
    };

    const executeCommand = (cmd) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        setCmdHistory(prev => [...prev, trimmed]);
        setHistoryIdx(-1);
        setTabCompletions([]);
        setActiveCompIdx(-1);

        const parts = trimmed.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        let output = '';
        let newPath = [...terminalPath];

        switch (command) {
            case 'help':
                output = AVAILABLE_COMMANDS.map(c => `  ${c.name.padEnd(8)}${c.description}`).join('\n');
                break;
            case 'clear':
                setTerminalHistory([]);
                setTerminalInput('');
                return;
            case 'exit':
                closeTerminal();
                return;
            case 'ls': {
                const content = getTerminalContent(getTerminalPathString(terminalPath));
                if (!content.exists) {
                    output = 'Error: Current directory not found.';
                } else {
                    const entries = Object.entries(content.entry.children || {});
                    output = entries.map(([name, item]) => {
                        const suffix = item.type === 'directory' ? '/' : '';
                        return `${name}${suffix}`;
                    }).sort().join('  ');
                }
                break;
            }
            case 'cd': {
                const target = extractTarget(args);
                if (args.length === 0 || target === '~' || target === '/') {
                    newPath = [];
                    output = '';
                } else if (target === '..') {
                    if (newPath.length > 0) {
                        newPath = newPath.slice(0, -1);
                    }
                    output = '';
                } else {
                    const content = getTerminalContent(getTerminalPathString(terminalPath));
                    if (!content.exists) {
                        output = 'Error: Directory not found.';
                    } else {
                        let next = content.entry.children?.[target];
                        if (!next) {
                            const allKeys = Object.keys(content.entry.children || {});
                            const match = allKeys.find(k => k.toLowerCase() === target.toLowerCase());
                            if (match) next = content.entry.children?.[match];
                            if (next?.type === 'directory') {
                                newPath.push(match);
                                output = '';
                            } else if (!next) {
                                output = `cd: no such directory: ${target}`;
                            } else {
                                output = `cd: not a directory: ${target}`;
                            }
                        } else if (next?.type === 'directory') {
                            newPath.push(target);
                            output = '';
                        } else {
                            output = `cd: not a directory: ${target}`;
                        }
                    }
                }
                break;
            }
            case 'cat': {
                if (args.length === 0) {
                    output = 'Usage: cat <filename>';
                    break;
                }
                const target = extractTarget(args);
                const content = getTerminalContent(getTerminalPathString(terminalPath));
                if (!content.exists) {
                    output = 'Error: Directory not found.';
                } else {
                    let file = content.entry.children?.[target];
                    if (!file) {
                        const allKeys = Object.keys(content.entry.children || {});
                        const match = allKeys.find(k => k.toLowerCase() === target.toLowerCase());
                        if (match) file = content.entry.children?.[match];
                    }
                    if (file?.type === 'file') {
                        output = file.description || 'No content available.';
                    } else if (file?.type === 'directory') {
                        output = `cat: ${target}: Is a directory`;
                    } else {
                        output = `cat: ${target}: No such file`;
                    }
                }
                break;
            }
            default:
                output = `command not found: ${command}`;
        }

        const cmdToSave = trimmed;
        setTerminalHistory(prev => [
            ...prev,
            { type: 'input', content: `${getTerminalPathString(terminalPath)}$ ${cmd}` },
            ...(output ? [{ type: 'output', content: output }] : []),
        ]);
        setTerminalPath(newPath);
        setTerminalInput('');
        if (cmdToSave && !['clear', 'exit'].includes(command)) {
            setCmdHistory(prev => {
                const filtered = prev.filter(c => c !== cmdToSave);
                return [...filtered, cmdToSave].slice(-50);
            });
            setHistoryIdx(-1);
        }
    };

    const computeCompletions = useCallback(() => {
        const input = terminalInput.trim();
        const parts = input.split(/\s+/);

        if (!input) {
            return AVAILABLE_COMMANDS.map(c => ({
                name: c.name, type: 'command', desc: c.description,
            }));
        }

        if (parts.length === 1) {
            const partial = parts[0].toLowerCase();
            const cmdMatches = AVAILABLE_COMMANDS
                .filter(c => c.name.startsWith(partial))
                .map(c => ({ name: c.name, type: 'command', desc: c.description }));
            const content = getTerminalContent(getTerminalPathString(terminalPath));
            const fileMatches = content.exists
                ? Object.entries(content.entry.children || {})
                    .filter(([name]) => name.toLowerCase().startsWith(partial))
                    .map(([name, item]) => ({ name, type: item.type === 'directory' ? 'directory' : 'file' }))
                : [];
            return [...cmdMatches, ...fileMatches];
        }

        const cmd = parts[0].toLowerCase();
        let partial = parts.slice(1).join(' ').replace(/^["']/, '');
        const content = getTerminalContent(getTerminalPathString(terminalPath));
        if (!content.exists) return [];
        const entries = Object.entries(content.entry.children || {});

        if (cmd === 'cd') {
            return entries
                .filter(([, item]) => item.type === 'directory')
                .filter(([name]) => !partial || name.toLowerCase().startsWith(partial.toLowerCase()))
                .map(([name]) => ({ name, type: 'directory' }));
        }
        if (cmd === 'cat') {
            return entries
                .filter(([, item]) => item.type === 'file')
                .filter(([name]) => !partial || name.toLowerCase().startsWith(partial.toLowerCase()))
                .map(([name]) => ({ name, type: 'file' }));
        }
        if (cmd === 'ls') {
            return entries
                .filter(([name]) => !partial || name.toLowerCase().startsWith(partial.toLowerCase()))
                .map(([name, item]) => ({ name, type: item.type === 'directory' ? 'directory' : 'file' }));
        }
        return [];
    }, [terminalInput, terminalPath]);

    const applyCompletion = useCallback((comp) => {
        const input = terminalInput.trim();
        const parts = input.split(/\s+/);
        if (comp.type === 'command') {
            setTerminalInput(comp.name + ' ');
        } else {
            const cmd = parts.length >= 1 ? parts[0] : '';
            const needsQuote = comp.name.includes(' ');
            const quoted = needsQuote ? `"${comp.name}"` : comp.name;
            setTerminalInput(cmd ? cmd + ' ' + quoted : quoted);
        }
        setTabCompletions([]);
        setActiveCompIdx(-1);
    }, [terminalInput]);

    const handleInputChange = (e) => {
        setTerminalInput(e.target.value);
        setTabCompletions([]);
        setActiveCompIdx(-1);
        setHistoryIdx(-1);
    };

    const handleTerminalKeyDown = (e) => {
        if (tabCompletions.length > 0) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const next = (activeCompIdx + 1) % tabCompletions.length;
                setActiveCompIdx(next);
                return;
            }
            if (e.key === 'Enter' && activeCompIdx >= 0) {
                e.preventDefault();
                applyCompletion(tabCompletions[activeCompIdx]);
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveCompIdx(prev => Math.min(prev + 1, tabCompletions.length - 1));
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveCompIdx(prev => Math.max(prev - 1, 0));
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setTabCompletions([]);
                setActiveCompIdx(-1);
                return;
            }
        }

        if (e.key === 'Enter') {
            executeCommand(terminalInput);
        } else if (e.key === 'Escape') {
            closeTerminal();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const completions = computeCompletions();
            if (completions.length === 1) {
                applyCompletion(completions[0]);
            } else if (completions.length > 1) {
                setTabCompletions(completions);
                setActiveCompIdx(0);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const newIdx = historyIdx < cmdHistory.length - 1 ? historyIdx + 1 : historyIdx;
                setHistoryIdx(newIdx);
                setTerminalInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx > 0) {
                const newIdx = historyIdx - 1;
                setHistoryIdx(newIdx);
                setTerminalInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
            } else if (historyIdx === 0) {
                setHistoryIdx(-1);
                setTerminalInput('');
            }
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            setTerminalHistory([]);
            setTerminalInput('');
        }
    };

    useEffect(() => {
        if (mode === 'terminal' && terminalInputRef.current) {
            terminalInputRef.current.focus({ preventScroll: true });
        }
    }, [mode]);

    useEffect(() => {
        if (terminalOutputRef.current) {
            terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
    }, [terminalHistory]);

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
                                {mode === 'terminal' ? 'terminal' : selectedProject ? getDetailPathString(pathStack, selectedProject.name) : getPathString(pathStack)}
                            </span>
                        </div>
                        {mode === 'terminal' ? (
                            <button className="terminal-toggle" onClick={(e) => closeTerminal(e)} title="Open File Explorer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                </svg>
                            </button>
                        ) : (
                            <button className="terminal-toggle" onClick={(e) => openTerminal(e)} title="Open Terminal">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="4,17 10,11 4,5" />
                                    <line x1="12" y1="19" x2="20" y2="19" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="file-browser__content">
                        {/* Terminal Panel */}
                        <div className={`content-panel ${mode === 'terminal' ? 'content-panel--enter' : 'content-panel--exit'}`} style={{ padding: 0 }}>
                            <div className="terminal-container">
                                <div className="terminal-output" ref={terminalOutputRef}>
                                    {terminalHistory.map((entry, i) => (
                                        <div key={i} className={`terminal-line terminal-${entry.type}`}>
                                            {entry.content}
                                        </div>
                                    ))}
                                </div>
                                <div className="terminal-input-line">
                                    {tabCompletions.length > 0 && (
                                        <div className="tab-completions" ref={completionsRef}>
                                            {tabCompletions.map((comp, i) => (
                                                <div
                                                    key={comp.name}
                                                    className={`tab-completions__item ${i === activeCompIdx ? 'tab-completions__item--active' : ''}`}
                                                    onMouseDown={(e) => { e.preventDefault(); applyCompletion(comp); }}
                                                >
                                                    <span className={`comp-icon ${comp.type === 'directory' ? 'comp-dir' : comp.type === 'file' ? 'comp-file' : 'comp-cmd'}`}>
                                                        {comp.type === 'directory' ? '▸' : comp.type === 'command' ? '›' : '·'}
                                                    </span>
                                                    {comp.name}
                                                    {comp.desc && <span style={{ marginLeft: 'auto', opacity: 0.4, fontSize: '0.72rem' }}>{comp.desc}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <span className="terminal-prompt">{getTerminalPathString(terminalPath)}$ </span>
                                    <input
                                        ref={terminalInputRef}
                                        type="text"
                                        className="terminal-input"
                                        value={terminalInput}
                                        onChange={handleInputChange}
                                        onKeyDown={handleTerminalKeyDown}
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                        tabIndex={0}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Browser Panel */}
                        <div className={`content-panel ${mode !== 'terminal' ? 'content-panel--enter' : 'content-panel--exit'}`}>
                            {selectedProject ? (
                                <div className="project-detail">
                                    <div className="project-detail__header">
                                        <span className="project-detail__icon">
                                            <i className={`fa-solid ${selectedProject.icon}`} style={{ fontSize: '20px' }}></i>
                                        </span>
                                        <h3 className="project-detail__title">{selectedProject.name}</h3>
                                        {selectedProject.github && (
                                            <a href={selectedProject.github} className="project-detail__link" target="_blank" rel="noopener noreferrer" title="View on GitHub">
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
                                            <button key={name} className="file-grid-item file-grid-item--folder" onClick={() => handleFolderClick(name)}>
                                                <span className="file-grid-item__icon">
                                                    <FolderIcon />
                                                </span>
                                                <span className="file-grid-item__name">{name}</span>
                                            </button>
                                        ) : (
                                            <button key={name} className="file-grid-item file-grid-item--file" onClick={() => handleFileClick(name)}>
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
                    </div>
                    <div className="file-browser__footer">
                        <span className="file-browser__count">
                            {mode === 'terminal' ? '\u00A0' : selectedProject ? '\u00A0' : `${entries.length} items`}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}