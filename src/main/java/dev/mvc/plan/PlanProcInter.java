package dev.mvc.plan;

import java.util.ArrayList;
import java.util.List;

public interface PlanProcInter {

    /** 1. 여행 계획 등록 */
    public int create(PlanVO planVO);

    /** 2. 여행 계획 상세 조회 */
    public PlanVO read(int plan_no);

    /** 3. 여행 계획 수정 */
    public int update(PlanVO planVO);

    /** 4. 여행 계획 삭제 */
    public int delete(int plan_no);

    /** 5. 여행 계획 삭제 */
    ArrayList<PlanVO> list_all();

}
