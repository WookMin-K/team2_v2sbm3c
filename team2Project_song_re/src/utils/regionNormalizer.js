// 한글 → 초성 추출 함수

// 검색 때문에 만들어 놓은 파일
const getInitialConsonants = (str) =>
  str
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0) - 44032;
      if (code < 0 || code > 11171) return char;
      const initialIndex = Math.floor(code / 588);
      return 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'[initialIndex];
    })
    .join('');

// 별칭 매핑
const aliasMap = {
  서울: '서울특별시', 서울시: '서울특별시', 서울특별시: '서울특별시', seoul: '서울특별시', 'ㅅㅇ': '서울특별시',
  경기: '경기도', 경기도: '경기도', gyeonggi: '경기도', 'ㄱㄱ': '경기도',
  인천: '인천광역시', 인천시: '인천광역시', 인천광역시: '인천광역시', incheon: '인천광역시', 'ㅇㅊ': '인천광역시',
  강원: '강원특별자치도', 강원도: '강원특별자치도', gangwon: '강원특별자치도', 'ㄱㅇ': '강원특별자치도',
  경북: '경상북도', 경상북도: '경상북도', gyeongbuk: '경상북도', 'ㄱㅂ': '경상북도',
  충북: '충청북도', 충청북도: '충청북도', chungbuk: '충청북도', 'ㅊㅂ': '충청북도',
  충남: '충청남도', 충청남도: '충청남도', chungnam: '충청남도', 'ㅊㄴ': '충청남도',
  세종: '세종특별자치시', 세종시: '세종특별자치시', 세종특별자치시: '세종특별자치시', sejong: '세종특별자치시', 'ㅅㅈ': '세종특별자치시',
  대전: '대전광역시', 대전광역시: '대전광역시', daejeon: '대전광역시', 'ㄷㅈ': '대전광역시',
  전북: '전라북도', 전라북도: '전라북도', jeonbuk: '전라북도', 'ㅈㅂ': '전라북도',
  경남: '경상남도', 경상남도: '경상남도', gyeongnam: '경상남도', 'ㄱㄴ': '경상남도',
  부산: '부산광역시', 부산광역시: '부산광역시', busan: '부산광역시', 'ㅂㅅ': '부산광역시',
  전남: '전라남도', 전라남도: '전라남도', jeonnam: '전라남도', 'ㅈㄴ': '전라남도',
  광주: '광주광역시', 광주광역시: '광주광역시', gwangju: '광주광역시', 'ㄱㅈ': '광주광역시',
  대구: '대구광역시', 대구광역시: '대구광역시', daegu: '대구광역시', 'ㄷㄱ': '대구광역시',
  울산: '울산광역시', 울산광역시: '울산광역시', ulsan: '울산광역시', 'ㅇㅅ': '울산광역시',
  제주: '제주특별자치도', 제주도: '제주특별자치도', 제주특별자치도: '제주특별자치도', jeju: '제주특별자치도', 'ㅈㅈ': '제주특별자치도',
};

export const normalizeRegion = (input) => {
  const trimmed = input.trim().toLowerCase();
  if (aliasMap[trimmed]) return aliasMap[trimmed];
  const initials = getInitialConsonants(trimmed);
  if (aliasMap[initials]) return aliasMap[initials];
  return '';
};

export const getSuggestions = (input) => {
  const lower = input.trim().toLowerCase();
  const initials = getInitialConsonants(lower);
  const suggestions = Object.keys(aliasMap).filter(
    (key) => key.includes(lower) || getInitialConsonants(key).includes(initials)
  );
  const uniqueRegions = [...new Set(suggestions.map((key) => aliasMap[key]))];
  return uniqueRegions;
};