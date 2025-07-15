DROP TABLE comment;

CREATE TABLE comment (
	comment_no	NUMBER(10)		NULL,
	content	VARCHAR(255)		NOT NULL,
	created_day	DATE	DEFAULT CURRENT_TIMESTAMP	NULL,
	post_no	NUMBER(10)		NULL,
	user_no	NUMBER(10)		NOT NULL,
    PRIMARY KEY (comment_no),
    FOREIGN KEY (post_no) REFERENCES post (post_no),
    FOREIGN KEY (user_no) REFERENCES users (user_no)
);

COMMENT ON COLUMN comment.comment_no IS '댓글 번호';

COMMENT ON COLUMN comment.content IS '댓글 내용';

COMMENT ON COLUMN comment.created_day IS '작성일';

COMMENT ON COLUMN comment.post_no IS '게시글 번호';

DROP SEQUENCE comment_SEQ;

CREATE SEQUENCE comment_SEQ
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지