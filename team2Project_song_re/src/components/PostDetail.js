// 📁 src/components/PostDetail.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostDetail } from '../api/postApi';
import { useLoginContext } from '../contexts/LoginContext';
import './PostDetail.css';
import BookmarkPostButton from './bookmark/bookmarkbutton_post';


const PostDetail = () => {
  const { postNo } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userName, setIsLoginOpen } = useLoginContext();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState(''); // 댓글 입력값
  const [childReplyContent, setChildReplyContent] = useState({}); // 대댓글 입력값
  const [replyParent, setReplyParent] = useState(null); // 대댓글 대상
  const [editingReplyNo, setEditingReplyNo] = useState(null); // 수정 대상 댓글 번호
  const [editContent, setEditContent] = useState(''); // 수정 내용
  const userNo = sessionStorage.getItem('userNo');

  


  // 게시글 및 댓글 데이터 불러오기
  const fetchData = async () => {
    const data = await getPostDetail(postNo);
    setPost(data.post);
    setReplies(data.replies);
  };

  useEffect(() => {
    fetchData();
  }, [postNo]);


// 파일 다운로드
const handleDownload = async (fileName) => {
  try {
    const response = await fetch(`http://192.168.12.142:9093/post/download/${fileName}`);
    if (!response.ok) throw new Error('파일 다운로드 실패');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('다운로드 오류:', err);
    alert('파일 다운로드에 실패했습니다.');
  }
};
  // 댓글/답글 등록
