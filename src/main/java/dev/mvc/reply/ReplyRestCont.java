package dev.mvc.reply;

import dev.mvc.reply.ReplyProcInter;
import dev.mvc.reply.ReplyVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reply") // React와 맞는 경로
public class ReplyRestCont {

    @Autowired
    @Qualifier("dev.mvc.reply.ReplyProc")
    private ReplyProcInter replyProc;

    // ✅ 댓글 등록
    @PostMapping("/create")
    public Map<String, Object> create(@RequestBody ReplyVO replyVO) {
        int cnt = replyProc.create(replyVO);

        Map<String, Object> result = new HashMap<>();
        result.put("result", cnt == 1 ? "success" : "fail");
        return result;
    }

    // ✅ 게시글별 댓글 목록
    @GetMapping("/list/{post_no}")
    public List<ReplyVO> listByPost(@PathVariable("post_no") int post_no) {
        return replyProc.list_by_post(post_no);
    }

    // ✅ 댓글 삭제
    @DeleteMapping("/delete/{reply_no}")
    public Map<String, Object> delete(@PathVariable("reply_no") int reply_no) {
        int cnt = replyProc.delete(reply_no);
        Map<String, Object> result = new HashMap<>();
        result.put("result", cnt == 1 ? "success" : "fail");
        return result;
    }

    // ✅ 댓글 수정
    @PutMapping("/update")
    public Map<String, Object> update(@RequestBody ReplyVO replyVO) {
        int cnt = replyProc.update(replyVO);
        Map<String, Object> result = new HashMap<>();
        result.put("result", cnt == 1 ? "success" : "fail");
        return result;
    }
}
