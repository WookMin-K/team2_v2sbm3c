import React, { useState, useRef, useEffect } from 'react';
import { useLoginContext } from '../contexts/LoginContext';
import { useChatbotContext } from '../contexts/ChatbotContext';


function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const { userNo, userName } = useLoginContext();
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const { messages, setMessages } = useChatbotContext();
  

  // // 1) 새로고침 후에도 저장된 이력을 가져오는 useEffect
  // useEffect(() => {
  //   if (!userNo) {
  //     // 비로그인 시 기본 환영 메시지
  //     setMessages([{ type: 'bot', text: 'trAveI에 오신것을 환영합니다! 무엇을 도와드릴까요?' }]);
  //     return;
  //   }
  //   // 로그인한 회원 → DB에서 history 호출
  //   fetch(`http://192.168.12.142:8000/api/chat/history?user_no=${userNo}`)
  //     .then(res => {
  //       if (!res.ok) throw new Error('이력 조회 실패');
  //       return res.json();  // [{ role, content, created_at}, …]
  //     })
  //     .then(history => {
  //       if (history.length === 0) {
  //         // 첫 대화인 경우, 사용자 이름을 넣어서 인사
  //         setMessages([{
  //           type: 'bot',
  //           text: `${userName}님, 반갑습니다! 무엇을 도와드릴까요?`
  //         }]);
  //       } else {
  //         // 기존 대화 이력을 보여줌
  //         const msgs = history.map(h => ({
  //           type: h.role === 'human' ? 'user' : 'bot',
  //           text: h.content
  //         }));
  //         setMessages(msgs);
  //       }
  //     })
  //     .catch(() => {
  //       // 에러 나도 최소 인사는 보여주기
  //       setMessages([{
  //         type: 'bot',
  //         text: `${userName || '손님'}님, 반갑습니다! 무엇을 도와드릴까요?`
  //       }]);
  //     });
  // }, [userNo, userName]);

  const handleQuickQuestion = async (label) => {
    if (loading) return;
    // 바로 전송: userInput을 비우고, 메시지 업데이트, API 호출
    const updatedMessages = [...messages, { type: 'user', text: label }];
    setMessages(updatedMessages);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch('http://192.168.12.142:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_no: userNo ? parseInt(userNo, 10) : null,
          user_name: userName || null,
          query: label,
        }),
      });
      if (!res.ok) throw new Error(`API 에러: ${res.status}`);
      const { answer } = await res.json();
      setMessages([...updatedMessages, { type: 'bot', text: answer }]);
    } catch (err) {
      setMessages([...updatedMessages, { type: 'bot', text: '오류가 발생했어요. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
      setShowQuickQuestions(false); // 전송 후 닫기
    }
  };


  const handleSend = async () => {
    if (!userInput.trim()) return;

    // 1) 사용자 메시지 추가
    const updatedMessages = [...messages, { type: 'user', text: userInput }];
    setMessages(updatedMessages);
    setUserInput('');
    setLoading(true);

    try {
      // 2) 로컬 FastAPI 챗봇 호출
      console.log('🔍 요청 보냄 → http://192.168.12.142:8000/api/chat', userInput);
      const res = await fetch('http://192.168.12.142:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_no:    userNo ? parseInt(userNo, 10) : null,
          user_name:  userName || null,
          query: userInput }),
      });
        console.log('🔍 fetch 응답:', res.status, res.statusText);
      if (!res.ok) throw new Error(`API 에러: ${res.status}`);
      const { answer } = await res.json();
      
      // 3) 봇 답변 추가
      setMessages([...updatedMessages, { type: 'bot', text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { type: 'bot', text: '오류가 발생했어요. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* 챗봇 열기 버튼 */}
      <div className="fixed bottom-6 right-6 z-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-20 h-20 rounded-full bg-white border border-[#EDE1E1] text-white shadow-lg flex items-center justify-center hover:bg-blue-200 transition-all"
          title="챗봇"
        >
          <img src="/icon/chatbot.png" alt="챗봇" className="w-12 h-12" />
        </button>
      </div>

      {/* 챗봇 UI 창 */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-100
          ${isExpanded ? 'w-[500px] h-[500px]' : 'w-80 h-96'}
          bg-white border border-gray-300 rounded-xl shadow-xl p-4 z-50 transition-all duration-300 flex flex-col`}
        >

          {/* 상단 헤더 */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-blue-700">trAveI 챗봇</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? '창 축소' : '창 확장'}
                className="mt-[-4px]"
              >
                <span className="text-xl text-gray-500 hover:text-black">
                  {isExpanded ? '🗕' : '🗖'}
                </span>
              </button>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black text-xl" title="닫기">✖</button>
            </div>
          </div>

          {/* 채팅 메시지 영역 */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-2 text-sm pr-1 scrollbar-thin scrollbar-thumb-blue-200"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[70%] break-words ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-400 italic">답변 생성 중...</div>}
          </div>

            {/* 빠른 질문 토글 */}
            <div className="flex justify-end mb-1">
              <button
                onClick={() => setShowQuickQuestions(v => !v)}
                className="text-xs text-blue-500 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                disabled={loading}
              >
                {showQuickQuestions ? "빠른 질문 닫기 ▲" : "빠른 질문 열기 ▼"}
              </button>
            </div>
            {showQuickQuestions && (
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  '여행 일정 생성 방법',
                  '일정 저장하는 법',
                  '저장된 일정 보기',
                  'PDF 저장하기',
                  '공유하기'
                ].map(label => (
                  <button
                    key={label}
                    onClick={() => handleQuickQuestion(label)}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
                    disabled={loading}
                  >
                    {label}
                  </button>
            ))}
          </div>
          )}

          {/* 입력창 */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="질문을 입력하세요..."
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
