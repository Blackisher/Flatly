package edu.pw.react.project.restapi.controller;

import edu.pw.react.project.backend.dao.UserRepository;
import edu.pw.react.project.backend.model.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/users")
public class UserController {
    private UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
        UserEntity u = userRepository.findById(id).orElseGet(UserEntity::new);
        return new ResponseEntity<>(u, HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @PostMapping(path = "")
    public ResponseEntity<UserEntity> checkUser(@RequestBody UserEntity userEntity) {
        UserEntity u = userRepository.findByLogin(userEntity.getLogin());
        if (u == null) {
            throw new ResourceNotFoundException(
                    "Creditials are not correct: " + userEntity.getId());
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12); // Strength set as 12
        if (encoder.matches(userEntity.getPassword(), u.getPassword())) {
            return new ResponseEntity<>(u, HttpStatus.OK);
        }
        return new ResponseEntity<>(u, HttpStatus.NOT_FOUND);
    }

    @CrossOrigin(origins = "*")
    @PostMapping(value = "/{id}")
    public ResponseEntity<UserEntity> updateUser(@RequestBody UserEntity user) {
        long id = user.getId();
        if (!userRepository.existsById(id))
            throw new ResourceNotFoundException(
                    "There is no user with this id: " + user.getId());
        return new ResponseEntity<>(userRepository.saveAndFlush(userRepository.save(user)), HttpStatus.OK);
    }
}
