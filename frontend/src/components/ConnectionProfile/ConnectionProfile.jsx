// frontend/src/components/ConnectionProfile/ConnectionProfile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addConnection,
  getConnection,
  updateMeetingStatus,
  updateConnectionStatus,
  updateFeedback,
  removeConnection,
} from '../../store/user-connections';

function ConnectionProfile() {
  const loading = useSelector(state => state.userconnections.loading);
  const { userId } = useParams();
  console.log('userId:', userId, 'Type:', typeof userId);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const connections = useSelector((state) => state.userconnections?.connections || []);
  const userIdNumber = Number(userId);
  const connection = connections.find(
    (conn) => conn.user_2_id === userIdNumber || conn.user_1_id === userIdNumber
  );

  const userconnections = useSelector(state => state.userconnections);
  console.log('Userconnections:', userconnections);
  console.log('All connections:', connections);
  console.log('userIdNumber:', userIdNumber);
  console.log('Current connection:', connection);

  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          const profileRes = await fetch(`/api/users/${userId}`, { credentials: 'include' });
          if (profileRes.ok) {
            const data = await profileRes.json();
            console.log('API response data:', data);
            setProfile(data);
            setError(null);
          } else {
            throw new Error('Failed to load profile');
          }
        } catch (err) {
          console.error(err);
          setError(err.message);
        }
      };

      fetchProfile();
      console.log('Dispatching getConnection for userId:', userId);
      dispatch(getConnection(userId));
    }
  }, [userId, dispatch]);

  const handleAcceptConnection = async () => {
    if (connection) {
      await dispatch(updateConnectionStatus(connection.id, 'accepted'));
      setMessage('Connection accepted.');
    } else {
      console.log("No connection found for this user");
    }
  };

  const handleDeclineConnection = async () => {
    if (connection) {
      await dispatch(updateConnectionStatus(connection.id, 'declined'));
      setMessage('Connection declined.');
    }
  };

  const handleCancelRequest = async () => {
    if (!connection) {
      console.log("No connection found to cancel");
      setMessage("No connection request to cancel.");
      return;
    }

    const confirmed = window.confirm('Are you sure you want to cancel the meeting request?');
    if (confirmed) {
      try {
        await dispatch(removeConnection(connection.id));
        setMessage('Connection request canceled.');
      } catch (err) {
        console.error('Error canceling connection request:', err);
        setMessage('Failed to cancel the connection request.');
      }
    } else {
      console.log("Cancellation aborted");
    }
  };

  const handleWantToMeet = () => {
    const user_2_id = parseInt(userId);
    const suggestedActivity = "Coffee chat";
    const meetingTime = new Date().toISOString();

    if (!user_2_id || !suggestedActivity || isNaN(new Date(meetingTime))) {
      setError("Missing or invalid connection fields");
      return;
    }

    if (!connection) {
      dispatch(addConnection({ user_2_id, suggestedActivity, meetingTime }));
      setMessage('Connection request sent!');
    } else {
      setMessage('You already have a connection with this user.');
    }
  };

  const handleConfirmMeeting = async () => {
    if (connection) {
      await dispatch(updateMeetingStatus(connection.id, 'confirmed'));
      setMessage('Meeting confirmed.');
    }
  };

  const handleMeetAgain = async () => {
    if (connection) {
      await dispatch(updateFeedback(connection.id, true));
      setMessage('Your interest in meeting again has been noted.');
    }
  };

  const handleEndMeeting = async () => {
    if (connection) {
      await dispatch(removeConnection(connection.id));
      setMessage('Meeting ended and connection removed.');
    }
  };

  const handleCancelMeeting = async () => {
    if (connection) {
      const confirmed = window.confirm('Are you sure you want to cancel the meeting?');
      if (!confirmed) return;

      try {
        await dispatch(updateMeetingStatus(connection.id, 'cancelled'));
        setMessage('Meeting has been canceled.');
      } catch (err) {
        console.error('Error canceling meeting:', err);
        setMessage('Failed to cancel the meeting.');
      }
    }
  };

  if (loading) return <p>Loading connection...</p>;

  if (error) return <p style={{ color: 'red' }}>Error loading profile: {error}</p>;

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
      {/* <button disabled>Request sent</button> */}
      <button onClick={handleCancelRequest}>Cancel request</button>
      <button onClick={handleAcceptConnection}>Accept Connection</button>
      <button onClick={handleDeclineConnection}>Decline Connection</button>
      <button onClick={handleConfirmMeeting}>Confirm Meeting</button>
      <button onClick={handleCancelMeeting}>Cancel Meeting</button>
      <button onClick={handleMeetAgain}>Meet Again</button>
      <button onClick={handleEndMeeting}>End Meeting</button>
      {/* <button disabled>Connection already exists</button> */}
    </div>
  );
}

export default ConnectionProfile;