package dev.mvc.request;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/request")
public class RequestCont {

    @Autowired
    private RequestProcInter requestProc;

    /** ✅ 문의 등록 */
    @PostMapping("/create")
    public int create(@RequestBody RequestVO requestVO) {
        return requestProc.create(requestVO);
    }

    /** ✅ 내 문의 리스트 (기존) */
    @GetMapping("/list/{user_no}")
    public List<RequestVO> listByUser(@PathVariable("user_no") int user_no) {
        return requestProc.listByUser(user_no);
    }

    /** ✅ 관리자용 전체 리스트 (기존) */
    @GetMapping("/admin/list")
    public List<RequestVO> listAll() {
        return requestProc.listAll();
    }

    /** ✅ 단일 읽기 */
    @GetMapping("/read/{request_no}")
    public RequestVO read(@PathVariable("request_no") int request_no) {
        return requestProc.read(request_no);
    }

    /** ✅ 수정 */
    @PutMapping("/update")
    public int update(@RequestBody RequestVO requestVO) {
        return requestProc.update(requestVO);
    }

    /** ✅ 삭제 */
    @DeleteMapping("/delete/{request_no}")
    public int delete(@PathVariable("request_no") int request_no) {
        return requestProc.delete(request_no);
    }

    /** ✅ 통합: 관리자(admin)는 전부, 일반 회원은 본인만 */
    @GetMapping("/listAuto/{user_id}/{user_no}")
    public List<RequestVO> listAuto(
            @PathVariable("user_id") String user_id,
            @PathVariable("user_no") int user_no) {
        if ("admin01".equals(user_id)) {
            return requestProc.listAll();
        } else {
            return requestProc.listByUser(user_no);
        }
    }
    @PutMapping("/updateAnswer")
    public int updateAnswer(@RequestBody RequestVO requestVO) {
        return requestProc.updateAnswer(requestVO);
    }
}
