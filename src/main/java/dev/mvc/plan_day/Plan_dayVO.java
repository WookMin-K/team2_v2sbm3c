package dev.mvc.plan_day;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;

@Setter @Getter @ToString @NoArgsConstructor
public class Plan_dayVO {
  /** 여행 일자 번호 (PK) */
  private Integer plan_day_no;

  /** 일차 */
  @NotNull(message="일차는 필수 항목입니다.")
  private Integer day_order;

  /** 실제 날짜 */
  @NotNull(message="실제 날짜는 필수 항목입니다.")
  private Date pdate;

  /** 여행 번호 (FK) */
  @NotNull(message="여행 번호는 필수 항목입니다.")
  private Integer plan_no;
}
