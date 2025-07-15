-- 1. 시퀀스 생성
DROP SEQUENCE copyofplan_seq;
DROP TABLE copyofplan;

CREATE SEQUENCE copyofplan_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  NOCACHE
  NOCYCLE;

-- 2. 테이블 생성
CREATE TABLE CopyOfplan (
  plan_no      NUMBER(10)      PRIMARY KEY,              -- 여행 번호 (PK)
  title        VARCHAR2(255),                            -- 여행 제목
  start_date   DATE,                                     -- 여행 시작일
  departure    VARCHAR2(100),                            -- 출발지
  transport    VARCHAR2(50),                             -- 이동 수단
  people_count VARCHAR2(100),                            -- 인원 수
  place        VARCHAR2(100),                            -- 여행 장소 (주요 목적지)
  contentstype NUMBER(10),                               -- 콘텐츠 유형 (예: 자연, 도시, 체험 등)
  x            NUMBER(20,15),                            -- X좌표 (경도)
  y            NUMBER(20,15),                            -- Y좌표 (위도)
  trip_day     NUMBER(30),                               -- 여행 일수
  user_no      NUMBER(10)      NOT NULL,                  -- 회원 번호 (FK)
  FOREIGN KEY (user_no) REFERENCES users (user_no)
);

-- 3. 코멘트 추가
COMMENT ON TABLE CopyOfplan IS '사용자가 생성한 여행 일정 정보를 저장하는 테이블';

COMMENT ON COLUMN CopyOfplan.plan_no      IS '여행 번호 (PK)';
COMMENT ON COLUMN CopyOfplan.title        IS '여행 제목';
COMMENT ON COLUMN CopyOfplan.start_date   IS '여행 시작일';
COMMENT ON COLUMN CopyOfplan.departure    IS '출발지';
COMMENT ON COLUMN CopyOfplan.transport    IS '이동 수단 (버스, 비행기 등)';
COMMENT ON COLUMN CopyOfplan.people_count IS '여행 인원 수';
COMMENT ON COLUMN CopyOfplan.place        IS '여행 목적지';
COMMENT ON COLUMN CopyOfplan.contentstype IS '콘텐츠 유형 (ex: 1=자연, 2=도시, 3=체험 등)';
COMMENT ON COLUMN CopyOfplan.x            IS '여행 장소의 경도 (X 좌표)';
COMMENT ON COLUMN CopyOfplan.y            IS '여행 장소의 위도 (Y 좌표)';
COMMENT ON COLUMN CopyOfplan.trip_day     IS '전체 여행 일수';
COMMENT ON COLUMN CopyOfplan.user_no      IS '일정 생성자 회원 번호 (FK)';


INSERT INTO CopyOfplan (
    plan_no, title, start_date, departure, transport, people_count,
    place, contentstype, x, y, trip_day, user_no
) VALUES (
    copyofplan_seq.NEXTVAL,
    '제주도 가족여행',
    TO_DATE('2025-08-01', 'YYYY-MM-DD'),
    '서울',
    '비행기',
    '4명',
    '제주도',
    1,                            -- 자연
    126.531,                     -- 경도 (예시)
    33.499,                      -- 위도 (예시)
    3,                           -- 3일 여행
    1                            -- user_no 예시
);

commit;