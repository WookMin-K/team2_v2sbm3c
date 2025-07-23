package dev.mvc.reply_report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reply")
public class ReplyReportRestCont {
    @Autowired
    @Qualifier("dev.mvc.reply_report.ReplyReportProc")
    private ReplyReportProcInter reportProc;

    @PostMapping("/report")
    public ResponseEntity<Map<String,String>> report(@RequestBody ReplyReportVO vo) {
        try {
            int cnt = reportProc.report(vo);
            if (cnt == 1) {
                return ResponseEntity.ok(Collections.singletonMap("result","success"));
            } else {
                return ResponseEntity.ok(Collections.singletonMap("result","fail"));
            }
        } catch(RuntimeException e) {
            Map<String,String> body = new HashMap<>();
            body.put("result", "fail");
            body.put("message", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(body);
        }
    }

    @GetMapping("/reports")
    public List<ReplyReportVO> listReports() {
        return reportProc.listAll();
    }
}