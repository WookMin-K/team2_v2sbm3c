package dev.mvc.post_report;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import dev.mvc.reply_report.ReplyReportProcInter;
import dev.mvc.reply_report.ReplyReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminReportRestCont {

    @Autowired
    @Qualifier("dev.mvc.post_report.PostReportProc")
    private PostReportProcInter reportProc;

    @Autowired
    @Qualifier("dev.mvc.reply_report.ReplyReportProc")
    private ReplyReportProcInter replyReportProc;

    // 관리자가 호출해서 신고 전체 목록을 가져오는 엔드포인트
    @GetMapping("/reports")
    public List<PostReportVO> listReports() {
        return reportProc.listAll();
    }

    @GetMapping("/reply_reports")
    public List<ReplyReportVO> listReplyReports() {
        return replyReportProc.listAll();
    }
    @PostMapping("/report")
    public Map<String,Object> report(@RequestBody PostReportVO vo) {
        int cnt = reportProc.report(vo);
        return Collections.singletonMap("result", cnt == 1 ? "success" : "fail");
    }
}