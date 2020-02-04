package edu.pw.react.project.restapi.controller;

import edu.pw.react.project.backend.dao.FlatRepository;
import edu.pw.react.project.backend.dao.ImageRepository;
import edu.pw.react.project.backend.model.FlatEntity;
import edu.pw.react.project.backend.model.ImageEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collection;

@RestController
@RequestMapping(path = "/images")
public class ImageController {
    private ImageRepository imageRepository;

    @Autowired
    public ImageController(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @GetMapping(path = "")
    public ResponseEntity<Collection<ImageEntity>> getAllImages() {
        System.out.println("Getting all images");
        return ResponseEntity.ok(imageRepository.findAll());
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @PostMapping(value = "")
    @Transactional
    public ResponseEntity<ImageEntity> createImage(@Valid @RequestBody ImageEntity image) {
        imageRepository.deleteImageOfRoom(image.getRoom_id());
        return new ResponseEntity<>(imageRepository.save(image), HttpStatus.OK);
    }
}
