CREATE TABLE reply_report (
  report_no     NUMBER          PRIMARY KEY,
  reply_no      NUMBER          NOT NULL, -- FK to reply(reply_no)
  user_no       NUMBER          NOT NULL, -- FK to users(user_no)
  reason        VARCHAR2(1000)  NOT NULL,
  report_date   DATE            DEFAULT SYSDATE,
  status        CHAR(1)         DEFAULT 'N',  -- N: 미처리, Y: 처리완료
  FOREIGN KEY (reply_no) REFERENCES reply(reply_no) ON DELETE CASCADE,
  FOREIGN KEY (user_no)  REFERENCES users(user_no) ON DELETE CASCADE
);

CREATE SEQUENCE reply_report_seq
  START WITH 1 INCREMENT BY 1 NOCACHE;