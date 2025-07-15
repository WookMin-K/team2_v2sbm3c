package dev.mvc.reply_like;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Setter
@Getter
@ToString
@NoArgsConstructor
public class ReplyLikeVO {
    /** 게시글 번호 (PK) */
    private int reply_like_no;

    /** 좋아요 누른 댓글 (FK) */
    private int reply_no;

    /** 좋아요 누른 회원 (FK) */
    private int user_no;

    /**  좋아요 누른 시간 */
    private Date liked_day;
}
