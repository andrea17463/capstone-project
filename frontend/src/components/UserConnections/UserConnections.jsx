import { useState } from 'react';
import UserConnectionsForms from './UserConnectionsForms';
import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';

const UserConnections = () => {
  useExtractCookiesCsrfToken();

  const [formData, setFormData] = useState({
    interests: '',
    objectives: '',
    location: '',
    locationRadius: '',
    matchType: '',
    customLocationRadius: '',
  });

  const [results, setResults] = useState([]);

  return (
    <div>
      <h1>UserConnections</h1>

      <UserConnectionsForms
        formData={formData}
        setFormData={setFormData}
        setResults={setResults}
      />

      <hr />

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