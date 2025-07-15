package dev.mvc.review;

import java.sql.Date;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class ReviewVO {
  /** 리뷰 번호 (PK) */
  private Integer review_no;

  /** 평점 (1~5점) */
  @Min(value = 1, message = "최소 평점은 1점입니다.")
  @Max(value = 5, message = "최대 평점은 5점입니다.")
  private Integer rating;

  /** 리뷰 내용 */
  private String content;

  /** 작성일 */
  private Date created_day;

  /** 사용자 번호 (FK) */
  @NotNull(message = "작성자 번호는 필수 항목입니다.")
  private Integer user_no;

  /** 장소 번호 (FK) */
  @NotNull(message = "장소 번호는 필수 항목입니다.")
  private Integer spot_no;
}
