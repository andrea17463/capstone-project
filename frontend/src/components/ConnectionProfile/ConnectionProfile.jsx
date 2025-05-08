// frontend/src/components/ConnectionProfile/ConnectionProfile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ConnectionProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`/api/users/${userId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching profile:', error);
        return;
      }

      const data = await response.json();
      setProfile(data);
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{profile.fullName || profile.username}</h1>
      <p>Age: {profile.age}</p>
      <p>Interests: {profile.interests}</p>
      <p>Objectives: {profile.objectives}</p>
      <br />
      <button>Want to meet</button>
      <br />
      <button>Meet again</button>
      <br />
      <button>End meeting</button>
    </div>
  );
}

export default ConnectionProfile;