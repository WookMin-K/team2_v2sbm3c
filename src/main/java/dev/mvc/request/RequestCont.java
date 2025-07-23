package dev.mvc.request;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import dev.mvc.tool.Tool;
import dev.mvc.users.UsersProcInter;
import dev.mvc.users.UsersVO;

@RestController
@RequestMapping("/request")
public class RequestCont {

    @Autowired
    @Qualifier("dev.mvc.users.UsersProc")
    private UsersProcInter usersProc;
  
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
        int cnt = requestProc.updateAnswer(requestVO);

        // ✅ 답변 등록 후 MMS 전송
        if (cnt == 1) {
            RequestVO targetRequest = requestProc.read(requestVO.getRequest_no());
            int user_no = targetRequest.getUser_no();

            UsersVO user = usersProc.read(user_no);
            String phone = user.getPhone();

            // ✅ MMS 안내 메시지 및 이미지 설정
            String msg = "[여행일정] 문의하신 글에 대한 답변이 등록되었습니다.";
            String imagePath = Tool.getUploadDir() + "answer_notify.jpg"; // 예시 이미지 경로

            File imageFile = new File(imagePath);
            if (imageFile.exists()) {
                try {
                    Tool.sendMMS(phone, msg, imageFile);
                } catch (IOException e) {
                    System.err.println("❌ MMS 전송 중 오류: " + e.getMessage());
                }
            } else {
                System.err.println("❌ 안내 이미지 파일이 존재하지 않습니다: " + imagePath);
            }
        }

        return cnt;
    }
}
