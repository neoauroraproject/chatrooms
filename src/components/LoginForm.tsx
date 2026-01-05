import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Settings, Hash, Sparkles } from 'lucide-react';
import { validateMasterPassword, generateUserId, generateUserColor, checkRoomAccess, isAdminUser, validateAdminPassword } from '../utils/auth';
import { storage, AdminConfig } from '../utils/storage';
import { User as UserType } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import LanguageToggle from './LanguageToggle';
import Copyright from './Copyright';

interface LoginFormProps {
  onLogin: (user: UserType, accessLevel: 'admin' | 'room' | 'public', restrictedToRoom?: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const { t, rtl, language, changeLanguage } = useLanguage();
  const [step, setStep] = useState<'password' | 'username' | 'admin-setup'>('password');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'admin' | 'room' | 'public'>('public');
  const [restrictedToRoom, setRestrictedToRoom] = useState<string | undefined>();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // Check if it's the master password
      if (validateMasterPassword(password)) {
        setAccessLevel('public');
        setStep('username');
        setIsLoading(false);
        return;
      }

      // Check if it's a room password
      const chatRooms = storage.getChatRooms();
      const roomId = checkRoomAccess(password, chatRooms);
      if (roomId) {
        const room = chatRooms.find(r => r.id === roomId);
        if (room && room.isPrivate) {
          setAccessLevel('room');
          setRestrictedToRoom(roomId);
          setStep('username');
          setIsLoading(false);
          return;
        }
      }

      setError(t.invalidPassword);
      setIsLoading(false);
    }, 500);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) {
      setError(t.usernameTooShort);
      return;
    }

    // Check if this is admin user
    if (isAdminUser(username.trim())) {
      const adminConfig = storage.getAdminConfig();
      if (!adminConfig) {
        // First time admin setup
        setStep('admin-setup');
        return;
      } else {
        // Existing admin - need to validate password
        if (!validateAdminPassword(password, adminConfig)) {
          setError(t.invalidAdminCredentials);
          return;
        }
        setAccessLevel('admin');
      }
    }

    // Check for existing session
    const existingSession = storage.getUserSession(username.trim());
    if (existingSession) {
      // Login with existing user data
      const updatedUser = { 
        ...existingSession, 
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        status: 'online' as const
      };
      
      if (isAdminUser(username.trim())) {
        updatedUser.isAdmin = true;
      }
      
      const existingUsers = storage.getUsers();
      const otherUsers = existingUsers.filter(u => u.username.toLowerCase() !== username.toLowerCase());
      const updatedUsers = [...otherUsers, updatedUser];
      
      storage.saveUsers(updatedUsers);
      storage.saveCurrentUser(updatedUser);
      onLogin(updatedUser, accessLevel, restrictedToRoom);
      return;
    }

    // Check if username is currently taken by online user
    const existingUsers = storage.getUsers();
    if (existingUsers.some(user => user.username.toLowerCase() === username.toLowerCase())) {
      setError(t.usernameInUse);
      return;
    }

    // Create new user
    const newUser: UserType = {
      id: generateUserId(),
      username: username.trim(),
      color: generateUserColor(),
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      status: 'online',
      isAdmin: isAdminUser(username.trim())
    };

    const updatedUsers = [...existingUsers, newUser];
    storage.saveUsers(updatedUsers);
    storage.saveCurrentUser(newUser);
    storage.saveUserSession(username.trim(), newUser);
    onLogin(newUser, accessLevel, restrictedToRoom);
  };

  const handleAdminSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword.trim().length < 6) {
      setError(t.adminPasswordTooShort);
      return;
    }

    const adminConfig: AdminConfig = {
      adminPassword: adminPassword.trim(),
      defaultMessageRetentionHours: 24,
      allowUserRoomCreation: true,
      maxRoomsPerUser: 5,
      welcomeMessage: 'Welcome to SecureChat! 🎉'
    };

    storage.saveAdminConfig(adminConfig);

    // Create admin user
    const newUser: UserType = {
      id: generateUserId(),
      username: 'admin',
      color: '#FF6B6B',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      status: 'online',
      isAdmin: true
    };

    const existingUsers = storage.getUsers();
    const updatedUsers = [...existingUsers, newUser];
    storage.saveUsers(updatedUsers);
    storage.saveCurrentUser(newUser);
    storage.saveUserSession('admin', newUser);
    onLogin(newUser, 'admin');
  };

  const getAccessLevelIcon = () => {
    switch (accessLevel) {
      case 'admin':
        return <Settings className="w-5 h-5 text-red-500" />;
      case 'room':
        return <Hash className="w-5 h-5 text-blue-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-green-500" />;
    }
  };

  const getAccessLevelText = () => {
    switch (accessLevel) {
      case 'admin':
        return t.adminAccess;
      case 'room':
        return t.roomAccess;
      default:
        return t.publicAccess;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 border border-white/20">
        {/* Language Toggle */}
        <div className={`flex ${rtl ? 'justify-start' : 'justify-end'} mb-4`}>
          <LanguageToggle 
            currentLanguage={language} 
            onLanguageChange={changeLanguage}
            className="text-gray-600"
          />
        </div>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            {getAccessLevelIcon()}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t.loginTitle}
          </h1>
          <p className="text-gray-600">
            {step === 'password' ? t.enterAccessPassword : 
             step === 'admin-setup' ? t.setupAdminAccount :
             `${t.chooseUsername} - ${getAccessLevelText()}`}
          </p>
        </div>

        {step === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="relative">
              <Lock className={`absolute ${rtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.accessPassword}
                className={`w-full ${rtl ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50`}
                required
                dir={rtl ? 'rtl' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${rtl ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-3 px-4 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {isLoading ? t.verifying : t.continue}
            </button>
          </form>
        ) : step === 'admin-setup' ? (
          <form onSubmit={handleAdminSetup} className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-yellow-800 font-medium">
                🚨 {t.setupAdminAccount}: <strong>admin</strong>
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This will be the master admin account for the chatroom
              </p>
            </div>
            
            <div className="relative">
              <Lock className={`absolute ${rtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder={t.setAdminPassword}
                className={`w-full ${rtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-gray-50/50`}
                required
                minLength={6}
                dir={rtl ? 'rtl' : 'ltr'}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-3 px-4 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className={`flex ${rtl ? 'flex-row-reverse' : ''} space-x-3 ${rtl ? 'space-x-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => setStep('username')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-medium transition-all duration-200"
              >
                {t.back}
              </button>
              <button
                type="submit"
                disabled={!adminPassword.trim()}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                {t.setupAdmin}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUsernameSubmit} className="space-y-6">
            {accessLevel !== 'public' && (
              <div className={`border rounded-xl p-4 ${
                accessLevel === 'admin' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              }`}>
                <p className="text-sm font-medium flex items-center space-x-2">
                  {getAccessLevelIcon()}
                  <span>{getAccessLevelText()}</span>
                </p>
              </div>
            )}
            
            <div className="relative">
              <User className={`absolute ${rtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.username}
                className={`w-full ${rtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50`}
                required
                maxLength={20}
                dir={rtl ? 'rtl' : 'ltr'}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-3 px-4 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className={`flex ${rtl ? 'flex-row-reverse' : ''} space-x-3 ${rtl ? 'space-x-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => setStep('password')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-medium transition-all duration-200"
              >
                {t.back}
              </button>
              <button
                type="submit"
                disabled={!username.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                {t.joinChat}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-2">{t.accessHints}</p>
            <div className="space-y-1 text-xs">
              <p>🔓 <strong>{t.public}:</strong> "Password from HMray"</p>
              <p>👑 <strong>{t.admin}:</strong> Username "admin" + custom password</p>
              <p>🏠 <strong>{t.room}:</strong> Use room-specific passwords</p>
            </div>
            <p className="text-xs text-gray-600 mt-3 border-t border-gray-200 pt-2">
              {t.restoreHistory}
            </p>
          </div>
        </div>

        <Copyright className="mt-6" />
      </div>
    </div>
  );
}