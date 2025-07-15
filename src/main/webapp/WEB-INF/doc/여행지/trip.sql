DROP TABLE trip;
DROP SEQUENCE TRIP_SEQ;

CREATE TABLE trip (
  trip_no      NUMBER(20)    PRIMARY KEY,
  tname        VARCHAR(30)   NOT NULL,
  image        VARCHAR(100),
  intro        VARCHAR2(1000),
  tnew         DATE,
  viewcnt      NUMBER(10),
  url_1        VARCHAR(500),
  url_2        VARCHAR(500),
  sname        VARCHAR(30)   NOT NULL,
  district_no  NUMBER(10)    REFERENCES district(district_no)
);

COMMENT ON TABLE TRIP is '여행지';
COMMENT ON COLUMN TRIP.TRIP_NO is '여행지 번호';
COMMENT ON COLUMN TRIP.TNAME is '여행지명';
COMMENT ON COLUMN TRIP.IMAGE is '여행지 사진';
COMMENT ON COLUMN TRIP.INTRO is '소개글';
COMMENT ON COLUMN TRIP.TNEW is '등록일 연간방문자순';
COMMENT ON COLUMN TRIP.VIEWCNT is '조회수';
COMMENT ON COLUMN TRIP.URL_1 is 'url_1';
COMMENT ON COLUMN TRIP.URL_2 is 'url_2';
COMMENT ON COLUMN TRIP.SNAME is '여행지명2';
COMMENT ON COLUMN TRIP.DISTRICT_NO is '여행지명2';

CREATE SEQUENCE TRIP_SEQ
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지


COMMIT;


-- 강남구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (1,'GANGNAM','gangnamgu.png',
'트렌드의 중심 서울 강남구. 예술가의 거리로 불리는 신사동 가로수길에는 아기자기하고 트렌디한 카페, 맛집, 편집숍 등이 모여있다. 한국 패션의 유행을 선도하는 압구정 로데오거리 그리고 도산 안창호 선생의 정신을 기리는 도산 공원에서는 번화한 도심 속에서 여유를 느낄 수 있다. 서울의 대표 사찰 봉은사는 봄이 되면 홍매화가 만개하여 출사지로 유명하다. 봉은사 근처에는 전시 컨벤션의 메카인 코엑스가 있어 흥미로운 전시부터 다양한 쇼핑까지 한 번에 즐길 수 있다.',
SYSDATE,0,
'https://www.diningcode.com/list.dc?query=서울 강남',
'https://kr.trip.com/hotels/?locale=ko-KR',
'강남구',101);

-- 종로구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (2, 'JONGNO', 'jongnogu.png', 
'도심 속 옛 정서를 느낄 수 있는 북촌 한옥마을과 고궁은 가볍게 산책하기 좋으며, 한복체험을 통해 이색적인 추억을 쌓을 수 있다. 젊음 가득한 대학로와 육회와 마약김밥으로 유명한 광장시장은 항상 사람들의 발길이 끊이지 않는다. 도심 속 휴식 공간인 청계천에서는 매주 크고 작은 공연 및 행사들이 열려 볼거리가 풍성하다.', 
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 종로',
'https://kr.trip.com/hotels/?locale=ko-KR',
'종로구', 102);

-- 마포구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (3, 'MAPO', 'mapogu.png',
'젊음과 자유의 도시 서울 마포구. 아기자기함이 가득한 소소한 동네 연남동은 골 골목 숨겨진 맛집, 카페 그리고 편집숍들이 인상적이다. 뉴욕에 센트럴파크가 있다면 연남동에는 경의선 숲길, 일명 연트럴파크가 있어 산책하기 좋다. 홍대 인근은 인디밴드의 거리공연, 비보이 공연 등 다양한 문화생활 집결지다. 가을이 되면 억새풀로 가득 차 장관을 이루는 하늘공원은 출사지로 유명하다. 난지 한강공원에서는 매년 음악 페스티벌이 열리고 캠핑장이 조성되어 있어 야영도 가능하다.', 
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 마포',
'https://kr.trip.com/hotels/?locale=ko-KR',
'마포구', 103);

-- 송파구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (4, 'SONGPA', 'songpagu.png', 
'즐거움이 가득한 도시 서울 송파구. 석촌호수는 시시각각 변하는 계절의 정취를 만끽할 수 있는 곳으로 봄에는 벚꽃이 만개하여 많은 사람들이 찾는 벚꽃 명소다. 석촌호수 가운데에는 놀이공원이 있어 가족, 커플, 친구들이 함께 즐거운 시간을 보낼 수 있다. 1986년 아시안게임과 1988년 서울 올림픽을 위해 조성된 올림픽 공원은 여러 경기장과 드넓은 공원을 갖추고 있어 공연 및 휴식 공간으로 각광받고 있다. 특히 공원 내 나홀로 나무와 들꽃마루는 사진 찍기 좋은 핫플레이스!', 
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 송파',
'https://kr.trip.com/hotels/?locale=ko-KR',
'송파구', 104);

-- 중구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (5, 'JUNG', 'junggu.png', 
'전통과 현대가 어우러진 서울 중구. 작지만 소담한 멋이 있는 덕수궁은 봄이 되면 하얀 벚꽃이 수놓아진다. 특히 덕수궁 돌담길에 은행나무와 단풍나무가 줄지어 있어 가을의 고즈넉한 정취를 느낄 수 있다. 남산골 한옥마을에서 한옥문화를 체험할 수 있으며 전통공연도 선보이고 있다. 데이트 명소로 꼽히는 N서울타워는 케이블카를 타고 올라가 서울 경관을 감상할 수 있어 낭만적이다. 복합문화공간 DDP에서는 각종 전시뿐만 아니라 매년 패션위크가 열려 눈길을 사로잡고 있으며, LED 장미정원은 빼놓을 수 없는 사진 찍기 좋은 장소!',
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 중구',
'https://kr.trip.com/hotels/?locale=ko-KR',
'중구', 105);

-- 영등포구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (6, 'YDP', 'yeongdeungpogu.png', 
'다양한 문화생활의 중심지 서울 영등포구. 바쁘게 흘러가는 도심 속에서 여유를 느낄 수 있는 여의도 한강공원은 피크닉 장소의 대명사이며 자전거, 스케이트보드, 수상 레저 등을 즐길 수 있다. 봄에는 여의도 윤중로가 벚꽃으로 하얗게 물들고 가을에는 해마다 한강공원에서 서울 세계불꽃축제가 열려 하늘에 불꽃이 수놓아진다. 철제 상가로 유명했던 문래동은 아티스트들의 예술공간으로 거듭나 이색적인 예술촌으로 바뀌었다. 도심 문화의 복합체인 타임스퀘어와 IFC 몰에서는 다양한 브랜드 쇼핑 및 문화생활이 가능하다.',
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 영등포',
'https://kr.trip.com/hotels/?locale=ko-KR',
'영등포구', 106);

-- 용산구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (7, 'YONGSAN', 'yongsangu.png',
'다양한 세계 문화와 인종이 공존하는 서울 용산구. 주한 미군을 비롯해 여러 국적의 외국인들이 집결한 이태원은 아기자기한 경리단길과 세계음식문화거리가 있어 이색적인 분위기를 느낄 수 있다. 젊은 세대의 핫플레이스로 급부상한 한남동에는 개성 넘치는 카페와 식당들, 새로운 문화예술 아지트인 디뮤지엄이 있다. 총 33만여 국보급 유물을 소장한 국립중앙박물관에서는 다양한 전시를 제공하고 있어 문화생활을 즐기기 좋다.',
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 용산',
'https://kr.trip.com/hotels/?locale=ko-KR',
'용산구', 107);

-- 서초구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (8, 'SEOCHO', 'seochogu.png',
'산과 물이 감싸 안은 명품도시 서울 서초구. 서울의 대표 명산 청계산은 다양한 산행 코스가 조성되어 있어 서울 시민들이 많이 찾는다. 프랑스인들이 많이 거주하고 있는 서래마을은 트렌디한 맛집과 디저트 카페들이 가득하며 몽마르트 공원이 조성되어 있어 쁘띠 프랑스로 불린다. 국내 최초의 인공섬인 세빛둥둥섬과 세계에서 가장 긴 분수로 기네스북에 등재된 반포대교 달빛무지개분수는 야경 데이트 코스로 제격이다.',
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 서초',
'https://kr.trip.com/hotels/?locale=ko-KR',
'서초구', 108);

-- 강서구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (9, 'GANGSEO', 'gangseogu.png',
'당대 최고의 명의인 구암 허준 선생의 업적과 한의학에 대해 친근하게 접할 수 있는 허준박물관은 한방 관련 900여 점의 유물을 소장하고 있으며 직접 체험할 수 있는 프로그램이 구성되어 있다. 서울 유일의 향교인 양천향교에서는 조상들의 교육 문화의 산실로서 한복 및 다도체험, 예절교육 등의 전통체험뿐만 아니라 학생들을 위한 진로탐색 프로그램 등을 운영하고 있다.',
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 강서',
'https://kr.trip.com/hotels/?locale=ko-KR',
'강서구', 109);

