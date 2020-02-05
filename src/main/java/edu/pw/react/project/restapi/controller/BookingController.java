package edu.pw.react.project.restapi.controller;

import edu.pw.react.project.backend.dao.BookingRepository;
import edu.pw.react.project.backend.dao.FlatRepository;
import edu.pw.react.project.backend.model.BookingEntity;
import edu.pw.react.project.middleware.service.BookingService;
import edu.pw.react.project.middleware.service.SecurityService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collection;

import static java.util.stream.Collectors.joining;

@RestController
@RequestMapping(path = "/bookings")
public class BookingController {

   private final org.slf4j.Logger logger = LoggerFactory.getLogger(BookingController.class);

    private void logHeaders(@RequestHeader HttpHeaders headers) {
        logger.info("Controller request headers {}",
                headers.entrySet()
                        .stream()
                        .map(entry -> String.format("%s->[%s]", entry.getKey(), String.join(",", entry.getValue())))
                        .collect(joining(","))
        );
    }

    private BookingRepository bookingRepository;
    private FlatRepository flatRepository;
    private SecurityService securityService;
    private BookingService bookingService;

    @Autowired
    public BookingController(BookingRepository bookingRepository, FlatRepository flatRepository, BookingService bookingService, SecurityService securityService ) {
        this.bookingRepository = bookingRepository;
        this.flatRepository = flatRepository;
        this.securityService = securityService;
        this.bookingService = bookingService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "")
    public ResponseEntity<Collection<BookingEntity>> getAllBookingsOfUser(@RequestParam Long id) {
        System.out.println("Getting All bookings");
        return ResponseEntity.ok(flatRepository.findAllReservations(id));
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "/flat/{id}")
    public ResponseEntity<Collection<BookingEntity>> getBookingsByIdOfFlat(@PathVariable Long id) {
        System.out.println("Getting bookings of flat");
        return ResponseEntity.ok(bookingRepository.findAllBookingsOfFlat(id));
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "/{id}")
    public ResponseEntity<BookingEntity> getBookingById(@PathVariable Long id) {
        System.out.println("Getting booking");
        BookingEntity f = bookingRepository.findById(id).orElseGet(BookingEntity::new);
        return new ResponseEntity<>(f, HttpStatus.OK);
    }

    @CrossOrigin(origins = "*")
    @PostMapping(path = "")
    @Transactional
    public ResponseEntity<BookingEntity> createBooking(@RequestHeader HttpHeaders headers, @Valid @RequestBody BookingEntity booking) {
        logHeaders(headers);
        if (!bookingService.checkIncommingBookingForCreate(booking)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(booking);
        }
        if (securityService.isAuthorized(headers)) {
            booking = bookingService.checkavaibility(booking);
            if ('T' == booking.getActive()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(booking);
            } else {
                if (null == booking.getId()) {
                    //flat not avaible
                    return ResponseEntity.status(HttpStatus.GONE).body(booking);
                } else {
                    //conflict with other booking
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(booking);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(booking);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping(value = "/{id}")
    @Transactional
    public ResponseEntity<String> setBookingNonactive(@PathVariable Long id, @RequestHeader HttpHeaders headers, @Valid @RequestBody BookingEntity booking) {
        logHeaders(headers);
        if (securityService.isAuthorized(headers)) {
            if (bookingService.checkForDeletionAndDelete(id, booking)){
                return ResponseEntity.status(HttpStatus.OK).body(String.format("Booking with id %s was removed.", id));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad request.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access to resources.");
    }

}
