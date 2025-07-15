DROP TABLE SPOT;
DROP TABLE SPOT CASCADE CONSTRAINTS; -- 자식 무시하고 삭제 가능

CREATE TABLE SPOT (
    spot_no         NUMBER(10)      NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    type            VARCHAR(50)     NOT NULL,
<<<<<<< HEAD
    description     VARCHAR(50)     NOT NULL,
    district_no     NUMBER(10) NOT NULL,
=======
    description     VARCHAR(50),
    district_no     NUMBER(10)      NOT NULL,
>>>>>>> d688f52632be75c95c1b0cee50183468907840ee
    PRIMARY KEY (spot_no),
    FOREIGN KEY (district_no) REFERENCES DISTRICT (district_no)
);

COMMENT ON TABLE spot is '장소';
COMMENT ON COLUMN spot.spot_no is '장소 번호';
COMMENT ON COLUMN spot.district_no is '자치구 번호';
COMMENT ON COLUMN spot.name is '장소명';
COMMENT ON COLUMN spot.type is '장소 유형';
COMMENT ON COLUMN spot.description is '장소 설명';

DROP SEQUENCE SPOT_SEQ;

CREATE SEQUENCE SPOT_SEQ
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(20) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지
<<<<<<< HEAD
commit;
=======

commit;