-- 노원구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (10, 'NOWON', 'nowongu.png', 
'조선 중종의 두 번째 계비 문정왕후의 무덤인 태릉은 유네스코 세계문화유산에 등재되었으며 왕비의 무덤이라고 믿기 힘들 만큼 웅장하다. 서울에 마지막으로 남은 달동네 중계동 백사마을은 과거 여행을 하는 것 같은 기분이 들게 하는 곳이지만 서울 3대 벽화마을이라고 불릴 정도로 아기자기한 벽화들이 많다. 노원역 근처 문화의 거리에서는 생동감 넘치는 다양한 길거리 공연이 열려 야외공연의 메카로 불린다.',
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 노원',
'https://kr.trip.com/hotels/?locale=ko-KR',
'노원구', 110);

-- 강북구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (11, 'GANGBUK', 'gangbukgu.png',
'도심 속 천혜의 자연과 어우러진 강북구. 벚꽃길과 단풍 숲이 조성된 대형 녹지공원인 북서울 꿈의 숲은 공연장, 레스토랑, 전망타워 등이 있어 피크닉 장소로 많이 찾는 곳이다. 서울 근교 산 중에서 가장 높은 북한산의 둘레길은 많은 등산객의 발길이 끊이질 않으며 특히 겨울 눈꽃을 즐기러 오는 사람들이 많다. 북한산 기슭에는 4.19혁명 희생자를 기리는 국립묘지가 있어 해마다 추모기념행사가 열린다.', 
SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서울 강북',
'https://kr.trip.com/hotels/?locale=ko-KR',
'강북구', 111);

-- 해운대구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (12, '해운대구', 'haeundaegu.png', 
'역동적인 해양 도시 부산 해운대구. 해운대 해수욕장은 긴 백사장과 주변에 오락 및 편의시설이 잘 갖춰져 있어 해마다 천만 명의 관광객이 방문한다. 인근에 부산 아쿠아리움과 동백섬, APEC 정상 회의가 열렸던 누리마루 APEC 하우스가 있어 또 다른 볼거리를 제공한다. 한국의 몽마르트 언덕, 달맞이 길에는 바다 전망을 감상할 수 있는 카페들이 있고 특히 벚꽃이 피면 최적의 드라이브 코스로 꼽힌다. 화려한 고층 건물의 불빛들이 아른거리는 마린시티의 야경과 작은 포구마을인 청사포에서 바라보는 저녁달의 모습은 부산의 놓치지 말아야 할 경관!',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=부산 해운대구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'해운대구', 201);

