import { useState, useEffect } from 'react';
import './Hero.css';

const ROLES = ['Full-Stack Developer', 'ML & Data Enthusiast', 'Quant Finance Builder', 'AI App Developer'];

const QUICK_LINKS = [
    { icon: <i className="fa-solid fa-user"></i>, label: 'About', count: 'My story', href: '#about' },
    { icon: <i className="fa-solid fa-folder-open"></i>, label: 'Projects', count: '8 featured', href: '#projects' },
    { icon: <i className="fa-solid fa-envelope"></i>, label: 'Contact', count: 'Get in touch', href: '#contact' },
];

export default function Hero() {
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

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
                                <a key={link.label} href={link.href} className="hero__card-link">
                                    <span className="hero__card-link-icon">{link.icon}</span>
                                    <div className="hero__card-link-info">
                                        <span className="hero__card-link-label">{link.label}</span>
                                        <span className="hero__card-link-count">{link.count}</span>
                                    </div>
                                    <span className="hero__card-link-arrow">›</span>
                                </a>
                            ))}
                        </div>
                        <a href="#about" className="hero__card-footer">
                            Learn More About Me →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
