/*
 * Author: Team BEL
 * Last code change: 21.5.2021
 */

package ch.bbcag.bel.loginServer.controller;

import ch.bbcag.bel.loginServer.common.PasswordHasher;
import ch.bbcag.bel.loginServer.factory.ResponseEntityFactory;
import ch.bbcag.bel.loginServer.model.Authorization;
import ch.bbcag.bel.loginServer.model.User;
import ch.bbcag.bel.loginServer.repository.AuthorizationRepository;
import ch.bbcag.bel.loginServer.repository.UserRepository;
import ch.bbcag.bel.loginServer.request.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@RestController
public class UserController {

    private final UserRepository repository;
    private final AuthorizationRepository authRepository;
    private final String rsaPrivateKey = "KLa0qdUjlFsYYDcKMUXiF5XxN3381YrVI9mb9XGjI+fH7C8cbnB8ugWmTkCE3taU" +
            "VDE/J2+euQLFN7C12350a+9AHRYK/sheALBcZZMTGPhN0pk0/UpbON2CJFOqgvmm" +
            "ET1a4joMbAt7yhLq5Ug5eiVeUPQlqsZm3JobN6al+dvE31TViO+fMCPT+9G8jdI1" +
            "5TUvYf9d6OTCeyKbLYCZlvn78/Hl328++kUqGgzSwjPSKpM3C83uiM1ZUszRTaXo" +
            "c3qXZtiYowbHUbQvozQFkpYiLQq5NXgcEU3S6IvofTBiDmI7mtCkmArX3CddMP2a" +
            "ocSMS1YRLbJWj/DDm/mvrA==";
    private final byte[] key = Base64.getDecoder().decode(rsaPrivateKey);

    public UserController(UserRepository repository, AuthorizationRepository authRepository) {
        this.repository = repository;
        this.authRepository = authRepository;
    }

    @PostMapping("/register")
    /*
    exitCodes
    0: user already exists
    1: success
     */
    public ResponseEntity<String> register(@RequestBody User user) {
        String hashedPassword = PasswordHasher.getsha512(user.getPassword());
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();

        user.setPassword(hashedPassword);

        User checkUser = this.repository.fetchUser(user.getUserName());
        HttpHeaders headers = new HttpHeaders();

        if (checkUser == null) {
            this.repository.insert(user);
            headers.set("Authorization", buildWebToken(user.getUserName()));
            return factory.authorizedEntity("1", headers);
        } else {
            headers.set("Error", "Could not register");
            return factory.authorizedEntity("0", headers);
        }
    }

    @PostMapping("/login")
    /*
    exitCodes:
    0: User does not exist
    1: Login successful
    2: Login unsuccessful
    3: serverside failure/DB failure
     */
    public ResponseEntity<String> login(@RequestBody User user) {
        String hashedPassword = PasswordHasher.getsha512(user.getPassword());
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();

        try {
            User checkUser = this.repository.fetchUser(user.getUserName());
            HttpHeaders headers = new HttpHeaders();

            if (checkUser == null) {
                return factory.unauthorizedEntity("0", null);
            } else if (hashedPassword.equals(checkUser.getPassword())) {
                headers.set("Authorization", buildWebToken(user.getUserName()));
                return factory.authorizedEntity("1", headers);
            } else {
                return factory.unauthorizedEntity("2", null);
            }
        } catch (Exception e) {
            return factory.authorizedEntity("3", null);
        }
    }

    @PostMapping("/updateinfo")
    public ResponseEntity<String> updateProfileInfo(@RequestHeader("Authorization") String token, @RequestBody User requestUser) {
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();
        HttpHeaders headers = new HttpHeaders();

        try {
            Jws<Claims> result = authorizeUser(token);

            if (result != null) {
                User oldUser = this.repository.fetchUser(result.getBody().getSubject());

                requestUser.seteMail(oldUser.geteMail());
                requestUser.setPassword(oldUser.getPassword());
                requestUser.setUserName(oldUser.getUserName());

                this.repository.save(requestUser);
                this.repository.delete(oldUser);

                headers.set("Authorization", buildWebToken(result.getBody().getSubject()));
                return factory.authorizedEntity("1", headers);
            } else {
                headers.set("Authorization", "Unauthorized");
                return factory.unauthorizedEntity("0", headers);
            }
        } catch (ExpiredJwtException e) {
            headers.set("Authorization", "Expired");
            return factory.unauthorizedEntity("2", headers);
        }
    }

