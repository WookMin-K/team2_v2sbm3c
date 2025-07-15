package dev.mvc.trip;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@NoArgsConstructor
public class TripVO {
  /** 여행지 번호(PK) */
  // @NotNull(message = "여행지 번호는 필수 항목입니다.") // (INSERT 시 주석처리)
  private Integer trip_no;

  /** 여행지 명 */
  @NotNull(message = "여행지 명은 필수 항목입니다.")
  private String tname;

  /** 여행지 사진 URL */
  private String image;

  /** 여행지 소개글 */
  private String intro;

  /** 등록일( java.sql.Date) */
  private java.sql.Date tnew;

  /** 조회 수 */
  private Integer viewcnt;

  /** 맛집 링크 */
  private String url_1;

  /** 숙소 링크 */
  private String url_2;

  /** 행정동/시군구 이름 */
  private String sname;

  /** 소속 구군(외래키) */
  private Integer district_no;

  /** 키워드 목록 (쉼표로 구분된 감성 키워드 문자열) */
  private String keywords;
  
  private Integer region_no;
  
  private String dname;
  
  
} 
