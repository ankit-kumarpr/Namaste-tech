import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const Protected = (props) => {
    const { Component } = props;
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    React.useEffect(() => {
        if (!loading && !isAuthenticated()) {
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated()) {
        return null;
    }

    return <Component />;
};

export default Protected;