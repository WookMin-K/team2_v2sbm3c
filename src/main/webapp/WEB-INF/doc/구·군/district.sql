DROP TABLE DISTRICT;

CREATE TABLE DISTRICT (
    district_no     NUMBER(10)      NOT NULL,
    dname           VARCHAR(100)    NOT NULL,
    region_no       NUMBER(10)      NOT NULL,
    PRIMARY KEY (district_no),
    FOREIGN KEY (region_no)REFERENCES REGION (region_no)
);

COMMENT ON TABLE district is '구·군';
COMMENT ON COLUMN district.district_no is '자치구 번호';
COMMENT ON COLUMN district.dname is '자치구명';
COMMENT ON COLUMN district.region_no is '지역 번호';

DROP SEQUENCE REGION_SEQ;

CREATE SEQUENCE REGION_SEQ
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(20) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

commit;
