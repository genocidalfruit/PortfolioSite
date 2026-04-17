import './Contact.css';

const LINKS = [
    {
        icon: <i className="fa-solid fa-envelope" style={{ color: 'white' }}></i>,
        label: 'Email',
        value: 'karanthanshul@gmail.com',
        href: 'mailto:karanthanshul@gmail.com',
    },
    {
        icon: <i className="fa-brands fa-github" style={{ color: 'white' }}></i>,
        label: 'GitHub',
        value: 'github.com/genocidalfruit',
        href: 'https://github.com/genocidalfruit',
        external: true,
    },
    {
        icon: <i className="fa-brands fa-linkedin" style={{ color: 'white' }}></i>,
        label: 'LinkedIn',
        value: 'linkedin.com/in/anshul-karanth-938449278/',
        href: 'https://www.linkedin.com/in/anshul-karanth-938449278/',
        external: true,
    },
];

export default function Contact() {
    return (
        <section className="section contact" id="contact">
            <div className="container">
                <div className="section-header">
                    <span className="section-label">// contact</span>
                    <h2 className="section-title">Get In Touch</h2>
                </div>

                <div className="contact__layout">
                    {/* Left — intro + availability */}
                    <div className="contact__left">
                        <p className="contact__intro">
                            Have a project in mind, a question, or just want to say hello?
                            I'd love to hear from you — reach out through any of the channels below.
                        </p>

                        <div className="contact__availability">
                            <div className="contact__availability-dot"></div>
                            <div>
                                <span className="contact__availability-label">Currently available</span>
                                <span className="contact__availability-sub">
                                    Open to collaborations and freelance work
                                </span>
                            </div>
                        </div>

                        <div className="contact__tagline">
                            <span className="t-prompt">$</span> echo "Let's build something great"
                        </div>
                    </div>

                    {/* Right — link cards */}
                    <div className="contact__links">
                        {LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="contact__link card"
                                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            >
                                <span className="contact__link-icon">{link.icon}</span>
                                <div className="contact__link-body">
                                    <span className="contact__link-label">{link.label}</span>
                                    <span className="contact__link-value">{link.value}</span>
                                </div>
                                <span className="contact__link-arrow">›</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
