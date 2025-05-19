// frontend/src/components/UserConnectionsForms/UserConnectionsForms.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HoverClickDropdown from '../UserProfile/HoverClickDropdown';
import { csrfFetch } from '../../store/csrf';
import { setFilteredResults } from '../../store/user-connections';
import './UserConnectionsForms.css';

function UserConnectionsForms({ formData, setFormData, setResults, onSubmitSuccess,
}) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.session.user);

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => {
      const newFormData = { ...prev };

      if (['interests', 'objectives'].includes(name)) {
        newFormData[name] = Array.isArray(value) ? value : [value];
      } else {
        newFormData[name] = value;
      }

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

    if (
      !formData.interests.length ||
      !formData.objectives.length ||
      !formData.location ||
      !formData.matchType
    ) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

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

      const response = await csrfFetch('/filter-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Server responded with an error');

      const data = await response.json();
      setResults(data);
      dispatch(setFilteredResults(data));
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error('Failed to fetch filtered results:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearResults = async () => {
    setError(null);

    try {
      const response = await csrfFetch('/filter-results/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) throw new Error('Reset failed');

      await response.json();
      setResults([]);
      localStorage.removeItem(`filteredResults-${user.id}`);
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
        <input className="submit-button" type="submit" value="Submit" disabled={isSubmitting} />
      </form>

      <br />
      <button className="clear-filtered-results-button" type="button" onClick={handleClearResults}>
        Clear Filtered Results
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UserConnectionsForms;