package dev.mvc.recommendlog;

import java.util.Date;

public class RecommendLogVO {

  private Integer log_id;            // 추천 로그 고유번호 (PK)
  private Integer user_no;           // 회원 번호 (nullable)
  private String session_id;         // 비회원 세션 식별자
  private String keywords;           // 선택 키워드 (JSON 문자열)
  private Integer trip_no;           // 추천된 여행지 번호
  private String result_summary;     // AI 분석 결과 요약 문장
  private Date timestamp;            // 추천 시각

  // ───── Getters & Setters ─────

  public Integer getLog_id() {
    return log_id;
  }

  public void setLog_id(Integer log_id) {
    this.log_id = log_id;
  }

  public Integer getUser_no() {
    return user_no;
  }

  public void setUser_no(Integer user_no) {
    this.user_no = user_no;
  }

  public String getSession_id() {
    return session_id;
  }

  public void setSession_id(String session_id) {
    this.session_id = session_id;
  }

  public String getKeywords() {
    return keywords;
  }

  public void setKeywords(String keywords) {
    this.keywords = keywords;
  }

  public Integer getTrip_no() {
    return trip_no;
  }

  public void setTrip_no(Integer trip_no) {
    this.trip_no = trip_no;
  }

  public String getResult_summary() {
    return result_summary;
  }

  public void setResult_summary(String result_summary) {
    this.result_summary = result_summary;
  }

  public Date getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(Date timestamp) {
    this.timestamp = timestamp;
  }

}
