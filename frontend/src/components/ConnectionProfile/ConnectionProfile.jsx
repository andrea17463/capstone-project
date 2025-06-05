// frontend/src/components/ConnectionProfile/ConnectionProfile.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addConnection,
  getConnection,
  updateMeetingStatus,
  updateConnectionStatus,
  updateFeedback
} from '../../store/user-connections';
// import { startGame } from '../../store/game-plays';
import './ConnectionProfile.css';

function ConnectionProfile() {
  const userConnectionsLoading = useSelector(state => state.userConnections.loading);
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [suggestedActivityInput, setSuggestedActivityInput] = useState('');
  const [meetingTimeInput, setMeetingTimeInput] = useState('');
  const [activityError, setActivityError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [statusType, setStatusType] = useState('');

  const profileFetched = useRef(false);
  const connectionFetched = useRef(false);

  const connections = useSelector((state) => state.userConnections?.connections || []);
  const userIdNumber = Number(userId);
  const currentUserId = useSelector(state => state.session.user?.id);
  const { game, loading: gameLoading, error } = useSelector((state) => state.gamePlays);
  const currentUser = useSelector((state) => state.session.user);
  const connection = connections.find((conn) => conn.user_2_id === userIdNumber || conn.user_1_id === userIdNumber);

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
    if (userId && !profileFetched.current) {
      profileFetched.current = true;

      const fetchProfile = async () => {
        try {
          const profileRes = await fetch(`/api/users/${userId}`, { credentials: 'include' });
          if (profileRes.ok) {
            const data = await profileRes.json();
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
    }
  }, [userId]);

  useEffect(() => {
    if (userId && !connectionFetched.current) {
      connectionFetched.current = true;
      dispatch(getConnection(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (connection) {
      if (connection.suggestedActivity) {
        setSuggestedActivityInput(connection.suggestedActivity);
      }
      const localDateTimeString = (date) => {
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      if (connection.meetingTime) {
        const date = new Date(connection.meetingTime);
        setMeetingTimeInput(localDateTimeString(date));
      }
    }
  }, [connection]);

  const handleAcceptConnection = async () => {
    clearMessages();
    if (connection) {
      try {
        await dispatch(updateConnectionStatus(connection.id, 'accepted'));
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
      setMessage("No connection request to cancel.");
      return;
    }
    const confirmed = window.confirm('Are you sure you want to cancel the meeting request?');
    if (confirmed) {
      try {
        await dispatch(updateConnectionStatus(connection.id, 'pending'));
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
    let hasError = false;

    setActivityError('');
    setTimeError('');

    if (!suggestedActivity || suggestedActivity.length < 3) {
      setActivityError("Please enter a valid activity (at least 3 characters).");
      hasError = true;
    }

    if (isNaN(rawDate.getTime())) {
  setTimeError("Please select a valid meeting time.");
  hasError = true;
}

    if (hasError) return;

    const meetingTime = rawDate.toISOString();

    if (!connection || connection.connectionStatus === 'pending') {
      try {
        await dispatch(addConnection({
          user1Id: currentUserId,
          user2Id,
          suggestedActivity,
          meetingTime
        }, (errMsg) => setStatusMessage(errMsg)));

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
        await dispatch(updateConnectionStatus(connection.id, 'declined'));
        await dispatch(updateFeedback(connection.id, false));
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
        await dispatch(updateMeetingStatus(connection.id, 'canceled'));
        setMessage('Meeting has been canceled.');
      } catch (err) {
        console.error('Error canceling meeting:', err);
        setMessage('Failed to cancel the meeting.');
      }
    }
  };

  if (userConnectionsLoading) return <p>Loading connection...</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="connection-profile-wrapper">
      {gameLoading && <p>Starting game...</p>}
      {error && <p>Error: {error}</p>}
      {game && <p>Game started with {profile?.username}!</p>}

      <h1>
        {profile.fullName
          ? (currentUser && profile.id === currentUser.id
            ? profile.fullName
            : profile.fullName.split(' ')[0])
          : profile.username}
      </h1>
      <p>Username: {profile.username}</p>
      <p>Age: {profile.age}</p>
      <p>Interests: {profile.interests}</p>
      <p>Objectives: {profile.objectives}</p>
      <br />

      {connection && (
        <>
          <p><strong>Connection Status:</strong> {connection.connectionStatus}</p>
          <p><strong>Meeting Status:</strong> {connection.meetingStatus}</p>
          <p><strong>Suggested Activity:</strong> {connection.suggestedActivity}</p>
          <p><strong>Meeting Time:</strong> {connection.meetingTime ? new Date(connection.meetingTime).toLocaleString() : 'N/A'}</p>
          {currentUser.id === connection.user_1_id ? (
            <>
              <p><strong>Meet Again Choice (You):</strong> {String(connection.meetAgainChoiceUser1)}</p>
              <p><strong>Meet Again Choice (Them):</strong> {String(connection.meetAgainChoiceUser2)}</p>
            </>
          ) : (
            <>
              <p><strong>Meet Again Choice (You):</strong> {String(connection.meetAgainChoiceUser2)}</p>
              <p><strong>Meet Again Choice (Them):</strong> {String(connection.meetAgainChoiceUser1)}</p>
            </>
          )}
          <br />
        </>
      )}

      {statusMessage && (
        <p style={{ color: statusType === 'error' ? 'red' : 'green' }}>
          {statusMessage}
        </p>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <br />

      <div className="form-group">
  {activityError && <p style={{ color: 'red', marginBottom: '4px' }}>{activityError}</p>}
  <label>
    Suggested Activity:
    <input
      type="text"
      value={suggestedActivityInput}
      onChange={(e) => {
        setSuggestedActivityInput(e.target.value);
        setStatusMessage('');
        setActivityError('');
      }}
      placeholder="e.g., Coffee chat"
    />
  </label>
</div>

      <div className="form-group">
  {timeError && <p style={{ color: 'red', marginBottom: '4px' }}>{timeError}</p>}
  <label>
    Meeting Time:
    <input
      type="datetime-local"
      value={meetingTimeInput}
      onChange={(e) => {
        setMeetingTimeInput(e.target.value);
        setStatusMessage('');
        setTimeError('');
      }}
    />
  </label>
</div>

      {!connection ? (
        <button onClick={handleWantToMeet}>Want to meet</button>
      ) : connection.connectionStatus === 'pending' ? (
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