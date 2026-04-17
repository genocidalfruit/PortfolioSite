import { useState, useEffect } from 'react';
import './Hero.css';

const ROLES = ['Full-Stack Developer', 'ML & Data Enthusiast', 'Quant Finance Builder', 'AI App Developer'];

const QUICK_LINKS = [
    { icon: <i className="fa-solid fa-user" style={{ color: 'white' }}></i>, label: 'About', count: 'Who I Am', href: '#about' },
    { icon: <i className="fa-solid fa-folder-open" style={{ color: 'white' }}></i>, label: 'Projects', count: 'Featured Work', href: '#projects' },
    { icon: <i className="fa-solid fa-envelope" style={{ color: 'white' }}></i>, label: 'Contact', count: 'Get in touch', href: '#contact' },
    { icon: <i className="fa-solid fa-file" style={{ color: 'white' }}></i>, label: 'Resume', count: 'View Resume', isResume: true },
];

export default function Hero() {
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showResume, setShowResume] = useState(false);

    useEffect(() => {
        const currentRole = ROLES[roleIndex];
        let timeout;

        if (!isDeleting && displayed.length < currentRole.length) {
            timeout = setTimeout(() => setDisplayed(currentRole.slice(0, displayed.length + 1)), 80);
        } else if (!isDeleting && displayed.length === currentRole.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        } else if (isDeleting && displayed.length === 0) {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }

        return () => clearTimeout(timeout);
    }, [displayed, isDeleting, roleIndex]);

    return (
        <section className="hero" id="hero">
            <div className="hero__inner container">
                <div className="hero__content">
                    <div className="hero__greeting animate-in">
                        <span className="hero__wave"><i className="fa-solid fa-hand"></i></span> Hello, I'm
                    </div>
                    <h1 className="hero__name animate-in delay-1">
                        <span className="text-gradient">Anshul Karanth</span>
                    </h1>
                    <div className="hero__role animate-in delay-2">
                        <span className="hero__role-text">{displayed}</span>
                        <span className="hero__cursor">_</span>
                    </div>
                    <p className="hero__bio animate-in delay-3">
                        I craft elegant, performant digital experiences with clean code and modern tools.
                        Passionate about developer experience, open source, and building things that matter.
                    </p>
                </div>

                <div className="hero__sidebar animate-in delay-3">
                    <div className="hero__card">
                        <h3 className="hero__card-title">Quick Navigation</h3>
                        <div className="hero__card-links">
                            {QUICK_LINKS.map((link) => (
                                link.isResume ? (
                                    <button key={link.label} className="hero__card-link" onClick={() => setShowResume(true)}>
                                        <span className="hero__card-link-icon">{link.icon}</span>
                                        <div className="hero__card-link-info">
                                            <span className="hero__card-link-label">{link.label}</span>
                                            <span className="hero__card-link-count">{link.count}</span>
                                        </div>
                                        <span className="hero__card-link-arrow">›</span>
                                    </button>
                                ) : (
                                    <a key={link.label} href={link.href} className="hero__card-link">
                                        <span className="hero__card-link-icon">{link.icon}</span>
                                        <div className="hero__card-link-info">
                                            <span className="hero__card-link-label">{link.label}</span>
                                            <span className="hero__card-link-count">{link.count}</span>
                                        </div>
                                        <span className="hero__card-link-arrow">›</span>
                                    </a>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showResume && (
                <div className="resume-modal" onClick={() => setShowResume(false)}>
                    <div className="resume-modal__content" onClick={(e) => e.stopPropagation()}>
                        <button className="resume-modal__close" onClick={() => setShowResume(false)}>×</button>
                        <iframe src="/assets/SDE.pdf" title="Resume" />
                    </div>
                </div>
            )}
        </section>
    );
}
