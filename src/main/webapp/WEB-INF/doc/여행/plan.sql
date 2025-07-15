DROP TABLE plan;

CREATE TABLE plan (
	plan_no	NUMBER(10)		NOT NULL,
	title	VARCHAR(255)	NOT	NULL,
	start_date	DATE		NOT NULL,
	end_date	DATE		NOT NULL,
	departure	VARCHAR(100)		NOT NULL,
    transport	VARCHAR(50)		NOT NULL,
	people_count	VARCHAR(100)	NOT NULL,
	budget_range	VARCHAR(100)	NOT	NULL,
	user_no	NUMBER(10)		NOT NULL,
    PRIMARY KEY (plan_no),               -- PK 한번 등록된 값은 중복 안됨
    FOREIGN KEY (user_no) REFERENCES users (user_no)
);

COMMENT ON TABLE PLAN is '여행';
COMMENT ON COLUMN PLAN.PLAN_NO is '여행 번호';
COMMENT ON COLUMN PLAN.TITLE is '제목';
COMMENT ON COLUMN PLAN.START_DATE is '여행 시작일';
COMMENT ON COLUMN PLAN.END_DATE is '여행 종료일';
COMMENT ON COLUMN PLAN.DEPARTURE is '출발지';
COMMENT ON COLUMN PLAN.TRANSPORT is '이동 수단';
COMMENT ON COLUMN PLAN.PEOPLE_COUNT is '인원 수';
COMMENT ON COLUMN PLAN.BUDGET_RANGE is '예산';
COMMENT ON COLUMN PLAN.USER_NO is '회원 번호';

DROP SEQUENCE plan_seq;

CREATE SEQUENCE plan_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

INSERT INTO plan(plan_no, title, start_date, end_date, departure, transport, people_count, budget_range, user_no)
 VALUES (
    plan_seq.NEXTVAL,
    '부산 2박 3일 여행',
    TRUNC(SYSDATE),                          -- 오늘 날짜
    TRUNC(SYSDATE) + 2,                      -- 오늘부터 2박 3일이면 종료일은 이틀 뒤
    '서울역 출발, 부산 도착',
    'KTX',
    '2',                                     -- 인원 2명
    '50만원~70만원',
    1
);

SELECT plan_no, title, start_date, end_date, departure, transport, people_count, budget_range, user_no
FROM plan;

commit;
