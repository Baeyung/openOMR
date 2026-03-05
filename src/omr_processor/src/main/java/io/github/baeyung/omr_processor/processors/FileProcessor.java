package io.github.baeyung.omr_processor.processors;

import io.github.baeyung.omr_processor.models.Employee;
import io.github.baeyung.omr_processor.models.File;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class FileProcessor
{
    static String getNewFileName(int index, String month)
    {
        return "OMR_" + month + (index == -1 ? "" : "_" + index);
    }

    static String getFileExt(String ext)
    {
        return switch (ext)
        {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "excel/xlsx"  -> ".xlsx";
            default -> "." + ext;
        };
    }

    static byte[] zipAllFiles(List<File> files) throws IOException
    {
        // Create a byte output stream to hold zip content
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStream(byteArrayOutputStream);

        for (File file : files)
        {
            // Add file to zip
            zos.putNextEntry(new ZipEntry(file.getFileName()));
            zos.write(file.getFile());
            zos.closeEntry();
        }

        zos.close();

        return byteArrayOutputStream.toByteArray();
    }

    static byte[] fillOMRFormForTheEmployee(String data, Employee employee)
    {
        try (
                InputStream is = FileProcessor
                        .class
                        .getClassLoader()
                        .getResourceAsStream("templates/filled.xlsx");

                Workbook workbook = new XSSFWorkbook(is);
                ByteArrayOutputStream bos = new ByteArrayOutputStream()
        )
        {

            Sheet sheet = workbook.getSheetAt(0);

            // fill employee details
            sheet
                    .getRow(6)
                    .getCell(3)
                    .setCellValue(employee.getName()); // name
            sheet
                    .getRow(7)
                    .getCell(3)
                    .setCellValue(employee.getDesignation()); // designation
            sheet
                    .getRow(8)
                    .getCell(3)
                    .setCellValue(employee.getPhoneNumber()); // phoneNumber
            sheet
                    .getRow(9)
                    .getCell(3)
                    .setCellValue(employee.getEmail()); // email
            sheet
                    .getRow(10)
                    .getCell(3)
                    .setCellValue(employee.getForMonth()); // for month
            sheet
                    .getRow(11)
                    .getCell(3)
                    .setCellValue(employee.getTodayDate()); // today date

            String[] rowsToAddInExcel = data.split("\n");

            int rowIndex = 19; // Row 20 (0 based)

            for (var rowToAdd : rowsToAddInExcel)
            {

                Row row = sheet.getRow(rowIndex);
                var cellValues = rowToAdd.split("~");

                if (cellValues.length < 1)
                {
                    continue;
                }

                if (row == null)
                {
                    row = sheet.createRow(rowIndex);
                }

                for (int col = 1; col <= 8 && col <= cellValues.length; col++)
                {
                    Cell cell = row.getCell(col);

                    if (cell == null)
                    {
                        cell = row.createCell(col);
                    }

                    var cellValue = cellValues[col - 1];

                    if (StringUtils.isEmpty(cellValue))
                    {
                        continue;
                    }

                    try
                    {
                        cell.setCellValue(Double.parseDouble(cellValue));
                    }
                    catch (Exception ex)
                    {
                        cell.setCellValue(cellValue);
                    }
                }

                rowIndex++;
            }

            deleteRows(sheet, rowIndex, 37);

            sheet
                    .getRow(rowIndex + 13)
                    .getCell(0)
                    .setCellValue(employee.getName()); // signature
            sheet
                    .getRow(rowIndex + 20)
                    .getCell(0)
                    .setCellValue(employee.getTodayDate()); // today date

            workbook.write(bos);

            return bos.toByteArray();

        }
        catch (IOException e)
        {
            throw new RuntimeException(e);
        }
    }

    private static void deleteRow(Sheet sheet, int rowIndex)
    {
        Row row = sheet.getRow(rowIndex);
        if (row != null)
        {
            sheet.removeRow(row);

            // Shift all rows below up
            int lastRowNum = sheet.getLastRowNum();
            if (rowIndex >= 0 && rowIndex < lastRowNum)
            {
                sheet.shiftRows(rowIndex + 1, lastRowNum, -1);
            }
        }
    }

    private static void deleteRows(Sheet sheet, int startRow, int endRow)
    {
        for (int i = startRow; i <= endRow; i++)
        {
            deleteRow(sheet, startRow); // keep deleting the same start row since rows shift up
        }
    }
}
