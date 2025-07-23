package dev.mvc.post_report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/post")
public class PostReportRestCont {

    @Autowired
    @Qualifier("dev.mvc.post_report.PostReportProc")
    private PostReportProcInter reportProc;

    // 사용자: 게시글 신고
    @PostMapping("/report")
    public ResponseEntity<Map<String,String>> report(@RequestBody PostReportVO vo) {
        try {
            int cnt = reportProc.report(vo);
            if (cnt == 1) {
                return ResponseEntity.ok(Collections.singletonMap("result", "success"));
            } else {
                return ResponseEntity.ok(Collections.singletonMap("result", "fail"));
            }
        }
        catch (RuntimeException e) {
            // 중복신고 같은 커스텀 예외도 여기서 잡아서 메시지를 보냅니다.
            Map<String,String> body = new HashMap<>();
            body.put("result", "fail");
            body.put("message", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(body);
        }
    }
}
