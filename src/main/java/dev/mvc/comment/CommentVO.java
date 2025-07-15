package dev.mvc.comment;

import java.sql.Date;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@NoArgsConstructor
public class CommentVO {
  /** 댓글 번호 (PK) */
  private Integer comment_no;

  /** 댓글 내용 */
  @NotBlank(message = "댓글 내용은 필수 항목입니다.")
  private String content;

  /** 작성일 */
  private Date created_day;

  /** 게시글 번호 (FK) */
  private Integer post_no;

  /** 사용자 번호 (FK) */
  @NotNull(message = "작성자 번호는 필수 항목입니다.")
  private Integer user_no;
}
