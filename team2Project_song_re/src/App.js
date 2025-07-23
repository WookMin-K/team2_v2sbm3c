import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginProvider } from './contexts/LoginContext';
import MainPage from './components/MainPage';
import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import MyPage from './pages/MyPage';
import ScheduleMain from './pages/ScheduleMain';
import AdminReportList from './pages/AdminReportList';
import TravelInfoForm from './components/TravelInfoForm';
import { ChatbotProvider } from './contexts/ChatbotContext';
import PostList from './components/PostList';
import PostCreate from './components/PostCreate';
import PostUpdate from './components/PostUpdate';
import PostDetail from './components/PostDetail';
import PostDelete from './components/PostDelete';
import { TripListRegion } from './components/TripListRegion';
import { TripListDistrict } from './components/TripListDistrict';
import TripModal from './components/TripModal';
import ProtectedRoute from './components/ProtectedRoute';
import TripDetailPage from './components/TripDetailPage';

import NoticeList from './components/notice/NoticeList';
import NoticeDetail from './components/notice/NoticeDetail';
import NoticeCreate from './components/notice/NoticeCreate';
import NoticeUpdate from './components/notice/NoticeUpdate';
import NoticeDelete from './components/notice/NoticeDelete';
import BookmarkListPage from './components/bookmark/bookmark_list';
import ResultPage from './pages/ResultPage';
import MyTravelPage from './pages/MyTravelPage';
import MyPostListPage from './pages/MyPostListPage';
import RequestWritePage from './components/request/RequestWritePage';
import RequestListPage from './components/request/RequestListPage';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import UserListWithPaging from './pages/UserListWithPaging';

// ✅ login 복구 처리용 내부 래퍼


function App() {
  return (
    <LoginProvider>
      <ChatbotProvider>
        <Router>
          <Routes>
            <Route path="/login/oauth2/code/:provider" element={<OAuth2RedirectHandler />} />
            <Route path="/" element={<MainPage />} />

            <Route element={<Layout />}>
              <Route path="/users/signup" element={<SignUp />} />
              <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
              <Route path="/mypage/mytravel" element={<ProtectedRoute><MyTravelPage /></ProtectedRoute>} />
              <Route path="/mypage/postlist" element={<ProtectedRoute><MyPostListPage /></ProtectedRoute>} />
              <Route path="/mypage/bookmark" element={<ProtectedRoute><BookmarkListPage /></ProtectedRoute>}/>
              <Route path="/admin/reports" element={<ProtectedRoute><AdminReportList /></ProtectedRoute>} />
              {/* 관리자용 마이페이지 회원 목록 */}
              <Route path="/mypage/users" element={<UserListWithPaging />} />
              <Route path="/schedule" element={<ProtectedRoute><ScheduleMain /></ProtectedRoute>} />
              <Route path="/travel-info" element={<TravelInfoForm />} />
              <Route path="/result" element={<ResultPage />} />

              <Route path="/post/create" element={<ProtectedRoute><PostCreate /></ProtectedRoute>} />
              <Route path="/post/list" element={<PostList />} />
              <Route path="/post/read/:postNo" element={<PostDetail />} />
              <Route path="/post/update/:postNo" element={<PostUpdate />} />
              <Route path="/post/delete/:postNo" element={<PostDelete />} />

              <Route path="/triplistregion" element={<TripListRegion />} />
              <Route path="/district/:regionNo" element={<TripListDistrict />} />
              <Route path="/trips/:trip_no" element={<TripModal />} />
              <Route path="/ai-recommend/:trip_no" element={<TripDetailPage />} />

              <Route path="/notice" element={<NoticeList />} />
              <Route path="/notice/:notice_no" element={<NoticeDetail />} />
              <Route path="/notice/create" element={<NoticeCreate />} />
              <Route path="/notice/update/:notice_no" element={<NoticeUpdate />} />
              <Route path="/notice/delete/:notice_no" element={<NoticeDelete />} />
              <Route path="/request/create" element={<ProtectedRoute><RequestWritePage /></ProtectedRoute>} />
              <Route path="/request/list" element={<ProtectedRoute><RequestListPage /></ProtectedRoute>} />
              
            </Route>
          </Routes>
        </Router>
      </ChatbotProvider>
    </LoginProvider>
  );
}

export default App;