-- 중구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (13, '중구', 'bjunggu.png', 
'우리나라 최대의 수산물 시장인 자갈치시장. 선착장에서 통통배를 타면 영도로 뱃길 여행이 가능하며 싱싱한 먹거리를 만날 수 있다. 야경 명소로 유명한 용두산 공원과 깡통 야시장에서 맛보는 간식거리는 별미 중의 별미! 영화제와 씨앗호떡으로 유명한 BIFF 광장과 헌책방이 모여있는 보수동 책방 골목도 함께 둘러보면 좋다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=부산 중구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'중구', 202);

-- 영도구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (14, '영도구', 'yeongdogu.png', 
'부산을 대표하는 암석해안인 태종대에는 해안 절벽과 기암괴석이 멋스러워 많은 관광객들이 발걸음 한다. 태종대 명소를 둘러보기 위해 순환도로를 따라 걷거나 순환열차를 이용해도 좋지만, 유람선을 타면 새로운 경관을 만끽할 수 있다. 국립 해양 박물관은 복합문화공간으로 아이들과 함께 방문하기에 좋으며 영화 촬영지로 유명해진 흰여울 문화마을은 바다가 보이는 벽 사이로 보이는 골목길은 낭만을 느끼기에 좋다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=부산 영도구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'영도구', 203);

-- 동래구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (15, '동래구', 'dongraegu.png', 
'금강산 자락을 끼고 있는 유서 깊은 동래온천은 우리나라에서 가장 오래된 온천으로 지역 주민들이 즐겨 찾고 있다. 1000년의 역사를 가진 동래읍성과 금강공원은 가볍게 산책할 수 있는 곳이며 금강공원에서 케이블카를 타고 시가지 전경을 구경하는 것도 좋다. 공원 인근에 위치한 동래 파전 골목에서 시루떡처럼 두꺼운 파전을 맛보는 건 필수!',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=부산 동래구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'동래구', 204);

-- 수영구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (16, '수영구', 'suyeonggu.png', 
'해양 문화 관광도시 부산 수영구. 광활하고 아름다운 백사장이 끝없이 펼쳐지는 광안리 해수욕장은 피서철이 되면 발 디딜 틈 없이 인파가 몰리는 곳이다. 매년 10월 셋째 주 광안리 해수욕장에서는 부산불꽃축제가 개최되어 화려한 장관을 연출한다. 국내 최대 규모의 현수교인 광안대교는 밤이 되면 오색 빛의 조명이 어우러져 환상적인 야경을 자랑한다. 국내 최초의 수변공원인 민락수변공원을 찾는 시민들은 민락동 횟집거리에 들려 회를 포장해 선선한 바닷바람과 함께 한여름 밤의 피크닉을 즐기기도 한다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=부산 수영구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'수영구', 205);

-- 사하구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (17, '사하구', 'sahagu.png', 
'생태 문화 관광 도시 부산 사하구. 생활과 예술이 공존하는 감천문화마을은 계단식 주거형태와 독특한 벽화들 덕분에 인기 관광 명소로 자리 잡았다. 다대포 해수욕장에서는 갯벌체험을 비롯해 평균 수온이 높아 물놀이하기 좋다. 부산 최초의 음악 분수인 다대포 꿈의 낙조분수는 매년 4월부터 10월에 운영하며 세계 최대 바닥분수로 기네스북에 올랐다. 부산 을숙도에는 생태공원과 철새 도래지가 있어 낙동강 하구의 철새를 관찰할 수 있다. 바람결에 흔들리는 은빛 억새밭의 장관은 승학산 억새군락에서 감상할 수 있다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=부산 사하구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'사하구', 206);

-- 중구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (18, '중구', 'djunggu.png', 
'알찬 골목투어를 떠날 수 있는 대구 중구. 대표적으로 근대문화골목 투어는 청라언덕을 시작으로 3.1운동 거리, 대구 최초 서양식 건물인 계산성당 등 역사가 깃든 거리를 여행할 수 있다. 김광석 다시 그리기 길은 아기자기한 벽화가 있어 사진 찍기에도 좋으며 골목골목을 돌아보는 재미가 있다. 대구의 밤을 책임지는 서문시장 야시장도빼놓을 수 없는 대표 관광 코스!',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=대구 중구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'중구', 301);

-- 동성로
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (19, '동성로', 'dongseongro.png', 
'젊은 기운이 살아 숨쉬는 도심의 가로광장 동성로(東城路)는 사성로 중에서 대구역네거리와 동성로관광안내소 사이 구간(900m)으로서 대구의 대표적인 중심번화가 중의 하나이다. 본래 대구읍성 동쪽의 성곽지였으나 1907년 헐리고 도로가 되면서 현재에 이르렀다. 동성로는 동성로 야외무대를 중심으로 옛 성곽의 이미지를 재현하는 장대석 띠포장의 보행자전용거리를 따라 교동 귀금속거리, 떡볶이골목, 가방골목, 야시골목, 구제골목 등 각종 골목상권을 이루고 있다. 또한 2009년에 조성된 국내 최초의‘대중교통전용지구’(반월당네거리~대구역네거리, 1.05km)는 친인간적, 친환경적인 가로로 다양한 상권과 흥미로운 디자인에 의하여 동성로와 더불어 명품가로로 자리매김하고 있다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=대구 동성로', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'동성로', 302);

-- 수성구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (20, '수성구', 'suseonggu.png', 
'스포츠와 레저의 메카 대구 수성구. 매 시즌 야구 열기로 넘쳐나는 삼성 라이온즈 파크와 2002 한일 월드컵이 열린 대구스타디움이 위치해 있다. 대구 시민들에게 낭만의 공간을 선사하는 수성유원지는 수성못에서 5월~10월까지 매일 2회에 걸쳐 펼쳐지는 음악분수쇼가 이색 볼거리이다. 국립대구박물관과 대구미술관은 주말에 문화 생활을 즐기기에 좋다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=대구 수성구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'수성구', 303);

-- 달서구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (21, '달서구', 'dalseogu.png', 
'주말 데이트 코스의 제격인 대구 달서구. 이월드는 낮에는 평범한 놀이동산과 다름없다가도 봄과 겨울에는 빛 축제의 장으로 변신해 더욱 인기 만점이다. 인근에는 두류공원도 위치해 있어 가벼운 나들이 코스로도 좋으며, 매년 여름 두류공원에서 열리는 치맥페스티벌은 무더위를 날리기에 더할 나위 없는 대구 대표 축제!',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=대구 달서구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'달서구', 304);

-- 중구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (22, '중구', 'ijunggu.png', 
'',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=인천 중구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'중구', 401);

-- 연수구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (23, '연수구', 'yeonsugu.png', 
'국제 관광의 시작점 인천 중구. 인천역 광장 근처에는 화교인들이 거주하는 차이나타운이 있어 중국의 문화를 간접 체험할 수 있다. 놀이동산, 문화의 거리, 횟집 등이 있는 인천의 명소 월미도는 시민들의 휴식 공간으로 자리 잡았다. 영종도 서해 끝, 을왕리 해수욕장은 수도권에서 가까운 매력적인 관광지로서 국민 휴양지 역할을 톡톡히 하고 있다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=인천 연수구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'연수구', 402);

-- 남동구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (24, '남동구', 'namdonggu.png', 
'신비의 천연 포구이자 수도권 유일의 재래어항인 소래포구는 새우, 꽃게, 젓갈 등이 넘쳐나는 유명 관광 명소로서 매년 가을 소래포구 축제가 열리고 있다. 인근에 위치한 소래습지 생태공원에서는 폐 염전을 다시 꾸며 그 모습을 보존하고 있으며 가을에는 드넓은 들판이 황금빛 옷을 입어 데이트 코스로도 각광받고 있다. 식물원, 장미원, 동물원 등의 시설을 갖춘 인천대공원은 시민들의 나들이 장소이자 벚꽃축제 기간에는 인산인해를 이룬다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=인천 남동구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'남동구', 403);

-- 미추홀구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (25, '미추홀구', 'michuholgu.png', 
'삼국시대에 구축했던 문학산성이 터로 남아있는 유서 깊은 역사의 장소인 문학산에는 둘레길이 조성되어 있어 트래킹 하기 좋다. 인천에서 가장 활성화된 재래시장 중 하나인 주안 석바위시장은 저렴한 가격과 다양한 먹거리로 유명하다. 야구 SSG 랜더스 팀의 홈그라운드인 인천 문학야구장은 프로야구 시즌이 시작되면 열기 넘치는 곳으로 변한다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=인천 미추홀구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'미추홀구', 404);

-- 계양구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (26, '계양구', 'gyeyanggu.png', 
'인천에서 가장 높은 산이지만 초보자도 쉽게 올라갈 수 있는 계양산은 4-5월이 되면 철쭉과 진달래꽃이 활짝 피는 봄꽃 명소다. 가을이 되면 해마다 계양산 반딧불이 축제가 열려 가을밤 야간 산행을 통해 풀 내음, 풀벌레 소리, 반딧불이 불빛 등 평소에 느끼고 보지 못한 것들을 체험할 수 있다. 주말에 아이들과 함께 가기 좋은 곳으로는 인천 어린이 과학관과 두리 생태 오토캠핑장이 있다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=인천 계양구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'계양구', 405);

-- 동구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (27, '동구', 'gdonggu.png', 
'광주광역시 동구에는 활기를 잃은 재래시장에 예술가들의 호기심이 더해져 재탄생한 대인예술시장이 있다. 시장 중심에는 여행자와 상인을 위한 도서관이 자리하고 있으며 12월 말까지 매주 토요일 야시장이 열려 거리마다 숨은 맛집과 볼거리를 찾아가는 재미가 있다. 하늘 위로 뻗은 돌기둥이 인상적인 무등산 주상절리대 또한 광주를 대표하는 명소이다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=광주 동구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'동구', 501);

-- 서구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (28, '서구', 'gseogu.png', 
'5.18 기념공원을 시작으로 5.18 자유공원, 광주학생독립운동기념관 등을 통해 5.18 광주민주화운동의 역사를 들여다볼 수 있다. 도심 속 문화휴식 공간이 되어주는 무각사와 풍암 호수공원은 잠시 쉬어가는 산책로로 좋다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=광주 서구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'서구', 502);

-- 남구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (29, '남구', 'gnamgu.png', 
'광주로 여행을 오면 한 번쯤은 들르는 펭귄 마을. 아기자기한 벽화들로 가득 채워진 펭귄 마을은 사진 찍기에도 좋아 데이트 코스로도 제격이다. 펭귄 마을과 함께 근현대가 공존하는 양림동 역사 문화마을도 둘러보면 좋다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=광주 남구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'남구', 503);

-- 북구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (30, '북구', 'gbukgu.png', 
'주말에 가벼운 문화생활을 즐기기 좋은 광주 북구. 다양한 문화재가 모여있는 국립광주박물관, 광주비엔날레의 현장인 광주시립미술관까지 모두 북구에 모여있다. 광주 생태호수공원은 가벼운 산책 코스로 좋으며 광주 5대 시장인 말바우 시장에서 주전부리를 즐기는 것도 소소한 재미!',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=광주 북구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'북구', 504);

-- 중구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (31, '중구', 'jjunggu.png', 
'대전 도심 한복판에 있는 보문산은 산을 한 바퀴 돌 수 있는 순환형 숲길이 조성되어 가벼운 산행을 하기에 좋으며 전망대에 오르면 대전 시내를 한눈에 내려다볼 수 있다. 효를 테마로 만든 뿌리공원은 가벼운 주말 피크닉 장소로 제격! 테미공원은 벚꽃길이 아름다워 봄에 가면 더욱 좋다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=대전 중구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'중구', 601);

-- 서구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (32, '서구', 'jseogu.png', 
'주말 나들이 코스로 좋은 한밭수목원은 다양한 식물과 곤충생태관이 있어 아이들과 함께 다녀오기에 좋다. 대전시립미술관은 다양한 작품 전시를 감상할 수 있을 뿐 아니라 야경이 아름답기로 유명해 출사지로 많은 이들이 발걸음 한다. 장태산자연휴양림은 하늘까지 닿을듯한 메타세쿼이어 길이 조성되어 있어 산책 코스로 제격.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=대전 서구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'서구', 602);

-- 유성구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (33, '유성구', 'yuseonggu.png', 
'주말 나들이 코스로 좋은 유림공원. 그중에도 꽃 피는 4월과 국화 전시회가 열리는 10월에 더 많은 이들이 찾는다. 배움과 놀이가 공존하는 국립중앙박물관과 대전역사박물관, 지질박물관 등이 위치해 있어 아이와 함께 주말에 방문하기에 좋다. 온천공원에는 족욕체험장도 마련되어 있어 가볍게 하루의 피로를 풀기에 좋은 장소!',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=대전 유성구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'유성구', 603);

-- 대덕구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (34, '대덕구', 'daedeokgu.png', 
'닭발의 형상을 닮아 이름이 붙은 계족산. 계족산 정상 봉황정에서 만날 수 있는 탁 트인 전망은 계족산 산행의 백미! 다채로운 계족산의 모습과 함께 계족산성을 따라 걷기 좋다. 산성 주변으로 황톳길이 조성되어 있어 맨발 트레킹도 가능하다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=대전 대덕구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'대덕구', 604);

-- 중구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (35, '중구', 'ujunggu.png', 
'태화강은 1960년대 공업화 진행으로 인해 생명이 다한 강으로 여겨졌지만 노력 끝에 울산을 대표하는 생태공원으로 재탄생했다. 돌아온 연어가 활기를 더하고 시원하게 솟은 대나무로 가득한 십리대숲 산책로가 조성되어 있다. 태화강 대공원과 십리대숲은 제대로 감상하고자 한다면 태화루와 태화강 전망대를 이용해보자. 태화루에 오르면 한눈에 들어오는 태화강 줄기와 십리대숲이 지난 과거의 흔적은 찾을 수 없을 만큼 시원한 전경을 선물한다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=울산 중구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'중구', 701);

-- 남구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (36, '남구', 'unamgu.png', 
'울산 고유명사라고도 할 수 있는 고래. 고래에 관한 다양한 것들을 경험하고 싶다면 울산 남구로 향해보자. 울산 고유 먹거리인 고래 고기를 다양한 요리로 맛볼 수 있고, 고래 박물관과 생태체험관뿐만 아니라 고래 문화마을이 형성되어 있어 다양한 체험이 가능하다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=울산 남구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'남구', 702);

-- 동구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (37, '동구', 'udonggu.png', 
'울산대교를 건너 주전에서 강동으로 이어지는 해안선을 따라 달리다 보면 남다른 파도 소리를 들을 수 있다. 그 진원지는 주전몽돌해변이다. 모나지 않고 둥근 돌이란 의미의 몽돌은 바다가 지나온 세월의 흔적을 말해주며, 인적이 드문 새벽이나 이른 저녁에 방문하면 선명한 파도 소리를 감상할 수 있다. 울산 대표 명소로 손꼽히는 대왕암공원에서는 봄에는 벚꽃과 바다, 그리고 야경이 하나가 되는 경관을 감상할 수 있다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=울산 동구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'동구', 703);

-- 북구
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (38, '북구', 'ubukgu.png', 
'울산 북구는 울산의 어느 지역보다도 삶에 바다 냄새가 짙게 묻어나는 곳이다. 상상 이상으로 규모가 큰 정자항 대게 타운을 비롯해 전설을 간직한 용바위 해양낚시공원에는 강태공들을 비롯한 많은 이들의 발걸음이 이어지고 있다. 바다를 향해 뻗어있는 해양낚시공원 다리에는 소원이 담긴 조개껍데기가 걸려있어 운치 있는 경관이 펼쳐진다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=울산 북구', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'북구', 704);

-- 울주군
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (39, '울주군', 'uljugun.png', 
'누구보다 가장 먼저 하루를 시작하는 울주군 간절곶. 일출이 가장 빨리 시작되는 간절곶은 석양마저도 아름다워 울주군 대표 명소로 손꼽힌다. 가을이면 영남알프스 간월산에서 영축산까지 출렁이는 억새풀 물결은 장관을 이뤄 트래킹이나 등산을 좋아하는 이들에게 멋진 풍경을 선사한다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=울산 울주군', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'울주군', 705);
commit;

-- 세종특별자치시 (8) -- 수정하고해라
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (80, '세종특별자치시', 'sejong.png', 
'주말 여행지로 좋은 세종특별자치시. 도심에 위치한 국립세종수목원은 다양한 테마 정원이 조성되어 있으며, 연중 다양한 전시와 교육 프로그램을 제공하고 있어 주말 가족 나들이 장소로 제격이다. 세종 호수공원은 여유로운 산책을 즐길 수 있어 데이트 코스로 좋다.',
SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=세종시', 
'https://kr.trip.com/hotels/?locale=ko-KR', 
'세종시', 801);
commit;

-- 경기도 (9)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (40, '가평군', 'gapyeonggun.png', '자연의 정취에 젖어들게 만드는 가평 아침고요수목원. 어디를 둘러봐도 풍경이 가득해 지루할 틈이 없다. 그중에도 가평하면 빼놓을 수 없는 쁘띠프랑스는 프랑스를 떠올리게 하는 이국적인 풍경으로 빨간 지붕이 매력적이다. 또한 매년 가을에 열리는 자라섬 국제재즈페스티벌은 석양과 음악이 어우러질 때까지 재즈의 매력에 흠뻑 취해볼 수 있다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=가평군', 
'https://kr.trip.com/hotels/?locale=ko-KR', '가평군', 901);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (41, '수원시', 'suwonsi.png', '서울의 축소판이라도고 할 수 있는 경기도 수원시. 서울만큼이나 정치, 경제, 문화, 사회 등 다양한 부문에서 두루 발달한 도시이다. 그중에도 고고학적 가치를 지닌 수원화성은 수원의 자랑이며, 화성행궁 열차를 타고 대표 명소를 둘러보는 것도 좋다. 광교호수공원은 야경이 아름다워 밤에도 산책을 즐기는 사람들이 많으며, 수원 통닭골목은 저렴한 가격에 비해 양이 푸짐해 입소문을 타고 전국 각지에서 많은 이들이 찾아오고 있다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=수원시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '수원시', 902);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (42, '용인시', 'yonginsi.png', '주말 나들이 코스로 좋은 용인. 국내 최대 규모의 테마파크 에버랜드는 4계절 내내 다양한 행사로 즐거움이 끊이지 않는 곳이다. 옛 생활 모습을 둘러볼 수 있는 한국민속촌도 용인의 대표 관광지! 탈 일상의 전원체험을 느낄 수 있는 용인농촌테마파크와 주택가 골목을 따라 생긴 보정동 카페거리도 데이트 코스로 좋다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=용인시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '용인시', 903);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (43, '성남시', 'seongnamsi.png', '데이트 코스로 좋은 성남시. 다양한 공연 전시를 볼 수 있는 성남 아트 센터와 봄나들이 코스로 좋은 율동공원이 자리하고 있다. 율동공원에 있는 번지점프에 도전해보는 것도 짜릿한 재미! 신사동 가로수길을 연상케하는 정자동 카페골목에서 브런치를 즐기는 것도 데이트 코스로 빼놓을 수 없다. 수도권 최대 규모 모란민속장도 볼거리가 다양해 구경하는 재미가 쏠쏠하다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=성남시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '성남시', 904);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (44, '화성시', 'hwaseongsi.png', '해안과 육지를 넘나드는 경험이 가능한 화성. 바다낚시를 즐길 수 있는 궁평항과 하루에 2번 바닷길이 열리는 제부도에서는 갯벌체험이 가능하다. 궁평리와 매향리를 잇는 화옹방조제 도로는 시원한 드라이브 코스를 즐길 수 있으며 도로 양쪽으로는 자전거와 인라인을 탈 수 있는 길도 나있어 데이트 코스로도 좋다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=화성시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '화성시', 905);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (45, '안산시', 'ansansi.png', '안산시는 녹지율이 가장 높아 그만큼 다양한 자연의 모습을 품고 있다. 안산을 대표하는 대부도는 74km에 이르는 대부 해솔길이 조성되어 있어 자연 경관을 바라보며 산책하기에 좋다. 코스도 석양길, 염전길, 갈대길 등 총 7개로 고르는 재미가 있으며, 구봉도와 탄도항은 낙조가 아름답기로 유명하다. 365 빛 축제가 열리는 별빛마을 포토랜드도 주말 나들이 코스로 가볼만 하다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=안산시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '안산시', 906);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (46, '고양시', 'goyangsi.png', '신한류 문화 관광도시 고양. 방송국이 있어 방송 제작과 콘텐츠 관련 경험 등 색다른 체험이 가능해 해외 관광객들로부터도 많은 사랑을 받고 있다. 600년의 문화유적을 간직한 고양시는 행주산성과 북한산성이 자리해 등산 코스로도 제격이다. 현대식 전통시장인 웨스턴돔은 스트리트형 쇼핑몰인 라페스타와 함께 다양한 문화시설을 즐길 수 있다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=고양시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '고양시', 907);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (47, '이천시', 'icheonsi.png', '다양한 체험을 즐길 수 있는 이천시. 매년 봄이면 이천을 대표하는 두 가지 축제가 열린다. 이천 백사산수유꽃축제는 100년이 넘는 산수유나무가 군락을 이루는 절경을 만날 수 있고, 이천도자기 축제에서는 물레체험을 비롯한 다채로운 경험이 가능하다. 그 외에도 낙농체험과 농촌체험 등이 있어 골라 체험하는 즐거움이 있다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=이천시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '이천시', 908);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (48, '파주시', 'pajusi.png', '어느 곳보다도 시간이 더디게 가는 파주. 책이 넘어가는 소리가 들리는 출판 단지부터 50~60년대에 사랑받은 골동품 장난감과 과거 추억 물품을 만나볼 수 있는 한국 근현대사박물관까지 느린 감성이 짙게 묻어난다. 임진각 평화누리 공원은 근처에 평화랜드도 함께 운영하고 있어 주말 나들이 장소로 딱이다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=파주시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '파주시', 909);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no) 
VALUES (49, '부천시', 'bucheonsi.png', '문화·예술·축제·관광 콘텐츠가 넘쳐나는 ‘문화도시’ 부천시. 부천국제판타스틱영화제, 부천국제만화축제, 세계비보이대회, 부천국제애니메이션페스티벌 등 다양한 국제 축제 뿐 아니라, 백만송이 장미원, 진달래 군락지, 누구나 숲길, 수피아 등 도심 속 힐링공간도 풍부하다. 이 외에도 눈길 끄는 전문 박물관, 폐소각장을 문화플랫폼으로 재탄생시킨 ‘부천아트벙커 39’ 등 문화 DNA를 자극하는 곳이 많다.', SYSDATE, 0, 
'https://www.diningcode.com/list.dc?query=부천시', 
'https://kr.trip.com/hotels/?locale=ko-KR', '부천시', 910);

commit;

-- 강원특별자치도 (10)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (50, '춘천시', 'chuncheonsi.png', '경춘선 청춘열차와 함께 일상 속 한 발짝 더 가까워진 낭만도시 춘천. 춘천의 대표 여행지로 손꼽히는 남이섬은 사계절마다 다채로운 모습으로 늘 새로운 공간을 연출하고, 김유정 작품의 무대가 되었던 실레마을을 걷다 보면 점순이 등 작품 속 인물들이 마중 나올 것만 같다. 자연 속에 파묻힌 문학과 예술의 숨결을 느끼고 싶다면 춘천 청춘열차에 올라보자.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=춘천시',
'https://kr.trip.com/hotels/?locale=ko-KR', '춘천시', 1001);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (51, '속초시', 'sokchosi.png', '약 50m 길이의 구름다리를 건너면 바다와 마주할 수 있는 속초 영금정. 일출 명소로도 알려진 이곳은 동해안의 시원한 절경을 감상할 수 있는 최적의 장소이다. 옛날 항구의 고유 분위기는 사라졌지만, 새우튀김 골목으로 재탄생한 대포항은 여전히 속초 대표 방문 코스! 아바이 순대로 유명한 아바이마을도 빼놓을 수 없는 인기 여행지이다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=속초시',
'https://kr.trip.com/hotels/?locale=ko-KR', '속초시', 1002);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (52, '강릉시', 'gangneungsi.png', '은은한 커피향이 남다른 강원도 강릉시. 그중에도 카페거리로 유명한 안목해변은 발이 닿는 어디든 향긋한 커피 한 잔에 지평선 끝까지 펼쳐지는 바다 풍경은 덤으로 얻을 수 있다. 일출 명소로 유명한 정동진과 야경이 아름다운 경포대는 대표 여행 코스! 구름도 머물다 간다는 해발 1,100m에 위치한 강릉 안반데기 마을은 전망대에 올라 드넓게 펼쳐진 배추밭이 붉게 물드는 일출 전경이 일품이다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=강릉시',
'https://kr.trip.com/hotels/?locale=ko-KR', '강릉시', 1003);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (53, '원주시', 'wonjusi.png', '강원특별자치도 원주시는 상상과 함께 천 년의 시간을 경험하게 해준다. 남한강 물길을 따라 걷는 폐사지 탐방은 지금껏 경험해보지 못했던 새로운 여행이 될 것이다. 사찰의 흥망성쇠를 유일하게 목격한 느티나무가 되어 빈터를 잠시 나만의 상상으로 채워보는 즐거움이 있다. 치악산에는 캠핑장이 마련되어 있어 가족 나들이 코스로도 딱이며, 치악산 자락에 위치한 아름다운 사찰인 구룡사도 함께 둘러보면 좋다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=원주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '원주시', 1004);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (54, '양양군', 'yangyanggun.png', '또 다른 세계와 연결되어 있을 것만 같은 양양의 구룡령 옛길. 낙산사 의상대와 명승지 하조대의 수려한 일출 경관의 화려함은 양양군의 명소로 손꼽히지만, 그와 달리 소박한 우리의 삶의 이야기를 담고 있는 구룡령 옛길을 차분히 걸어보는 것도 좋다. 남해항은 전망대에 올라 한눈에 보이는 바다 전경이 일품이며, 남애항에서 10분 거리에 있는 사찰 휴휴암은 쉬고 또 쉰다는 이름의 의미처럼 많은 이들의 쉼터 역할이 되어주고 있다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=양양군',
'https://kr.trip.com/hotels/?locale=ko-KR', '양양군', 1005);

-- 충청북도 (11)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (55, '청주시', 'cheongjusi.png', '누구나 대통령이 될 수 있는 청주. 청주시 청남대는 역대 대통령의 흔적이 남아있는 곳으로 대통령 업무 체험 공간이 마련되어 있다. 천년의 역사가 숨 쉬는 상당산성은 가벼운 산행 코스로 제격이다. 단돈 천 원에 즐기는 청주 동물원과 글로벌 명품시장으로 발돋움한 육거리종합시장의 골목골목을 돌아보는 것도 청주 대표 여행 코스!', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=청주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '청주시', 1101);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (56, '충주시', 'chungjusi.png', '내륙에 바다가 있는 충주. 우리나라에서 유일하게 바다와 닿지 않은 충청북도에는 바다만큼 넓은 충주호가 있다. 충주호는 드라이브 코스로 좋으며, 동심이 가득한 라바 랜드는 충주의 새로운 관광지로 부상하고 있다. 세계 유일 모든 술의 역사를 담고 있는 리쿼리움에서 시음을 하는 것도 소소한 즐거움! 충주 명물 무학시장 순대골목도 빼놓을 수 없는 코스 중 하나!', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=충주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '충주시', 1102);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (57, '제천시', 'jecheonsi.png', '문화재의 집합소 충북 제천시. 청풍문화재단지를 시작으로 국내에서 가장 오래된 저수지 의림지를 비롯해 한국 천주교 전파의 진원지인 베론성지는 편히 둘러보기에도 좋다. 월악산에 둘러싸여 있는 송계계곡은 울창한 숲과 깊은 계곡이 있어 여름철 피서지로 인기가 높다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=제천시',
'https://kr.trip.com/hotels/?locale=ko-KR', '제천시', 1103);

-- 충청남도 (12)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (58, '천안시', 'cheonansi.png', '서울에서 1시간도 채 걸리지 않아 닿을 수 있는 천안. 편리한 교통으로 주말이면 많은 관광객들이 몰린다. 역사와 문화, 자연 모두 아우르는 독립기념관은 천안의 대표 관광지이며 천안삼거리 공원은 가족 나들이 코스로 좋다. 아라리오갤러리와 리각미술관 등 다양한 작품을 만날 수 있는 공간이 있어 갤러리 투어를 테마로 잡는 것도 하나의 팁! 병천순대와 호두과자는 꼭 맛 보아야 하는 천안 대표 주전부리!', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=천안시',
'https://kr.trip.com/hotels/?locale=ko-KR', '천안시', 1201);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (59, '공주시', 'gongjusi.png', '역사가 숨 쉬는 사찰이 있는 공주. 대표적으로 계룡산에는 동학사, 갑사 등 유독 아름다운 사찰이 몰려있다. 마곡사는 세계문화유산에 잠정목록에 오를 만큼 그 가치를 인정받은 문화재이다. 백제 시대에 공주를 지키던 공산성에 올라 내려다보이는 금강의 풍경은 일품이다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=공주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '공주시', 1202);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (60, '논산시', 'nonsansi.png', '백제시대의 군사적 요충지였던 논산은 백제군사 박물관과 계백장군 유적지가 있어 계백장군의 자취와 당시 군사문화를 엿볼 수 있다. 탑정호는 산책로 뿐만 아니라 드라이브 코스로도 많은 사랑을 받고 있으며, 양촌자연휴양림은 아이들과 함께하는 주말 여행지로 좋다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=논산시',
'https://kr.trip.com/hotels/?locale=ko-KR', '논산시', 1203);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (61, '서산시', 'seosansi.png', '충청남도 서산에는 날마다 섬과 육지를 옮겨 다니는 땅이 있다. 바로 간월암을 떠받들고 있는 간월도인데, 만조시 석양으로 물드는 모습이 절경이다. 직접 간월암까지 발걸음을 하고 싶다면 간조 시간 체크는 필수! 서산 땅 끝에 위치한 황금산을 넘으면 서해의 물을 모조리 들이마시고 있는 코끼리 바위를 만날 수 있으며, 썰물 때는 황금산 둘레로 해안 트래킹도 가능하다. 프란치스코 교황 방문과 함께 알려진 해미읍성은 산책 코스로 좋다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서산시',
'https://kr.trip.com/hotels/?locale=ko-KR', '서산시', 1204);

-- 전북특별자치도 (13)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (62, '전주시', 'jeonjusi.png', '한국의 멋이 살아있는 전주. 도심 한복판에 자리한 한옥마을에 들어서면 시대를 거슬러가는 기분이다. 경사스러운 터에 지어진 궁궐이란 의미의 경기전에 들어서면 대나무가 서로 부대끼며 내는 소리에 귀 기울이게 된다. 전주 야경투어 명소의 대표인 전동성당과 한옥마을을 한눈에 내려다볼 수 있는 오목대 역시 빼놓을 수 없는 곳. 마을 전체가 미술관인 자만 벽화마을은 전주의 대표 포토 존이다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=전주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '전주시', 1301);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (63, '군산시', 'gunsansi.png', '1930년대 우리나라 근대역사를 고스란히 간직한 도시 군산. 근대문화유산 투어 코스를 따라 걷다보면 곳곳에 남아있는 일본식 주택과 근대건축물들을 쉽게 볼 수 있다. 2.5km 길이의 오래된 철도가 놓인 경암동 철길마을은 출사지로도 유명. 우리나라에서 가장 오래된 빵집, 전국 5대 짬뽕 맛집, 70년 역사의 호떡집 등 군산 맛집 먹방 여행도 추천한다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=군산시',
'https://kr.trip.com/hotels/?locale=ko-KR', '군산시', 1302);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (64, '남원시', 'namwonsi.png', '춘향의 사랑이 남겨진 남원. 남원의 대표 광한루는 춘향과 몽룡의 사랑이 시작된 곳으로 연못 위에 세워진 오작교가 운치를 더한다. 5가지의 테마로 꾸며진 춘향 테마파크와 작가 최명희의 대하소설의 무대가 되었던 <혼불> 문학관도 가볼 만하다.지리산 바래봉은 철쭉제가 열리는 봄에 여행하기 좋다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=남원시',
'https://kr.trip.com/hotels/?locale=ko-KR', '남원시', 1303);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (65, '익산시', 'iksansi.png', '우리나라에서 가장 오래된 기차역인 춘포역은 이제 문을 닫았지만 추억 속 간이역의 운치가 남아 있어 잠시 쉬어가기 좋다. 백제시대 유적으로 세계유산으로 등록되어있는 왕궁리유적과 미륵사지도 천천히 둘러보면 좋고, 당일치기로 익산을 둘러볼 예정이라면 저렴한 가격의 시티투어도 추천한다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=익산시',
'https://kr.trip.com/hotels/?locale=ko-KR', '익산시', 1304);

-- 전라남도 (14)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (66, '순천시', 'suncheonsi.png', '살아숨쉬는 생태 수도 전남 순천시. 매년 깊어지는 가을마다 세계 5대 습지이자 철새들의 도래지인 순천만 습지의 갈대밭은 더욱 몽환적인 모습으로 무장한다. 이를 보호하고자 만든 순천만 국가 정원에서는 다양한 생태 식물들을 관찰할 수 있어 또 다른 자연의 아름다움을 느낄 수 있다. 구불구불한 리아스식 해안선을 따라 드라이브할 수 있는 와온해변은 일몰이 아름답기로 유명하며 이곳의 마을에서는 어촌체험도 가능하다. 추억을 떠올리게 하는 순천 드라마 세트장은 60-80년대의 모습을 완벽히 재현하고 있어 떠오르는 관광 명소다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=순천시',
'https://kr.trip.com/hotels/?locale=ko-KR', '순천시', 1401);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (67, '여수시', 'yeosusi.png', '국제 해양관광의 중심 전남 여수시. 3천여 그루의 동백나무로 가득 찬 붉은 섬 오동도는 웰빙 트래킹 코스를 갖추고 있어 한층 더 운치 있다. 해상 케이블카를 타면 마치 바다 위를 걷는 듯한 느낌이 들며 탁 트인 바다 전망을 감상할 수 있다. 노래 가사에도 나오는 낭만적이고 황홀한 여수의 밤바다는 돌산대교와 음악분수가 함께 어우러져 멋진 야경을 선사한다. 공식 밥도둑 게장백반과 돌산 갓김치, 갈치조림 등 풍부한 먹거리까지 갖춘 인기 만점 관광지!', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=여수시',
'https://kr.trip.com/hotels/?locale=ko-KR', '여수시', 1402);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (68, '목포시', 'mokposi.png', '아름다운 한 폭의 동양화를 연상시키는 유달산에서 다도해의 경관을 한눈에 감상할 수 있다. 때묻지 않은 자연을 간직한 사랑의 섬 외달도는 전국에서 휴양하기 좋은 섬 30위 안에 선정될 만큼 아름다운 바다와 해변이 특징이다. 목포 평화광장 앞 바다에는 음악에 맞춰 빛과 물이 어우러지는 세계 최대의 춤추는 바다분수가 있어 이색적인 볼거리를 제공하고 있다. 갯벌 속의 인삼이라 불리는 세 발 낙지는 목포의 대표적인 토산품 중 하나이며 일부 지역에서만 잡히는 지역 특산품이다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=목포시',
'https://kr.trip.com/hotels/?locale=ko-KR', '목포시', 1403);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (69, '나주시', 'najusi.png', '보물 제2037호 금성관과 전체 둘레가 3.7km에 달하는 나주읍성에 위치한 4대문(동점문, 서성문, 남고문, 북망문)은 호남의 웅도 나주를 보여주는 상징적인 역사 유적으로 도보여행으로 천년고도 나주를 체험할 수 있는 곳이다. 성균관 다음으로 큰 조선시대 교육 시설인 나주 향교는 역사적, 건축학적 가치가 크며 해마다 여름에 서당이 개설되고 시민들의 전통 혼례식장으로도 이용된다. 푹 끓인 곰탕과 톡 쏘는 맛이 일품인 홍어는 나주를 상징하는 음식인 만큼 먹어보는 것을 추천한다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=나주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '나주시', 1404);

-- 경상북도 (15)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (70, '경주시', 'gyeongjusi.png', '지붕 없는 박물관 경주. 경주는 그만큼 발길이 닿는 어느 곳이든 문화 유적지를 만날 수 있는 곳이다. 밤이면 더 빛나는 동궁과 월지를 비롯해 허허벌판에 자리를 굳건히 지키고 있는 첨성대. 뛰어난 건축미를 자랑하는 불국사 석굴암까지 어느 하나 빼놓을 수 없다. 경주 여행의 기록을 남기고 싶다면 스탬프 투어를 이용해보는 것도 좋다. 16곳의 명소를 탐방할 때마다 찍히는 도장 모으는 재미가 쏠쏠하다. 모바일 앱으로도 스탬프 투어 참여가 가능하다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=경주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '경주시', 1501);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (71, '안동시', 'andongsi.png', '마을 전체가 유네스코 세계문화유산에 등재되어 있는 안동 하회마을. 퇴계 이황 선생의 가르침이 남아있는 도산서원과 그가 거닐던 예던길은 한적한 등산 코스로 좋다. 아기자기한 그림으로 채워진 신세동 벽화마을과 환상적인 야경을 볼 수 있는 월영교도 빼놓을 수 없다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=안동시',
'https://kr.trip.com/hotels/?locale=ko-KR', '안동시', 1502);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (72, '포항시', 'pohangsi.png', '포항 영일만 끝에 있는 호미곶에는 코스로 구성된 자전거 길이 있어서 산과 바다를 가로지르며 라이딩 할 수 있다. 죽도시장의 트렌드 마크 대게빵과 포항을 대표하는 과메기를 맛보는 것도 여행의 필수 코스! 구룡포 근대문화역사 거리에 들어서면 가슴 아픈 수탈의 흔적과 옛 추억 먹거리를 만날 수 있다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=포항시',
'https://kr.trip.com/hotels/?locale=ko-KR', '포항시', 1503);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (73, '경산시', 'gyeongsansi.png', '기도객의 발길이 끊이지 않는 경산시. 팔공산에 위치한 갓바위는 정성껏 빌면 한 가지 소원은 반드시 이루어진다는 부처로 알려져 경산에 오면 지나칠 수 없는 곳이다. 반곡지는 사진작가들을 통해 입소문이 난 곳인데, 작은 저수지를 가득 메운 왕버들 나무가 대표 사진 스팟이다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=경산시',
'https://kr.trip.com/hotels/?locale=ko-KR', '경산시', 1504);

commit;

-- 경상남도 (16)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (74, '창원시', 'changwonsi.png', '창원시는 세계 최대 벚꽃축제인 진해 군항제가 대표적이다. 벚꽃 아래 놓인 여좌천로망스다리는 대표 포토존이다. 아름다운 군무로 유명한 가창오리를 감상할 수 있는 주남저수지는 람사르총회를 통해 세계적인 주목을 받은 바 있다. 골목골목을 구경하는 재미가 있는 창동 예술촌과 해양드라마 세트장도 창원시에서만 만날 수 있는 이색 여행지이다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=창원시',
'https://kr.trip.com/hotels/?locale=ko-KR', '창원시', 1601);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (75, '통영시', 'tongyeongsi.png', '예술과 음식의 맛에 혼을 빼앗기는 통영. 보물 같은 섬 욕지도와 바다를 품은 장사도 해상공원 등 수려한 자연경관이 가득한 곳으로 많이 알려져 있지만, 시인 백석이 지나간 자리와 통영이 고향인 소설가 박경리의 발자취가 깃들어 있는 곳이기도 하다. 통영의 명물이 되었다는 충무김밥이나 대표 간식 꿀빵은 통영 여행에 빠지지 않는 주전부리 목록이다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=통영시',
'https://kr.trip.com/hotels/?locale=ko-KR', '통영시', 1602);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (76, '거제시', 'geojesi.png', '한없이 걷고 또 걷고 싶은 땅 거제시. 겨울이면 지심도에서는 빨간 동백꽃 길이 펼쳐지고, 희귀식물들이 가득한 외도 보타니아와 파도 소리를 따라 걸을 수 있는 학동몽돌해변 등 발이 닿는 어느 곳이든 아름다운 산책로가 펼쳐진다. 거제시에서는 전국 최초 복합 어촌체험 상품도 있어 갯벌 체험 등 다채로운 경험도 가능하다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=거제시',
'https://kr.trip.com/hotels/?locale=ko-KR', '거제시', 1603);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (77, '진주시', 'jinjusi.png', '진주를 대표 명소인 진주성은 역사와 문화가 집약된 성곽이다. 남강을 따라 산책하기에도 좋으며 촉석루에서 바라보는 진주성의 야경은 더욱 근사하다. 물안개가 피어나는 새벽이면 더욱 멋진 풍광을 선물하는 진양호와 가을이면 코스모스 밭으로 변하는 내촌호수마을도 가볼 만하다.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=진주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '진주시', 1604);

-- 제주특별자치도 (17)
INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (78, '제주시', 'jejusi.png', '해변이 아름다운 제주시. 에메랄드빛 맑은 물빛을 자랑하는 협재 해수욕장부터 다른 지역에서는 볼 수 없는 삼양 검은 모래해변, 목마 등대가 눈에 띄는 이호테우해변까지 다양한 바다를 만날 수 있다. 제주를 상징하는 해안 절경 용두암과 푸른 하늘과 언덕 그리고 바다까지 삼박자를 모두 갖춘 우도도 빼놓을 수 없다. 오메기떡으로 유명한 동문재래시장 쇼핑은 떠오르는 제주 여행 코스.', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=제주시',
'https://kr.trip.com/hotels/?locale=ko-KR', '제주시', 1701);

INSERT INTO trip (trip_no, tname, image, intro, tnew, viewcnt, url_1, url_2, sname, district_no)
VALUES (79, '서귀포시', 'seogwiposhi.png', '신비로운 자연의 모습을 품은 서귀포시. 웅장한 돌기둥들이 병풍처럼 펼쳐진 대포 주상절리와 하늘과 땅이 만나는 연못이라 불리는 천지연 폭포, 수중 폭발 분화구인 성산 일출봉은 제주를 대표하는 관광지이다. 제주에서 손꼽히는 비경 중 하나인 섭지코지는 꾸준히 사랑받고 있는 여행지이며, 서귀포 매일 올레시장에 들러 꽁치김밥을 맛보는 것도 하나의 별미!', SYSDATE, 0,
'https://www.diningcode.com/list.dc?query=서귀포시',
'https://kr.trip.com/hotels/?locale=ko-KR', '서귀포시', 1702);

COMMIT;

UPDATE trip SET intro = '마치 외국에 온 듯한 느낌의 송도 센트럴파크는 떠오르는 관광지로 자리 잡고 있다. 송도를 한눈에 담고 싶다면 G 타워 하늘 전망대에 올라가 보는 것을 추천한다. 한국전쟁 당시 희생하신 분들을 기리기 위해 세워진 인천상륙작전기념관은 조국의 자유수호 의지를 익힐 수 있어 교육의 장으로 활용된다. 4-6월 사이에는 꽃게 제철로 송도유원지 쪽에 위치한 꽃게거리에서 다양한 꽃게요리를 맛볼 수 있다.' WHERE trip_no = 23;

-- trip_no 12~80 tname 수정 (한글 → 영어 대문자, '구' 제거)
UPDATE trip SET tname = 'HAEUNDAE' WHERE trip_no = 12;
UPDATE trip SET tname = 'JUNGGU' WHERE trip_no = 13;
UPDATE trip SET tname = 'YEONGDO' WHERE trip_no = 14;
UPDATE trip SET tname = 'DONGNAE' WHERE trip_no = 15;
UPDATE trip SET tname = 'SUYEONG' WHERE trip_no = 16;
UPDATE trip SET tname = 'SAHA' WHERE trip_no = 17;
UPDATE trip SET tname = 'JUNGGU' WHERE trip_no = 18;
UPDATE trip SET tname = 'DONGSEONGRO' WHERE trip_no = 19;
UPDATE trip SET tname = 'SUSEONG' WHERE trip_no = 20;
UPDATE trip SET tname = 'DALSEO' WHERE trip_no = 21;
UPDATE trip SET tname = 'JUNGGU' WHERE trip_no = 22;
UPDATE trip SET tname = 'YEONSU' WHERE trip_no = 23;
UPDATE trip SET tname = 'NAMDONG' WHERE trip_no = 24;
UPDATE trip SET tname = 'MICHOHOL' WHERE trip_no = 25;
UPDATE trip SET tname = 'GYEYANG' WHERE trip_no = 26;
UPDATE trip SET tname = 'DONGGU' WHERE trip_no = 27;
UPDATE trip SET tname = 'SEOGU' WHERE trip_no = 28;
UPDATE trip SET tname = 'NAMGU' WHERE trip_no = 29;
UPDATE trip SET tname = 'BUKGU' WHERE trip_no = 30;
UPDATE trip SET tname = 'JUNGGU' WHERE trip_no = 31;
UPDATE trip SET tname = 'SEOGU' WHERE trip_no = 32;
UPDATE trip SET tname = 'YUSEONG' WHERE trip_no = 33;
UPDATE trip SET tname = 'DAEDEOK' WHERE trip_no = 34;
UPDATE trip SET tname = 'JUNGGU' WHERE trip_no = 35;
UPDATE trip SET tname = 'NAMGU' WHERE trip_no = 36;
UPDATE trip SET tname = 'DONGGU' WHERE trip_no = 37;
UPDATE trip SET tname = 'BUKGU' WHERE trip_no = 38;
UPDATE trip SET tname = 'ULJUGUN' WHERE trip_no = 39;
UPDATE trip SET tname = 'GAPYEONG' WHERE trip_no = 40;
UPDATE trip SET tname = 'SUWON' WHERE trip_no = 41;
UPDATE trip SET tname = 'YONGIN' WHERE trip_no = 42;
UPDATE trip SET tname = 'SEONGNAM' WHERE trip_no = 43;
UPDATE trip SET tname = 'HWASEONG' WHERE trip_no = 44;
UPDATE trip SET tname = 'ANSAN' WHERE trip_no = 45;
UPDATE trip SET tname = 'GOYANG' WHERE trip_no = 46;
UPDATE trip SET tname = 'ICHEON' WHERE trip_no = 47;
UPDATE trip SET tname = 'PAJU' WHERE trip_no = 48;
UPDATE trip SET tname = 'BUCHEON' WHERE trip_no = 49;
UPDATE trip SET tname = 'CHUNCHEON' WHERE trip_no = 50;
UPDATE trip SET tname = 'SOKCHO' WHERE trip_no = 51;
UPDATE trip SET tname = 'GANGNEUNG' WHERE trip_no = 52;
UPDATE trip SET tname = 'WONJU' WHERE trip_no = 53;
UPDATE trip SET tname = 'YANGYANG' WHERE trip_no = 54;
UPDATE trip SET tname = 'CHEONGJU' WHERE trip_no = 55;
UPDATE trip SET tname = 'CHUNGJU' WHERE trip_no = 56;
UPDATE trip SET tname = 'JECHEON' WHERE trip_no = 57;
UPDATE trip SET tname = 'CHEONAN' WHERE trip_no = 58;
UPDATE trip SET tname = 'GONGJU' WHERE trip_no = 59;
UPDATE trip SET tname = 'NONSAN' WHERE trip_no = 60;
UPDATE trip SET tname = 'SEOSAN' WHERE trip_no = 61;
UPDATE trip SET tname = 'JEONJU' WHERE trip_no = 62;
UPDATE trip SET tname = 'GUNSAN' WHERE trip_no = 63;
UPDATE trip SET tname = 'NAMWON' WHERE trip_no = 64;
UPDATE trip SET tname = 'IKSAN' WHERE trip_no = 65;
UPDATE trip SET tname = 'SUNCHEON' WHERE trip_no = 66;
UPDATE trip SET tname = 'YEOSU' WHERE trip_no = 67;
UPDATE trip SET tname = 'MOKPO' WHERE trip_no = 68;
UPDATE trip SET tname = 'NAJU' WHERE trip_no = 69;
UPDATE trip SET tname = 'GYEONGJU' WHERE trip_no = 70;
UPDATE trip SET tname = 'ANDONG' WHERE trip_no = 71;
UPDATE trip SET tname = 'POHANG' WHERE trip_no = 72;
UPDATE trip SET tname = 'GYEONGSAN' WHERE trip_no = 73;
UPDATE trip SET tname = 'CHANGWON' WHERE trip_no = 74;
UPDATE trip SET tname = 'TONGYEONG' WHERE trip_no = 75;
UPDATE trip SET tname = 'GEOJE' WHERE trip_no = 76;
UPDATE trip SET tname = 'JINJU' WHERE trip_no = 77;
UPDATE trip SET tname = 'JEJU' WHERE trip_no = 78;
UPDATE trip SET tname = 'SEOGWIPO' WHERE trip_no = 79;
UPDATE trip SET tname = 'SEJONG' WHERE trip_no = 80;

DELETE trip WHERE trip_no = 19;
COMMIT;
SELECT * FROM trip WHERE trip_no = 12;




ALTER TABLE trip ADD keywords VARCHAR2(500);
COMMENT ON COLUMN trip.keywords IS '인트로 기반 추출 키워드';

UPDATE trip SET keywords = '웅장함,과거 여행,아기자기함,벽화,생동감,길거리 공연,문화' WHERE trip_no = 10;
UPDATE trip SET keywords = '자연,힐링,피크닉,등산,추모,계절감,문화' WHERE trip_no = 11;
UPDATE trip SET keywords = '해양 도시,백사장,오락 및 편의시설,자연 경관,야경,드라이브 코스,힐링' WHERE trip_no = 12;
UPDATE trip SET keywords = '수산물,야경,뱃길 여행,간식거리,영화제,헌책방,문화' WHERE trip_no = 13;
UPDATE trip SET keywords = '해안 절벽,기암괴석,유람선,복합문화공간,낭만,골목길,자연' WHERE trip_no = 14;
UPDATE trip SET keywords = '역사,온천,산책,전망,지역 음식,전통' WHERE trip_no = 15;
UPDATE trip SET keywords = '해양,문화,축제,야경,피크닉,여름,관광' WHERE trip_no = 16;
UPDATE trip SET keywords = '생태,문화,예술,자연,힐링,관찰,장관' WHERE trip_no = 17;
UPDATE trip SET keywords = '역사,문화,골목투어,벽화,야시장,사진,탐방' WHERE trip_no = 18;
UPDATE trip SET keywords = '자연,힐링,가족,문화,교육,놀이,휴식' WHERE trip_no = 33;
UPDATE trip SET keywords = '전망,산행,다채로움,트레킹,자연' WHERE trip_no = 34;
UPDATE trip SET keywords = '생태공원,자연,산책로,재생,전망,힐링' WHERE trip_no = 35;
UPDATE trip SET keywords = '고래,체험,문화,요리,박물관,생태,먹거리' WHERE trip_no = 36;
UPDATE trip SET keywords = '해안선,파도 소리,자연,고요함,몽돌 해변,벚꽃,야경' WHERE trip_no = 37;
UPDATE trip SET keywords = '바다,운치,낚시,전설,소원,경관' WHERE trip_no = 38;
UPDATE trip SET keywords = '일출,석양,자연,장관,트래킹,등산,억새풀' WHERE trip_no = 39;
UPDATE trip SET keywords = '자연,이국적,풍경,음악,축제,힐링' WHERE trip_no = 40;
UPDATE trip SET keywords = '역사,야경,산책,문화,미식,관광' WHERE trip_no = 41;
UPDATE trip SET keywords = '테마파크,문화,전원체험,데이트,힐링,전통,즐거움' WHERE trip_no = 42;
UPDATE trip SET keywords = '데이트,공연,자연,짜릿한,브런치,전통시장,힐링' WHERE trip_no = 43;
UPDATE trip SET keywords = '해안,바다낚시,갯벌체험,드라이브,자전거,데이트,자연' WHERE trip_no = 44;
UPDATE trip SET keywords = '자연,산책,낙조,녹지,힐링,축제,경관' WHERE trip_no = 45;
UPDATE trip SET keywords = '문화유적,체험,등산,쇼핑,현대적,전통시장,관광' WHERE trip_no = 46;
UPDATE trip SET keywords = '체험,축제,자연,전통,문화,즐거움' WHERE trip_no = 47;
UPDATE trip SET keywords = '느린 감성,추억,문화,역사,평화,주말 나들이' WHERE trip_no = 48;
UPDATE trip SET keywords = '문화,예술,축제,힐링,자연,관광,도심 속 휴식' WHERE trip_no = 49;
UPDATE trip SET keywords = '전통,고즈넉함,역사,야경,예술,포토존' WHERE trip_no = 62;
UPDATE trip SET keywords = '근대역사,문화유산,건축물,철길마을,맛집,먹방 여행,레트로' WHERE trip_no = 63;
UPDATE trip SET keywords = '사랑,운치,테마파크,문학,자연,축제' WHERE trip_no = 64;
UPDATE trip SET keywords = '추억,운치,역사,유적지,문화,힐링,여유' WHERE trip_no = 65;
UPDATE trip SET keywords = '스포츠,레저,낭만,문화,이색 볼거리,음악,야외 활동' WHERE trip_no = 20;
UPDATE trip SET keywords = '데이트,축제,빛,나들이,여름,놀이동산,자연' WHERE trip_no = 21;
UPDATE trip SET keywords = '문화 체험,휴식,관광지,해변,놀이,도시 탐험' WHERE trip_no = 22;
UPDATE trip SET keywords = '현대적,전망,역사,교육,미식,자연,관광' WHERE trip_no = 23;
UPDATE trip SET keywords = '자연,축제,전통,데이트,관광,힐링,가을' WHERE trip_no = 24;
UPDATE trip SET keywords = '역사,트래킹,시장,먹거리,열기,스포츠' WHERE trip_no = 25;
UPDATE trip SET keywords = '자연,봄꽃,야간 산행,가을밤,체험,가족 나들이' WHERE trip_no = 26;
UPDATE trip SET keywords = '예술,재래시장,야시장,맛집,자연,힐링,문화' WHERE trip_no = 27;
UPDATE trip SET keywords = '역사,문화,휴식,산책,자연,힐링' WHERE trip_no = 28;
UPDATE trip SET keywords = '벽화,데이트,역사,문화,아기자기함,사진 촬영' WHERE trip_no = 29;
UPDATE trip SET keywords = '문화,산책,소소한 재미,예술,역사,자연,휴식' WHERE trip_no = 30;
UPDATE trip SET keywords = '자연,산책,전망,피크닉,벚꽃,힐링' WHERE trip_no = 31;
UPDATE trip SET keywords = '자연,힐링,산책,가족,예술,야경' WHERE trip_no = 32;
UPDATE trip SET keywords = '트렌디,카페,여유,자연,힐링,문화,쇼핑' WHERE trip_no = 1;
UPDATE trip SET keywords = '전통,산책,이색 체험,젊음,미식,휴식,문화 행사' WHERE trip_no = 2;
UPDATE trip SET keywords = '젊음,자유,아기자기함,산책,문화,자연,힐링' WHERE trip_no = 3;
UPDATE trip SET keywords = '자연,벚꽃,놀이공원,가족,휴식,사진,계절' WHERE trip_no = 4;
UPDATE trip SET keywords = '전통,현대,낭만,고즈넉함,문화체험,자연,포토스팟' WHERE trip_no = 5;
UPDATE trip SET keywords = '문화,여유,레저,예술,축제,자연,쇼핑' WHERE trip_no = 6;
UPDATE trip SET keywords = '다문화,이색적,핫플레이스,문화예술,전시,카페,젊은 세대' WHERE trip_no = 7;
UPDATE trip SET keywords = '자연,산행,트렌디,카페,야경,데이트,문화' WHERE trip_no = 8;
UPDATE trip SET keywords = '한의학,전통체험,교육 문화,역사,체험 프로그램,유물,예절교육' WHERE trip_no = 9;
UPDATE trip SET keywords = '낭만,자연,문학,예술,사계절,여유' WHERE trip_no = 50;
UPDATE trip SET keywords = '일출,절경,바다,전통,미식,자연,힐링' WHERE trip_no = 51;
UPDATE trip SET keywords = '커피향,바다 풍경,일출,야경,전망,자연,힐링' WHERE trip_no = 52;
UPDATE trip SET keywords = '역사,자연,상상,탐방,힐링,가족,사찰' WHERE trip_no = 53;
UPDATE trip SET keywords = '자연,일출,소박함,역사,힐링,전망,명소' WHERE trip_no = 54;
UPDATE trip SET keywords = '역사,체험,산행,가족,시장,문화,여유' WHERE trip_no = 55;
UPDATE trip SET keywords = '내륙,드라이브,동심,관광지,역사,소소한 즐거움,시장' WHERE trip_no = 56;
UPDATE trip SET keywords = '문화재,역사,자연,힐링,계곡,여름 피서지' WHERE trip_no = 57;
UPDATE trip SET keywords = '역사,문화,자연,가족 나들이,갤러리 투어,미식,편리한 교통' WHERE trip_no = 58;
UPDATE trip SET keywords = '역사,사찰,자연,문화재,풍경,힐링' WHERE trip_no = 59;
UPDATE trip SET keywords = '역사,군사문화,산책,드라이브,자연,가족여행' WHERE trip_no = 60;
UPDATE trip SET keywords = '절경,석양,트래킹,자연,산책,해안,역사' WHERE trip_no = 61;
UPDATE trip SET keywords = '도심,젊음,보행자전용,골목상권,친환경,디자인,번화가' WHERE trip_no = 19;
UPDATE trip SET keywords = '생태,몽환적,자연,일몰,어촌체험,추억,관광 명소' WHERE trip_no = 66;
UPDATE trip SET keywords = '웰빙,트래킹,운치,낭만적,야경,먹거리' WHERE trip_no = 67;
UPDATE trip SET keywords = '자연,힐링,경관,이색적,휴양,바다,특산품' WHERE trip_no = 68;
UPDATE trip SET keywords = '역사,도보여행,전통,건축학적 가치,향토 음식,문화 체험' WHERE trip_no = 69;
UPDATE trip SET keywords = '문화 유적지,건축미,밤의 아름다움,역사 탐방,스탬프 투어,모바일 참여' WHERE trip_no = 70;
UPDATE trip SET keywords = '문화유산,전통,한적함,예술,야경,역사' WHERE trip_no = 71;
UPDATE trip SET keywords = '자전거 여행,자연,미식 여행,역사 탐방,문화 체험,바다,산' WHERE trip_no = 72;
UPDATE trip SET keywords = '기도,소원,자연,사진,힐링,명소' WHERE trip_no = 73;
UPDATE trip SET keywords = '벚꽃,포토존,자연,축제,예술,이색 여행지,문화' WHERE trip_no = 74;
UPDATE trip SET keywords = '예술,음식,자연경관,문학,역사,주전부리' WHERE trip_no = 75;
UPDATE trip SET keywords = '산책,자연,힐링,다채로운 경험,겨울,아름다움' WHERE trip_no = 76;
UPDATE trip SET keywords = '역사,문화,산책,야경,자연,풍광,가을' WHERE trip_no = 77;
UPDATE trip SET keywords = '해변,자연,절경,힐링,쇼핑,다양성' WHERE trip_no = 78;
UPDATE trip SET keywords = '자연,신비로움,웅장함,비경,힐링,전통시장' WHERE trip_no = 79;
UPDATE trip SET keywords = '자연,힐링,가족 나들이,데이트,산책,교육 프로그램' WHERE trip_no = 80;

commit;