package dev.mvc.users_sns;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users_sns")
public class UsersSnsCont {

    @Autowired
    @Qualifier("dev.mvc.users_sns.UsersSnsProc")
    private UsersSnsProcInter usersSnsProc;

    @PostMapping("/create")
    public String create(@RequestBody UsersSnsVO vo) {
        int cnt = usersSnsProc.create(vo);
        return cnt == 1 ? "success" : "fail";
    }

    @GetMapping("/check")
    public String check(@RequestParam String provider_no) {
        int cnt = usersSnsProc.checkSnsId(provider_no);
        return cnt == 0 ? "new" : "exists";
    }
}
