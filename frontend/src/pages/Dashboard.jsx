import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, LogOut } from 'lucide-react';

const Dashboard = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [newItem, setNewItem] = useState({ name: '', description: '', priority: 'medium' });

    const navigate = useNavigate();

    const fetchResources = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/v1/resources', {
                headers: { 'token': token }
            });
            const data = await res.json();
            if (res.ok) {
                setResources(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/v1/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setShowModal(false);
                setNewItem({ name: '', description: '', priority: 'medium' });
                fetchResources(); // Refresh list
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-grid">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 style={{ color: 'var(--accent-primary)', marginBottom: '2rem' }}>TaskFlow</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Projects</a>
                    <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Analytics</a>
                    <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Settings</a>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                    <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Dashboard</h1>
                    <button className="btn" onClick={() => setShowModal(true)}>
                        <Plus size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> New Project
                    </button>
                </header>

                <div className="stat-grid">
                    <div className="stat-card">
                        <div style={{ color: 'var(--text-secondary)' }}>Total Projects</div>
                        <div className="stat-value">{resources.length}</div>
                    </div>
                    <div className="stat-card">
                        <div style={{ color: 'var(--text-secondary)' }}>Active Tasks</div>
                        <div className="stat-value">0</div>
                    </div>
                </div>

                <div className="card glass-panel">
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Projects</h3>
                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {resources.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No projects found. Create one!</p> : resources.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.description}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            background: item.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                                            color: item.priority === 'high' ? '#ef4444' : '#6366f1'
                                        }}>
                                            {item.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '400px', background: 'var(--bg-secondary)' }}>
                        <h2>New Project</h2>
                        <form onSubmit={handleCreate}>
                            <input
                                className="input-field"
                                placeholder="Project Name"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                required
                            />
                            <textarea
                                className="input-field"
                                placeholder="Description"
                                rows="3"
                                value={newItem.description}
                                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                            />
                            <select
                                className="input-field"
                                value={newItem.priority}
                                onChange={e => setNewItem({ ...newItem, priority: e.target.value })}
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn" style={{ flex: 1 }}>Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
