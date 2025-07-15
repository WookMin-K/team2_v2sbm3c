export const vsQuestions = [
  // ✅ 점수 기반 질문 (score_keywords → totaldata 기준)
  {
    id: "q1",
    type: "score",
    question: "자연 속에서 힐링하기 VS 시내에서 감성 충전",
    options: ["자연", "감성"]
  },
  {
    id: "q2",
    type: "score",
    question: "먹방 여행 좋아해? 아니면 풍경 감상이 더 좋아?",
    options: ["맛집", "풍경"]
  },
  {
    id: "q3",
    type: "score",
    question: "문화 유적지 탐방 VS 현대 전시·공연 감상",
    options: ["역사", "문화"]
  },
  {
    id: "q4",
    type: "score",
    question: "SNS 포토존 필수 VS 분위기만 좋으면 OK",
    options: ["포토존", "여유"]
  },
  {
    id: "q5",
    type: "score",
    question: "조용한 힐링 여행 VS 놀이·체험 많은 활동 여행",
    options: ["힐링", "레저"]
  },
  {
    id: "q6",
    type: "score",
    question: "가족과 함께하는 체험 여행 VS 친구와 즐기는 자유 여행",
    options: ["가족", "젊음"]
  },
  {
    id: "q7",
    type: "score",
    question: "사찰이나 전통 건축물 좋아해? 아니면 예술적 공간이 더 끌려?",
    options: ["전통", "예술"]
  },
  {
    id: "q8",
    type: "score",
    question: "벚꽃 명소 or 단풍 명소 중 뭐가 좋아?",
    options: ["벚꽃", "가을"]
  },
  {
    id: "q9",
    type: "score",
    question: "산을 오르는 트레킹 VS 바다를 따라 드라이브",
    options: ["트레킹", "드라이브"]
  },
  {
    id: "q10",
    type: "score",
    question: "휴양지에서의 여유 VS 핫플에서의 설렘",
    options: ["휴양", "핫플"]
  },
  {
    id: "q11",
    type: "score",
    question: "전망대에서 풍경 감상 VS 산책하며 자연 즐기기",
    options: ["전망", "산책"]
  },
  {
    id: "q12",
    type: "score",
    question: "지역 특산물 먹기 VS 감성 카페 탐방",
    options: ["먹거리", "카페"]
  },
  {
    id: "q13",
    type: "score",
    question: "축제 구경하기 VS 조용한 분위기 느끼기",
    options: ["축제", "고요함"]
  },
  {
    id: "q14",
    type: "score",
    question: "오래된 전통시장 VS 대형 쇼핑몰",
    options: ["시장", "쇼핑"]
  },
  {
    id: "q15",
    type: "score",
    question: "도보 여행 VS 유람선 타고 여유있게",
    options: ["도보", "유람선"]
  },

  // ✅ 감성 기반 질문 (GPT 해석 기반 → trip.keywords 비교)
  {
    id: "q16",
    type: "emotional",
    question: "아침부터 부지런히 돌아다니기 VS 오후부터 여유롭게 시작",
    options: [
      "일찍 시작하는 활동적인 여행 스타일",
      "여유로운 낮부터 감성 여행"
    ]
  },
  {
    id: "q17",
    type: "emotional",
    question: "조용한 곳에서 사색하기 VS 번화가에서 즐기기",
    options: [
      "조용하고 평화로운 분위기를 선호",
      "사람 많은 번화한 거리도 좋아함"
    ]
  },
  {
    id: "q18",
    type: "emotional",
    question: "축제와 공연을 꼭 포함하고 싶어?",
    options: [
      "네! 지역 축제나 공연을 꼭 즐기고 싶어요",
      "굳이 없어도 괜찮아요"
    ]
  },
  {
    id: "q19",
    type: "emotional",
    question: "해안 드라이브와 일출 보러 가기 VS 산책로에서 풍경 감상",
    options: [
      "해안·일출 등 바다 중심 여행",
      "산책·풍경 감상 위주 자연 여행"
    ]
  },
  {
    id: "q20",
    type: "emotional",
    question: "전통시장 구경 vs 현대적 쇼핑센터 탐방",
    options: [
      "시장이나 길거리 음식이 있는 지역",
      "쇼핑몰이나 핫플 위주 현대적인 여행"
    ]
  },
  {
    id: "q21",
    type: "emotional",
    question: "체험 위주의 여행 VS 감상 위주의 여행",
    options: [
      "직접 해보는 체험 활동 중심",
      "풍경·분위기 감상 중심"
    ]
  },
  {
    id: "q22",
    type: "emotional",
    question: "감성 카페 투어 VS 자연 속 명소 투어",
    options: [
      "도심 속 감성 공간들",
      "자연 속 이색 장소"
    ]
  },
  {
    id: "q23",
    type: "emotional",
    question: "야경 감상 VS 낮에 풍경 감상",
    options: [
      "밤의 조용한 야경이 좋아요",
      "낮의 화사한 풍경이 좋아요"
    ]
  },
  {
    id: "q24",
    type: "emotional",
    question: "한적한 시골 마을 여행 VS 문화 예술이 있는 도시 여행",
    options: [
      "조용한 시골 마을의 감성",
      "문화가 살아있는 도심"
    ]
  },
  {
    id: "q25",
    type: "emotional",
    question: "자연의 웅장함 VS 골목의 아기자기함",
    options: [
      "장엄한 자연 경관을 선호",
      "감성적인 골목과 소도시 분위기"
    ]
  },
  {
    id: "q26",
    type: "emotional",
    question: "계절 따라 달라지는 풍경 좋아해?",
    options: [
      "네! 봄꽃, 단풍, 눈 오는 여행 모두 좋아해요",
      "계절보단 장소의 매력을 더 중요시해요"
    ]
  },
  {
    id: "q27",
    type: "emotional",
    question: "혼자 떠나는 여행 VS 함께 떠나는 여행",
    options: [
      "혼자서 여유롭게 힐링하고 싶어요",
      "여럿이서 즐거운 추억 만들고 싶어요"
    ]
  },
  {
    id: "q28",
    type: "emotional",
    question: "감성 충전이 필요해? 아니면 스트레스 해소가 목적이야?",
    options: [
      "감성을 깨우는 풍경과 분위기를 원해요",
      "액티비티와 음식으로 스트레스를 풀고 싶어요"
    ]
  },
  {
    id: "q29",
    type: "emotional",
    question: "여행에서 감동을 원해? 재미를 원해?",
    options: [
      "감동과 여운이 남는 여행이 좋아요",
      "신나고 즐거운 순간이 많은 여행이 좋아요"
    ]
  },
  {
    id: "q30",
    type: "emotional",
    question: "내가 가는 여행지는…",
    options: [
      "SNS에 올릴만한 감성 사진이 가득했으면",
      "직접 느끼는 경험이 더 중요해"
    ]
  }
];
