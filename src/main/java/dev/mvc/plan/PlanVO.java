package dev.mvc.plan;

import jakarta.validation.constraints.NotEmpty;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;

@Setter
@Getter
@ToString
@NoArgsConstructor
public class PlanVO {
  
  /** 여행 번호 (PK) */
  private Integer plan_no;

  /** 제목 */
  @NotEmpty(message="제목은 필수 항목입니다.")
  @Size(min=2, max=50, message="제목은 최소 2자에서 최대 50자입니다.")
  private String title;

  /** 여행 시작일 */
  @NotNull(message="여행 시작일은 필수 항목입니다.")
  private Date start_date;

  /** 여행 종료일 */
  @NotNull(message="여행 종료일은 필수 항목입니다.")
  private Date end_date;

  /** 출발지 */
  @NotEmpty(message="출발지는 필수 항목입니다.")
  @Size(min=2, max=100, message="출발지는 최소 2자에서 최대 100자입니다.")
  private String departure;

  /** 이동 수단 */
  @NotEmpty(message="이동 수단은 필수 항목입니다.")
  @Size(min=1, max=50, message="이동 수단은 최대 50자까지 입력 가능합니다.")
  private String transport;

  /** 인원 수 (문자열로 저장됨) */
  @NotEmpty(message="인원 수는 필수 항목입니다.")
  @Size(min=1, max=100, message="인원 수는 최대 100자까지 입력 가능합니다.")
  private String people_count;

  /** 예산 범위 */
  @NotEmpty(message="예산 정보는 필수 항목입니다.")
  @Size(min=1, max=100, message="예산은 최대 100자까지 입력 가능합니다.")
  private String budget_range;

  /** 회원 번호 (FK) */
  @NotNull(message="회원 번호는 필수 항목입니다.")
  private Integer user_no;
}

