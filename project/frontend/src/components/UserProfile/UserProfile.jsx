import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';
import UserConnectionsForms from '../UserConnections/UserConnectionsForms';
import { restoreUser } from '../../store/session';

function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [results, setResults] = useState([]);
  const [interests, setInterests] = useState('');
  const [objectives, setObjectives] = useState('');
  const [location, setLocation] = useState('');
  const [locationRadius, setLocationRadius] = useState(0);
  const [matchType, setMatchType] = useState('any');

  useExtractCookiesCsrfToken();

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  const handleCancel = async () => {

    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    try {
      const response = await fetch('/api/filter-results/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          interests,
          objectives,
          location,
          locationRadius,
          matchType,
          userId: user?.id,
        }),
      });

      const data = await response.json();
      console.log(data);

      setResults(data);
    } catch (error) {
      console.error('Failed to reset filter results:', error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>

      <UserConnectionsForms
        setInterests={setInterests}
        setObjectives={setObjectives}
        setLocation={setLocation}
        setLocationRadius={setLocationRadius}
        setMatchType={setMatchType}
        setResults={setResults}
      />

      <hr />

      <button onClick={handleCancel}>Clear Filter Results</button>

      <h3>Filtered Results:</h3>
      {results.length > 0 ? (
        <ul>
          {results.map((item, index) => (
            <li key={index}>
              <strong>{item.username}</strong> ({item.firstName}) — Interests: {item.interests}, Objectives: {item.objectives}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results yet. Submit the form above.</p>
      )}
    </div>
  );
}

export default UserProfile;