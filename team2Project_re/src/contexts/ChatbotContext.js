import { createContext, useContext, useState, useEffect } from 'react';
import { useLoginContext } from './LoginContext';

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const { userNo, userName } = useLoginContext();

  // 1. 챗봇 메시지 상태
  const [messages, setMessages] = useState(() => {
    // 게스트면 localStorage에서 불러오기
    if (!userNo) {
      const saved = localStorage.getItem('chatbot_guest_history');
      return saved
        ? JSON.parse(saved)
        : [{ type: 'bot', text: 'trAveI에 오신것을 환영합니다! 무엇을 도와드릴까요?' }];
    }
    // 회원이면 일단 기본 메시지, 아래 useEffect에서 DB에서 불러옴
    return [{ type: 'bot', text: 'trAveI에 오신것을 환영합니다! 무엇을 도와드릴까요?' }];
  });

  // 2. userNo 또는 userName이 바뀔 때마다 “누구 상태냐”에 따라 messages를 교체!
  useEffect(() => {
    if (!userNo) {
      // ✨ 게스트(로그아웃)일 때: localStorage에서 불러오기
      const guestHistory = localStorage.getItem('chatbot_guest_history');
      setMessages(
        guestHistory
          ? JSON.parse(guestHistory)
          : [{ type: 'bot', text: 'trAveI에 오신것을 환영합니다! 무엇을 도와드릴까요?' }]
      );
    } else {
      // 🙋‍♂️ 회원(로그인)일 때: DB에서 이력 fetch
      fetch(`http://121.78.128.95:8000/api/chat/history?user_no=${userNo}`)
        .then(res => {
          if (!res.ok) throw new Error('이력 조회 실패');
          return res.json();
        })
        .then(history => {
          if (history.length === 0) {
            setMessages([{
              type: 'bot',
              text: `${userName}님, 반갑습니다! 무엇을 도와드릴까요?`
            }]);
          } else {
            setMessages(
              history.map(h => ({
                type: h.role === 'human' ? 'user' : 'bot',
                text: h.content
              }))
            );
          }
        })
        .catch(() => {
          setMessages([{
            type: 'bot',
            text: `${userName || '손님'}님, 반갑습니다! 무엇을 도와드릴까요?`
          }]);
        });
    }
  }, [userNo, userName]); // ← userNo가 변할 때마다 위 분기 실행

  // 3. 게스트일 때만 localStorage에 대화 저장
  useEffect(() => {
    if (!userNo) {
      localStorage.setItem('chatbot_guest_history', JSON.stringify(messages));
    }
  }, [messages, userNo]);

  return (
    <ChatbotContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbotContext = () => useContext(ChatbotContext);
