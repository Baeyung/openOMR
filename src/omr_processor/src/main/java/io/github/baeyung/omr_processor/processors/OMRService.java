package io.github.baeyung.omr_processor.processors;

import io.github.baeyung.omr_processor.models.Invoice;
import io.github.baeyung.omr_processor.processors.ocr.OCRService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class OMRService {
    private final OCRService ocrService;
    private final AIService aiService;

    public OMRService(OCRService ocrService, AIService aiService) {
        this.ocrService = ocrService;
        this.aiService = aiService;
    }

    public List<Invoice> processOMRImages(List<MultipartFile> images) {

        if (images == null || images.isEmpty()) {
            return Collections.emptyList();
        }

        List<Invoice> invoices = new ArrayList<>();

        for (MultipartFile image : images) {
            try {
                String ocrText = ocrService.extractText(image);

                if (ocrText == null || ocrText.isBlank()) {
                    continue;
                }

                Invoice invoice = aiService.fromOCRCreateInvoice(ocrText);

                if (invoice != null) {
                    invoices.add(invoice);
                }

            } catch (Exception e) {
                // log properly instead of failing entire batch
                System.out.println(e.getMessage());
            }
        }

        return invoices;
    }
}
