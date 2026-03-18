import React from 'react';
import MiniCoder from './MiniCoder';

const Dashboard = () => {
    return (
        <div style={{ padding: '24px', background: '#121212', minHeight: '100vh' }}>
            <h1 style={{ color: '#eee', fontFamily: 'Arial, sans-serif', marginBottom: '24px' }}>
                Agency Agent Dashboard
            </h1>
            <MiniCoder />
        </div>
    );
};

export default Dashboard;