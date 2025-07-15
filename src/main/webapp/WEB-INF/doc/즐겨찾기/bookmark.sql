DROP TABLE bookmark CASCADE CONSTRAINTS;

CREATE TABLE bookmark (
  bookmark_no NUMBER(10) PRIMARY KEY,   -- 즐겨찾기 번호
  trip_no     NUMBER(10) NOT NULL,      -- 여행지 번호 (기존 spot → trip)
  user_no     NUMBER(10) NOT NULL,      -- 사용자 번호

  FOREIGN KEY (trip_no) REFERENCES trip (trip_no),
  FOREIGN KEY (user_no) REFERENCES users (user_no)
);

COMMENT ON TABLE bookmark IS '즐겨찾기';
COMMENT ON COLUMN bookmark.bookmark_no IS '즐겨찾기 번호';
COMMENT ON COLUMN bookmark.trip_no IS '여행지 번호';
COMMENT ON COLUMN bookmark.user_no IS '회원 번호';

DROP SEQUENCE bookmark_seq;

CREATE SEQUENCE bookmark_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  NOCACHE
  NOCYCLE;

INSERT INTO bookmark (bookmark_no, trip_no, user_no)
VALUES (bookmark_seq.NEXTVAL, 1, 1);

SELECT * FROM bookmark ORDER BY bookmark_no DESC;

COMMIT;
SELECT table_name FROM user_tables;

SELECT * FROM bookmark WHERE user_no = 26 AND trip_no IS NOT NULL;