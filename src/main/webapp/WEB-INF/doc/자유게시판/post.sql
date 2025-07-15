DROP TABLE post;

CREATE TABLE post (
	post_no	NUMBER(10)		NULL,
	title	VARCHAR(255)		NOT NULL,
	content	VARCHAR(255)		NOT NULL,
	created_day	DATE	DEFAULT CURRENT_TIMESTAMP	NULL,
	user_no	NUMBER(10)		NOT NULL,
    view_cnt     NUMBER(10)     DEFAULT 0,
    notice_yn    CHAR(1)        DEFAULT 'N'
    PRIMARY KEY (post_no),
    FOREIGN KEY (user_no) REFERENCES users (user_no)
);

COMMENT ON COLUMN post.post_no is '게시글 번호';

COMMENT ON COLUMN post.title is '게시글 제목';

COMMENT ON COLUMN post.content is '게시글 내용';

COMMENT ON COLUMN post.created_day is '작성일';

COMMENT ON COLUMN post.view_cnt is '조회수';

COMMENT ON COLUMN post.notice_yn is '고정글';

DROP SEQUENCE post_SEQ;

CREATE SEQUENCE post_SEQ
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지