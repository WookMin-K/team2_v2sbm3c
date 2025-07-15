package dev.mvc.comment;

import java.util.List;

public interface CommentDAOInter {

  /**
   * 댓글 번호 시퀀스 생성
   * @return 새로운 댓글 번호
   */
  public int getCommentNo();

  /**
   * 댓글 등록
   * @param commentVO
   * @return 등록된 레코드 수
   */
  public int create(CommentVO commentVO);

  /**
   * 특정 게시글의 댓글 목록 조회
   * @param post_no
   * @return 댓글 목록
   */
  public List<CommentVO> list_by_post_no(int post_no);

  /**
   * 댓글 상세 조회
   * @param comment_no
   * @return 댓글 정보
   */
  public CommentVO read(int comment_no);

  /**
   * 댓글 수정
   * @param commentVO
   * @return 수정된 레코드 수
   */
  public int update(CommentVO commentVO);

  /**
   * 댓글 삭제
   * @param comment_no
   * @return 삭제된 레코드 수
   */
  public int delete(int comment_no);

  /**
   * 특정 게시글의 모든 댓글 삭제
   * @param post_no
   * @return 삭제된 레코드 수
   */
  public int delete_by_post_no(int post_no);
}
