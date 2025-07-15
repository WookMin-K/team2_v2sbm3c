package dev.mvc.region;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class RegionVO {
    /** 지역 번호(PK) */
    private int region_no;
    
    /** 지역명 */
    @NotNull(message = "지역명은 필수 항목입니다.")
    private String rname;
    
    /** 지역 이미지 */
    private String rimage;
}
