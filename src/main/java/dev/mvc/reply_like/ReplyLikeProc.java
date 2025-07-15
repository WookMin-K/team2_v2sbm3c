package dev.mvc.reply_like;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service("dev.mvc.reply.ReplyLikeProc")
public class ReplyLikeProc implements ReplyLikeProcInter {

    @Autowired
    private ReplyLikeDAOInter replyLikeDAO;

    @Override
    public int insertLike(Map<String, Object> map) {
        return replyLikeDAO.insertLike(map);
    }

    @Override
    public int deleteLike(Map<String, Object> map) {
        return replyLikeDAO.deleteLike(map);
    }

    @Override
    public int countLikes(int reply_no) {
        return replyLikeDAO.countLikes(reply_no);
    }

    @Override
    public int isLiked(Map<String, Object> map) {
        return replyLikeDAO.isLiked(map);
    }
}
