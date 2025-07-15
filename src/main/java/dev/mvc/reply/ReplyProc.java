package dev.mvc.reply;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.reply.ReplyProc")
public class ReplyProc implements ReplyProcInter {

  @Autowired
  private ReplyDAOInter replyDAO;

  /** 댓글 또는 대댓글 등록 */
  @Override
  public int create(ReplyVO replyVO) {
    return replyDAO.create(replyVO);
  }

  /** 게시글별 댓글 목록 조회 */
  @Override
  public List<ReplyVO> list_by_post(int post_no) {
    return replyDAO.list_by_post(post_no);
  }

  /** 내가 쓴 댓글 조회 */
  @Override
  public List<ReplyVO> list_by_user(int user_no) {
    return replyDAO.list_by_user(user_no);
  }

  /** 댓글 수정 */
  @Override
  public int update(ReplyVO replyVO) {
    return replyDAO.update(replyVO);
  }

  /** 댓글 삭제 */
  @Override
  public int delete(int reply_no) {
    return replyDAO.delete(reply_no);
  }

  /** 댓글 1건 조회 (수정용) */
  @Override
  public ReplyVO read(int reply_no) {
    return replyDAO.read(reply_no);
  }
}
