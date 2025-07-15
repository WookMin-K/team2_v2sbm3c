import React, { useState, useRef, useEffect } from 'react';

const OPENAI_API_KEY = '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';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'trAveI에 오신것을 환영합니다! 무엇을 도와드릴까요?' },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const updatedMessages = [...messages, { type: 'user', text: userInput }];
    setMessages(updatedMessages);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
              {
                role: 'system',
                content: `
                  너는 'trAveI'라는 여행 자동 일정 생성 사이트의 챗봇이야.
                  자주 묻는 질문(FAQ)을 기준으로 먼저 짧고 정확하게 답하고,
                  사용자가 추가 설명을 원하거나 이해 못할 경우엔 자세히 풀어서 설명해 줘.

                  ---

                  Q: 여행 일정은 어떻게 생성하나요?
                  A: 메인에서 'trAveI 시작하기' 또는 '일정 생성'를 클릭하고, 여행지와 날짜를 입력하면 자동으로 일정이 생성돼요.

                  Q: 일정을 저장하려면 어떻게 하나요?
                  A: 회원가입 후 로그인한 상태에서 일정을 생성하면 자동으로 저장돼요.

                  Q: 저장한 일정은 어디서 볼 수 있나요?
                  A: 상단 메뉴 '마이페이지 > 내 일정'에서 확인할 수 있어요.

                  Q: PDF로 저장할 수 있나요?
                  A: '내 일정' 화면에서 'PDF 저장' 버튼을 누르면 바로 저장됩니다.

                  Q: 친구와 일정 공유할 수 있나요?
                  A: 네! 일정 상세보기에서 '공유하기' 버튼을 누르면 공유 링크가 복사돼요.

                  ---

                  ※ 사용자가 이해하지 못하거나 '자세히 알려줘', '예시 보여줘' 같은 요청을 하면, AI답게 친절하고 쉽게 풀어서 설명해 주세요.
                `.trim()
              },
            ...updatedMessages.map((m) => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
          ],
        }),
      });

      const data = await res.json();
      const gptReply = data.choices?.[0]?.message?.content?.trim();

      setMessages([...updatedMessages, { type: 'bot', text: gptReply || '답변 생성 실패 😢' }]);
    } catch (err) {
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
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all"
          title="챗봇"
        >
          💬챗봇
        </button>
      </div>

      {/* 챗봇 UI 창 */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6
          ${isExpanded ? 'w-[500px] h-[500px]' : 'w-80 h-96'}
          bg-white border border-gray-300 rounded-xl shadow-xl p-4 z-50 transition-all duration-300 flex flex-col`}
        >

          {/* 상단 헤더 */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-blue-700">trAveI 챗봇</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)} title="확장/축소" className="mt-[-4px]">
                <span className="text-xl text-gray-500 hover:text-black">🗖</span>
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
