package io.github.baeyung.omr_processor.rest;

import io.github.baeyung.omr_processor.models.Invoice;
import io.github.baeyung.omr_processor.processors.OMRService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/images")
public class FileController {

    private final OMRService omrService;

    public FileController(OMRService omrService) {
        this.omrService = omrService;
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("hello this endpoint works");
    }

    @PostMapping(value = "/omr/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<Invoice>> processOMRImages(@RequestParam("files") List<MultipartFile> files) {

        if (files.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                this.omrService.processOMRImages(files)
        );
    }
}
