// frontend/src/components/ConnectionProfile/ProtectedConnectionProfile.jsx
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ConnectionProfile from './ConnectionProfile';

const ProtectedConnectionProfile = () => {
  const { userId } = useParams();
  const user = useSelector(state => state.session.user);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`filteredResults-${user.id}`);
      const results = stored ? JSON.parse(stored) : [];
      setFilteredResults(results);
      setLoading(false);
    }
  }, [user?.id]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (parseInt(userId) === user.id) {
    return <Navigate to="/profile" replace />;
  }

  if (loading) {
    return <p>Loading filtered results...</p>;
  }

  if (!filteredResults || filteredResults.length === 0) {
    return (
      <div>
        <p>No filtered results found.</p>
        <p>Please go to <a href="/user-connections">User Connections</a> to set your preferences and find potential matches.</p>
      </div>
    );
  }

  const userIdNum = parseInt(userId);
  const canView = filteredResults.some((u) => u.id === userIdNum);

  const containerStyle = {
    border: '2px solid #ccc',
    borderRadius: '12px',
    padding: '2rem',
    margin: '0 auto',
    maxWidth: '800px',
    boxShadow: '0 0 10px white'
  };

  if (!canView) {
    return (
      <div style={containerStyle}>
        <p>You do not have access to view this profile.</p>
        <p>This user is not in your current filtered results. Please update your preferences in <a href="/connections">User Connections</a> if you&apos;d like to find different matches.</p>
      </div>
    );
  }
  return <ConnectionProfile skipConnectionsFetch={true} />;
};

export default ProtectedConnectionProfile;