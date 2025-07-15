package dev.mvc.spot;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class SpotVO {
  
  /** 장소 번호(PK) */
  private int spot_no;
  
  /** 장소명 */
  @NotNull(message = " 장소명은 필수 항목입니다. ")
  private String name;
  
  /** 장소 유형 */
  @NotNull(message = " 장소 유형은 필수 항목입니다. ")
  private String type;
  
  /** 장소 설명 */
  private String description; 

  
  /** 자치도 번호(FK)*/
  @NotNull(message = " 자치도 번호는 필수 항목입니다. ")
  private int district_no;
}