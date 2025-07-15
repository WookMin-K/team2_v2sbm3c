
-- 기존 테이블 삭제
DROP TABLE notice_board CASCADE CONSTRAINTS;

-- 테이블 생성
CREATE TABLE notice_board (
  notice_no     NUMBER(10)     NOT NULL,
  title         VARCHAR2(100)  NOT NULL,
  content       CLOB           NOT NULL,
  user_no       NUMBER(10)     NOT NULL,
  wdate         DATE           DEFAULT SYSDATE,
  viewcnt       NUMBER(6)     DEFAULT 0,
  type          VARCHAR2(20)   CHECK (type IN ('공지', '질문')) NOT NULL,
  question_id   NUMBER(10),                  -- llamaindex 질문 연동용 (nullable)

  PRIMARY KEY (notice_no),
  FOREIGN KEY (user_no) REFERENCES users(user_no)
);

-- 코멘트
COMMENT ON TABLE notice_board IS '공지사항 게시판';
COMMENT ON COLUMN notice_board.notice_no IS '게시글 고유 번호';
COMMENT ON COLUMN notice_board.title IS '게시글 제목';
COMMENT ON COLUMN notice_board.content IS '게시글 내용';
COMMENT ON COLUMN notice_board.user_no IS '작성자 (관리자 user_no)';
COMMENT ON COLUMN notice_board.wdate IS '작성일';
COMMENT ON COLUMN notice_board.viewcnt IS '조회수';
COMMENT ON COLUMN notice_board.type IS '게시글 타입 (공지 or 질문)';
COMMENT ON COLUMN notice_board.question_id IS '챗봇 질문 ID';

-- 시퀀스 삭제 및 생성
DROP SEQUENCE notice_board_seq;

CREATE SEQUENCE notice_board_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  CACHE 2
  NOCYCLE;

-- 예시 INSERT (공지사항 1건)
INSERT INTO notice_board (
  notice_no, title, content, user_no, type
) VALUES (
  notice_board_seq.NEXTVAL,
  '서비스 점검 안내',
  '7월 5일 02:00 ~ 06:00 동안 시스템 점검이 예정되어 있습니다.',
  1,
  '공지'
);

-- SELECT 확인
SELECT notice_no, title, content, user_no, wdate, type
FROM notice_board;

COMMIT;


ALTER TABLE notice_board ADD saved_name1 VARCHAR2(255);
ALTER TABLE notice_board ADD origin_name1 VARCHAR2(255);
ALTER TABLE notice_board ADD filetype1 VARCHAR2(100);
ALTER TABLE notice_board ADD filesize1 NUMBER;

ALTER TABLE notice_board ADD saved_name2 VARCHAR2(255);
ALTER TABLE notice_board ADD origin_name2 VARCHAR2(255);
ALTER TABLE notice_board ADD filetype2 VARCHAR2(100);
ALTER TABLE notice_board ADD filesize2 NUMBER;

