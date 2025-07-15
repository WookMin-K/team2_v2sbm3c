package dev.mvc.comment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.comment.CommentProc")
public class CommentProc implements CommentProcInter {

  @Autowired
  private CommentDAOInter commentDAO;

  @Override
  public int getCommentNo() {
    return commentDAO.getCommentNo();
  }

  @Override
  public int create(CommentVO commentVO) {
    return commentDAO.create(commentVO);
  }

  @Override
  public List<CommentVO> list_by_post_no(int post_no) {
    return commentDAO.list_by_post_no(post_no);
  }

  @Override
  public CommentVO read(int comment_no) {
    return commentDAO.read(comment_no);
  }

  @Override
  public int update(CommentVO commentVO) {
    return commentDAO.update(commentVO);
  }

  @Override
  public int delete(int comment_no) {
    return commentDAO.delete(comment_no);
  }

  @Override
  public int delete_by_post_no(int post_no) {
    return commentDAO.delete_by_post_no(post_no);
  }
}
