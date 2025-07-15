DROP TABLE plan_spot;

CREATE TABLE plan_spot (
    plan_spot_no	NUMBER(10)		NULL,
	order_in_day	NUMBER(10)		NULL,
	plan_day_no	NUMBER(10)		NULL,
	spot_no	NUMBER(10)		NOT NULL,
    PRIMARY KEY (plan_spot_no),
    FOREIGN KEY (plan_day_no) REFERENCES plan_day (plan_day_no),
    FOREIGN KEY (spot_no) REFERENCES spot (spot_no)
);

COMMENT ON TABLE PLAN_SPOT is '여행 장소';
COMMENT ON COLUMN PLAN_SPOT.PLAN_SPOT_NO is '여행 장소 번호';
COMMENT ON COLUMN PLAN_SPOT.ORDER_IN_DAY is '날짜 순서';
COMMENT ON COLUMN PLAN_SPOT.PLAN_DAY_NO is '여행 일차 번호';
COMMENT ON COLUMN PLAN_SPOT.SPOT_NO is '장소 번호';

DROP SEQUENCE plan_spot_seq;

CREATE SEQUENCE plan_spot_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

INSERT INTO plan_spot(plan_spot_no, order_in_day, plan_day_no, spot_no)
 VALUES(plan_spot_seq.NEXTVAL,1,1,1 );
 
SELECT plan_spot_no, order_in_day, plan_day_no ,spot_no FROM plan_spot;

commit;