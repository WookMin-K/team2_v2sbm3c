package dev.mvc.users_sns;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.users_sns.UsersSnsProc")
public class UsersSnsProc implements UsersSnsProcInter {

    @Autowired
    private UsersSnsDAOInter usersSnsDAO;

    @Override
    public int create(UsersSnsVO vo) {
        return usersSnsDAO.create(vo);
    }

    @Override
    public int checkSnsId(String provider_no) {
        return usersSnsDAO.checkSnsId(provider_no);
    }
}
