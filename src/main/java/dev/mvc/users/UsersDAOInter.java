package dev.mvc.users;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpSession;
import org.apache.ibatis.annotations.Mapper;

/**
 * MyBatis <-> Mapper XML 연결을 위한 DAO 인터페이스
 */
@Mapper
public interface UsersDAOInter {

  /** 아이디 중복 체크 */
  public int checkID(String user_id);

  /** 이메일 중복 체크 */
  public int checkEmail(String email);

  /** 회원 가입 */
  public int create(UsersVO usersVO);

  /** 전체 회원 목록 조회 */
  public ArrayList<UsersVO> list();

  /** 회원 번호로 상세 조회 */
  public UsersVO read(int user_no);

  /** 아이디로 회원 정보 조회 */
  public UsersVO readById(String user_id);

  /** 회원 / 관리자인지 검사 */
  public boolean isUsers(HttpSession session);

  /** 관리자인지 검사 */
  public boolean isAdmin(HttpSession session);

  /** 마이페이지 사용자 정보 수정 */
  public int update_User(UsersVO usersVO);

  /** 관리자 전용 사용자 정보 수정 */
  public int update_Admin(UsersVO usersVO);

  /** 회원 삭제 */
  public int delete(int user_no);

  /** 로그인 검사 (아이디 + 비밀번호) */
  public int login(HashMap<String, Object> map);


  /** 현재 비밀번호 일치 여부 확인 (평문 비교용) */
  public int passwd_check(HashMap<String, Object> map);

  /** 비밀번호 변경 (암호화된 비밀번호 저장용) */
  public int passwd_update(HashMap<String, Object> map);

  /** 암호화된 비밀번호 가져오기 (user_no 기준) */
  public String getHashedPassword(int user_no);
  
  public List<UsersVO> listWithPaging(Map<String, Object> map);

  public int countAll(Map<String, Object> map);

  public int updateProfileUrl(UsersVO usersVO);

  public UsersVO readByEmail(String email);

  public int checkSnsId(String provider_no);

}
