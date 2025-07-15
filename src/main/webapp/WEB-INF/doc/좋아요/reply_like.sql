DROP TABLE reply_like;

CREATE TABLE reply_like (
  reply_like_no   NUMBER PRIMARY KEY,
  reply_no        NUMBER NOT NULL,
  user_no         NUMBER NOT NULL,
  liked_day       DATE DEFAULT SYSDATE,
  FOREIGN KEY (reply_no) REFERENCES reply(reply_no) ON DELETE CASCADE,
  FOREIGN KEY (user_no) REFERENCES users(user_no) ON DELETE CASCADE,
  UNIQUE (reply_no, user_no) -- 한 유저가 한 댓글에 한 번만 좋아요 가능
);

DROP SEQUENCE reply_like_seq;

CREATE SEQUENCE reply_like_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지