package dev.mvc.reply;

import dev.mvc.reply.ReplyProcInter;
import dev.mvc.reply.ReplyVO;
import dev.mvc.reply_like.ReplyLikeProcInter;
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

    @Autowired
    @Qualifier("dev.mvc.reply.ReplyLikeProc")
    private ReplyLikeProcInter replyLikeProc;

    //  댓글 등록
    @PostMapping("/create")
    public Map<String, Object> create(@RequestBody ReplyVO replyVO) {
        int cnt = replyProc.create(replyVO);

        Map<String, Object> result = new HashMap<>();
        result.put("result", cnt == 1 ? "success" : "fail");
        return result;
    }

    //  게시글별 댓글 목록
    @GetMapping("/list/{post_no}")
    public List<ReplyVO> listByPost(@PathVariable("post_no") int post_no) {
        return replyProc.list_by_post(post_no);
    }

    // 댓글 삭제
    @DeleteMapping("/delete/{reply_no}")
    public Map<String, Object> delete(@PathVariable("reply_no") int reply_no) {
        int cnt = replyProc.delete(reply_no);

        Map<String, Object> result = new HashMap<>();
        result.put("result", cnt == 1 ? "success" : "fail");
        return result;
    }

    //  댓글 수정
    @PutMapping("/update")
    public Map<String, Object> update(@RequestBody ReplyVO replyVO) {
        int cnt = replyProc.update(replyVO);
        Map<String, Object> result = new HashMap<>();
        result.put("result", cnt == 1 ? "success" : "fail");
        return result;
    }

    // 좋아요
    @PostMapping("/like")
    public Map<String, Object> likeToggle(@RequestParam("reply_no") int reply_no,
                                          @RequestParam("user_no") int user_no) {
        Map<String, Object> param = new HashMap<>();
        param.put("reply_no", reply_no);
        param.put("user_no", user_no);

        int isLiked = replyLikeProc.isLiked(param);
        if (isLiked == 0) {
            replyLikeProc.insertLike(param);
        } else {
            replyLikeProc.deleteLike(param);
        }

        int likeCount = replyLikeProc.countLikes(reply_no);

        Map<String, Object> result = new HashMap<>();
        result.put("liked", isLiked == 0);
        result.put("likeCount", likeCount);
        return result;
    }

    @GetMapping("/like/status")
    public Map<String, Object> getLikeStatus(@RequestParam("reply_no") int reply_no, @RequestParam("user_no") int user_no) {
        Map<String, Object> param = new HashMap<>();
        param.put("reply_no", reply_no);
        param.put("user_no", user_no);

        int isLiked = replyLikeProc.isLiked(param);
        int likeCount = replyLikeProc.countLikes(reply_no);

        Map<String, Object> result = new HashMap<>();
        result.put("liked", isLiked > 0);
        result.put("likeCount", likeCount);
        return result;
    }
}
