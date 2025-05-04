import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import './Settings.css';

const TABS = ['Profile', 'Security', 'Notifications', 'Preferences', 'Privacy'];

export default function Settings() {
  const user = auth.currentUser;

  const [activeTab, setActiveTab] = useState('Profile');

  // PROFILE
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profileMsg, setProfileMsg] = useState('');

  // SECURITY
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState('');

  // NOTIFICATIONS
  const [jobAlerts, setJobAlerts] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // PREFERENCES
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('gb');
  const [prefMsg, setPrefMsg] = useState('');

  // PRIVACY
  const [deleteMsg, setDeleteMsg] = useState('');

  useEffect(() => {
    setJobAlerts(JSON.parse(localStorage.getItem('jobAlerts')) || false);
    setWeeklySummary(JSON.parse(localStorage.getItem('weeklySummary')) || false);
    setLanguage(localStorage.getItem('language') || 'en');
    setCountry(localStorage.getItem('country') || 'gb');
  }, []);

  const saveProfile = async () => {
    setProfileMsg('');
    try {
      await updateProfile(user, { displayName });
      setProfileMsg('Profile updated.');
    } catch (err) {
      setProfileMsg(err.message);
    }
  };

  const changePassword = async () => {
    setSecurityMsg('');
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setSecurityMsg('Password changed.');
    } catch (err) {
      setSecurityMsg(err.message);
    }
  };

  const toggleNotification = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
    if (key === 'jobAlerts') setJobAlerts(val);
    else setWeeklySummary(val);
  };

  const savePreferences = () => {
    localStorage.setItem('language', language);
    localStorage.setItem('country', country);
    setPrefMsg('Preferences saved.');
  };

  const handleDeleteAccount = async () => {
    setDeleteMsg('');
    try {
      await deleteUser(user);
      setDeleteMsg('Account deleted.');
    } catch (err) {
      setDeleteMsg(err.message);
    }
  };

  return (
    <div className="settings-container">
      <nav className="settings-nav">
        <ul>
          {TABS.map(tab => (
            <li
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      <main className="settings-main">
        {activeTab === 'Profile' && (
          <section className="settings-card">
            <h2>Profile</h2>
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
            />
            <button onClick={saveProfile}>Save Profile</button>
            {profileMsg && <div className="settings-message">{profileMsg}</div>}
          </section>
        )}

        {activeTab === 'Security' && (
          <section className="settings-card">
            <h2>Account Security</h2>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button onClick={changePassword}>Change Password</button>
            {securityMsg && <div className="settings-message">{securityMsg}</div>}
          </section>
        )}

        {activeTab === 'Notifications' && (
          <section className="settings-card">
            <h2>Email Notifications</h2>
            <div className="toggle-row">
              <span>Job Alerts</span>
              <input
                type="checkbox"
                checked={jobAlerts}
                onChange={e => toggleNotification('jobAlerts', e.target.checked)}
              />
            </div>
            <div className="toggle-row">
              <span>Weekly Summary</span>
              <input
                type="checkbox"
                checked={weeklySummary}
                onChange={e => toggleNotification('weeklySummary', e.target.checked)}
              />
            </div>
          </section>
        )}

        {activeTab === 'Preferences' && (
          <section className="settings-card">
            <h2>App Preferences</h2>
            <label>Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>

            <label>Country</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
            >
              <option value="gb">United Kingdom</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
            </select>

            <button onClick={savePreferences}>Save Preferences</button>
            {prefMsg && <div className="settings-message">{prefMsg}</div>}
          </section>
        )}

        {activeTab === 'Privacy' && (
          <section className="settings-card">
            <h2>Privacy & Data</h2>
            <button className="danger" onClick={handleDeleteAccount}>
              Delete My Account
            </button>
            {deleteMsg && <div className="settings-message">{deleteMsg}</div>}
          </section>
        )}
      </main>
    </div>
  );
}
