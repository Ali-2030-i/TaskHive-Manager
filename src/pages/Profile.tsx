import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useTheme } from "@/contexts/ThemeContext";
import "./Profile.css";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  phone: string;
  bio: string;
  timezone: string;
  status: "online" | "offline" | "away";
  theme_preference: "light" | "dark" | "system";
  language_preference: "ar" | "en";
  notification_email: boolean;
  notification_push: boolean;
  notification_on_comment: boolean;
  notification_on_task_complete: boolean;
  updated_at: string;
  created_at: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPersonalMode, setEditPersonalMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for visual effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
    
    // Update connection status automatically
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Current user:", user);
      if (!user) {
        console.error("No user found");
        return;
      }

      // Try to fetch profile first
      let { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("Profile select result:", { data, error });

      // If profile doesn't exist, create a new one
      if (error?.code === 'PGRST116' || !data) {
        console.log("Profile not found, creating new one...");
        
        const newProfileData = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || "",
          avatar_initials: (user.email || "").substring(0, 2).toUpperCase(),
        };

        const { data: insertedData, error: insertError } = await supabase
          .from("user_profiles")
          .insert([newProfileData])
          .select()
          .single();

        console.log("Insert result:", { insertedData, insertError });

        if (insertError) {
          console.error("Insert error:", insertError);
          // Even if insertion fails, use default data
          const defaultProfile: UserProfile = {
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            avatar_url: "",
            role: "Member",
            phone: "",
            bio: "",
            timezone: "UTC",
            status: "offline",
            theme_preference: "system",
            language_preference: "ar",
            notification_email: true,
            notification_push: true,
            notification_on_comment: true,
            notification_on_task_complete: true,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          };
          setProfile(defaultProfile);
        } else {
          setProfile(insertedData);
        }
      } else if (error) {
        throw error;
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    try {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Updating profile with:", updates);

      const { error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      console.log("Update error:", error);

      if (error) throw error;

      // Update state
      setProfile((prev) =>
        prev ? { ...prev, ...updates } : null
      );

      // Refetch data to confirm it was saved
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating profile: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Convert image to base64 as alternative solution
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          
          // Save image directly to database
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({
              avatar_url: base64Data,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          if (updateError) throw updateError;

          // Update state
          setProfile((prev) =>
            prev ? { ...prev, avatar_url: base64Data } : null
          );

          alert("✅ Image uploaded successfully!");
          setSaving(false);
        } catch (error) {
          console.error("Error saving avatar:", error);
          alert(`❌ Error saving image: ${error instanceof Error ? error.message : String(error)}`);
          setSaving(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      alert("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAddAccount = async () => {
    const email = prompt("Enter new account email:");
    if (!email) return;
    
    navigate("/"); // Redirect to login page
  };

  const handleSwitchAccount = async () => {
    await handleLogout();
  };

  if (loading) {
    return (
      <Layout>
        <div className="profile-loading">
          <div className="spinner">🔄</div>
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="profile-error" style={{
          padding: '40px 20px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '40px auto',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24'
        }}>
          <h2 style={{marginTop: 0}}>⚠️ Database Error</h2>
          <p>Table `user_profiles` does not exist in Supabase</p>
          
          <div style={{
            backgroundColor: '#fff3cd',
            padding: '15px',
            borderRadius: '4px',
            margin: '20px 0'
          }}>
            <strong>Solution:</strong>
            <ol>
              <li>Go to <a href="https://app.supabase.com" target="_blank" style={{color: 'blue'}}>Supabase Dashboard</a></li>
              <li>Select your project (TaskHive)</li>
              <li>Go to SQL Editor</li>
              <li>Copy the contents of <code>supabase_schema.sql</code></li>
              <li>Execute the commands</li>
              <li>Come back here and refresh the page</li>
            </ol>
          </div>

          <p style={{fontSize: '12px', opacity: 0.7}}>
            More details in the file: <code>SETUP_INSTRUCTIONS.md</code>
          </p>

          <button onClick={fetchProfile} style={{
            padding: '10px 20px',
            marginTop: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            🔄 Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        {/* Main content - single vertical page */}
        <div className="profile-content">
          {/* ===== Identity Section ===== */}
          <motion.div
            className="profile-section identity-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="section-title">🪪 Identity</h2>
            
            <div className="identity-card">
              {/* Profile Picture */}
              <div className="avatar-section">
                <div className="avatar-wrapper">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {profile?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </div>
                  )}
                  {isOnline && (
                    <div className="status-indicator online" />
                  )}
                </div>

                {editMode && (
                  <label className="upload-button">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleAvatarUpload(e.target.files[0]);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                    📸 Upload Photo
                  </label>
                )}
              </div>

              {/* Identity Data */}
              <div className="identity-info">
                <div className="info-item">
                  <label>Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={profile?.full_name || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile!,
                          full_name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p>{profile?.full_name || "Not set"}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Job Title</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={profile?.role || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile!,
                          role: e.target.value,
                        })
                      }
                      placeholder="e.g. Senior Developer"
                    />
                  ) : (
                    <p>{profile?.role || "Not set"}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Email Address</label>
                  <p className="read-only">{profile?.email}</p>
                </div>
              </div>

              {/* Identity Control Buttons */}
              <div className="action-buttons">
                {editMode ? (
                  <>
                    <motion.button
                      className="save-button"
                      onClick={() => {
                        handleProfileUpdate({
                          full_name: profile?.full_name || "",
                          role: profile?.role || "",
                        });
                        setEditMode(false);
                      }}
                      whileHover={{ scale: 1.05 }}
                      disabled={saving}
                    >
                      💾 Save
                    </motion.button>
                    <motion.button
                      className="cancel-button"
                      onClick={() => setEditMode(false)}
                      whileHover={{ scale: 1.05 }}
                    >
                      ❌ Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    className="secondary-button"
                    onClick={() => setEditMode(true)}
                    whileHover={{ scale: 1.05 }}
                  >
                    ✏️ Edit Identity
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ===== Personal Information Section ===== */}
          <motion.div
            className="profile-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="section-header">
              <h2 className="section-title">📝 Personal Information</h2>
              {!editPersonalMode && (
                <motion.button
                  className="section-edit-btn"
                  onClick={() => setEditPersonalMode(true)}
                  whileHover={{ scale: 1.05 }}
                >
                  ✏️ Edit
                </motion.button>
              )}
            </div>

            <div className="form-section">
              <div className="form-group">
                <label>Phone Number</label>
                {editPersonalMode ? (
                  <input
                    type="tel"
                    value={profile?.phone || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile!,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+1 (123) 456-7890"
                  />
                ) : (
                  <p>{profile?.phone || "Not set"}</p>
                )}
              </div>

              <div className="form-group">
                <label>Bio</label>
                {editPersonalMode ? (
                  <textarea
                    value={profile?.bio || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile!,
                        bio: e.target.value,
                      })
                    }
                    placeholder="Tell us about yourself..."
                    maxLength={150}
                  />
                ) : (
                  <p>{profile?.bio || "Not set"}</p>
                )}
              </div>

              <div className="form-group">
                <label>Time Zone</label>
                {editPersonalMode ? (
                  <select
                    value={profile?.timezone || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile!,
                        timezone: e.target.value,
                      })
                    }
                  >
                    <option value="UTC">UTC</option>
                    <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Europe/Paris">Europe/Paris (CET)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                ) : (
                  <p>{profile?.timezone || "UTC"}</p>
                )}
              </div>

              {editPersonalMode && (
                <div className="action-buttons">
                  <motion.button
                    className="save-button"
                    onClick={() => {
                      handleProfileUpdate({
                        phone: profile?.phone || "",
                        bio: profile?.bio || "",
                        timezone: profile?.timezone || "",
                      });
                      setEditPersonalMode(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    disabled={saving}
                  >
                    💾 Save
                  </motion.button>
                  <motion.button
                    className="cancel-button"
                    onClick={() => setEditPersonalMode(false)}
                    whileHover={{ scale: 1.05 }}
                  >
                    ❌ Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* ===== Security Section ===== */}
          <motion.div
            className="profile-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="section-title">🔐 Security</h2>

            <div className="security-section">
              {/* Change Password */}
              <div className="security-item">
                <h3>🔑 Change Password</h3>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
                <motion.button
                  className="save-button"
                  onClick={handleChangePassword}
                  whileHover={{ scale: 1.05 }}
                  disabled={saving || !newPassword}
                >
                  💾 Update Password
                </motion.button>
              </div>

              {/* Logout */}
              <div className="security-item logout-section">
                <h3>🚪 Logout</h3>
                <p>Sign out of your account</p>
                <motion.button
                  className="danger-button"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                >
                  🚪 Logout
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
