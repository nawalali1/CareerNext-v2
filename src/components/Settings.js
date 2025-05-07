// src/components/Settings.js
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from "firebase/auth";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import {
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiLink
} from "react-icons/fi";


const MENU = [
  { key: "Profile",       label: "Personal Details", icon: <AiOutlineUser /> },
  { key: "Security",      label: "Login & Security", icon: <AiOutlineLock />  },
  { key: "Notifications", label: "Notifications",    icon: <FiBell />        },
  { key: "Preferences",   label: "Preferences",      icon: <FiSettings />    },
  { key: "Integrations",  label: "Integrations",     icon: <FiLink />        },
  { key: "Privacy",       label: "Privacy & Data",   icon: <AiOutlineLock /> },
];

export default function Settings() {
  const user = auth.currentUser;

  // Active tab
  const [activeTab, setActiveTab] = useState("Profile");

  // Profile
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileMsg, setProfileMsg] = useState("");

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMsg, setSecurityMsg] = useState("");

  // Notifications
  const [jobAlerts, setJobAlerts] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // Preferences
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("gb");
  const [prefMsg, setPrefMsg] = useState("");

  // Integrations
  const [googleDriveConnected, setGoogleDriveConnected] = useState(false);
  const [teamsConnected, setTeamsConnected] = useState(false);

  // Privacy
  const [deleteMsg, setDeleteMsg] = useState("");

  // On mount: load persisted settings & integrations
  useEffect(() => {
    setJobAlerts(JSON.parse(localStorage.getItem("jobAlerts")) || false);
    setWeeklySummary(JSON.parse(localStorage.getItem("weeklySummary")) || false);
    setLanguage(localStorage.getItem("language") || "en");
    setCountry(localStorage.getItem("country") || "gb");
    setGoogleDriveConnected(
      JSON.parse(localStorage.getItem("googleDriveConnected")) || false
    );
    setTeamsConnected(
      JSON.parse(localStorage.getItem("teamsConnected")) || false
    );
  }, []);

  // Handlers
  const saveProfile = async () => {
    setProfileMsg("");
    try {
      await updateProfile(user, { displayName });
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileMsg(err.message);
    }
  };

  const changePassword = async () => {
    setSecurityMsg("");
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setSecurityMsg("Password changed successfully.");
    } catch (err) {
      setSecurityMsg(err.message);
    }
  };

  const toggleNotification = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
    if (key === "jobAlerts") setJobAlerts(val);
    else setWeeklySummary(val);
  };

  const savePreferences = () => {
    localStorage.setItem("language", language);
    localStorage.setItem("country", country);
    setPrefMsg("Preferences saved.");
  };

  const handleConnectGoogleDrive = () => {
    const next = !googleDriveConnected;
    setGoogleDriveConnected(next);
    localStorage.setItem("googleDriveConnected", JSON.stringify(next));
  };

  const handleConnectTeams = () => {
    const next = !teamsConnected;
    setTeamsConnected(next);
    localStorage.setItem("teamsConnected", JSON.stringify(next));
  };

  const handleSupport = () => {
    window.location.href = "mailto:support@careernext.com";
  };

  const handleDeleteAccount = async () => {
    setDeleteMsg("");
    try {
      await deleteUser(user);
      setDeleteMsg("Account deleted.");
    } catch (err) {
      setDeleteMsg(err.message);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
  };

  return (
    <div className="settings-container">
      <aside className="settings-sidebar">
        <ul>
          {MENU.map(item => (
            <li
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
              onClick={() => setActiveTab(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="settings-bottom">
          <button className="settings-support" onClick={handleSupport}>
            <FiHelpCircle /> Support
          </button>
          <button className="settings-logout" onClick={handleSignOut}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      <section className="settings-content">
        {activeTab === "Profile" && (
          <div className="settings-card">
            <h2>Personal Details</h2>
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
            />
            <button onClick={saveProfile}>Save Changes</button>
            {profileMsg && (
              <div className="settings-message">{profileMsg}</div>
            )}
          </div>
        )}

        {activeTab === "Security" && (
          <div className="settings-card">
            <h2>Login & Security</h2>
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
            {securityMsg && (
              <div className="settings-message">{securityMsg}</div>
            )}
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="settings-card">
            <h2>Notifications</h2>
            <div className="toggle-row">
              <span>Job Alerts</span>
              <input
                type="checkbox"
                checked={jobAlerts}
                onChange={e =>
                  toggleNotification("jobAlerts", e.target.checked)
                }
              />
            </div>
            <div className="toggle-row">
              <span>Weekly Summary</span>
              <input
                type="checkbox"
                checked={weeklySummary}
                onChange={e =>
                  toggleNotification("weeklySummary", e.target.checked)
                }
              />
            </div>
          </div>
        )}

        {activeTab === "Preferences" && (
          <div className="settings-card">
            <h2>Preferences</h2>
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
            <button onClick={savePreferences}>Save Changes</button>
            {prefMsg && (
              <div className="settings-message">{prefMsg}</div>
            )}
          </div>
        )}

        {activeTab === "Integrations" && (
          <div className="settings-card">
            <h2>Integrations</h2>
            <p className="settings-note">
              Connect to third-party services for seamless workflows.
            </p>
            <div className="toggle-row">
              <span>Google Drive</span>
              <button
                className="connect-btn"
                onClick={handleConnectGoogleDrive}
              >
                {googleDriveConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
            <div className="toggle-row">
              <span>Microsoft Teams</span>
              <button
                className="connect-btn"
                onClick={handleConnectTeams}
              >
                {teamsConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "Privacy" && (
          <div className="settings-card">
            <h2>Privacy & Data</h2>
            <button className="danger" onClick={handleDeleteAccount}>
              Delete My Account
            </button>
            {deleteMsg && (
              <div className="settings-message">{deleteMsg}</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
