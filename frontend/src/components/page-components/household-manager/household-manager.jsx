import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '../../../atoms';
import { apiClient } from '../../../utils/api-client';
import { Link } from 'react-router-dom';
import { CurrentUserFlag } from '../../reusable-components/current-user-flag/current-user-flag';
import styles from './household-manager.module.css';

export const HouseholdManager = () => {
  const currentUser = useAtomValue(currentUserAtom);
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHouseholdInfo();
  }, [currentUser]);

  const fetchHouseholdInfo = async () => {
    setLoading(true);
    const result = await apiClient.getHouseholdInfo();
    if (result.success) {
      setHousehold(result.data.household);
    }
    setLoading(false);
  };

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    if (!householdName.trim()) {
      setMessage('Please enter a household name');
      return;
    }

    const result = await apiClient.createHousehold(householdName);
    if (result.success) {
      setMessage('Household created successfully! Please log out and log back in to see full household features.');
      setHouseholdName('');
      setShowCreateForm(false);
      // Wait a bit then refetch without reload
      setTimeout(() => {
        fetchHouseholdInfo();
        setMessage('');
      }, 3000);
    } else {
      setMessage(result.error);
    }
  };

  const handleJoinHousehold = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setMessage('Please enter an invite code');
      return;
    }

    const result = await apiClient.joinHousehold(inviteCode);
    if (result.success) {
      setMessage('Successfully joined household! Please log out and log back in to see full household features.');
      setInviteCode('');
      setShowJoinForm(false);
      // Wait a bit then refetch without reload
      setTimeout(() => {
        fetchHouseholdInfo();
        setMessage('');
      }, 3000);
    } else {
      setMessage(result.error);
    }
  };

  const handleLeaveHousehold = async () => {
    const confirmMessage = household?.isOwner
      ? 'Are you sure you want to delete this household? All members will be removed.'
      : 'Are you sure you want to leave this household?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const result = await apiClient.leaveHousehold();
    if (result.success) {
      setMessage((household?.isOwner ? 'Household deleted successfully' : 'Left household successfully') + ' Please log out and log back in to complete the process.');
      setHousehold(null);
      // Wait a bit then refetch without reload
      setTimeout(() => {
        fetchHouseholdInfo();
        setMessage('');
      }, 3000);
    } else {
      setMessage(result.error);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(household.invite_code);
    setMessage('Invite code copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <CurrentUserFlag username={currentUser?.username || ''} />
      <h2>Household Manager</h2>
      <Link to="/menu-page" className={styles.menuLink}>
        <img className={styles.logo} src="/512ktbudgebudiconlogo.png" alt="logo" />
      </Link>

      {message && <div className={styles.message}>{message}</div>}

      {/* No Household */}
      {!household && (
        <div className={styles.noHousehold}>
          <p>You are not currently in a household.</p>
          <div className={styles.actionButtons}>
            <button 
              onClick={() => {
                setShowCreateForm(true);
                setShowJoinForm(false);
              }} 
              className={styles.primaryButton}
            >
              Create Household
            </button>
            <button 
              onClick={() => {
                setShowJoinForm(true);
                setShowCreateForm(false);
              }} 
              className={styles.secondaryButton}
            >
              Join Household
            </button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateHousehold} className={styles.form}>
              <h3>Create New Household</h3>
              <input
                type="text"
                placeholder="Household Name"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                className={styles.input}
              />
              <div className={styles.formButtons}>
                <button type="submit" className={styles.submitButton}>Create</button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)} 
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Join Form */}
          {showJoinForm && (
            <form onSubmit={handleJoinHousehold} className={styles.form}>
              <h3>Join Existing Household</h3>
              <input
                type="text"
                placeholder="Enter Invite Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className={styles.input}
              />
              <div className={styles.formButtons}>
                <button type="submit" className={styles.submitButton}>Join</button>
                <button 
                  type="button" 
                  onClick={() => setShowJoinForm(false)} 
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Has Household */}
      {household && (
        <div className={styles.householdInfo}>
          <h3>{household.name}</h3>
          
          <div className={styles.infoSection}>
            <label>Invite Code:</label>
            <div className={styles.inviteCodeSection}>
              <span className={styles.inviteCode}>{household.invite_code}</span>
              <button onClick={copyInviteCode} className={styles.copyButton}>
                Copy
              </button>
            </div>
            <p className={styles.hint}>Share this code with others to invite them to your household</p>
          </div>

          <div className={styles.infoSection}>
            <label>Owner:</label>
            <p>{household.owner.username} ({household.owner.email})</p>
          </div>

          <div className={styles.infoSection}>
            <label>Members ({household.members.length}):</label>
            <ul className={styles.membersList}>
              {household.members.map((member) => (
                <li key={member._id}>
                  {member.username} ({member.email})
                  {member._id === household.owner._id && <span className={styles.ownerBadge}>Owner</span>}
                </li>
              ))}
            </ul>
          </div>

          <button onClick={handleLeaveHousehold} className={styles.dangerButton}>
            {household.isOwner ? 'Delete Household' : 'Leave Household'}
          </button>
        </div>
      )}

      <div className={styles.infoBox}>
        <h4>About Households</h4>
        <ul>
          <li>Create a household to share budgets with family or roommates</li>
          <li>All household members can see and manage shared transactions</li>
          <li>The household owner can delete the household</li>
          <li>Members can leave the household at any time</li>
        </ul>
      </div>
    </div>
  );
};
