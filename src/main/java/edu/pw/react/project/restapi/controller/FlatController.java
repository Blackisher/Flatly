package edu.pw.react.project.restapi.controller;

import edu.pw.react.project.backend.dao.FlatRepository;
import edu.pw.react.project.backend.model.FlatEntity;
import edu.pw.react.project.backend.model.ImageEntity;
import edu.pw.react.project.backend.model.PaymentMethodsEntity;
import edu.pw.react.project.middleware.service.FlatlyService;
import edu.pw.react.project.middleware.service.SecurityService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collection;
import java.util.Set;

import static java.util.stream.Collectors.joining;

@RestController
@RequestMapping(path = "/flats")
public class FlatController {

    private final org.slf4j.Logger logger = LoggerFactory.getLogger(FlatController.class);

    private FlatRepository flatRepository;

    private SecurityService securityService;
    private FlatlyService flatlyService;

    @Autowired
    public FlatController(FlatRepository flatRepository, FlatlyService flatlyService, SecurityService securityService) {
        this.flatRepository = flatRepository;
        this.flatlyService = flatlyService;
        this.securityService = securityService;
    }

    private void logHeaders(@RequestHeader HttpHeaders headers) {
        logger.info("Controller request headers {}",
                headers.entrySet()
                        .stream()
                        .map(entry -> String.format("%s->[%s]", entry.getKey(), String.join(",", entry.getValue())))
                        .collect(joining(","))
        );
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @GetMapping(path = "")
    public ResponseEntity<Collection<FlatEntity>> getAllActiveFlats(@RequestParam Long id) {//FIXME
        System.out.println("Getting all active flats");
        return ResponseEntity.ok(flatRepository.findAllActiveFlats(id));
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @GetMapping(path = "/nonactive")
    public ResponseEntity<Collection<FlatEntity>> getAllNonActiveFlats(@RequestParam Long id) {
        System.out.println("Getting all nonactive flats");
        return ResponseEntity.ok(flatRepository.findAllNonactiveFlats(id));
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @GetMapping(path = "/{id}")
    public ResponseEntity<FlatEntity> getFlatById(@PathVariable Long id) {
        //logHeaders(headers);
        //if (securityService.isAuthorized(headers)) {
            System.out.println("Getting flat");
            FlatEntity f = flatRepository.findById(id).orElseGet(FlatEntity::new);
            return new ResponseEntity<>(f, HttpStatus.OK);
        //}
        //return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(FlatEntity.EMPTY);
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @PostMapping(value = "/delete/{id}")
    public ResponseEntity<String> setRoomNonactive(@PathVariable Long id) throws ResourceNotFoundException {
        if (!flatRepository.existsById(id))
            return new ResponseEntity<>("Flat with id " + id + " does not exist", HttpStatus.NOT_FOUND);
        flatRepository.updateFlatToNonActive(id);

        return new ResponseEntity<>("Flat was set to nonactive", HttpStatus.OK);
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<FlatEntity> createFlat(@Valid @RequestBody FlatEntity flat) {
        Set<PaymentMethodsEntity> tmpPayments = flat.getPayment_methods();
        flat.setPayment_methods(null);
        ImageEntity tmpImage = flat.getRoom_image();
        flat.setRoom_image(null);
        flat = flatRepository.save(flat);
        flat.setPayment_methods(tmpPayments);
        flat.setRoom_image(tmpImage);
        return new ResponseEntity<>(flatRepository.save(flat), HttpStatus.OK);
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @PostMapping(value = "/{id}")
    public ResponseEntity<FlatEntity> updateFlat(@RequestBody FlatEntity flat) {
        long id = flat.getId();
        if (!flatRepository.existsById(id))
            throw new ResourceNotFoundException(
                    "There is no flat with this id: " + flat.getId());
        return new ResponseEntity<>(flatRepository.saveAndFlush(flatRepository.save(flat)), HttpStatus.OK);
    }

    @CrossOrigin(origins = "https://flatly-thursday.netlify.com")
    @DeleteMapping(value = "/{id}")
    @Transactional
    public ResponseEntity<String> setBookingNonactive(@PathVariable Long id, @RequestHeader HttpHeaders headers, @Valid @RequestBody FlatEntity flat) {
        logHeaders(headers);
        if (securityService.isAuthorized(headers)) {
            if (flatlyService.checkForDeletionAndDelete(id, flat)){
                return ResponseEntity.status(HttpStatus.OK).body(String.format("Flat with id %s was deleted.", id));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad request.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access to resources.");
    }
}
