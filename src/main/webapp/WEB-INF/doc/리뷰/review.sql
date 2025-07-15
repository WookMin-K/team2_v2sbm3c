DROP TABLE review;
DROP TABLE review CASCADE CONSTRAINTS;

CREATE TABLE review(
	review_no	NUMBER(10)		NOT NULL,
	rating	NUMBER(10)		NULL,
	content	VARCHAR(255)		NULL,
	created_day	DATE	DEFAULT CURRENT_TIMESTAMP	NULL,
	user_no	NUMBER(10)		NOT NULL,
	spot_no	NUMBER(10)		NOT NULL,
    PRIMARY KEY (review_no),
    FOREIGN KEY (user_no) REFERENCES users (user_no),
    FOREIGN KEY (spot_no) REFERENCES spot (spot_no)
);

COMMENT ON COLUMN review is '리뷰';

COMMENT ON COLUMN review.review_no is '리뷰 번호';

COMMENT ON COLUMN review.rating is '평점 (1~5점)';

COMMENT ON COLUMN review.content is '리뷰 내용';

COMMENT ON COLUMN review.created_day is '작성일시';

DROP SEQUENCE review_SEQ;

CREATE SEQUENCE PER_SEQ
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지