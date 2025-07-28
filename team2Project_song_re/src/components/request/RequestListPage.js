// src/pages/RequestListPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from '../../contexts/LoginContext';
import MegaMenu from '../../components/MegaMenu';
import upIcon from '../../pages/icon/up.png';
import './RequestListPage.css'; // 자유 게시판 공통 스타일

axios.defaults.withCredentials = true;

const RequestListPage = () => {
  const { loginUser } = useLoginContext();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // ── 사이드바 햄버거 ──
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen(o => !o);

  // ── 문의 데이터 ──
  const [requests, setRequests] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [answerMap, setAnswerMap] = useState({});

  // 문의 목록 가져오기
  const fetchRequests = () => {
    if (!loginUser) return;
    axios.get(`/request/listAuto/${loginUser.user_id}/${loginUser.user_no}`)
      .then(res => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.list)
            ? res.data.list
            : [];
        setRequests(list);
      })
      .catch(() => alert('❌ 문의 목록을 불러오지 못했습니다.'));
  };
  const isAdmin = loginUser?.grade === 0;

  useEffect(fetchRequests, [loginUser]);

  // 등록, 수정, 삭제, 답변 저장 핸들러는 원본 코드와 동일
  const handleCreate = e => {
    e.preventDefault();
    if (!newTitle || !newContent) return alert('제목과 내용을 입력해주세요.');
    axios.post('/request/create', {
      user_no: loginUser.user_no,
      title: newTitle,
      content: newContent
    })
      .then(() => {
        setNewTitle(''); setNewContent('');
        fetchRequests();
      })
      .catch(() => alert('❌ 등록 실패'));
  };

  const handleDelete = id => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    axios.delete(`/request/delete/${id}`)
      .then(() => setRequests(reqs => reqs.filter(r => r.request_no !== id)))
      .catch(() => alert('❌ 삭제 실패'));
  };

  const handleUpdate = () => {
    if (!editTitle || !editContent) return alert('제목과 내용을 입력해주세요.');
    axios.put('/request/update', {
      request_no: editId,
      title: editTitle,
      content: editContent
    })
      .then(() => {
        setEditId(null);
        fetchRequests();
      })
      .catch(() => alert('❌ 수정 실패'));
  };

  const handleAnswerSave = request_no => {
    const answer = answerMap[request_no];
    if (!answer) return alert('답변을 입력해주세요.');
    axios.put('/request/updateAnswer', { request_no, answer })
      .then(() => {
        setAnswerMap(m => ({ ...m, [request_no]: '' }));
        fetchRequests();
      })
      .catch(() => alert('❌ 답변 저장 실패'));
  };

  // 스크롤탑 버튼
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowTop(el.scrollTop > 0);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

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

          <div className="relative group w-full">
           <button onClick={() => navigate('/mypage')} className="btn-underline w-full flex flex-col items-center py-2">
             <img src="/icon/info_white.png" alt="내 정보" className="w-7 h-7" />
             <span className="text-white text-sm mt-2">내 정보</span>
           </button>
          </div>
           {isAdmin && (
            <button onClick={() => navigate('/mypage/users')} className="btn_user btn-underline w-full flex flex-col items-center py-2">
              <span className="icon w-7 h-7" />
              <span className="text-white text-sm mt-2">회원 목록</span>
            </button>          
          )}

          {isAdmin && (
            <button onClick={() => navigate('/admin/reports')} className="btn_report btn-underline w-full flex flex-col items-center py-2">
              <span className="icon w-7 h-7" />
              <span className="text-white text-sm mt-2">신고 목록</span>
            </button>
          )}

          <button onClick={() => navigate('/mypage/bookmark')} className="btn-star btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">즐겨찾기</span>
          </button>

          <button onClick={() => navigate('/mypage/postlist')} className="btn-post btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">내 게시글</span>
          </button>

          <button onClick={() => navigate('/mypage/mytravel')} className="btn_plane btn-underline w-full flex flex-col items-center py-2">
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">내 여행 일정</span>
          </button>
          
          {/* 관리자는 '문의 목록', 일반 회원은 '내 문의' */}
          <button
            onClick={() => navigate('/request/list')}
            className="btn_inquiry btn-underline w-full flex flex-col items-center py-2"
          >
            <span className="icon w-7 h-7" />
            <span className="text-white text-sm mt-2">
              {isAdmin ? '문의 목록' : '내 문의'}
            </span>
          </button>

          <span className="mb-2"></span>
        </nav>
        <button
          onClick={() => scrollRef.current.scrollTo({ top: 0, behavior: 'smooth'})}
          className="w-full p-6 flex justify-center bg-blue-300 transition-colors group">
          <img src={upIcon} alt="위로가기" 
          className="w-5 h-5 transform transition-transform duration-200 ease-in-out
                     group-hover:-translate-y-1" />
        </button>
      </aside>

      {/* ── 본문 ── */}
      <section ref={scrollRef} className="overflow-y-auto scrollable flex-1 mt-16 px-0 pb-40">
        {/* 제목 */}
        <h2 className="text-3xl text-center font-bold mb-4">
          {loginUser?.user_id === 'admin01' ? '모든 문의 목록' : '내 문의 목록'}
        </h2>
        <div className="border-t border-gray-300 my-14"/>

        <div className="max-w-5xl mx-auto px-6">
          {/* 등록 폼 (관리자 제외) */}
          {loginUser?.user_id !== 'admin01' && (
            <form onSubmit={handleCreate} className="space-y-4 mb-8">
              <input
                className="w-full border p-3 rounded"
                placeholder="문의 제목"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
              <textarea
                className="w-full border p-3 rounded h-32"
                placeholder="문의 내용"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full w-full"
              >
                문의 등록
              </button>
            </form>
          )}

          {/* 문의 리스트 */}
          <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
            {requests.map(req => (
              <div key={req.request_no} className="py-4 hover:bg-gray-50 transition">
                {/* 수정 모드 */}
                {editId === req.request_no ? (
                  <>
                    <input
                      className="w-full border p-2 rounded mb-2"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full border p-2 rounded mb-2 h-24"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={handleUpdate}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                        저장
                      </button>
                      <button onClick={() => setEditId(null)}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded">
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-[#3B3B58] mb-2">{req.title}</h3>
                    <p className="text-gray-700 mb-2 whitespace-pre-wrap">{req.content}</p>
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(req.created_at).toLocaleString()}
                    </p>

                    {/* 회원 수정/삭제 */}
                    {loginUser?.user_id !== 'admin01' && (
                      <div className="flex gap-4 mb-2">
                        <button onClick={() => {
                          setEditId(req.request_no);
                          setEditTitle(req.title);
                          setEditContent(req.content);
                        }} className="text-blue-500 hover:underline">
                          수정
                        </button>
                        <button onClick={() => handleDelete(req.request_no)}
                                className="text-red-500 hover:underline">
                          삭제
                        </button>
                      </div>
                    )}

                    {/* 관리자 답변 */}
                    {loginUser?.user_id === 'admin01' ? (
                      <div className="mt-4">
                        <textarea
                          className="w-full border p-2 rounded h-24 mb-2"
                          placeholder="답변을 입력해주세요"
                          value={answerMap[req.request_no] || ''}
                          onChange={e =>
                            setAnswerMap(m => ({
                              ...m,
                              [req.request_no]: e.target.value
                            }))
                          }
                        />
                        <button onClick={() => handleAnswerSave(req.request_no)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                          답변 저장
                        </button>
                      </div>
                    ) : (
                      req.answer && (
                        <div className="bg-gray-100 p-3 mt-4 rounded">
                          <p className="font-semibold mb-2">✅ 관리자 답변</p>
                          <p className="whitespace-pre-wrap">{req.answer}</p>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestListPage;
