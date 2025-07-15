package dev.mvc.plan_spot;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

//CREATE TABLE plan_spot (
//    plan_spot_no  NUMBER(10)    NULL,
//  order_in_day  NUMBER(10)    NULL,
//  plan_day_no NUMBER(10)    NULL,
//  spot_no NUMBER(10)    NOT NULL,
//    PRIMARY KEY (plan_spot_no),
//    FOREIGN KEY (plan_day_no) REFERENCES plan_day (plan_day_no),
//    FOREIGN KEY (spot_no) REFERENCES spot (spot_no)
//);

@Setter
@Getter
@ToString
@NoArgsConstructor
public class Plan_spotVO {
  /** 여행 장소 번호 (PK) */
  private Integer plan_spot_no;

  /** 하루 안에서의 순서 */
  @NotNull(message = "날짜 순서는 필수 항목입니다.")
  private Integer order_in_day;

  /** 여행 일차 번호 (FK) */
  @NotNull(message = "여행 일차 번호는 필수 항목입니다.")
  private Integer plan_day_no;

  /** 장소 번호 (FK) */
  @NotNull(message = "장소 번호는 필수 항목입니다.")
  private Integer spot_no;
}


