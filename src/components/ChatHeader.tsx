import React, { useState } from 'react';
import { LogOut, Users, MessageCircle, Hash, Crown, Settings, Clock } from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import LanguageToggle from './LanguageToggle';

interface ChatHeaderProps {
  currentUser: User;
  onlineUsers: User[];
  onLogout: () => void;
  activeChatName: string;
  activeChatType: 'general' | 'dm' | 'room';
  onUpdateRetention?: (hours: number) => void;
  onUpdateAdminPassword?: (newPassword: string) => void;
  accessLevel: 'admin' | 'room' | 'public';
}

export default function ChatHeader({ 
  currentUser, 
  onlineUsers, 
  onLogout, 
  activeChatName, 
  activeChatType,
  onUpdateRetention,
  onUpdateAdminPassword,
  accessLevel
}: ChatHeaderProps) {
  const { t, rtl, language, changeLanguage } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [retentionHours, setRetentionHours] = useState(24);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const getChatIcon = () => {
    switch (activeChatType) {
      case 'dm':
        return <MessageCircle className="w-5 h-5" />;
      case 'room':
        return <Hash className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getAccessBadge = () => {
    switch (accessLevel) {
      case 'admin':
        return <span className="text-xs bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-3 py-1 rounded-full font-medium">{t.adminAccess}</span>;
      case 'room':
        return <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full font-medium">{t.roomAccess}</span>;
      default:
        return <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full font-medium">{t.publicAccess}</span>;
    }
  };

  const handleRetentionUpdate = () => {
    if (onUpdateRetention) {
      onUpdateRetention(retentionHours);
      setShowSettings(false);
    }
  };

  const handlePasswordUpdate = () => {
    if (onUpdateAdminPassword && newAdminPassword.trim().length >= 6) {
      onUpdateAdminPassword(newAdminPassword.trim());
      setNewAdminPassword('');
      setShowPasswordChange(false);
      setShowSettings(false);
    }
  };

  const getOnlineCount = () => {
    return onlineUsers.filter(user => user.status === 'online').length;
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 shadow-lg" dir={rtl ? 'rtl' : 'ltr'}>
      <div className={`flex items-center ${rtl ? 'flex-row-reverse' : ''} justify-between`}>
        <div className={`flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-4`}>
          <div className={`flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-3`}>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              {getChatIcon()}
            </div>
            <div>
              <span className="font-semibold text-lg">{activeChatName}</span>
              {activeChatType === 'general' && (
                <div className={`text-sm text-white/80 flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-2`}>
                  <span>{getOnlineCount()} {t.online}</span>
                  <span>•</span>
                  <span>{onlineUsers.length} {t.total}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-4`}>
          {getAccessBadge()}
          
          <div className={`flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-3 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm`}>
            <div 
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm" 
              style={{ backgroundColor: currentUser.color }}
            />
            <span className={`text-sm font-medium flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-2`}>
              <span>{currentUser.username}</span>
              {currentUser.isAdmin && <Crown className="w-4 h-4 text-yellow-300" />}
            </span>
          </div>

          <LanguageToggle 
            currentLanguage={language} 
            onLanguageChange={changeLanguage}
          />

          {currentUser.isAdmin && (
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                title={t.adminSettings}
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {showSettings && (
                <div className={`absolute ${rtl ? 'left-0' : 'right-0'} top-12 bg-white text-gray-800 rounded-xl shadow-2xl p-6 w-80 z-50 border border-gray-100`} dir={rtl ? 'rtl' : 'ltr'}>
                  <h3 className={`font-semibold mb-4 flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 text-lg`}>
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <span>{t.adminSettings}</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {activeChatType === 'general' && onUpdateRetention && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className={`font-medium mb-3 flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 text-blue-800`}>
                          <Clock className="w-4 h-4" />
                          <span>{t.messageRetention}</span>
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">{t.hoursToKeep}</label>
                            <input
                              type="number"
                              value={retentionHours}
                              onChange={(e) => setRetentionHours(Number(e.target.value))}
                              min="1"
                              max="8760"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              dir={rtl ? 'rtl' : 'ltr'}
                            />
                          </div>
                          <button
                            onClick={handleRetentionUpdate}
                            className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                          >
                            {t.updateRetention}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className={`font-medium mb-3 flex items-center ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 text-red-800`}>
                        <Settings className="w-4 h-4" />
                        <span>{t.adminPassword}</span>
                      </h4>
                      {!showPasswordChange ? (
                        <button
                          onClick={() => setShowPasswordChange(true)}
                          className="w-full bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors"
                        >
                          {t.changePassword}
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <input
                            type="password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            placeholder={t.setAdminPassword}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            minLength={6}
                            dir={rtl ? 'rtl' : 'ltr'}
                          />
                          <div className={`flex ${rtl ? 'flex-row-reverse space-x-reverse' : ''} space-x-2`}>
                            <button
                              onClick={handlePasswordUpdate}
                              disabled={newAdminPassword.length < 6}
                              className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors disabled:bg-gray-300"
                            >
                              {t.updatePassword}
                            </button>
                            <button
                              onClick={() => {
                                setShowPasswordChange(false);
                                setNewAdminPassword('');
                              }}
                              className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                            >
                              {t.cancel}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowSettings(false)}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      {t.closeSettings}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onLogout}
            className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
            title={t.logout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}