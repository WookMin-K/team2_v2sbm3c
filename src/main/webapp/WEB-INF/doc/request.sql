CREATE TABLE request(
    request_no   NUMBER(10) PRIMARY KEY,
    user_no       NUMBER(10) NOT NULL, -- FK
    title         VARCHAR2(200) NOT NULL,
    content       CLOB,
    created_at    DATE DEFAULT SYSDATE,
    answer        CLOB,
    answered_at   DATE,
    FOREIGN KEY (user_no) REFERENCES users(user_no)
);
CREATE SEQUENCE request_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;


ALTER TABLE request ADD file_name VARCHAR2(300)
commit;