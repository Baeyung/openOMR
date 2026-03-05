package io.github.baeyung.omr_processor.processors;

import io.github.baeyung.omr_processor.models.Employee;
import io.github.baeyung.omr_processor.models.File;
import io.github.baeyung.omr_processor.models.Invoice;
import io.github.baeyung.omr_processor.processors.ocr.OCRService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OMRService
{
    private final OCRService ocrService;
    private final AIService aiService;

    public OMRService(OCRService ocrService, AIService aiService)
    {
        this.ocrService = ocrService;
        this.aiService = aiService;
    }

    public byte[] processOMRData(List<MultipartFile> images, Employee employee)
    {
        List<File> files = new ArrayList<>();
        int counter = 1;
        String finalText = "";

        for (MultipartFile image : images)
        {
            try
            {
                String ocrText = ocrService.extractText(image);

                if (ocrText == null || ocrText.isBlank())
                {
                    continue;
                }

                Invoice invoice = aiService.fromOCRCreateInvoice(ocrText);

                String fileName = FileProcessor.getNewFileName(
                        counter,
                        employee.getForMonth()
                );

                finalText = finalText
                        .concat(fileName.split("\\.")[0])
                        .concat("~")
                        .concat(invoice.getInvoiceDate())
                        .concat("~")
                        .concat(invoice.getTotalNet().toString())
                        .concat("~")
                        .concat("0")
                        .concat("~")
                        .concat("0")
                        .concat("~")
                        .concat("~")
                        .concat("~")
                        .concat("BP")// will add logic to find sickness using AI
                        .concat("\n");

                files.add(
                        new File(
                                fileName + FileProcessor.getFileExt(image.getContentType()),
                                image.getBytes()
                        )
                );

                counter++;
            }
            catch (Exception e)
            {
                System.out.println(e.getMessage());
            }
        }

        files.add(
                new File(
                        FileProcessor.getNewFileName(-1, employee.getForMonth()) +
                        "_" + (LocalDate.now().getYear() - 2000) +
                        FileProcessor.getFileExt("excel/xlsx"),
                        FileProcessor.fillOMRFormForTheEmployee(finalText, employee)
                )
        );

        try
        {
            return FileProcessor.zipAllFiles(files);
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
            return null;
        }
    }
}
