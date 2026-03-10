import './About.css';

export default function About() {
    return (
        <section className="section about" id="about">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">// about</span>
                    <h2 className="section-title">Who I Am</h2>
                </div>

                <div className="about__grid">
                    <div className="about__text">
                        <p className="about__intro">
                            I'm a full-stack developer with a passion for building clean, efficient,
                            and scalable software. I love turning complex problems into simple,
                            elegant solutions.
                        </p>
                        <p className="about__detail">
                            With experience spanning front-end interfaces to back-end
                            architectures, I bring ideas to life by writing code that's as
                            readable as it is performant. I believe in continuous learning,
                            open-source collaboration, and crafting tools that developers love to use.
                        </p>
                        <div className="about__stats">
                            <div className="about__stat">
                                <span className="about__stat-number text-gradient">3+</span>
                                <span className="about__stat-label">Years Experience</span>
                            </div>
                            <div className="about__stat">
                                <span className="about__stat-number text-gradient">20+</span>
                                <span className="about__stat-label">Projects Built</span>
                            </div>
                            <div className="about__stat">
                                <span className="about__stat-number text-gradient">10+</span>
                                <span className="about__stat-label">Technologies</span>
                            </div>
                        </div>
                    </div>

                    <div className="about__terminal">
                        <div className="about__terminal-header">
                            <div className="about__terminal-dots">
                                <span className="dot dot--red"></span>
                                <span className="dot dot--yellow"></span>
                                <span className="dot dot--green"></span>
                            </div>
                            <span className="about__terminal-title">about.sh</span>
                        </div>
                        <div className="about__terminal-body">
                            <code>
                                <span className="t-prompt">$</span> cat info.json<br /><br />
                                <span className="t-brace">{'{'}</span><br />
                                <span className="t-key">&nbsp;&nbsp;"name"</span>: <span className="t-string">"Your Name"</span>,<br />
                                <span className="t-key">&nbsp;&nbsp;"role"</span>: <span className="t-string">"Full-Stack Dev"</span>,<br />
                                <span className="t-key">&nbsp;&nbsp;"location"</span>: <span className="t-string">"Earth"</span>,<br />
                                <span className="t-key">&nbsp;&nbsp;"interests"</span>: [<br />
                                <span className="t-string">&nbsp;&nbsp;&nbsp;&nbsp;"Open Source"</span>,<br />
                                <span className="t-string">&nbsp;&nbsp;&nbsp;&nbsp;"System Design"</span>,<br />
                                <span className="t-string">&nbsp;&nbsp;&nbsp;&nbsp;"Creative Coding"</span><br />
                                &nbsp;&nbsp;],<br />
                                <span className="t-key">&nbsp;&nbsp;"available"</span>: <span className="t-bool">true</span><br />
                                <span className="t-brace">{'}'}</span><br /><br />
                                <span className="t-prompt">$</span> <span className="hero__cursor">_</span>
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
