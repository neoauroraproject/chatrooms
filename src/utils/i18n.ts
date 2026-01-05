export interface Translations {
  // Login Form
  loginTitle: string;
  enterAccessPassword: string;
  setupAdminAccount: string;
  chooseUsername: string;
  accessPassword: string;
  username: string;
  adminPassword: string;
  setAdminPassword: string;
  verifying: string;
  continue: string;
  back: string;
  joinChat: string;
  setupAdmin: string;
  cancel: string;
  close: string;
  
  // Access Levels
  adminAccess: string;
  roomAccess: string;
  publicAccess: string;
  
  // Access Hints
  accessHints: string;
  public: string;
  admin: string;
  room: string;
  restoreHistory: string;
  
  // Chat Interface
  generalChat: string;
  onlineUsers: string;
  chatRooms: string;
  backToGeneral: string;
  backToRoom: string;
  
  // Messages
  typeMessage: string;
  replyToMessage: string;
  pinnedMessages: string;
  messageDeleted: string;
  startChatting: string;
  sendDirectMessage: string;
  welcomeToRoom: string;
  welcomeToSecureChat: string;
  startConversation: string;
  privateRoomSpace: string;
  
  // Actions
  reply: string;
  edit: string;
  delete: string;
  pin: string;
  unpin: string;
  react: string;
  save: string;
  edited: string;
  
  // Room Management
  createRoom: string;
  joinRoom: string;
  roomName: string;
  roomPassword: string;
  description: string;
  private: string;
  messageRetention: string;
  hoursToKeep: string;
  yourRooms: string;
  availableRooms: string;
  noRoomsYet: string;
  noAccessToRooms: string;
  enterPassword: string;
  incorrectPassword: string;
  
  // Admin Settings
  adminSettings: string;
  updateRetention: string;
  changePassword: string;
  updatePassword: string;
  closeSettings: string;
  
  // User Interface
  logout: string;
  online: string;
  total: string;
  noOtherUsers: string;
  roomAccessOnly: string;
  
  // Emojis and Reactions
  quickEmojis: string;
  textShortcuts: string;
  smile: string;
  sad: string;
  happy: string;
  wink: string;
  tongue: string;
  heart: string;
  neutral: string;
  surprised: string;
  kiss: string;
  laugh: string;
  
  // Errors
  invalidPassword: string;
  usernameTooShort: string;
  usernameInUse: string;
  invalidAdminCredentials: string;
  adminPasswordTooShort: string;
  
  // Copyright
  poweredBy: string;
}

