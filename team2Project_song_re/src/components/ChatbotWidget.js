// src/components/ChatbotWidget.js
import React, { useState, useRef, useEffect } from 'react';
import { useLoginContext } from '../contexts/LoginContext';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, loginUser } = useLoginContext();

  // loginUser.id가 없으면 guest, 있으면 문자열로 사용
  const userId = (isLoggedIn && loginUser && loginUser.id)
    ? String(loginUser.id)
    : 'guest';

  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'trAveI에 오신 것을 환영합니다! 무엇을 도와드릴까요?' },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const handleSend = async () => {
    console.log('📣 fetch to:', 'http://localhost:8000/support/chat');
    if (!userInput.trim()) return;

    const updated = [...messages, { type: 'user', text: userInput }];
    setMessages(updated);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, question: userInput }),
      });
      if (!res.ok) throw new Error();
      const { answer } = await res.json();
      setMessages(prev => [...prev, { type: 'bot', text: answer }]);
    } catch {
      setMessages(prev => [...prev, { type: 'bot', text: '오류가 발생했습니다.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKey = e => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* 열기 버튼 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(o => !o)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        >
          💬
        </button>
      </div>

      {/* 챗봇 창 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 rounded-xl shadow-xl flex flex-col">
          {/* 헤더 */}
          <div className="flex justify-between items-center p-2 border-b">
            <span className="font-bold text-blue-700">trAveI 챗봇</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
              ✖
            </button>
          </div>

          {/* 메시지 영역 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1">
            {messages.map((m, i) => (
              <div key={i} className={m.type === 'user' ? 'text-right' : 'text-left'}>
                <span
                  className={`inline-block px-3 py-1 rounded ${
                    m.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">답변 생성 중...</div>}
          </div>

          {/* 입력창 */}
          <div className="p-2 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="질문을 입력하세요…"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
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
