//package dev.mvc.users;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//
//import jakarta.servlet.http.HttpSession;
//
///**
// * DAO를 호출하는 비즈니스 로직을 정의한 인터페이스
// */
//public interface UsersProcInter {
//
//  /** 아이디 중복 체크 */
//  public int checkID(String user_id);
//
//  /** 회원 가입 */
//  public int create(UsersVO usersVO);
//
//  /** 전체 회원 목록 조회 */
//  public ArrayList<UsersVO> list();
//
//  /** 회원 번호로 상세 조회 */
//  public UsersVO read(int user_no);
//
//  /** 아이디로 회원 정보 조회 */
//  public UsersVO readById(String user_id);
//
//  /** 회원 / 관리자인지 검사 */
//  public boolean isUsers(HttpSession session);
//
//  /** 관리자인지 검사 */
//  public boolean isAdmin(HttpSession session);
//
//  /** 마이페이지 사용자 정보 수정 */
//  public int update_User(UsersVO usersVO);
//
//  /** 관리자 전용 사용자 정보 수정 */
//  public int update_Admin(UsersVO usersVO);
//
//  /** 회원 삭제 */
//  public int delete(int user_no);
//
//  /** 로그인 검사 (아이디 + 비밀번호) */
//  public int login(HashMap<String, Object> map);
//
//  /** 현재 비밀번호 일치 여부 확인 */
//  public int passwd_check(HashMap<String, Object> map);
//
//  /** 비밀번호 변경 */
//  public int passwd_update(HashMap<String, Object> map);
//}
package dev.mvc.users;

import java.util.ArrayList;
import java.util.HashMap;

import jakarta.servlet.http.HttpSession;

/**
 * DAO를 호출하는 비즈니스 로직을 정의한 인터페이스
 */
public interface UsersProcInter {

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

  /** 암호화된 비밀번호를 조회해서 입력된 값과 비교 */
  public boolean getHashedPassword(int user_no, String inputPassword);

  /** 암호화하여 비밀번호 변경 처리 */
  public int passwd_update(int user_no, String newPassword);
}

