import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, CheckCircle, ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-logo">
                    Task<span style={{ color: 'white' }}>Flow</span>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="btn-outline" style={{ border: 'none', marginRight: '1rem' }}>Login</Link>
                    <Link to="/register" className="btn">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                <h1 className="animate-fade-in" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Manage Projects with <br /> Unmatched Speed
                </h1>
                <p className="animate-fade-in" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', marginInline: 'auto' }}>
                    The all-in-one workspace for high-performance teams. Plan, track, and collaborate without the clutter.
                </p>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Link to="/register" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
                        Start Free Trial <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
                    </Link>
                </div>
            </header>

            {/* Features */}
            <section className="container" style={{ padding: '4rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="card glass-panel">
                        <Layout size={32} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                        <h3>Intuitive Dashboard</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Get a birds-eye view of your project status and team velocity.</p>
                    </div>
                    <div className="card glass-panel">
                        <CheckCircle size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
                        <h3>Task Tracking</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Never lose track of a deadline with our smart notification system.</p>
                    </div>
                    {/* More cards... */}
                </div>
            </section>
        </div>
    );
};

export default Landing;
