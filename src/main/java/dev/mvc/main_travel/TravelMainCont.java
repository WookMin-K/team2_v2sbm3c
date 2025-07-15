package dev.mvc.main_travel;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/travel")
public class TravelMainCont {

    @Autowired
    private TravelMainProc travelMainProcInter;

    /** ✅ 여러 개 일정 한꺼번에 저장 */
    @PostMapping("/createList")
    public String createList(@RequestBody List<TravelMainVO> planList) {
        System.out.println(planList);
        for (TravelMainVO vo : planList) {
            travelMainProcInter.create(vo);
        }

        return "success";
    }

    /** ✅ 특정 회원의 일정 목록 조회 */
    @GetMapping("/list/{user_no}")
    public List<TravelMainVO> listByUserNo(@PathVariable("user_no") int user_no) {
        return travelMainProcInter.listByUserNo(user_no);
    }

    /** ✅ 특정 회원의 일정 모두 삭제 (옵션) */
    @DeleteMapping("/delete/{user_no}")
    public String deleteByUserNo(@PathVariable("user_no") int user_no) {
        travelMainProcInter.deleteByUserNo(user_no);
        return "deleted";
    }
}
