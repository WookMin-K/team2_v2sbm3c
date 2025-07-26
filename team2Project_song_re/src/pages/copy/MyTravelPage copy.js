import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useLoginContext } from '../../contexts/LoginContext';

const PAGE_SIZE = 1; // 한 페이지에 보여줄 '날짜 블록' 수

const MyTravelPage = () => {
  const { loginUser } = useLoginContext();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 검색창 입력값과 실제 검색어 분리
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  
  // (추가) 일자별 열림/닫힘 상태
  const [opened, setOpened] = useState({});

  useEffect(() => {
    if (!loginUser) return;
    axios.get(`/travel/list/${loginUser.user_no}`)
      .then(res => setPlans(res.data))
      .catch(err => console.error('❌ 여행 일정 가져오기 실패:', err))
      .finally(() => setLoading(false));
  }, [loginUser]);

  // 1) 입력값(searchInput)이 아닌, 확인 버튼으로 설정된 searchTerm 으로 필터링
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return plans;
    const term = searchTerm.toLowerCase();
    return plans.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.place.toLowerCase().includes(term)
    );
  }, [plans, searchTerm]);


  // 2) 제목별 → 일별 정렬/그룹핑
  const groupedByTitle = useMemo(() => {
    const titleMap = {};
    filtered.forEach(item => {
      if (!titleMap[item.title]) titleMap[item.title] = [];
      titleMap[item.title].push(item);
    });
    return Object.entries(titleMap).map(([title, items]) => {
      const dayMap = {};
      items.forEach(it => {
        if (!dayMap[it.trip_day]) dayMap[it.trip_day] = [];
        dayMap[it.trip_day].push(it);
      });
      const days = Object.entries(dayMap)
        .map(([day, dayItems]) => ({
          day: Number(day),
          items: dayItems.sort(
            (a,b) => new Date(a.start_date) - new Date(b.start_date)
          )
        }))
        .sort((a,b) => a.day - b.day);
      return { title, days };
    });
  }, [filtered]);

  // 3) 페이징 (제목 블록 단위)
  const totalPages = Math.ceil(groupedByTitle.length / PAGE_SIZE);
  const pageData = groupedByTitle.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (!loginUser) {
    return <div className="text-center mt-20">로그인이 필요합니다.</div>;
  }
  if (loading) {
    return <div className="text-center mt-20">로딩 중...</div>;
  }
  if (plans.length === 0) {
    return <div className="text-center mt-20">등록된 여행 일정이 없습니다.</div>;
  }

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">✈️ 내 여행 일정</h2>

      {/* 검색창 + 확인 버튼 */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="제목 또는 장소 검색..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="border p-2 flex-1 rounded"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setSearchTerm(searchInput);
              setCurrentPage(1);
            }
          }}
        />
        <button
          onClick={() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
          }}
          className="bg-blue-500 text-white px-4 rounded"
        >
          확인
        </button>
      </div>

      {/* 페이징된 데이터 렌더 */}
      {pageData.map(({ title, days }) => (
        <section key={title} className="mb-8 p-4 border rounded-md">
          <h3 className="text-xl font-bold mb-4">📁 {title}</h3>
          <div className="w-full flex justify-center space-x-6 overflow-x-auto">
            {days.map(({ day, items }) => (
              <div
                key={day}
                className="min-w-[200px] bg-white rounded shadow flex-shrink-0"
              >
                <h4 className="px-4 py-2 bg-gray-100 font-medium text-center">
                  {day}일차
                </h4>
                <ul className="divide-y">
                  {items.map(p => (
                    <li
                      key={p.plan_no}
                      className="flex justify-between px-4 py-2 hover:bg-gray-50"
                    >
                      <span>
                        {new Date(p.start_date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      <span>{p.place}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* 페이징 UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            이전
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTravelPage;