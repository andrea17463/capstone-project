// frontend/src/components/ConnectionProfile/ConnectionProfile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addConnection,
  getConnection,
  fetchAllConnections,
  updateMeetingStatus,
  updateConnectionStatus,
  updateFeedback,
  removeConnection,
} from '../../store/user-connections';
// import { startGame } from '../../store/game-plays';

function ConnectionProfile() {
  const userConnectionsLoading = useSelector(state => state.userConnections.loading);
  const { userId } = useParams();
  console.log('userId:', userId, 'Type:', typeof userId);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [suggestedActivityInput, setSuggestedActivityInput] = useState('');
  const [meetingTimeInput, setMeetingTimeInput] = useState('');
  const [activityError, setActivityError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [statusType, setStatusType] = useState('');

  const connections = useSelector((state) => state.userConnections?.connections || []);
  const userIdNumber = Number(userId);
  const currentUserId = useSelector(state => state.session.user?.id);
  // const currentUser = useSelector((state) => state.session.user);
  const connection = connections.find(
    (conn) => conn.user_2_id === userIdNumber || conn.user_1_id === userIdNumber
  );

  console.log('Redux state:', useSelector(state => state));
  console.log('All connections:', connections);
  console.log('userIdNumber:', userIdNumber);
  console.log('Current connection:', connection);

  const clearMessages = () => {
    setStatusMessage('');
    setMessage('');
  };

  // const handleStartGame = async () => {
  //   if (!currentUser || !connection) return;

  //   const user1Id = currentUser.id;
  //   const user2Id = connection.user_1_id === user1Id ? connection.user_2_id : connection.user_1_id;

  //   try {
  //     const game = await dispatch(startGame({ user1Id, user2Id }));
  //     console.log('Game started:', game);
  //     if (game) {
  //       setMessage(`Game started with ${profile.username}`);
  //       navigate('/guess-me-game');
  //     }
  //   } catch (err) {
  //     console.error('Error starting game:', err);
  //     setMessage('Failed to start game.');
  //   }
  // };

  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          const profileRes = await fetch(`/api/users/${userId}`, { credentials: 'include' });
          if (profileRes.ok) {
            const data = await profileRes.json();
            console.log('API response data:', data);
            setProfile(data);
            setStatusMessage('');
          } else {
            throw new Error('Failed to load profile');
          }
        } catch (err) {
          console.error(err);
          setStatusMessage(err.message);
          setStatusType('error');
        }
      };

      fetchProfile();
      console.log('Dispatching getConnection for userId:', userId);
      dispatch(getConnection(userId));
    }
  }, [userId, dispatch]);

  const handleAcceptConnection = async () => {
    clearMessages();
    if (connection) {
      try {
        await dispatch(updateConnectionStatus(connection.id, 'accepted'));
        await dispatch(fetchAllConnections());
        setMessage('Connection accepted.');
      } catch (err) {
        console.error('Error accepting connection:', err);
        setMessage('Failed to accept connection.');
      }
    } else {
      console.log("No connection found for this user");
    }
  };

  const handleDeclineConnection = async () => {
    clearMessages();
    if (connection) {
      try {
        await dispatch(updateConnectionStatus(connection.id, 'declined'));
        await dispatch(fetchAllConnections());
        setMessage('Connection declined.');
      } catch (err) {
        console.error('Error declining connection:', err);
        setMessage('Failed to decline connection.');
      }
    }
  };

  const handleCancelRequest = async () => {
    clearMessages();
    if (!connection) {
      console.log("No connection found to cancel");
      setMessage("No connection request to cancel.");
      return;
    }

    const confirmed = window.confirm('Are you sure you want to cancel the meeting request?');
    if (confirmed) {
      try {
        await dispatch(removeConnection(connection.id));
        await dispatch(fetchAllConnections());
        setMessage('Connection request canceled.');
        setSuggestedActivityInput('');
        setMeetingTimeInput('');
      } catch (err) {
        console.error('Error canceling connection request:', err);
        setMessage('Failed to cancel the connection request.');
      }
    } else {
      console.log("Cancellation aborted");
    }
  };

  const handleWantToMeet = async () => {
    clearMessages();
    const user2Id = parseInt(userId);
    const suggestedActivity = suggestedActivityInput.trim();
    const rawDate = new Date(meetingTimeInput);

    console.log("Suggested activity:", `"${suggestedActivity}"`);
    console.log("Meeting time input:", meetingTimeInput);
    console.log("Raw date is valid:", !isNaN(rawDate));

    let hasError = false;
    setActivityError('');
    setTimeError('');

    if (!suggestedActivity || suggestedActivity.length < 3) {
      setActivityError("Please enter a valid activity (at least 3 characters).");
      hasError = true;
    }

    if (isNaN(rawDate)) {
      setTimeError("Please select a valid meeting time.");
      hasError = true;
    }

    if (hasError) return;

    const meetingTime = rawDate.toISOString();

    if (!connection) {
      try {
        await dispatch(
          addConnection(
            {
              user1Id: currentUserId, user2Id, suggestedActivity, meetingTime
            },
            (errMsg) => setStatusMessage(errMsg)
          )
        );
        await dispatch(fetchAllConnections());
        await dispatch(getConnection(userId));
        setMessage('Connection request sent!');
        setSuggestedActivityInput('');
        setMeetingTimeInput('');
      } catch (err) {
        console.error('Error sending connection request:', err);
        setMessage('Failed to send connection request.');
      }
    } else {
      setMessage('You already have a connection with this user.');
    }
  };

  const handleConfirmMeeting = async () => {
    clearMessages();
    if (connection) {
      try {
        await dispatch(updateMeetingStatus(connection.id, 'confirmed'));
        setMessage('Meeting confirmed.');
        await dispatch(fetchAllConnections());
        setMessage('Meeting confirmed.');
      } catch (err) {
        console.error('Error confirming meeting:', err);
        setMessage('Failed to confirm meeting.');
      }
    }
  };

  const handleMeetAgain = async () => {
    clearMessages();
    if (connection) {
      try {
        await dispatch(updateFeedback(connection.id, true));
        await dispatch(fetchAllConnections());
        setMessage('Your interest in meeting again has been noted.');
      } catch (err) {
        console.error('Error updating feedback:', err);
        setMessage('Failed to update feedback.');
      }
    }
  };

  const handleEndMeeting = async () => {
    clearMessages();
    if (connection) {
      try {
        await dispatch(removeConnection(connection.id));
        await dispatch(fetchAllConnections());
        setMessage('Meeting ended and connection removed.');
      } catch (err) {
        console.error('Error ending meeting:', err);
        setMessage('Failed to end meeting.');
      }
    }
  };

  const handleCancelMeeting = async () => {
    clearMessages();
    if (connection) {
      const confirmed = window.confirm('Are you sure you want to cancel the meeting?');
      if (!confirmed) return;

      try {
        await dispatch(updateMeetingStatus(connection.id, 'cancelled'));
        await dispatch(fetchAllConnections());
        setMessage('Meeting has been canceled.');
      } catch (err) {
        console.error('Error canceling meeting:', err);
        setMessage('Failed to cancel the meeting.');
      }
    }
  };

  const { game, loading: gameLoading, error } = useSelector((state) => state.gamePlays);

  { gameLoading && <p>Starting game...</p> }
  { error && <p>Error: {error}</p> }
  { game && <p>Game started with {profile?.username}!</p> }

  if (userConnectionsLoading) return <p>Loading connection...</p>;

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.fullName || profile.username}</h1>
      <p>Age: {profile.age}</p>
      <p>Interests: {profile.interests}</p>
      <p>Objectives: {profile.objectives}</p>
      <br />
      {statusMessage && (
        <p style={{ color: statusType === 'error' ? 'red' : 'green' }}>
          {statusMessage}
        </p>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      < br />
      <label>
        Suggested Activity:
        <input
          type="text"
          value={suggestedActivityInput}
          onChange={(e) => {
            setSuggestedActivityInput(e.target.value);
            setStatusMessage('');
          }}
          placeholder="e.g., Coffee chat"
        />
      </label>
      {activityError && <p style={{ color: 'red' }}>{activityError}</p>}
      < br />

      <label>
        Meeting Time:
        <input
          type="datetime-local"
          value={meetingTimeInput}
          onChange={(e) => {
            setMeetingTimeInput(e.target.value);
            setStatusMessage('');
          }}
        />
      </label>
      {timeError && <p style={{ color: 'red' }}>{timeError}</p>}
      < br />

      {!connection ? (
        <button onClick={handleWantToMeet}>Want to meet</button>
      ) : (
        <button disabled>Request already sent</button>
      )}
      <button onClick={handleCancelRequest}>Cancel request</button>
      <button onClick={handleAcceptConnection}>Accept Connection</button>
      <button onClick={handleDeclineConnection}>Decline Connection</button>
      <button onClick={handleConfirmMeeting}>Confirm Meeting</button>
      <button onClick={handleCancelMeeting}>Cancel Meeting</button>
      <button onClick={handleMeetAgain}>Meet Again</button>
      <button onClick={handleEndMeeting}>End Meeting</button>
      {/* <button disabled>Connection already exists</button> */}
      <br />
      <button
        // onClick={handleStartGame}
        className="start-game-button"
      >
        Start Game
      </button>
    </div>
  );
}

export default ConnectionProfile;