    @DeleteMapping("/deleteuser")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String token) {
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();
        HttpHeaders headers = new HttpHeaders();

        try {
            Jws<Claims> result = authorizeUser(token);

            if (result != null) {

                User user = this.repository.fetchUser(result.getBody().getSubject());
                IRequest carRequest = new RequestUtil("http://localhost:8081/deletecarbyuser", "", RequestType.DELETE);

                carRequest.makeCarServerRequest(user.getUserName());

                this.repository.delete(user);
                return factory.authorizedEntity("1", null);
            } else {
                headers.set("Authorization", "Unauthorized");
                return factory.unauthorizedEntity("0", headers);
            }
        } catch (ExpiredJwtException e) {
            headers.set("Authorization", "Expired");
            return factory.unauthorizedEntity("2", headers);
        }
    }


    /**
     * This fetches the profileInfo from an owner e.g. a username
     */
    @GetMapping("/owner")
    public ResponseEntity<User> fetchUserInfo(@RequestParam("name") String userName, @RequestHeader("Authorization") String token) {
        ResponseEntityFactory<User> factory = new ResponseEntityFactory<>();

        if (token.equals("guest")) {
            return factory.authorizedEntity(this.repository.fetchUserInfo(userName), null);
        } else {
            try {
                Jws<Claims> claims = authorizeUser(token);
                HttpHeaders headers = new HttpHeaders();

                if (claims != null) {
                    if (!userName.equals("")) {
                        headers.set("Authorization", buildWebToken(claims.getBody().getSubject()));
                        return factory.authorizedEntity(this.repository.fetchUserInfo(userName), headers);
                    } else {
                        headers.set("Authorization", buildWebToken(claims.getBody().getSubject()));
                        return factory.authorizedEntity(this.repository.fetchUserInfo(claims.getBody().getSubject()), headers);
                    }
                }
            } catch (ExpiredJwtException e) {
                return factory.unauthorizedEntity(null, null);
            }
            return factory.unauthorizedEntity(null, null);
        }
    }

    @GetMapping("/filterowners")
    public ResponseEntity<List<User>> fetchUsers(@RequestParam("name") String userName, @RequestHeader("Authorization") String token) {
        ResponseEntityFactory<List<User>> factory = new ResponseEntityFactory<>();

        if (token.equals("guest")) {
            return factory.authorizedEntity(this.repository.fetchUsers(userName), null);
        } else {
            try {
                Jws<Claims> claims = authorizeUser(token);
                HttpHeaders headers = new HttpHeaders();

                if (claims != null) {
                    if (!userName.equals("")) {
                        headers.set("Authorization", buildWebToken(claims.getBody().getSubject()));
                        return factory.authorizedEntity(this.repository.fetchUsers(userName), headers);
                    } else {
                        headers.set("Authorization", buildWebToken(claims.getBody().getSubject()));
                        return factory.authorizedEntity(this.repository.fetchUsers(claims.getBody().getSubject()), headers);
                    }
                }
            } catch (ExpiredJwtException e) {
                return factory.unauthorizedEntity(null, null);
            }
            return factory.unauthorizedEntity(null, null);
        }
    }


    /**
     * This is the external auth called by other servers e.g. the carServer to read out and validate tokens
     */
    @GetMapping("/authorization")
    /*
        exitCodes:
        0: Unauthorized
        2: Login expired
    */
    public ResponseEntity<String> externalAuth(@RequestHeader("Authorization") String token) {
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();
        HttpHeaders headers = new HttpHeaders();

        try {
            Jws<Claims> result = authorizeUser(token);

            if (result != null) {
                headers.set("Username", result.getBody().getSubject());
                return factory.authorizedEntity(buildWebToken(result.getBody().getSubject()), headers);
            } else {
                headers.set("Authorization", "Unauthorized");
                return factory.authorizedEntity("0", headers);
            }
        } catch (ExpiredJwtException e) {
            headers.set("Authorization", "Expired");
            return factory.authorizedEntity("2", headers);
        }
    }

    @GetMapping("/logout")
    /*
        exitCodes:
        0: Logout error
        1: Logout Successful
     */
    public ResponseEntity<String> logOut(@RequestHeader("Authorization") String token) {
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();

        try {
            Jws<Claims> claims = authorizeUser(token);
        } catch (Exception e) {
            return factory.authorizedEntity("0", null);
        }
        return factory.authorizedEntity("1", null);
    }

    /**
     * This mapping builds a request to the mailServer to send an email with the information given
     */
    @GetMapping("/sendemail")
    public ResponseEntity<String> sendEmail(@RequestHeader("Authorization") String token,
                                            @RequestHeader("to") String receiver,
                                            @RequestHeader("car") String car,
                                            @RequestHeader("start_date") String start_date,
                                            @RequestHeader("end_date") String end_date,
                                            @RequestHeader("emailText") String text,
                                            @RequestHeader("price") String price) {
        ResponseEntityFactory<String> factory = new ResponseEntityFactory<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            Jws<Claims> result = authorizeUser(token);

            if (result != null) {
                String userName = result.getBody().getSubject();
                User user = repository.fetchUserInfo(userName);
                IRequest request = new RequestUtil("http://localhost:8082/send", "", RequestType.GET);
                String response = request.makeEmailServerRequest(receiver, user.geteMail(), car, text, splitString(start_date), splitString(end_date), price);

                if (response.equals("1")) {
                    headers.set("Authorization", buildWebToken(result.getBody().getSubject()));
                    return factory.authorizedEntity("", headers);
                } else {
                    return null;
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    private String buildWebToken(String userName) {
        Instant now = Instant.now();
        UUID uuid = UUID.randomUUID();
        Authorization auth = new Authorization(uuid.toString());

        auth.setDate(now);
        this.authRepository.insert(auth);

        return Jwts.builder()
                .setSubject(userName)
                .setAudience("authorization")
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(5, ChronoUnit.HOURS)))
                .claim("uuid", uuid)
                .signWith(Keys.hmacShaKeyFor(key))
                .compact();
    }

    /**
     * This checks if the token is valid
     * If so it returns a new token and deletes the old one
     */
    private Jws<Claims> authorizeUser(String token) throws ExpiredJwtException {
        try {
            List<Authorization> uuids = this.authRepository.findAll();
            Jws<Claims> result = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(key))
                    .build()
                    .parseClaimsJws(token);
            String uuid = result.getBody().get("uuid").toString();

            if (checkUUID(uuids, uuid)) {
                Authorization auth = this.authRepository.fetchAuth(uuid);

                this.authRepository.delete(auth);
                return result;
            } else {
                return null;
            }
        } catch (SignatureException e) {
            return null;
        }
    }

    /**
     * This method checks if the UUID of the token is valid
     */
    private boolean checkUUID(List<Authorization> uuids, String uuid) {
        for (Authorization auth : uuids) {
            if (auth.getUuid().equals(uuid)) {
                return true;
            }
        }
        return false;
    }

    private String splitString(String date) {
        String[] dateSplit = date.split("12:00:00", 2);
        return dateSplit[0];
    }
}
