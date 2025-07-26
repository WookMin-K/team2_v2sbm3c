import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoginContext } from '../../contexts/LoginContext';

const RequestListPage = () => {
  const { loginUser } = useLoginContext();
  const [requests, setRequests] = useState([]);

  // ✅ 등록 폼 상태
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // ✅ 수정 모드 상태
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // ✅ 관리자 답변 상태
  const [answerMap, setAnswerMap] = useState({});

  // ✅ 문의 리스트 가져오기
  const fetchRequests = () => {
    if (!loginUser) return;

    axios
      .get(`/request/listAuto/${loginUser.user_id}/${loginUser.user_no}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRequests(res.data);
        } else if (res.data && Array.isArray(res.data.list)) {
          setRequests(res.data.list);
        } else {
          setRequests([]);
        }
      })
      .catch(() => alert('❌ 문의 목록을 불러오지 못했습니다.'));
  };

  useEffect(() => {
    fetchRequests();
  }, [loginUser]);

  // ✅ 등록
  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return alert('제목과 내용을 입력해주세요.');

    axios
      .post('/request/create', {
        user_no: loginUser.user_no,
        title: newTitle,
        content: newContent
      })
      .then(() => {
        alert('✅ 등록 완료');
        setNewTitle('');
        setNewContent('');
        fetchRequests();
      })
      .catch(() => alert('❌ 등록 실패'));
  };

  // ✅ 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios
        .delete(`/request/delete/${id}`)
        .then(() => {
          alert('✅ 삭제 완료');
          setRequests(requests.filter((r) => r.request_no !== id));
        })
        .catch(() => alert('❌ 삭제 실패'));
    }
  };

  // ✅ 수정 저장
  const handleUpdate = () => {
    if (!editTitle || !editContent) return alert('제목과 내용을 입력해주세요.');

    axios
      .put('/request/update', {
        request_no: editId,
        title: editTitle,
        content: editContent
      })
      .then(() => {
        alert('✅ 수정 완료');
        setEditId(null);
        fetchRequests();
      })
      .catch(() => alert('❌ 수정 실패'));
  };

  // ✅ 관리자 답변 저장
  const handleAnswerSave = (request_no) => {
    const answer = answerMap[request_no];
    if (!answer) return alert('답변을 입력해주세요.');

    axios
      .put('/request/updateAnswer', {
        request_no,
        answer
      })
      .then(() => {
        alert('✅ 답변 저장 완료');
        setAnswerMap((prev) => ({ ...prev, [request_no]: '' }));
        fetchRequests();
      })
      .catch(() => alert('❌ 답변 저장 실패'));
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">

        {/* ✅ 제목 */}
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2e3a4e]">
          {loginUser?.user_id === 'admin01' ? '모든 문의 목록 (관리자)' : '내 문의 목록'}
        </h2>

        {/* ✅ 등록 폼 (관리자는 작성 못함) */}
        {loginUser?.user_id !== 'admin01' && (
          <form onSubmit={handleCreate} className="space-y-4 mb-10">
            <input
              className="w-full border p-3 rounded"
              placeholder="문의 제목을 입력해주세요"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full border p-3 rounded h-32"
              placeholder="문의 내용을 입력해주세요"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-full"
            >
              문의 등록하기
            </button>
          </form>
        )}

        {/* ✅ 리스트 */}
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center">작성한 문의가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req.request_no} className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-4 shadow">
                {/* ✅ 수정 모드 */}
                {editId === req.request_no ? (
                  <>
                    <input
                      className="w-full border p-2 rounded mb-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full border p-2 rounded mb-2 h-24"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-[#3B3B58] mb-2">{req.title}</h3>
                    <p className="text-gray-700 mb-2 whitespace-pre-wrap">{req.content}</p>
                    <p className="text-sm text-gray-400">{new Date(req.created_at).toLocaleString()}</p>

                    {/* ✅ 회원의 수정/삭제 버튼 */}
                    {loginUser?.user_id !== 'admin01' && (
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => {
                            setEditId(req.request_no);
                            setEditTitle(req.title);
                            setEditContent(req.content);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(req.request_no)}
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    )}

                    {/* ✅ 관리자 답변 영역 */}
                    {loginUser?.user_id === 'admin01' ? (
                      <div className="mt-4">
                        <textarea
                          className="w-full border p-2 rounded h-24 mb-2"
                          placeholder="답변을 입력해주세요"
                          value={answerMap[req.request_no] || ''}
                          onChange={(e) =>
                            setAnswerMap((prev) => ({
                              ...prev,
                              [req.request_no]: e.target.value
                            }))
                          }
                        />
                        <button
                          onClick={() => handleAnswerSave(req.request_no)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RequestListPage;
