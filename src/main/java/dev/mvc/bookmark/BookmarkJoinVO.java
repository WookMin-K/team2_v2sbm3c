package dev.mvc.bookmark;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;

/**
 * 즐겨찾기 + 여행지 or 게시글 + 사용자 정보를 담는 통합 VO (JOIN 결과용)
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
public class BookmarkJoinVO {
  private Integer bookmark_no;
  private Integer user_no;
  private String user_name;

  private String type; // "trip" or "post"

  // trip 관련
  private Integer trip_no;
  private String trip_title;
  private String sname;
  private String image;
  private String intro;
  private String tnew;
  private Integer viewcnt;

  // post 관련
  private Integer post_no;
  private String post_title;
  private String created_day;
}
