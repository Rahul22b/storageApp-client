import { useState } from 'react';
import { Settings, Lock, Trash2, Power, Smartphone, HardDrive, Bell, Shield, LogOut, Eye, EyeOff, ChevronRight, Download, Upload, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function StorageSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [storageUsed] = useState(45.8);
  const [storageTotal] = useState(100);
  const [autoBackup, setAutoBackup] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);

  const devices = [
    { id: 1, name: 'Chrome on Windows', location: 'New York, US', lastActive: '2 mins ago', current: true, ip: '192.168.1.1' },
    { id: 2, name: 'Safari on iPhone 15', location: 'New York, US', lastActive: '1 hour ago', current: false, ip: '192.168.1.5' },
    { id: 3, name: 'Chrome on Android', location: 'New York, US', lastActive: '2 days ago', current: false, ip: '192.168.1.8' }
  ];

  const storageBreakdown = [
    { type: 'Documents', size: 18.5, color: 'from-blue-500 to-cyan-500' },
    { type: 'Images', size: 15.2, color: 'from-purple-500 to-pink-500' },
    { type: 'Videos', size: 10.1, color: 'from-orange-500 to-red-500' },
    { type: 'Other', size: 2.0, color: 'from-green-500 to-emerald-500' }
  ];

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogoutDevice = (deviceId) => {
    alert(`Logged out device ${deviceId}`);
  };

  const handleDeleteAccount = () => {
    alert('Account deletion initiated. You will receive a confirmation email.');
    setShowDeleteModal(false);
  };

  const handleDisableAccount = () => {
    alert('Account disabled successfully.');
    setShowDisableModal(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Settings
                </h1>
              </div>
              <p className="text-gray-500 ml-14">Manage your account, security, and storage preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Storage & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Storage Overview */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <HardDrive className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Storage</h2>
              </div>
              
              <div className="relative mb-6">
                <svg className="w-full h-40" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#1f1f1f"
                    strokeWidth="20"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="20"
                    strokeDasharray={`${(storageUsed / storageTotal) * 502.4} 502.4`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-white">{storageUsed} GB</p>
                  <p className="text-sm text-gray-500">of {storageTotal} GB</p>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="space-y-3">
                {storageBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
                      <span className="text-sm text-gray-400">{item.type}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{item.size} GB</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <Download className="w-4 h-4" />
                    <span>Available</span>
                  </div>
                  <span className="font-medium text-white">{(storageTotal - storageUsed).toFixed(1)} GB</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Files Uploaded</span>
                  </div>
                  <span className="text-sm font-semibold text-white">1,247</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Active Devices</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{devices.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Member Since</span>
                  </div>
                  <span className="text-sm font-semibold text-white">Jan 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Settings */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Security</h2>
              </div>

              {/* Change Password */}
              <div className="mb-6 pb-6 border-b border-gray-800">
                <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Change Password
                </h3>
                <div className="space-y-3">
                  <div className="relative group">
                    <input
                      type={showPasswords ? "text" : "password"}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type={showPasswords ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type={showPasswords ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPasswords ? 'Hide' : 'Show'} passwords
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg shadow-purple-500/20"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative w-14 h-7 rounded-full transition-all ${twoFactor ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform shadow-lg ${twoFactor ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Active Devices */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Active Devices</h2>
                </div>
                <span className="text-sm text-gray-500">{devices.length} devices</span>
              </div>
              <div className="space-y-3">
                {devices.map((device) => (
                  <div key={device.id} className="group relative overflow-hidden bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <Smartphone className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium">{device.name}</h3>
                            {device.current && (
                              <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                                <CheckCircle className="w-3 h-3" />
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{device.location}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-xs text-gray-600">IP: {device.ip}</p>
                            <span className="text-gray-700">•</span>
                            <p className="text-xs text-gray-600">Last active: {device.lastActive}</p>
                          </div>
                        </div>
                      </div>
                      {!device.current && (
                        <button
                          onClick={() => handleLogoutDevice(device.id)}
                          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Bell className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Preferences</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Download className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Auto-Backup</h3>
                      <p className="text-sm text-gray-500">Automatically backup files daily</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoBackup(!autoBackup)}
                    className={`relative w-14 h-7 rounded-full transition-all ${autoBackup ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform shadow-lg ${autoBackup ? 'translate-x-8' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Bell className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive storage and security alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-14 h-7 rounded-full transition-all ${notifications ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform shadow-lg ${notifications ? 'translate-x-8' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gradient-to-br from-red-950/30 to-black rounded-2xl p-6 border border-red-900/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setShowDisableModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Power className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-medium">Disable Account</h3>
                      <p className="text-sm text-gray-500">Temporarily disable your account</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-red-900/50 hover:border-red-500 hover:bg-red-500/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-medium">Delete Account</h3>
                      <p className="text-sm text-gray-500">Permanently delete account and all data</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 max-w-md w-full border border-red-900/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Delete Account</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                This action cannot be undone. All your data, files, and settings will be permanently deleted from our servers.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg shadow-red-500/20"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Disable Account Modal */}
        {showDisableModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 max-w-md w-full border border-yellow-900/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <Power className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Disable Account</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your account will be temporarily disabled. You can reactivate it anytime by logging back in with your credentials.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisableModal(false)}
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisableAccount}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-4 py-3 rounded-xl hover:from-yellow-700 hover:to-yellow-800 transition-all font-medium shadow-lg shadow-yellow-500/20"
                >
                  Disable Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}