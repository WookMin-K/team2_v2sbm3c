-- user 삭제전에 FK가 선언된 blog 테이블 먼저 삭제합니다.
DROP TABLE users;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE users CASCADE CONSTRAINTS; 
 
CREATE TABLE users (
    user_no       NUMBER(10)      PRIMARY KEY,                      -- 회원 번호, 레코드를 구분하는 컬럼 
    user_id       VARCHAR(50)     UNIQUE NOT NULL,                  -- 이메일(아이디), 중복 안됨, 레코드를 구분 
    password      VARCHAR(255)    NOT NULL,                         -- 패스워드, 영숫자 조합, 암호화
    email         VARCHAR(100)    UNIQUE NOT NULL,                  -- 이메일
    name          VARCHAR(100)    NOT NULL,                         -- 성명, 한글 
    phone         VARCHAR(20),                                      -- 폰 번호
    created_at    DATE            DEFAULT SYSDATE,                  -- 가입일    
    grade         NUMBER(1)       DEFAULT 1                         -- 등급
                  CHECK (grade BETWEEN 1 AND 5)
);

COMMENT ON TABLE USERS is '회원';
COMMENT ON COLUMN USERS.user_no is '회원 번호';
COMMENT ON COLUMN USERS.user_id is '아이디';
COMMENT ON COLUMN USERS.password is '비밀번호';
COMMENT ON COLUMN USERS.email is '이메일';
COMMENT ON COLUMN USERS.name is '회원 이름';
COMMENT ON COLUMN USERS.phone is '폰 번호';
COMMENT ON COLUMN USERS.created_at is '가입일';
COMMENT ON COLUMN USERS.grade is '등급';

--DROP SEQUENCE users_seq;
SELECT user_id, grade FROM users WHERE user_id = 'admin01';

CREATE SEQUENCE users_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                       -- 2번은 메모리에서만 계산
  NOCYCLE;                     -- 다시 1부터 생성되는 것을 방지
  
  1. 등록
 
1) id 중복 확인(null 값을 가지고 있으면 count에서 제외됨)
SELECT COUNT(user_id)
FROM users
WHERE user_id='hihisun1';

SELECT COUNT(user_id) as cnt
FROM users
WHERE user_id='hihisun950';
 
 cnt
 ---
   0   ← 중복 되지 않음.
   
   2) 등록
-- 회원 관리용 계정
INSERT INTO users(user_no, user_id, password, email, name, phone, created_at, grade)
VALUES (users_seq.nextval, 'hihisun950', 'fS/kjO+fuEKk06Zl7VYMhg==', 'hihisun950@gmail.com', '김민욱', '010-3705-4914', '', '', sysdate, '관리자');
             
 
-- 개인 회원 테스트 계정
INSERT INTO users(user_no, user_id, password, email, name, phone, created_at, grade)
VALUES (users_seq.nextval, 'hihisun', 'fS/kjO+fuEKk06Zl7VYMhg==', 'hihisun950@gmail.com', '김민욱2', '010-3705-4914', '', '', sysdate, '회원');

2. 목록
- 검색을 하지 않는 경우, 전체 목록 출력
 
SELECT user_no, user_id, password, email, name, phone, created_at, grade
FROM users
ORDER BY grade ASC, user_id ASC;

SELECT user_no, user_id, password, email, name, phone, created_at, grade
FROM users
ORDER BY grade ASC, user_id ASC;

COMMIT;
   