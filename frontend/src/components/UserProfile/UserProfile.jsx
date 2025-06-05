// frontend/src/components/UserProfile/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUser } from '../../store/session';
import { deleteUser } from '../../store/users';
import { csrfFetch } from '../../store/csrf';
import './UserProfile.css';

function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  const [formData, setFormData] = useState({
    age: '',
    interests: [],
    objectives: [],
    location: '',
    locationRadius: '',
    customLocationRadius: '',
    availability: '',
    matchType: 'any',
  });

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age?.toString() || '',
        interests: Array.isArray(user.interests) ? user.interests : [],
        objectives: Array.isArray(user.objectives) ? user.objectives : [],
        location: user.location || '',
        locationRadius: user.locationRadius?.toString() || '',
        customLocationRadius: '',
        availability: user.availability || '',
        matchType: 'any',
      });
      setShowProfileInfo(true);
    }
  }, [user]);

  const handleLocationRadiusChange = (e) => {
    const value = e.target.value;
    if (value === "other") {
      setFormData((prev) => ({ ...prev, locationRadius: value, customLocationRadius: '' }));
    } else {
      setFormData((prev) => ({ ...prev, locationRadius: value, customLocationRadius: '' }));
    }
  };

  const handleCustomLocationRadiusChange = (e) => {
    setFormData((prev) => ({ ...prev, customLocationRadius: e.target.value }));
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {

      try {
        const response = await csrfFetch('/users', {
          method: 'DELETE',
          headers: {
          },
        });

        if (response.ok) {
          await dispatch(deleteUser());
          window.location.href = '/';
        } else {
          alert('Failed to delete profile.');
        }
      } catch (err) {
        console.error('Failed to delete profile:', err);
        alert('There was an error deleting your profile.');
      }
    }
  };

  const handleEditProfile = async () => {
    const locationRadius =
      formData.locationRadius === 'other'
        ? parseInt(formData.customLocationRadius) || 0
        : parseInt(formData.locationRadius) || 0;

    const updates = {
      age: parseInt(formData.age) || null,
      location: formData.location,
      locationRadius,
      availability: formData.availability,
      interests: formData.interests,
      objectives: formData.objectives,
    };

    try {

      const response = await csrfFetch('/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await dispatch(restoreUser());
        alert('Profile updated successfully!');
        setIsEditing(false);
        setShowProfileInfo(true);
      } else {
        alert('There was an error updating your profile.');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('There was an error updating your profile.');
    }
  };

  if (!user) {
    return (
      <>
        <p>Please log in or sign up to create a profile.</p>
      </>
    );
  }

  return (
    <div className="user-profile-wrapper">
      <h2>User Profile</h2>

      <div>
        <button className="edit-profile-button" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? 'Cancel' : 'Edit profile'}
        </button>
      </div>
      < br />

      <div>
        <button className="delete-profile-button" onClick={handleDeleteProfile}>Delete profile</button>
      </div>

      {showProfileInfo && !isEditing && (
        <div className="user-info">
          <h3>Profile Information</h3>
          {/* <p><strong>Full Name:</strong> {user.fullName || 'N/A'}</p> */}
          <p>
            <strong>Full Name:</strong>{" "}
            {user && user.fullName
              ? (user.id === (user?.id)
                ? user.fullName
                : user.fullName.split(' ')[0])
              : 'N/A'}
          </p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Interests:</strong> {user.interests || 'No interests added'}</p>
          <p><strong>Objectives:</strong> {user.objectives || 'No objectives added'}</p>
        </div>
      )}

      {isEditing && (
        <div>
          <h3>Edit Profile</h3>
          <form>
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />

            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <label htmlFor="locationRadius">Location Radius:</label>
            <select
              id="locationRadius"
              value={formData.locationRadius}
              onChange={handleLocationRadiusChange}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value="other">Other</option>
            </select>

            {formData.locationRadius === 'other' && (
              <input
                type="number"
                placeholder="Enter custom radius"
                value={formData.customLocationRadius}
                onChange={handleCustomLocationRadiusChange}
              />
            )}

            <label htmlFor="availability">Availability:</label>
            <select
              id="availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            >
              <option value="">Select availability</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="mornings">Mornings</option>
              <option value="evenings">Evenings</option>
              <option value="flexible">Flexible</option>
            </select>

            <p>Instructions: If selecting more than one interest, press and hold CTRL or CMD and click on more than one interest from the list or press Shift to select a range of interests.</p>

            <label htmlFor="interests">Interests:</label>
            <select
              id="interests"
              multiple
              value={formData.interests}
              onChange={(e) =>
                setFormData({ ...formData, interests: Array.from(e.target.selectedOptions, opt => opt.value) })
              }
            >
              <option value="">Select interest</option>
              <option value="sports">Sports</option>
              <option value="movies">Movies</option>
              <option value="Art">Art</option>
              <option value="Cooking">Cooking</option>
              <option value="Fitness">Fitness</option>
              <option value="Food">Food</option>
              <option value="Hiking">Hiking</option>
              <option value="Music">Music</option>
              <option value="Photography">Photography</option>
              <option value="Reading">Reading</option>
              <option value="Technology">Technology</option>
              <option value="Traveling">Traveling</option>
              <option value="Volunteering">Volunteering</option>
              <option value="Yoga">Yoga</option>
              <option value="Personal Growth">Personal Growth</option>
              <option value="Skill Development">Skill Development</option>
              <option value="other">Other</option>
            </select>

            <p>Instructions: If selecting more than one objective, press and hold CTRL or CMD and click on more than one objective from the list or press Shift to select a range of objectives.</p>
            <label htmlFor="objectives">Objectives:</label>
            <select
              id="objectives"
              multiple
              value={formData.objectives}
              onChange={(e) =>
                setFormData({ ...formData, objectives: Array.from(e.target.selectedOptions, opt => opt.value) })
              }
            >
              <option value="">Select objective</option>
              <option value="Meeting New People">Meeting New People</option>
              <option value="Networking">Networking</option>
              <option value="Skill Development">Skill Development</option>
              <option value="Personal Growth">Personal Growth</option>
              <option value="Building Connections">Building Connections</option>
              <option value="Having Lunch">Having Lunch</option>
              <option value="Venting to Someone">Venting to Someone</option>
              <option value="Other">Other</option>
            </select>
            <button type="button" onClick={handleEditProfile}>Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserProfile;