import React, { useEffect, useState, useRef  } from 'react';
import { useParams, useNavigate, useLocation,  } from 'react-router-dom';
import { getPostDetail } from '../api/postApi';
import { useLoginContext } from '../contexts/LoginContext';
import ReplyLikeButton from './ReplyLikeButton';
import BookmarkPostButton from '../components/bookmark/bookmarkbutton_post';


import { FiFileText, FiDownload } from 'react-icons/fi';

import prev1Icon from '../pages/icon/left.png'
import next1Icon from '../pages/icon/right.png'
import reportIcon from '../pages/icon/rreport.png'
import starIcon from '../pages/icon/star.png'
import rdeleteIcon from '../pages/icon/rdelete.png'
import updateIcon from '../pages/icon/update.png'
import axios from 'axios';
import './PostDetail.css';
import upIcon from '../pages/icon/up.png';
import MegaMenu from '../components/MegaMenu';

const PostDetail = () => {
  const { postNo } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoginOpen } = useLoginContext();
  const menuRef = useRef();

  // 게시글, 댓글, 페이징 상태
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [childReplyContent, setChildReplyContent] = useState({});
  const [replyParent, setReplyParent] = useState(null);
  const [editingReplyNo, setEditingReplyNo] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  // 댓글 원본 보관 + 번역 중 플래그
  const [originalReplies, setOriginalReplies] = useState([]);
  const [isTranslatingReplies, setIsTranslatingReplies] = useState(false);

  // 게시글 신고 모달 
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // 댓글·대댓글 신고 모달 
  const [showReplyReportModal, setShowReplyReportModal] = useState(false);
  const [replyReportReason, setReplyReportReason] = useState('');
  const [reportReplyNo, setReportReplyNo] = useState(null);

  // 세션에서 유저 정보
  const userNo    = Number(sessionStorage.getItem('userNo'));
  const gradeStr  = sessionStorage.getItem('grade');
  const userGrade = gradeStr != null ? parseInt(gradeStr, 10) : -1;
  const isAuthor  = post && userNo === post.user_no;
  const isAdmin   = userGrade === 0;
  const location = useLocation(); // 목록클릭 시 페이지 유지
  const fromSearch = location.state?.fromSearch || location.search;

  
  // 햄버거 메뉴 열림/닫힘 상태
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen(open => !open);
  const megaMenuRef = useRef();

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  // 본문 스크롤 감지용 ref
  const scrollRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

  


  // ✅ LocalStorage에서 번역 데이터 꺼내기
  const translationMap = JSON.parse(
    localStorage.getItem('translatedPosts') || '{}'
  );

    // 즐겨찾기
  const handleBookmarkClick = () => {
    if (isLoggedIn) {
      navigate('/mypage/bookmark');
    } else {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', '/mypage/bookmark');
      setIsLoginOpen(true);
    }
  };

  // 내 게시글
  const handleMyPostsClick = () => {
    if (isLoggedIn) {
      navigate('/mypage/postlist');
    } else {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', '/mypage/postlist');
      setIsLoginOpen(true);
    }
  };

  // 데이터 로드
  const fetchData = async () => {
    const data = await getPostDetail(postNo);
    setPost(data.post);
    setReplies(data.replies);
    setOriginalReplies(data.replies);
    setPrevPost(data.prev);
    setNextPost(data.next);
  };

  // 댓글 번역
const translateReplies = async (lang) => {
  if (isTranslatingReplies) return;
  setIsTranslatingReplies(true);
  try {
    const translated = await Promise.all(
      replies.map(async r => {
        const { data } = await axios.post(
          'http://121.78.128.95:8000/api/translate',
          { text: r.content, target_language: lang }
        );
        return { ...r, content: data.translated_text };
      })
    );
    setReplies(translated);
  } catch (err) {
    console.error(err);
    alert('댓글 번역 중 오류가 발생했습니다.');
  } finally {
    setIsTranslatingReplies(false);
  }
};

    // 본문 스크롤 감지
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      setShowTop(el.scrollTop > 0);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

// 댓글 원래대로
const resetReplyTranslation = () => {
  setReplies(originalReplies);
};

  useEffect(() => {
    fetchData();
  }, [postNo]);

  useEffect(() => {
    const onClickOutside = e => {
      if (menuOpen && megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  // 파일 다운로드
  const handleDownload = async (fileName) => {
    try {
      const res = await fetch(`http://121.78.128.95:9093/post/download/${fileName}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  // 댓글/답글 등록
  const handleReplySubmit = async (e, parentReplyNo) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('댓글을 쓰려면 로그인해야 합니다.');
      setIsLoginOpen(true);
      return;
    }
    const content = parentReplyNo
      ? childReplyContent[parentReplyNo] || ''
      : replyContent;
    if (!content.trim()) return;
    await fetch('/reply/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_no: post.post_no,
        content,
        user_no: userNo,
        parent_reply_no: parentReplyNo,
      }),
    });
    if (parentReplyNo) {
      setChildReplyContent({ ...childReplyContent, [parentReplyNo]: '' });
      setReplyParent(null);
    } else {
      setReplyContent('');
    }
    fetchData();
  };

  // 댓글 수정
  const handleReplyUpdate = async (reply_no) => {
    await fetch('/reply/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply_no, content: editContent }),
    });
    setEditingReplyNo(null);
    setEditContent('');
    fetchData();
  };

  // 댓글 삭제
//   const handleReplyDelete = async (reply_no) => {
//     if (!window.confirm('정말 삭제할까요?')) return;
//     await fetch(`/reply/delete/${reply_no}`, { method: 'DELETE' });
//     fetchData();
//   };

    const handleReplyDelete = async (reply_no) => {
    if (!window.confirm('정말 삭제할까요?')) return;

    try {
        const res = await fetch(`/reply/delete/${reply_no}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        });

        // 1) HTTP 에러 체크
        if (!res.ok) {
        // status 400, 500 등을 잡아냅니다.
        throw new Error(`Server responded ${res.status}`);
        }

        // 2) JSON 결과(result: 'success' or 'fail') 파싱
        const data = await res.json();
        if (data.result !== 'success') {
        // 백엔드에서 실패 시 메시지를 같이 내려주면 data.message로 표시
        alert(`삭제 실패: ${data.message || '알 수 없는 오류'}`);
        }

        // 3) 성공이든 실패든 목록 갱신
        fetchData();
    }
    catch (err) {
        console.error(err);
        alert('삭제 중 오류가 발생했습니다.');
    }
    };

  // 신고 제출

  const onClickReport = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', `/post/read/${postNo}${fromSearch}`);
      setIsLoginOpen(true);
      return;
    }
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert('신고 사유를 입력해주세요.');
      return;
    }
    try {
      const res = await fetch('/post/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          post_no: post.post_no,
          user_no : userNo,
          reason: reportReason.trim(),
        }),
      });
      const data = await res.json();
      if (data.result === 'success') {
        alert('신고가 접수되었습니다.');
        setShowReportModal(false);
        setReportReason('');
        fetchData();
      } else {
        alert(`❌ ${data.message || '신고에 실패했습니다.'}`);
      }
    } catch {
      alert('신고 중 오류가 발생했습니다.');
    }
  };
  //  댓글 신고 제출

  const onClickReplyReport = (reply_no) => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다 😊');
      sessionStorage.setItem('redirectAfterLogin', `/post/read/${postNo}${fromSearch}`);
      setIsLoginOpen(true);
      return;
    }
    setReportReplyNo(reply_no);
    setShowReplyReportModal(true);
  };
  const handleReplyReportSubmit = async () => {
    if (!replyReportReason.trim()) {
      alert('신고 사유를 입력해주세요.');
      return;
    }
    try {
      const res = await fetch('/reply/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          reply_no: reportReplyNo,
          user_no: userNo,
          reason: replyReportReason.trim(),
        }),
      });
      const data = await res.json();
      if (data.result === 'success') {
        alert('신고가 접수되었습니다.');
        setShowReplyReportModal(false);
        setReplyReportReason('');
        setReportReplyNo(null);
        fetchData();
      } else {
        alert(`❌ ${data.message || '신고에 실패했습니다.'}`);
      }
    } catch {
      alert('신고 중 오류가 발생했습니다.');
    }
 };

  if (!post) return <div>로딩 중...</div>;

  // 해당 포스트에 번역 데이터가 있으면 사용, 없으면 원본 사용
  const translatedTitle = translationMap[post.post_no]?.title || post.title;
  const translatedContent = translationMap[post.post_no]?.content || post.content;

  return (
    <div className="flex w-screen h-[807px] bg-[#ffffff]">
      {/* 왼쪽 사이드바 */}
      <aside className="w-24 bg-[#2e3a4e] flex flex-col justify-between items-center pt-4 pb-0 shadow-md">

        <button
          className="ham_btn mb-4 focus:outline-none"
          onClick={handleMenuToggle}>
          <div className="line" />
          <div className="line" />
          <div className="line" />  
        </button>
        

          <MegaMenu open={menuOpen} onClose={handleMenuToggle} />


        <hr className="w-24 border-gray-600 mb-4" />

        <nav className="flex-1 flex flex-col items-center justify-end space-y-6">
          <button 
            onClick={() => navigate('/post/list')} 
            className="btn-underline w-full flex flex-col items-center py-2">
            <img src="/icon/note_white.png" alt="자유 게시판" className="w-7 h-7" />
            <span className="text-white text-sm mt-2">자유 게시판</span>
          </button>

          <button onClick={() => alert('준비 중입니다.')}
            className="btn-underline w-full flex flex-col items-center py-2">
            <img src="/icon/note_white.png" alt="일정 공유 게시판" className="w-7 h-7" />
            <span className="text-white text-sm mt-2">일정 공유</span>
            <span className="text-white text-sm">게시판</span>
          </button>
          <span className="mb-2"></span>
        </nav>
        <button
          onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full p-6 flex justify-center bg-blue-300 transition-colors group">
          <img src={upIcon} alt="위로가기" 
          className="w-5 h-5 transform transition-transform duration-200 ease-in-out
                     group-hover:-translate-y-1" />
        </button>
      </aside>

      {/* 본문 */}
      <section ref={scrollRef} className="content flex-1 overflow-y-auto">
        {post.hidden_yn === 'Y' && !isAdmin ? (
          <div className="text-center mt-20 text-xl">
            신고 처리된 글입니다.
          </div>
        ) : (
          <>
            <div className="post-title">{translatedTitle}</div>
            <div className="post-meta flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
              <span>{post.created_day}</span>
              <span className="mx-2">·</span>
              <span>조회 : {post.view_cnt}</span>
              <span className="mx-2">·</span>
              <span>작성자 : {post.name}</span>
            </div>
              <div ref={menuRef} className="relative inline-block">
                <button
                  onClick={() => setMoreMenuOpen(o => !o)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="더보기"
                >
                  <span className="text-lg select-none">⋮</span>
                </button>

                {moreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button
                      onClick={() => { onClickReport(); setMoreMenuOpen(false); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <img src={reportIcon} alt="" className="w-4 h-4 mr-2" />
                      신고
                    </button>
                {/* 수정된 BookmarkPostButton */}
                <BookmarkPostButton
                  post_no={post.post_no}
                  onClickCallback={() => setMoreMenuOpen(false)}
                  defaultIcon={starIcon}
                  activeIcon={starIcon /*(활성화 아이콘 따로 있으면 그걸)*/}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                />

                     {isAuthor && (
                      <button
                         onClick={() => { navigate(`/post/update/${post.post_no}`); setMoreMenuOpen(false); }}
                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       >
                        <img src={updateIcon} alt="" className="w-4 h-4 mr-2" />
                         수정
                       </button>
                     )}

                     {/* 삭제 */}
                     {(isAuthor || isAdmin) && (
                       <button
                         onClick={() => { navigate(`/post/delete/${post.post_no}`); setMoreMenuOpen(false); }}
                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       >
                        <img src={rdeleteIcon} alt="" className="w-4 h-4 mr-2" />
                         삭제
                       </button>
                     )}
                    </div>
                )}
              </div>
           </div>

             <hr className="border-t border-gray-200 my-6" />
             
            <div className="flex flex-col space-y-6">
              <div className="post-content">{translatedContent}</div>
              {post.image && (
                <img
                  src={`http://121.78.128.95:9093/images/${post.image}`}
                  alt="게시글 이미지"
                  style={{ maxWidth: '30%', marginTop: 20, borderRadius: 8 }}
                />
              )}
            </div>



            {post.file_org && (
              <div className="mt-6">
                <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                  {/* 문서 아이콘 */}
                  <FiFileText className="w-6 h-6 text-gray-500 mr-3" />

                  {/* 파일명 */}
                  <span className="flex-1 text-gray-700 font-medium">
                    {post.file_org}
                  </span>

                  {/* 다운로드 버튼 */}
                  <button
                    onClick={() => handleDownload(post.files)}
                    className="
                      inline-flex items-center
                      px-3 py-1
                      bg-blue-600 hover:bg-blue-700
                      text-white text-sm font-medium
                      rounded-md
                      transition
                    "
                  >
                    <FiDownload className="w-4 h-4 mr-1" />
                    다운로드
                  </button>
                </div>
              </div>
            )}

            <hr style={{ margin: '40px 0' }} />

            <div className="flex items-center justify-between mt-8 mb-12">
              {prevPost ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/post/read/${prevPost.post_no}${fromSearch}`)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <img src={prev1Icon} alt="이전" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/post/read/${prevPost.post_no}${fromSearch}`)}
                    className="text-gray-500 hover:text-gray-800 text-sm"
                  >
                    이전 글
                  </button>
                </div>
              ) : <div className="w-20" />}

              
              <button
                onClick={() => navigate(`/post/list${fromSearch}`)}
                className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                목록
              </button>
                  
              {nextPost ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/post/read/${nextPost.post_no}${fromSearch}`)}
                    className="text-gray-500 hover:text-gray-800 text-sm"
                  >
                    다음 글
                  </button>
                  <button
                    onClick={() => navigate(`/post/read/${nextPost.post_no}${fromSearch}`)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <img src={next1Icon} alt="다음" className="w-4 h-4" />
                  </button>
                </div>
              ) : <div className="w-20" />}
            </div>
            {/* 댓글 폼 */}
            <form className="reply-form" onSubmit={e => handleReplySubmit(e, null)}>
              <textarea
                placeholder="댓글을 입력하세요"
                rows="3"
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
              />
              <div className="right">
                <button type="submit">등록</button>
              </div>
            </form>

            {/* 댓글 번역 버튼들 */}
            <div className="flex justify-end gap-3 mb-4">
              <button
                onClick={() => translateReplies('en')}
                disabled={isTranslatingReplies}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isTranslatingReplies ? 'Translating…' : 'ENG'}
              </button>
              <button
                onClick={() => translateReplies('ja')}
                disabled={isTranslatingReplies}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
              >
                {isTranslatingReplies ? '翻訳中…' : '日本語'}
              </button>
              <button
                onClick={resetReplyTranslation}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                한국어
              </button>
            </div>

            {/* 댓글 및 대댓글 */}
            <div className="reply-list">
              {replies
                .filter(r => !r.parent_reply_no)
                .map(parent => {
                  const isReplyAuthor = userNo === parent.user_no;
                    const displayContent = parent.deletedYn === 'Y'
                    ? '작성자에 의해 삭제된 댓글입니다.'
                    : (parent.hiddenYn === 'Y' && !isAdmin
                        ? '신고 처리된 댓글입니다.'
                        : parent.content);

                  return (
                    <div key={parent.reply_no} className="reply-item">
                      <div>
                        <strong>{parent.userName || parent.user_id}</strong>  <span className="reply-date">{parent.created_day}</span>
                        <ReplyLikeButton replyNo={parent.reply_no} userNo={userNo} />
                        {!isAdmin && (
                          <button
                            onClick={() => { onClickReplyReport(parent.reply_no); }}
                            className="action-btn report-btn"
                          >
                            신고
                          </button>
                        )}                       
                      </div>
                      
                      <div>{displayContent}</div>

                      {editingReplyNo === parent.reply_no ? (
                        <>
                          <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            rows="2"
                          />
                          <button onClick={() => handleReplyUpdate(parent.reply_no)}>저장</button>
                          <button onClick={() => setEditingReplyNo(null)}>취소</button>
                        </>
                      ) : (
                        <>
                          {/* <div>{parent.content}</div> */}
                          
                          <div style={{ marginTop: 5 }}>
                            {isLoggedIn && (
                              <span
                                 className="reply-text"
                                onClick={() => {
                                  setReplyParent(parent.reply_no);
                                  setReplyContent('');
                                }}
                              >
                                답글
                              </span>
                            )}
                            
                            {isReplyAuthor && (
                              <span
                                className="reply-text"
                                onClick={() => {
                                  setEditingReplyNo(parent.reply_no);
                                  setEditContent(parent.content);
                                }}
                              >
                                수정
                              </span>
                            )}
                            {(isReplyAuthor || isAdmin) && (
                              <span className="reply-text" onClick={() => handleReplyDelete(parent.reply_no)}>
                                삭제
                              </span>
                            )}
                          </div>
                        </>
                      )}

                      {replyParent === parent.reply_no && (
                        <form
                          onSubmit={e => handleReplySubmit(e, parent.reply_no)}
                          className="reply-form"
                          style={{ marginLeft: 30, marginTop: 10 }}
                        >
                          <textarea
                            placeholder="답글을 입력하세요"
                            rows="2"
                            value={childReplyContent[parent.reply_no] || ''}
                            onChange={e =>
                              setChildReplyContent({
                                ...childReplyContent,
                                [parent.reply_no]: e.target.value,
                              })
                            }
                          />
                          <div className="right">
                            <button type="submit">등록</button>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyParent(null);
                                setChildReplyContent({
                                  ...childReplyContent,
                                  [parent.reply_no]: '',
                                });
                              }}
                            >
                              취소
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="replies" style={{ marginLeft: 30, marginTop: 10 }}>
                        {replies
                          .filter(child => child.parent_reply_no === parent.reply_no)
                          .map(child => {
                            const isChildAuthor = userNo === child.user_no;
                            const displayChild   =
                                child.hiddenYn === 'Y' && !isAdmin
                                    ? '신고 처리된 댓글입니다.'
                                    : child.content;
                            return (
                              <div
                                key={child.reply_no}
                                className="reply-item"
                                style={{ borderLeft: '2px solid #eee', paddingLeft: 10, marginBottom: 10 }}
                              >
                                <div>
                                  <strong>{child.userName || child.user_id}</strong>  
                                  <span className="reply-date">{child.created_day}</span>
                                  <ReplyLikeButton replyNo={child.reply_no} userNo={userNo} />
                                  {!isAdmin && (
                                    <button
                                      onClick={() => { onClickReplyReport(child.reply_no); }}
                                      className="action-btn report-btn"
                                    >
                                      신고
                                    </button>

                                  )}                                  
                                </div>
                                <div>{displayChild}</div>
                                {editingReplyNo === child.reply_no ? (
                                  <>
                                    <textarea
                                      value={editContent}
                                      onChange={e => setEditContent(e.target.value)}
                                      rows="2"
                                    />
                                    <button onClick={() => handleReplyUpdate(child.reply_no)}>저장</button>
                                    <button onClick={() => setEditingReplyNo(null)}>취소</button>
                                  </>
                                ) : (
                                  <>
                                    {/* <div>{child.content}</div> */}
                                    <div style={{ marginTop: 5 }}>
                                      {isChildAuthor && (
                                         <span
                                          className="reply-text"
                                          onClick={() => {
                                            setEditingReplyNo(child.reply_no);
                                            setEditContent(child.content);
                                          }}
                                        >
                                          수정
                                         </span>
                                      )}
                                      {(isChildAuthor || isAdmin) && (
                                        <span className="reply-text" onClick={() => handleReplyDelete(child.reply_no)}>
                                          삭제
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </section>

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-3">게시글 신고</h2>
            <textarea
              rows="4"
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              placeholder="신고 사유를 입력해주세요."
              className="w-full border rounded p-2 mb-4"
            />
            <div className="text-right space-x-2">
              <button
                onClick={handleReportSubmit}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                신고하기
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

    {/*  댓글 신고 모달 */}
    {showReplyReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-3">댓글 신고</h2>
            <textarea
            rows="4"
            value={replyReportReason}
            onChange={e => setReplyReportReason(e.target.value)}
            placeholder="신고 사유를 입력해주세요."
            className="w-full border rounded p-2 mb-4"
            />
            <div className="text-right space-x-2">
            <button
                onClick={handleReplyReportSubmit}
                className="bg-red-500 text-white px-4 py-1 rounded"
            >
                신고하기
            </button>
            <button
                onClick={() => {
                setShowReplyReportModal(false);
                setReplyReportReason('');
                setReportReplyNo(null);
                }}
                className="bg-gray-300 px-4 py-1 rounded"
            >
                취소
            </button>
            </div>
        </div>
        </div>
     )}      
    </div>
  );
};

export default PostDetail;
