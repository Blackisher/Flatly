package edu.pw.react.project.restapi.controller;

import edu.pw.react.project.backend.dao.PaymentMethodsRepository;
import edu.pw.react.project.backend.model.PaymentMethodsEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping(path = "/payment")
public class PaymentMethodsController {
    private PaymentMethodsRepository methodsFlatRepository;
    @Autowired
    public PaymentMethodsController(PaymentMethodsRepository repository) {
        this.methodsFlatRepository = repository;
    }

    @CrossOrigin(origins = "*")
    @GetMapping(path = "")
    public ResponseEntity<Collection<PaymentMethodsEntity>> getAllMethods() {
        System.out.println("Getting all payment methods");
        return ResponseEntity.ok(methodsFlatRepository.findAll());
    }

}
