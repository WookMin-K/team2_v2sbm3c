package dev.mvc.bookmark;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 즐겨찾기 정보를 저장하는 VO 클래스
 * - 여행지(trip) 또는 게시글(post) 중 하나만 선택 가능
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
public class BookmarkVO {

  /** 즐겨찾기 번호 (PK) */
  private Integer bookmark_no;

  /** 여행지 번호 (nullable) */
  private Integer trip_no;

  /** 게시글 번호 (nullable) */
  private Integer post_no;

  /** 회원 번호 (FK) */
  private Integer user_no;
}
