import { useState } from 'react';
import HoverClickDropdown from './HoverClickDropdown';

function UserProfile() {
  // const [results, setResults] = useState([]);
  const [setResults] = useState([]);
  const [formData, setFormData] = useState({
    interests: '',
    objectives: '',
    location: '',
    'location-radius': '',
  });

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/filter-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <HoverClickDropdown
          label="Interests"
          name="interests"
          options={[
            { value: 'tech', label: 'Technology' },
            { value: 'sports', label: 'Sports' },
            { value: 'other', label: 'Other' },
          ]}
          onChange={handleDropdownChange}
        />

        <HoverClickDropdown
          label="Objectives"
          name="objectives"
          options={[
            { value: 'networking', label: 'Networking' },
            { value: 'learning', label: 'Learning' },
            { value: 'having lunch', label: 'Having lunch' },
            { value: 'venting to someone', label: 'Venting to someone' },
            { value: 'other', label: 'Other' },
          ]}
          onChange={handleDropdownChange}
        />

        <HoverClickDropdown
          label="Location"
          name="location"
          options={[
            { value: 'ny', label: 'New York' },
            { value: 'sf', label: 'San Francisco' },
            { value: 'other', label: 'Other' },
          ]}
          onChange={handleDropdownChange}
        />

        <HoverClickDropdown
          label="Location Radius"
          name="location-radius"
          options={[
            { value: '10', label: '10 miles' },
            { value: '15', label: '15 miles' },
            { value: '20', label: '20 miles' },
            { value: '25', label: '25 miles' },
            { value: 'other', label: 'Other' },
          ]}
          onChange={handleDropdownChange}
        />

        <br />
        <input type="submit" value="Submit" />
      </form>

      <hr />

      <h3>Filtered Results:</h3>
      <ul>
        {/* {results.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))} */}
      </ul>
    </>
  );
}

export default UserProfile;