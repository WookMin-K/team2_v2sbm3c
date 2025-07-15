DROP TABLE plan_day;

CREATE TABLE plan_day (
	plan_day_no	NUMBER(10)		NOT NULL,
	day_order	NUMBER(10)		NULL,
	pdate	DATE		NULL,
	plan_no	NUMBER(10)		NULL,
    PRIMARY KEY (plan_day_no),
    FOREIGN KEY (plan_no) REFERENCES plan (plan_no)
);

COMMENT ON TABLE PLAN_DAY is '여행 일차';
COMMENT ON COLUMN PLAN_DAY.PLAN_DAY_NO is '여행 일차 번호';
COMMENT ON COLUMN PLAN_DAY.DAY_ORDER is '일차';
COMMENT ON COLUMN PLAN_DAY.PDATE is '실제 날짜';
COMMENT ON COLUMN PLAN_DAY.PLAN_NO is '여행 번호';

DROP SEQUENCE plan_day_seq;

CREATE SEQUENCE plan_day_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

INSERT INTO plan_day(plan_day_no, day_order, pdate, plan_no)
 VALUES(plan_day_seq.NEXTVAL,1,TRUNC(SYSDATE),1 );
 
 
SELECT plan_day_no, day_order, pdate, plan_no FROM plan_day;

commit;