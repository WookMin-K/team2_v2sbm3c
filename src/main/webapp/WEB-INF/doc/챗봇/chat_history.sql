-- 1) 대화 이력용 시퀀스
CREATE SEQUENCE chat_history_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- 2) 대화 이력 테이블
CREATE TABLE chat_history (
  history_id   NUMBER                         NOT NULL,
  user_no      NUMBER                         NOT NULL,  -- users.user_no FK
  role         VARCHAR2(10 CHAR)              NOT NULL,  -- 'human' 또는 'ai'
  content      CLOB                           NOT NULL,  -- 대화 내용
  created_at   TIMESTAMP WITH TIME ZONE       DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_chat_history PRIMARY KEY (history_id),
  CONSTRAINT fk_chat_user FOREIGN KEY (user_no)
    REFERENCES users(user_no)
    ON DELETE CASCADE
);

-- 3) INSERT 시 history_id 자동 채번 트리거
CREATE OR REPLACE TRIGGER trg_chat_history_bi
  BEFORE INSERT ON chat_history
  FOR EACH ROW
BEGIN
  :NEW.history_id := chat_history_seq.NEXTVAL;
END;
/
