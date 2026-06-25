import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './layouts/AppLayout';

// Common
import SplashScreen from './pages/common/SplashScreen';
import RoleSelection from './pages/common/RoleSelection';
import LoginScreen from './pages/common/LoginScreen';
import OtpScreen from './pages/common/OtpScreen';
import SignupScreen from './pages/common/SignupScreen';

// Teacher
import TeacherOnboarding from './pages/teacher/TeacherOnboarding';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ApplicationStatus from './pages/teacher/ApplicationStatus';
import IncomingRequests from './pages/teacher/IncomingRequests';
import TeacherWallet from './pages/teacher/TeacherWallet';
import PlaceholderPage from './pages/PlaceholderPage';
import SettingsScreen from './pages/common/SettingsScreen';

// Student
import StudentProfileSetup from './pages/student/StudentProfileSetup';
import StudentDashboard from './pages/student/StudentDashboard';
import AskDoubt from './pages/student/AskDoubt';
import TeacherSearching from './pages/student/TeacherSearching';
import ChatSession from './pages/student/ChatSession';
import DailyMcq from './pages/student/DailyMcq';
import PlanSelection from './pages/student/PlanSelection';

// Parent
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentProfileSetup from './pages/parent/ParentProfileSetup';

const T = (title, icon, desc) => <PlaceholderPage title={title} icon={icon} description={desc} />;

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Entry */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/otp" element={<OtpScreen />} />
        <Route path="/signup" element={<SignupScreen />} />

        {/* Teacher */}
        <Route path="/teacher/onboarding" element={<TeacherOnboarding />} />
        <Route path="/teacher/application-status" element={<ApplicationStatus />} />
        <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/requests" element={<ProtectedRoute role="teacher"><IncomingRequests /></ProtectedRoute>} />
        <Route path="/teacher/wallet" element={<ProtectedRoute role="teacher"><TeacherWallet /></ProtectedRoute>} />
        <Route path="/teacher/sessions" element={<ProtectedRoute role="teacher">{T('Session History', '📋')}</ProtectedRoute>} />
        <Route path="/teacher/profile" element={<ProtectedRoute role="teacher">{T('Edit Profile', '👤')}</ProtectedRoute>} />
        <Route path="/teacher/availability" element={<ProtectedRoute role="teacher">{T('Availability', '📅', 'Set day-wise time slots and subject availability')}</ProtectedRoute>} />
        <Route path="/teacher/interview" element={<ProtectedRoute role="teacher">{T('Interview', '🎤', 'Schedule and join your verification interview')}</ProtectedRoute>} />
        <Route path="/teacher/live-class" element={<ProtectedRoute role="teacher">{T('Live Class', '🎥', 'Create and manage live class requests')}</ProtectedRoute>} />
        <Route path="/teacher/upload-video" element={<ProtectedRoute role="teacher">{T('Upload Video', '📹', 'Upload educational short videos (max 180s)')}</ProtectedRoute>} />
        <Route path="/teacher/referral" element={<ProtectedRoute role="teacher">{T('Refer & Earn', '🔗', 'Share referral links for students and teachers')}</ProtectedRoute>} />
        <Route path="/teacher/reviews" element={<ProtectedRoute role="teacher">{T('Reviews', '⭐', 'View and reply to student feedback')}</ProtectedRoute>} />
        <Route path="/teacher/analytics" element={<ProtectedRoute role="teacher">{T('Analytics', '📊', 'Performance metrics and earnings trends')}</ProtectedRoute>} />
        <Route path="/teacher/more" element={<ProtectedRoute role="teacher"><SettingsScreen /></ProtectedRoute>} />
        <Route path="/teacher/settings" element={<ProtectedRoute role="teacher"><SettingsScreen /></ProtectedRoute>} />
        <Route path="/teacher/chat/:sessionId" element={<ProtectedRoute role="teacher"><ChatSession /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/student/profile-setup" element={<StudentProfileSetup />} />
        <Route path="/student/plans" element={<PlanSelection />} />
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/ask-doubt" element={<ProtectedRoute role="student"><AskDoubt /></ProtectedRoute>} />
        <Route path="/student/searching" element={<ProtectedRoute role="student"><TeacherSearching /></ProtectedRoute>} />
        <Route path="/student/chat/:sessionId" element={<ProtectedRoute role="student"><ChatSession /></ProtectedRoute>} />
        <Route path="/student/mcq" element={<ProtectedRoute role="student"><DailyMcq /></ProtectedRoute>} />
        <Route path="/student/wallet" element={<ProtectedRoute role="student">{T('Rewards Wallet', '💰', 'Points, redemption and recharge')}</ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute role="student"><SettingsScreen /></ProtectedRoute>} />
        <Route path="/student/ai-tutor" element={<ProtectedRoute role="student">{T('AI Tutor', '🤖', 'Instant AI academic help with credits')}</ProtectedRoute>} />
        <Route path="/student/leaderboard" element={<ProtectedRoute role="student">{T('Leaderboard', '🏆', 'Class, city, state and global rankings')}</ProtectedRoute>} />
        <Route path="/student/live-classes" element={<ProtectedRoute role="student">{T('Live Classes', '🎥', 'Join upcoming and live classes')}</ProtectedRoute>} />
        <Route path="/student/videos" element={<ProtectedRoute role="student">{T('Short Videos', '📹', 'Educational video feed by class/subject')}</ProtectedRoute>} />
        <Route path="/student/spin" element={<ProtectedRoute role="student">{T('Daily Spin', '🎡', 'Spin wheel reward after app-open timer')}</ProtectedRoute>} />
        <Route path="/student/referral" element={<ProtectedRoute role="student">{T('Refer & Earn', '🔗', 'Refer students and teachers')}</ProtectedRoute>} />
        <Route path="/student/history" element={<ProtectedRoute role="student">{T('Session History', '📚', 'Past doubts, recordings and transcripts')}</ProtectedRoute>} />
        <Route path="/student/feedback/:sessionId" element={<ProtectedRoute role="student">{T('Feedback', '⭐', 'Rate your session experience')}</ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute role="student">{T('Notifications', '🔔')}</ProtectedRoute>} />
        <Route path="/student/support" element={<ProtectedRoute role="student">{T('Support', '🎧', 'Create and track support tickets')}</ProtectedRoute>} />

        {/* Parent */}
        <Route path="/parent/profile-setup" element={<ParentProfileSetup />} />
        <Route path="/parent/dashboard" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
        <Route path="/parent/children" element={<ProtectedRoute role="parent">{T('My Children', '👨‍👩‍👧', 'Manage linked children')}</ProtectedRoute>} />
        <Route path="/parent/reports" element={<ProtectedRoute role="parent">{T('Reports', '📊', 'Weekly/monthly performance reports')}</ProtectedRoute>} />
        <Route path="/parent/controls" element={<ProtectedRoute role="parent">{T('Study Controls', '🔒', 'Study time, feature limits, schedule lock')}</ProtectedRoute>} />
        <Route path="/parent/settings" element={<ProtectedRoute role="parent"><SettingsScreen /></ProtectedRoute>} />
        <Route path="/parent/support" element={<ProtectedRoute role="parent">{T('Support', '🎧')}</ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
