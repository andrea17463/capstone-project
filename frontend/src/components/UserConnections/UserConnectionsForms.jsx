import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HoverClickDropdown from '../UserProfile/HoverClickDropdown';
import { restoreUser } from '../../store/session';
import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';

function UserConnectionsForms({ setResults }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  useExtractCookiesCsrfToken();

  console.log("User from Redux:", user);

  const [formData, setFormData] = useState({
    interests: '',
    objectives: '',
    location: '',
    locationRadius: '',
    matchType: '',
    customLocationRadius: '',
  });

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.id) {
      setFormData((prev) => ({
        ...prev,
        userId: user.id,
      }));
    }
  }, [user]);

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      if (name === 'locationRadius' && value === 'other') {
        newFormData.customLocationRadius = '';
      }

      return newFormData;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Document cookies:", document.cookie);

    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

      console.log("Extracted CSRF Token:", csrfToken);

    try {
      const locationRadius = formData.locationRadius === 'other' ? parseInt(formData.customLocationRadius) || 0 : parseInt(formData.locationRadius) || 0;

      const response = await fetch('http://localhost:8000/api/filter-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          locationRadius,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filtered results');
      }

      const data = await response.json();
      console.log('Filtered results:', data);

      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  return (
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
          { value: 'ny', label: 'New York, NY' },
          { value: 'sf', label: 'San Francisco, CA' },
          { value: 'other', label: 'Other' },
        ]}
        onChange={handleDropdownChange}
      />

      <HoverClickDropdown
        label="Location Radius"
        name="locationRadius"
        options={[
          { value: '10', label: '10 miles' },
          { value: '15', label: '15 miles' },
          { value: '20', label: '20 miles' },
          { value: '25', label: '25 miles' },
          { value: 'other', label: 'Other' },
        ]}
        onChange={handleDropdownChange}
      />

      {formData.locationRadius === 'other' && (
        <div>
          <label>Custom Location Radius (miles):</label>
          <input
            type="number"
            name="customLocationRadius"
            value={formData.customLocationRadius}
            onChange={handleInputChange}
            placeholder="Enter custom radius"
          />
        </div>
      )}

      <HoverClickDropdown
        label="Match Type"
        name="matchType"
        options={[
          { value: 'any', label: 'Match any' },
          { value: 'all', label: 'Match all' },
          { value: 'some', label: 'Match at least two' },
        ]}
        onChange={handleDropdownChange}
      />

      <br />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default UserConnectionsForms;