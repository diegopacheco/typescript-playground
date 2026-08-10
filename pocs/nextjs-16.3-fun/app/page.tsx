'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', borderRadius: '16px' }}>Loading Map...</div>
});

type Restaurant = {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'crud' | 'map'>('crud');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [formData, setFormData] = useState({ name: '', type: '', address: '', lat: '', lng: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.address || !formData.lat || !formData.lng) return;
    
    const newRestaurant: Restaurant = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      type: formData.type,
      address: formData.address,
      lat: Number(formData.lat),
      lng: Number(formData.lng)
    };
    
    setRestaurants([...restaurants, newRestaurant]);
    setFormData({ name: '', type: '', address: '', lat: '', lng: '' });
  };

  const handleDelete = (id: string) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Restaurant Manager</h1>
      </header>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'crud' ? 'active' : ''}`}
          onClick={() => setActiveTab('crud')}
        >
          Manage Restaurants
        </button>
        <button 
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Map View
        </button>
      </div>

      {activeTab === 'crud' ? (
        <div className="grid-layout">
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Add Restaurant</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="The Daily Grind"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  placeholder="Cafe, Italian, etc."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="123 Main St"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input 
                    type="number"
                    step="any" 
                    className="form-input"
                    value={formData.lat}
                    onChange={e => setFormData({...formData, lat: e.target.value})}
                    placeholder="51.505"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input 
                    type="number"
                    step="any" 
                    className="form-input"
                    value={formData.lng}
                    onChange={e => setFormData({...formData, lng: e.target.value})}
                    placeholder="-0.09"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Save Restaurant</button>
            </form>
          </div>

          <div className="card table-container">
            {restaurants.length === 0 ? (
              <div className="empty-state">
                <p>No restaurants added yet. Add one to see it here.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td>{r.type}</td>
                      <td>{r.address}</td>
                      <td><span className="badge">Active</span></td>
                      <td>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(r.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="card">
          <Map restaurants={restaurants} />
        </div>
      )}
    </div>
  );
}
