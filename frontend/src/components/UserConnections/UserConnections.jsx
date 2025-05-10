// frontend/src/components/UserConnections/UserConnections.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserConnectionsForms from './UserConnectionsForms';
// import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';

const UserConnections = () => {
  // useExtractCookiesCsrfToken();

  const [formData, setFormData] = useState({
    interests: '',
    objectives: '',
    location: '',
    locationRadius: '',
    customLocationRadius: '',
    matchType: '',
  });

  const [results, setResults] = useState(() => {
    const stored = localStorage.getItem('filteredResults');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('filteredResults', JSON.stringify(results));
  }, [results]);

  console.log('Filtered Results:', results);

  return (
    <div>
      <h1>User Connections</h1>

      <UserConnectionsForms
        formData={formData}
        setFormData={setFormData}
        setResults={setResults}
        results={results}
      />

      <hr />

      <h3>Filtered Results:</h3>
      <br />
      {results.length > 0 ? (
        <>
          {results.map((item, index) => {
            if (!item || !item.id || !item.username || !item.fullName) return null;

            return (
              <p key={index}>
                <strong>{item.username}</strong> ({item.fullName}) — Interests: {item.interests}, Objectives: {item.objectives}
                <br />
                <Link to={`/profile/${item.id}`}>
                  <button>View Connection Profile</button>
                </Link>
              </p>
            );
          })}
        </>
      ) : (
        <p>No results yet. Submit the form above.</p>
      )}
    </div>
  );
};

// Recommendations
// If both users match based on interests and/or objectives: Display both users to each other

// Social Meetings
// Lists of activities: Suggested meeting ideas like coffee or walk
// Places of activities: Suggested locations based on the shared location radius
// Calendar and time slots: Suggested time slots
// Add time button: Lets a user suggest a custom time
// Add activity button: Lets a user suggest a custom activity
// Add place button: Lets a user suggest a custom location

// Connections
// Want to meet button: Used to initiate a meeting
// Meet again button: Available after the meeting if a user wants to meet again
// End meeting button: Used to indicate a user does not want to continue; chat is disabled

// Report
// Report button: Allows a user to report another user for inappropriate behavior

export default UserConnections;