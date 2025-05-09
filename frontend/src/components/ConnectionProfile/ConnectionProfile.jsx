// frontend/src/components/ConnectionProfile/ConnectionProfile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { csrfFetch } from '../../utils/csrf';
import {
  addConnection,
  // updateMeetingStatus,
  updateFeedback,
  removeConnection,
} from '../../store/user-connections';

function ConnectionProfile() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const profileRes = await fetch(`/api/users/${userId}`, { credentials: 'include' });
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data);
      }

      const connRes = await csrfFetch(`/api/connections/${userId}`);
      if (connRes.ok) {
        const connData = await connRes.json();
        setConnection(connData);
      } else {
        setConnection(null);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const handleWantToMeet = () => {
    if (!connection) {
      dispatch(addConnection({
        user_2_id: parseInt(userId),
        suggestedActivity: "Coffee chat",
        meetingTime: new Date().toISOString()
      }));
      setMessage('Connection request sent!');
    } else {
      setMessage('You already have a connection with this user.');
    }
  };

  const handleMeetAgain = async () => {
    if (connection) {
      console.log('handleMeetAgain connection', connection);
      await dispatch(updateFeedback(connection.id, true));
      setMessage('Your interest in meeting again has been noted.');
    }
  };

  const handleEndMeeting = async () => {
    if (connection) {
      console.log('handleEndMeeting connection', connection);
      await dispatch(removeConnection(connection.id));
      setConnection(null);
      setMessage('Meeting ended and connection removed.');
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.fullName || profile.username}</h1>
      <p>Age: {profile.age}</p>
      <p>Interests: {profile.interests}</p>
      <p>Objectives: {profile.objectives}</p>
      <br />
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <button onClick={handleWantToMeet}>Want to meet</button>
      <br />
      <button onClick={handleMeetAgain}>Meet again</button>
      <br />
      <button onClick={handleEndMeeting}>End meeting</button>
    </div>
  );
}

export default ConnectionProfile;