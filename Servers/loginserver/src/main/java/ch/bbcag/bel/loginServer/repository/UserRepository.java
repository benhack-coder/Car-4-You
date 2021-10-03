package ch.bbcag.bel.loginServer.repository;

import ch.bbcag.bel.loginServer.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;


public interface UserRepository extends MongoRepository<User, String> {
    @Query(value = "{'userName' : ?0}")
    User fetchUser(String username);

    @Query(value = "{'userName' : ?0}", fields = "{'eMail': 1, 'telNum': 1, 'userName': 1}")
    User fetchUserInfo(String username);

    @Query(value = "{'userName' : {$regex: ?0}}}", fields = "{'eMail': 1, 'telNum': 1, 'userName': 1}")
    List<User> fetchUsers(String username);
}
