package dev.mvc.plan;

import java.util.ArrayList;
import java.util.List;

public interface PlanDAOInter {

    /** 여행 계획 등록 */
    public int create(PlanVO planVO);
    
    /** 여행 계획 상세 조회 */
    public PlanVO read(int plan_no);

    /** 여행 계획 수정 */
    public int update(PlanVO planVO);

    /** 여행 계획 삭제 */
    public int delete(int plan_no);

    public ArrayList<PlanVO> list_all();
}
