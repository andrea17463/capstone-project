// frontend/src/components/UserConnectionsForms/UserConnectionsForms.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import HoverClickDropdown from '../UserProfile/HoverClickDropdown';
// import useExtractCookiesCsrfToken from '../../hooks/extract-cookies-csrf-token';

function UserConnectionsForms({ formData, setFormData, setResults }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.session.user);

  // useExtractCookiesCsrfToken();

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
    setIsSubmitting(true);
    setError(null);

    if (!formData.interests || !formData.objectives || !formData.location || !formData.matchType) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    try {
      const locationRadius =
        formData.locationRadius === 'other'
          ? parseInt(formData.customLocationRadius) || 0
          : parseInt(formData.locationRadius) || 0;

      const payload = {
        ...formData,
        locationRadius,
        customLocationRadius:
          formData.locationRadius === 'other' ? formData.customLocationRadius : '',
        userId: user?.id,
      };

      const response = await fetch('/api/filter-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Server responded with an error');

      const data = await response.json();
      console.log('Filtered Data:', data);
      setResults(data);
    } catch (error) {
      console.error('Failed to fetch filtered results:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearResults = async () => {
    setError(null);

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
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) throw new Error('Reset failed');

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Failed to clear filter results:', error);
      setError('Failed to clear results.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <HoverClickDropdown
          label="Interests"
          name="interests"
          options={[
            { value: 'tech', label: 'Technology' },
            { value: 'sports', label: 'Sports' },
            { value: 'other', label: 'Other' },
          ]}
          value={formData.interests}
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
          value={formData.objectives}
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
          value={formData.location}
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
          value={formData.locationRadius}
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
          value={formData.matchType}
          onChange={handleDropdownChange}
        />

        <br />
        <input type="submit" value="Submit" disabled={isSubmitting} />
      </form>

      <button type="button" onClick={handleClearResults}>
        Clear Filtered Results
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UserConnectionsForms;