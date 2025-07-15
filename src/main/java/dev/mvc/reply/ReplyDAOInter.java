package dev.mvc.reply;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ReplyDAOInter {

//  /**
//   * 댓글 번호 시퀀스 생성
//   * @return 새로운 댓글 번호
//   */
//  public int getReplyNo();

  /**
   * 댓글 또는 대댓글 등록
   * @param replyVO 등록할 댓글 정보
   * @return 등록된 레코드 수 (1: 성공, 0: 실패)
   */
  public int create(ReplyVO replyVO);

  /**
   * 특정 게시글에 달린 댓글/대댓글 전체 조회
   * @param post_no
   * @return 댓글 목록
   */
  public List<ReplyVO> list_by_post(int post_no);

  /**
   * 특정 사용자가 작성한 댓글/대댓글 목록 조회 (마이페이지용)
   * @param user_no
   * @return 댓글 정보
   */
  public List<ReplyVO> list_by_user(int user_no);

  /**
   * 댓글 수정
   * @param replyVO
   * @return 수정된 레코드 수sss
   */
  public int update(ReplyVO replyVO);

  /**
   * 댓글 삭제
   * @param reply_no
   * @return 삭제된 레코드 수
   */
  public int delete(int reply_no );

  /**
   * 댓글/대댓글 1건 조회 (수정 전 데이터 불러올 때 사용)
   * @param reply_no
   * @return ReplyVO
   */
  public ReplyVO read(int reply_no);
}
