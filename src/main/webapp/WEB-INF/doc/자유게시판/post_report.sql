CREATE TABLE post_report (
  report_no    NUMBER            PRIMARY KEY,            -- 신고 고유번호
  post_no      NUMBER            NOT NULL,               -- 신고 대상 게시글 번호 (FK)
  user_no      NUMBER            NOT NULL,               -- 신고한 회원 번호 (FK)
  reason       VARCHAR2(1000)    NOT NULL,               -- 신고 사유
  report_date  DATE              DEFAULT SYSDATE,        -- 신고일시
  status       CHAR(1)           DEFAULT 'N'             -- 처리상태 (N: 미처리, Y: 처리완료)
  ,FOREIGN KEY(post_no) REFERENCES post(post_no) ON DELETE CASCADE
  ,FOREIGN KEY(user_no) REFERENCES users(user_no) ON DELETE CASCADE
);

CREATE SEQUENCE post_report_seq
  START WITH 1 INCREMENT BY 1 NOCACHE;