const handleReplySubmit = async (e, parentReplyNo) => {
    e.preventDefault();
    
      if (!isLoggedIn) {
      alert('댓글을 쓰려면 로그인해야 합니다.');
      setIsLoginOpen(true);
      // 저장된 리다이렉트는 필요 없으면 생략
      return;
    }

  // ✅ 대댓글일 경우 해당 키로부터 문자열을 꺼내고, 없으면 빈 문자열
  const contentToSubmit = parentReplyNo
    ? childReplyContent[parentReplyNo] || ''
    : replyContent;

  if (!contentToSubmit.trim()) return;

   const res = await fetch('/reply/create', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       post_no: post.post_no,
       content: contentToSubmit,
       user_no: Number(userNo),     // 세션에서 꺼낸 userNo
       parent_reply_no: parentReplyNo,
     }),
   });

  if (res.ok) {
    if (parentReplyNo) {
      // ✅ 대댓글은 해당 키 초기화
      setChildReplyContent({
        ...childReplyContent,
        [parentReplyNo]: '',
      });
      setReplyParent(null);
    } else {
      setReplyContent('');
    }
    fetchData();
  }
};


  // 댓글 수정 제출
  const handleReplyUpdate = async (reply_no) => {
    const res = await fetch('/reply/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply_no,
        content: editContent,
      }),
    });

    if (res.ok) {
      setEditingReplyNo(null);
      setEditContent('');
      fetchData();
    }
  };

  // 댓글 삭제
  const handleReplyDelete = async (reply_no) => {
    if (!window.confirm('정말 삭제할까요?')) return;

    const res = await fetch(`/reply/delete/${reply_no}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchData();
    }
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="post-detail-container">
      {/* 사이드바 */}
      <div className="sidebar">
        <h3>마이페이지</h3>
        <ul>
          <li><button className="link-btn" onClick={() => alert('설정 준비 중')}>설정</button></li>
        </ul>
        <hr />
        <h4>글 관리</h4>
        <ul>
          <li><button className="link-btn" onClick={() => alert('즐겨찾기 준비 중')}>즐겨찾기</button></li>
          <li><button className="link-btn" onClick={() => navigate('/post/list')}>내 게시물</button></li>
        </ul>
      </div>

      {/* 본문 */}
      <div className="content">
        <div className="post-title">{post.title}</div>
        <div className="post-meta">
          작성자: {post.name} | 작성일: {post.created_day} | 조회수: {post.view_cnt}
        </div>
        <div className="post-content">{post.content}</div>

        {post?.image && (
          <img
            //src={`http://192.168.12.142:9093/images/${post.image}`} // 여기서 /images/는 WebMvcConfig에 매핑된 이름
            src={`http://localhost:9093/images/${post.image}`}
            alt="게시글 이미지"
            style={{ maxWidth: '100%', marginTop: '20px', borderRadius: '8px' }}
          />
        )}

        {post.file_org && (
          <div style={{ margin: '10px 0' }}>
            <button
              onClick={() => handleDownload(post.files)}
              style={{
                textDecoration: 'none',
                padding: '6px 12px',
                backgroundColor: '#eee',
                border: '1px solid #888',
                borderRadius: '4px',
                display: 'inline-block',
                cursor: 'pointer'
              }}
            >
              📎 {post.file_org} 다운로드
            </button>
          </div>
        )}        

        <div className="buttons">
          <button onClick={() => navigate(`/post/update/${post.post_no}`)}>수정</button>
          <button onClick={() => navigate(`/post/delete/${post.post_no}`)}>삭제</button>
          <button onClick={() => navigate('/post/list')}>목록</button>
          <BookmarkPostButton post_no={post.post_no} />
        </div>

        <hr style={{ margin: '40px 0' }} />

        {/* 댓글 입력 폼 */}
        <form className="reply-form" onSubmit={(e) => handleReplySubmit(e, null)}>
          <textarea
            placeholder="댓글을 입력하세요"
            rows="3"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          ></textarea>
          <div className="right">
            <button type="submit">등록</button>
          </div>
        </form>


        {/* 댓글 및 대댓글 출력 */}
        <div className="reply-list">
          {replies.filter(r => !r.parent_reply_no).map(parent => (
            <div key={parent.reply_no} className="reply-item">
              <div><strong>{parent.userName || parent.user_id}</strong> | {parent.created_day}</div>

              {editingReplyNo === parent.reply_no ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="2"
                  />
                  <button onClick={() => handleReplyUpdate(parent.reply_no)}>저장</button>
                  <button onClick={() => setEditingReplyNo(null)}>취소</button>
                </>
              ) : (
                <>
                  <div>{parent.content}</div>
                  <div style={{ marginTop: 5 }}>
                    <button onClick={() => {
                      setReplyParent(parent.reply_no);
                      setReplyContent('');
                    }}>답글</button>
                    <button onClick={() => {
                      setEditingReplyNo(parent.reply_no);
                      setEditContent(parent.content);
                    }}>수정</button>
                    <button onClick={() => handleReplyDelete(parent.reply_no)}>삭제</button>
                  </div>
                </>
              )}

              {/* 대댓글 입력 폼 */}
              {replyParent === parent.reply_no && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, parent.reply_no)}
                  className="reply-form"
                  style={{ marginLeft: '30px', marginTop: '10px' }}
                >
                  <textarea
                    placeholder="답글을 입력하세요"
                    rows="2"
                    value={childReplyContent[parent.reply_no] || ''}
                    onChange={(e) =>
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

              {/* 대댓글 출력 */}
              <div className="replies" style={{ marginLeft: '30px', marginTop: '10px' }}>
                {replies
                  .filter(child => child.parent_reply_no === parent.reply_no)
                  .map(child => (
                    <div key={child.reply_no} className="reply-item" style={{ borderLeft: '2px solid #eee', paddingLeft: '10px', marginBottom: '10px' }}>
                      <div><strong>{child.userName || child.user_id}</strong> | {child.created_day}</div>

                      {editingReplyNo === child.reply_no ? (
                        <>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows="2"
                          />
                          <button onClick={() => handleReplyUpdate(child.reply_no)}>저장</button>
                          <button onClick={() => setEditingReplyNo(null)}>취소</button>
                        </>
                      ) : (
                        <>
                          <div>{child.content}</div>
                          <button onClick={() => {
                            setEditingReplyNo(child.reply_no);
                            setEditContent(child.content);
                          }}>수정</button>
                          <button onClick={() => handleReplyDelete(child.reply_no)}>삭제</button>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
