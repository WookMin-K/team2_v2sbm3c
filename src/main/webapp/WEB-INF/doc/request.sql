-- user 삭제전에 FK가 선언된 blog 테이블 먼저 삭제합니다.
DROP TABLE request;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE request CASCADE CONSTRAINTS; 

CREATE TABLE request (
    request_no NUMBER PRIMARY KEY,
    user_no NUMBER REFERENCES users(user_no),
    title VARCHAR2(255),
    content CLOB,
    created_at DATE DEFAULT SYSDATE
);

DROP SEQUENCE request_seq;

CREATE SEQUENCE request_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;


ALTER TABLE request ADD file_name VARCHAR2(300)

ALTER TABLE request ADD answer CLOB;
commit;