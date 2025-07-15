-- 삭제
DROP TABLE plan_share;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE plan_share CASCADE CONSTRAINTS; 

CREATE TABLE plan_share(
    share_no                            NUMBER(10)     NOT NULL     PRIMARY KEY,
    share_title                               VARCHAR2(255)  NOT NULL,  
    share_story                              VARCHAR2(255)  NOT NULL,
    visibility                           CHAR(1)      DEFAULT 'Y'    NOT NULL,
    created_day                             DATE          NOT NULL,
    plan_no                              NUMBER(10) NOT NULL,
    user_no                              NUMBER(10) NOT NULL,
    FOREIGN KEY (plan_no) REFERENCES plan (plan_no),
    FOREIGN KEY (user_no) REFERENCES users (user_no)
);

COMMENT ON TABLE PLAN_SHARE is '일정 공유';
COMMENT ON COLUMN PLAN_SHARE.SHARE_NO is '공유 번호';
COMMENT ON COLUMN PLAN_SHARE.SHARE_TITLE is '공유 일정 제목';
COMMENT ON COLUMN PLAN_SHARE.STORY is '공유 설명';
COMMENT ON COLUMN PLAN_SHARE.VISIBILITY is '공개 여부';
COMMENT ON COLUMN PLAN_SHARE.CREATED_DAY is '공유일';
COMMENT ON COLUMN PLAN_SHARE.PLAN_NO is '여행 번호';
COMMENT ON COLUMN PLAN_SHARE.USER_NO is '회원번호';

DROP SEQUENCE plan_share_seq;

CREATE SEQUENCE plan_share_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지
