import { useState } from 'react';
import UserConnectionsForms from '../UserConnections/UserConnectionsForms';

function UserProfile() {
  const [results, setResults] = useState([]);
  const [interests, setInterests] = useState('');
  const [objectives, setObjectives] = useState('');
  const [location, setLocation] = useState('');
  const [locationRadius, setLocationRadius] = useState(0);
  const [matchType, setMatchType] = useState('any');

  const handleFilterResults = async () => {
    const response = await fetch('/api/filter-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interests,
        objectives,
        location,
        locationRadius,
        matchType,
      }),
    });

    const data = await response.json();
    console.log(data);

    setResults(data);
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

      <button onClick={handleFilterResults}>Filter Results</button>

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