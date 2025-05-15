// src/components/Settings.js

import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import {
  updateProfile,
  updateEmail,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { FiBell, FiSettings, FiHelpCircle, FiLogOut, FiLink } from "react-icons/fi";

const MENU_GROUPS = [
  {
    label: "Account Settings",
    items: [
      { key: "Profile",  label: "Personal Details",  icon: <AiOutlineUser /> },
      { key: "Security", label: "Login & Security",  icon: <AiOutlineLock /> },
    ],
  },
  {
    label: "App Preferences",
    items: [
      { key: "Notifications", label: "Notifications", icon: <FiBell /> },
      { key: "Preferences",   label: "Preferences",   icon: <FiSettings /> },
    ],
  },
  {
    label: "Integrations",
    items: [
      { key: "Integrations", label: "Integrations", icon: <FiLink /> },
    ],
  },
  {
    label: "Privacy & Support",
    items: [
      { key: "Privacy",  label: "Privacy & Data", icon: <AiOutlineLock /> },
      { key: "Support",  label: "Support",        icon: <FiHelpCircle /> },
      { key: "SignOut",  label: "Sign Out",       icon: <FiLogOut /> },
    ],
  },
];

export default function Settings() {
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState("Profile");

  // ── Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState(user?.email || "");
  const [phone, setPhone]         = useState("");
  const [photoURL, setPhotoURL]   = useState(user?.photoURL || "");
  const [resumeURL, setResumeURL] = useState("");
  const [picFile, setPicFile]     = useState(null);
  const [resFile, setResFile]     = useState(null);
  const [profileMsg, setProfileMsg]       = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  // ── Security
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd]         = useState("");
  const [securityMsg, setSecurityMsg] = useState("");

  // ── Notifications
  const [jobAlerts, setJobAlerts]         = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // ── Preferences & Theme
  const [language, setLanguage] = useState("en");
  const [country, setCountry]   = useState("gb");
  const [prefMsg, setPrefMsg]   = useState("");
  const [theme, setTheme]       = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  // ── Integrations
  const [googleDrive, setGoogleDrive] = useState(false);
  const [teams, setTeams]             = useState(false);

  // ── Privacy
  const [deleteMsg, setDeleteMsg] = useState("");

  // ── Load on mount
  useEffect(() => {
    if (!user) return;
    // Name split
    if (user.displayName) {
      const parts = user.displayName.split(" ");
      setFirstName(parts[0]);
      setLastName(parts.slice(1).join(" "));
    }
    // Firestore extras
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setPhone(d.phone || "");
        setResumeURL(d.resumeURL || "");
      }
    })();
    // LocalStorage prefs
    setJobAlerts(JSON.parse(localStorage.getItem("jobAlerts")) || false);
    setWeeklySummary(JSON.parse(localStorage.getItem("weeklySummary")) || false);
    setLanguage(localStorage.getItem("language") || "en");
    setCountry(localStorage.getItem("country") || "gb");
    setGoogleDrive(JSON.parse(localStorage.getItem("googleDrive")) || false);
    setTeams(JSON.parse(localStorage.getItem("teams")) || false);
    // Apply theme immediately
    document.documentElement.setAttribute("data-theme", theme);
  }, [user]);

  // ── Handlers

  // Profile Save
  const handleSaveProfile = async () => {
    setProfileMsg("");
    setLoadingProfile(true);
    try {
      // Photo upload
      let newPhotoURL = photoURL;
      if (picFile) {
        const sRef = ref(storage, `profiles/${user.uid}/photo.jpg`);
        await uploadBytes(sRef, picFile);
        newPhotoURL = await getDownloadURL(sRef);
      }
      // Resume upload
      let newResumeURL = resumeURL;
      if (resFile) {
        const rRef = ref(storage, `profiles/${user.uid}/resume_${resFile.name}`);
        await uploadBytes(rRef, resFile);
        newResumeURL = await getDownloadURL(rRef);
      }
      // Auth update
      const fullName = `${firstName}${lastName ? ` ${lastName}` : ""}`;
      await updateProfile(user, { displayName: fullName, photoURL: newPhotoURL });
      if (email !== user.email) {
        await updateEmail(user, email);
        await sendEmailVerification(user);
      }
      // Firestore update
      await setDoc(
        doc(db, "users", user.uid),
        { phone, resumeURL: newResumeURL },
        { merge: true }
      );
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileMsg(err.message);
    }
    setLoadingProfile(false);
  };

  // Profile Cancel
  const handleProfileCancel = () => {
    if (user.displayName) {
      const parts = user.displayName.split(" ");
      setFirstName(parts[0]);
      setLastName(parts.slice(1).join(" "));
    }
    setEmail(user.email);
    setPhone("");
    setPicFile(null);
    setResFile(null);
    setProfileMsg("");
  };

  // Security
  const handleChangePassword = async () => {
    setSecurityMsg("");
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPwd);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPwd);
      setSecurityMsg("Password changed successfully.");
    } catch (err) {
      setSecurityMsg(err.message);
    }
  };

  // Notifications toggle (with browser notification)
  const handleToggle = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
    if (key === "jobAlerts") {
      setJobAlerts(val);
      if (val && "Notification" in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification("Job Alerts enabled", {
              body: "We’ll notify you when new jobs are posted.",
            });
          }
        });
      }
    } else {
      setWeeklySummary(val);
    }
  };

  // Preferences save
  const handleSavePrefs = () => {
    localStorage.setItem("language", language);
    localStorage.setItem("country", country);
    setPrefMsg("Preferences saved.");
  };

  // Theme toggle
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Integrations
  const handleDrive = () => {
    const nxt = !googleDrive;
    setGoogleDrive(nxt);
    localStorage.setItem("googleDrive", JSON.stringify(nxt));
  };
  const handleTeams = () => {
    const nxt = !teams;
    setTeams(nxt);
    localStorage.setItem("teams", JSON.stringify(nxt));
  };

  // Support & Logout
  const handleSupport = () => window.location.href = "mailto:support@careernext.com";
  const handleSignOut = () => auth.signOut();

  // Privacy
  const handleDelete = async () => {
    setDeleteMsg("");
    try {
      await deleteUser(user);
      setDeleteMsg("Account deleted.");
    } catch (err) {
      setDeleteMsg(err.message);
    }
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <aside className="settings-sidebar">
        {MENU_GROUPS.map(g => (
          <div key={g.label} className="settings-group">
            <div className="settings-group-label">{g.label}</div>
            <ul>
              {g.items.map(item => (
                <li
                  key={item.key}
                  className={activeTab === item.key ? "active" : ""}
                  onClick={() => {
                    if (item.key === "Support") handleSupport();
                    else if (item.key === "SignOut") handleSignOut();
                    else setActiveTab(item.key);
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Content */}
      <section className="settings-content">
        {/* PROFILE */}
        {activeTab === "Profile" && (
          <div className="settings-card">
            <h2>Personal Details</h2>
            <label>First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} />
            <label>Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} />
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              placeholder="+44 7..."
              onChange={e => setPhone(e.target.value)}
            />
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPicFile(e.target.files[0])}
            />
            {photoURL && (
              <img
                src={photoURL}
                alt="Profile"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "0.5rem 0"
                }}
              />
            )}
            <label>Resume (PDF/DOCX)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => setResFile(e.target.files[0])}
            />
            {resumeURL && (
              <p>
                Current:{" "}
                <a href={resumeURL} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </p>
            )}
            <div className="button-group" style={{ marginTop: "1rem" }}>
              <button
                className="save-btn"
                disabled={loadingProfile}
                onClick={handleSaveProfile}
              >
                {loadingProfile ? "Saving…" : "Save Changes"}
              </button>
              <button
                className="cancel-btn"
                onClick={handleProfileCancel}
              >
                Cancel
              </button>
            </div>
            {profileMsg && <div className="settings-message">{profileMsg}</div>}
          </div>
        )}

        {/* SECURITY */}
        {activeTab === "Security" && (
          <div className="settings-card">
            <h2>Login & Security</h2>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPwd}
              onChange={e => setCurrentPwd(e.target.value)}
            />
            <label>New Password</label>
            <input
              type="password"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
            />
            <button onClick={handleChangePassword}>Change Password</button>
            {securityMsg && <div className="settings-message">{securityMsg}</div>}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "Notifications" && (
          <div className="settings-card">
            <h2>Notifications</h2>
            <div className="toggle-row">
              <span>Job Alerts</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={jobAlerts}
                  onChange={e => handleToggle("jobAlerts", e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="toggle-row">
              <span>Weekly Summary</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={weeklySummary}
                  onChange={e =>
                    handleToggle("weeklySummary", e.target.checked)
                  }
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        )}

        {/* PREFERENCES */}
        {activeTab === "Preferences" && (
          <div className="settings-card">
            <h2>Preferences</h2>
            <label>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="zh">中文 (简体)</option>
            </select>

            <label>Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)}>
              <option value="gb">United Kingdom</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
            </select>

            <label>Theme</label>
            <div className="toggle-row">
              <span>Dark Mode</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={theme === "dark"}
                  onChange={e =>
                    toggleTheme(e.target.checked ? "dark" : "light")
                  }
                />
                <span className="slider" />
              </label>
            </div>

            <button onClick={handleSavePrefs}>Save Preferences</button>
            {prefMsg && <div className="settings-message">{prefMsg}</div>}
          </div>
        )}

        {/* INTEGRATIONS */}
        {activeTab === "Integrations" && (
          <div className="settings-card">
            <h2>Integrations</h2>
            <div className="toggle-row">
              <span>Google Drive</span>
              <button className="connect-btn" onClick={handleDrive}>
                {googleDrive ? "Disconnect" : "Connect"}
              </button>
            </div>
            <div className="toggle-row">
              <span>Microsoft Teams</span>
              <button className="connect-btn" onClick={handleTeams}>
                {teams ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        )}

        {/* PRIVACY */}
        {activeTab === "Privacy" && (
          <div className="settings-card">
            <h2>Privacy & Data</h2>
            <button className="danger" onClick={handleDelete}>
              Delete My Account
            </button>
            {deleteMsg && <div className="settings-message">{deleteMsg}</div>}
          </div>
        )}
      </section>
    </div>
  );
}
