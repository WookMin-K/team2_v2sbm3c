package dev.mvc.recommendlog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommend-log")
public class RecommendLogRestCont {

    @Autowired
    @Qualifier("dev.mvc.recommendlog.RecommendLogProc")
    private RecommendLogProcInter recommendLogProc;

    // ✅ 1. 추천 로그 등록 (게스트/회원 공용)
    @PostMapping("/create")
    public int create(@RequestBody RecommendLogVO vo) {
        return recommendLogProc.insert(vo);
    }

    // ✅ 2. 전체 추천 로그 목록
    @GetMapping("/list")
    public List<RecommendLogVO> list() {
        return recommendLogProc.list();
    }

    // ✅ 3. 특정 회원의 추천 로그 조회
    @GetMapping("/list/user/{user_no}")
    public List<RecommendLogVO> listByUser(@PathVariable int user_no) {
        return recommendLogProc.list_by_user(user_no);
    }

    // ✅ 4. 추천 로그 1건 조회
    @GetMapping("/read/{log_id}")
    public RecommendLogVO read(@PathVariable int log_id) {
        return recommendLogProc.read(log_id);
    }

    // ✅ 5. 추천 로그 삭제
    @DeleteMapping("/delete/{log_id}")
    public int delete(@PathVariable int log_id) {
        return recommendLogProc.delete(log_id);
    }

    // ✅ 6. 추천 로그 총 개수
    @GetMapping("/count")
    public int count() {
        return recommendLogProc.count();
    }

}
