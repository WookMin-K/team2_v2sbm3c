package dev.mvc.post;

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
public class PostVO {
  /** 게시글 번호 (PK) */
  private Integer post_no;

  /** 게시글 제목 */
  @NotBlank(message = "제목은 필수 항목입니다.")
  private String title;

  /** 게시글 내용 */
  @NotBlank(message = "내용은 필수 항목입니다.")
  private String content;

  /** 작성일 */
  private Date created_day;

  /** 조회수 */
  private int view_cnt = 0;

  /** 고정글 */
  private String notice_yn;

  /** 글쓴이 이름(users.name) */
  private String name;

  // 이미지

  /** 저장 파일명 */
  private String image;
  /** 원본 파일명 */
  private String image_org;
  /** MIME 타입 */
  private String image_type;
  /** 크기 */
  private Long image_size;

  // 파일

  /** 저장 파일명 */
  private String files;
  /** 원본 파일명 */
  private String file_org;
  /** MIME 타입 */
  private String file_type;
  /** 크기 */
  private Long file_size;

  /** 작성자 회원 번호 (FK) */
  @NotNull(message = "작성자 번호는 필수 항목입니다.")
  private Integer user_no;
}

