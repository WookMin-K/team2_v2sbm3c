DROP TABLE REGION;
DROP TABLE REGION CASCADE CONSTRAINTS; -- 자식 무시하고 삭제 가능

CREATE TABLE REGION (
    REGION_NO      NUMBER(10)      NOT NULL     PRIMARY KEY,
    RNAME          VARCHAR(100)    NOT NULL
);

COMMENT ON TABLE region IS '시·도';
COMMENT ON COLUMN region.REGION_NO is '지역 번호';
COMMENT ON COLUMN region.RNAME is '지역명';

DROP SEQUENCE REGION_SEQ;

CREATE SEQUENCE REGION_SEQ
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

<<<<<<< HEAD
commit;
=======

commit;