export const translations: Record<'en' | 'fa', Translations> = {
  en: {
    // Login Form
    loginTitle: 'SecureChat ✨',
    enterAccessPassword: 'Enter access password 🔐',
    setupAdminAccount: 'Setup admin account 👑',
    chooseUsername: 'Choose your username',
    accessPassword: 'Access Password',
    username: 'Enter username',
    adminPassword: 'Admin Password',
    setAdminPassword: 'Set Admin Password',
    verifying: 'Verifying... ⏳',
    continue: 'Continue ➡️',
    back: 'Back ⬅️',
    joinChat: 'Join Chat 🚀',
    setupAdmin: 'Setup Admin 👑',
    cancel: 'Cancel ❌',
    close: 'Close 🚪',
    
    // Access Levels
    adminAccess: 'Admin Access 👑',
    roomAccess: 'Room Access 🏠',
    publicAccess: 'Public Access 🌍',
    
    // Access Hints
    accessHints: '💡 Access Hints:',
    public: 'Public',
    admin: 'Admin',
    room: 'Room',
    restoreHistory: '🔄 Use same username to restore your chat history',
    
    // Chat Interface
    generalChat: 'General Chat',
    onlineUsers: 'Online Users 👥',
    chatRooms: 'Chat Rooms 🏠',
    backToGeneral: 'Back to General Chat',
    backToRoom: 'Back to Room',
    
    // Messages
    typeMessage: 'Type a message... 💬',
    replyToMessage: 'Reply to message... 💬',
    pinnedMessages: '📌 Pinned Messages',
    messageDeleted: '💬 Message deleted',
    startChatting: 'Start chatting with',
    sendDirectMessage: 'Send a direct message to get started ✨',
    welcomeToRoom: 'Welcome to',
    welcomeToSecureChat: 'Welcome to SecureChat!',
    startConversation: 'Start the conversation by sending a message ✨',
    privateRoomSpace: 'This is your private room space 🌟',
    
    // Actions
    reply: 'Reply',
    edit: 'Edit message',
    delete: 'Delete message',
    pin: 'Pin message',
    unpin: 'Unpin message',
    react: 'React',
    save: 'Save',
    edited: '(edited)',
    
    // Room Management
    createRoom: 'Create Room',
    joinRoom: 'Join 🚪',
    roomName: 'Room name 🏷️',
    roomPassword: 'Room password 🔐',
    description: 'Description (optional) 📝',
    private: 'Private 🔒',
    messageRetention: 'Message retention (hours) ⏰:',
    hoursToKeep: 'Hours to keep messages:',
    yourRooms: 'Your Rooms 🏠',
    availableRooms: 'Available Rooms 🌟',
    noRoomsYet: 'No chat rooms yet 📭',
    noAccessToRooms: 'No access to other rooms 🚫',
    enterPassword: 'Enter password 🔐',
    incorrectPassword: 'Incorrect password ❌',
    
    // Admin Settings
    adminSettings: 'Admin Settings 👑',
    updateRetention: 'Update Retention ✅',
    changePassword: 'Change Password 🔄',
    updatePassword: 'Update ✅',
    closeSettings: 'Close Settings 🚪',
    
    // User Interface
    logout: 'Logout',
    online: 'online',
    total: 'total 👥',
    noOtherUsers: 'No other users online 😔',
    roomAccessOnly: '🔒 Room access only',
    
    // Emojis and Reactions
    quickEmojis: 'Quick Emojis ✨',
    textShortcuts: 'Text Shortcuts',
    smile: 'smile',
    sad: 'sad',
    happy: 'happy',
    wink: 'wink',
    tongue: 'tongue',
    heart: 'heart',
    neutral: 'neutral',
    surprised: 'surprised',
    kiss: 'kiss',
    laugh: 'laugh',
    
    // Errors
    invalidPassword: 'Invalid password 🔐',
    usernameTooShort: 'Username must be at least 2 characters 📝',
    usernameInUse: 'Username is currently in use 👥',
    invalidAdminCredentials: 'Invalid admin credentials 👑',
    adminPasswordTooShort: 'Admin password must be at least 6 characters 🔒',
    
    // Copyright
    poweredBy: 'Powered and designed by HMray'
  },
  fa: {
    // Login Form
    loginTitle: 'چت امن ✨',
    enterAccessPassword: 'رمز عبور دسترسی را وارد کنید 🔐',
    setupAdminAccount: 'تنظیم حساب مدیر 👑',
    chooseUsername: 'نام کاربری خود را انتخاب کنید',
    accessPassword: 'رمز عبور دسترسی',
    username: 'نام کاربری را وارد کنید',
    adminPassword: 'رمز عبور مدیر',
    setAdminPassword: 'تنظیم رمز عبور مدیر',
    verifying: 'در حال تأیید... ⏳',
    continue: 'ادامه ➡️',
    back: 'بازگشت ⬅️',
    joinChat: 'ورود به چت 🚀',
    setupAdmin: 'تنظیم مدیر 👑',
    cancel: 'لغو ❌',
    close: 'بستن 🚪',
    
    // Access Levels
    adminAccess: 'دسترسی مدیر 👑',
    roomAccess: 'دسترسی اتاق 🏠',
    publicAccess: 'دسترسی عمومی 🌍',
    
    // Access Hints
    accessHints: '💡 راهنمای دسترسی:',
    public: 'عمومی',
    admin: 'مدیر',
    room: 'اتاق',
    restoreHistory: '🔄 از همان نام کاربری برای بازیابی تاریخچه چت استفاده کنید',
    
    // Chat Interface
    generalChat: 'چت عمومی',
    onlineUsers: 'کاربران آنلاین 👥',
    chatRooms: 'اتاق‌های چت 🏠',
    backToGeneral: 'بازگشت به چت عمومی',
    backToRoom: 'بازگشت به اتاق',
    
    // Messages
    typeMessage: 'پیام خود را تایپ کنید... 💬',
    replyToMessage: 'پاسخ به پیام... 💬',
    pinnedMessages: '📌 پیام‌های سنجاق شده',
    messageDeleted: '💬 پیام حذف شد',
    startChatting: 'شروع چت با',
    sendDirectMessage: 'برای شروع یک پیام مستقیم ارسال کنید ✨',
    welcomeToRoom: 'خوش آمدید به',
    welcomeToSecureChat: 'خوش آمدید به چت امن!',
    startConversation: 'با ارسال پیام گفتگو را شروع کنید ✨',
    privateRoomSpace: 'این فضای اتاق خصوصی شماست 🌟',
    
    // Actions
    reply: 'پاسخ',
    edit: 'ویرایش پیام',
    delete: 'حذف پیام',
    pin: 'سنجاق کردن پیام',
    unpin: 'برداشتن سنجاق پیام',
    react: 'واکنش',
    save: 'ذخیره',
    edited: '(ویرایش شده)',
    
    // Room Management
    createRoom: 'ایجاد اتاق',
    joinRoom: 'ورود 🚪',
    roomName: 'نام اتاق 🏷️',
    roomPassword: 'رمز عبور اتاق 🔐',
    description: 'توضیحات (اختیاری) 📝',
    private: 'خصوصی 🔒',
    messageRetention: 'نگهداری پیام (ساعت) ⏰:',
    hoursToKeep: 'ساعت نگهداری پیام‌ها:',
    yourRooms: 'اتاق‌های شما 🏠',
    availableRooms: 'اتاق‌های موجود 🌟',
    noRoomsYet: 'هنوز اتاق چتی وجود ندارد 📭',
    noAccessToRooms: 'دسترسی به اتاق‌های دیگر ندارید 🚫',
    enterPassword: 'رمز عبور را وارد کنید 🔐',
    incorrectPassword: 'رمز عبور اشتباه ❌',
    
    // Admin Settings
    adminSettings: 'تنظیمات مدیر 👑',
    updateRetention: 'به‌روزرسانی نگهداری ✅',
    changePassword: 'تغییر رمز عبور 🔄',
    updatePassword: 'به‌روزرسانی ✅',
    closeSettings: 'بستن تنظیمات 🚪',
    
    // User Interface
    logout: 'خروج',
    online: 'آنلاین',
    total: 'کل 👥',
    noOtherUsers: 'کاربر دیگری آنلاین نیست 😔',
    roomAccessOnly: '🔒 فقط دسترسی اتاق',
    
    // Emojis and Reactions
    quickEmojis: 'ایموجی‌های سریع ✨',
    textShortcuts: 'میانبرهای متنی',
    smile: 'لبخند',
    sad: 'غمگین',
    happy: 'خوشحال',
    wink: 'چشمک',
    tongue: 'زبان',
    heart: 'قلب',
    neutral: 'خنثی',
    surprised: 'متعجب',
    kiss: 'بوسه',
    laugh: 'خنده',
    
    // Errors
    invalidPassword: 'رمز عبور نامعتبر 🔐',
    usernameTooShort: 'نام کاربری باید حداقل ۲ کاراکتر باشد 📝',
    usernameInUse: 'نام کاربری در حال استفاده است 👥',
    invalidAdminCredentials: 'اطلاعات مدیر نامعتبر 👑',
    adminPasswordTooShort: 'رمز عبور مدیر باید حداقل ۶ کاراکتر باشد 🔒',
    
    // Copyright
    poweredBy: 'طراحی و توسعه توسط HMray'
  }
};

export type Language = 'en' | 'fa';

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};

export const isRTL = (lang: Language): boolean => {
  return lang === 'fa';
};

// Detect if text contains Persian/Arabic characters
export const containsPersianText = (text: string): boolean => {
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return persianRegex.test(text);
};

// Get text direction based on content
export const getTextDirection = (text: string): 'ltr' | 'rtl' => {
  return containsPersianText(text) ? 'rtl' : 'ltr';
};