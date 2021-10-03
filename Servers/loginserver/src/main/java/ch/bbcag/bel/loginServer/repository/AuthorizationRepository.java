package ch.bbcag.bel.loginServer.repository;

import ch.bbcag.bel.loginServer.model.Authorization;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.UUID;

public interface AuthorizationRepository extends MongoRepository<Authorization, String> {
    @Query(value = "{'uuid' : ?0}")
    Authorization fetchAuth(String uuid);
}
