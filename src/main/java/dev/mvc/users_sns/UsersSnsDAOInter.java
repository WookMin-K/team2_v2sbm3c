package dev.mvc.users_sns;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UsersSnsDAOInter {
    int create(UsersSnsVO vo);
    int checkSnsId(String provider_no);
}
