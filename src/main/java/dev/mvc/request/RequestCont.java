package dev.mvc.request;

import java.io.File;
import java.io.IOException;
import java.util.List;

import dev.mvc.tool.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;
import dev.mvc.users.UsersVO;
import dev.mvc.users.UsersProcInter;
import dev.mvc.sms.MMSImageGenerator;
@RestController
@RequestMapping("/request")
public class RequestCont {

    @Autowired
    private RequestProcInter requestProc;

    @Autowired
    @Qualifier("dev.mvc.users.UsersProc")
    private UsersProcInter usersProc;
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
            return requestProc.listUnanswered();
        } else {
            return requestProc.listByUser(user_no);
        }
    }


    @PutMapping("/updateAnswer")
    public int updateAnswer(@RequestBody RequestVO requestVO) {
        int cnt = requestProc.updateAnswer(requestVO);

        if (cnt == 1) {
            RequestVO targetRequest = requestProc.read(requestVO.getRequest_no());
            int user_no = targetRequest.getUser_no();
            UsersVO user = usersProc.read(user_no);
            String phone = user.getPhone();

            // ✅ 안내 메시지
            String msg = "[여행일정] 문의하신 글에 대한 답변이 등록되었습니다. 이미지를 참고하세요.";

            try {
                // ✅ 1. 이미지 내용 생성 (답변 내용을 기반으로 텍스트 구성)
                String content = "문의하신 내용에 대한\n답변이 등록되었습니다.\n\n" +
                        "답변 내용:\n" + targetRequest.getAnswer();

                // ✅ 2. 이미지 생성
                String baseImage = Tool.getUploadDir() + "answer_notify.jpg"; // 배경 이미지
                String outputImage = Tool.getUploadDir() + "mms_output.jpg";

                File generatedImage = MMSImageGenerator.createAnswerImage(baseImage, outputImage, content);

                // ✅ 3. MMS 전송
                Tool.sendMMS(phone, msg, generatedImage);

            } catch (IOException e) {
                System.err.println("❌ MMS 생성 또는 전송 오류: " + e.getMessage());
            }
        }
        return cnt;
    }
}
