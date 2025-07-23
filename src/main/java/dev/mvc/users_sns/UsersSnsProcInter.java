package dev.mvc.users_sns;

public interface UsersSnsProcInter {
    int create(UsersSnsVO vo);
    int checkSnsId(String provider_no);
}
