package dev.mvc.district;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class DistrictVO {
  
  /** 자치구 번호(PK)  */
  private int district_no;
  
  /** 자치구명*/
  @NotNull(message = " 자치구명은 필수 항목입니다.")
  private String dname;
  
  /** 지역 번호(FK)*/
  @NotNull(message = " 지역 번호는 필수 항목입니다. ")
  private int region_no;
  
  /**시도 이미지*/
  @NotNull(message = " 이미지 첨부는 필수 항목입니다.")
  private String dimage;
}