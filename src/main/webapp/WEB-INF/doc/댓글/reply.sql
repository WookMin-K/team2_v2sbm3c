DROP TABLE reply;

CREATE TABLE reply (
  reply_no   NUMBER(10),
  content      VARCHAR2(255) NOT NULL,
  created_day  DATE DEFAULT CURRENT_TIMESTAMP,
  post_no      NUMBER(10),
  user_no      NUMBER(10) NOT NULL,
  parent_reply_no  NUMBER(10), -- NULL이면 일반 댓글, 숫자면 대댓글

  PRIMARY KEY (reply_no),
  FOREIGN KEY (post_no) REFERENCES post (post_no) ON DELETE CASCADE, -- 글 삭제 시 댓글 삭제
  FOREIGN KEY (user_no) REFERENCES users (user_no)
);

COMMENT ON COLUMN reply.reply_no IS '댓글 번호';

COMMENT ON COLUMN reply.content IS '댓글 내용';

COMMENT ON COLUMN reply.created_day IS '작성일';

COMMENT ON COLUMN reply.post_no IS '게시글 번호';

ALTER TABLE reply
  ADD hidden_yn CHAR(1) DEFAULT 'N' NOT NULL;  -- 'N': 정상, 'Y': 블라인드

DROP SEQUENCE reply_SEQ;

CREATE SEQUENCE reply_SEQ
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

