package dev.mvc.sms;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class MMSImageGenerator {

    public static File createAnswerImage(String baseImagePath, String outputPath, String content) throws IOException {
        BufferedImage originalImage = ImageIO.read(new File(baseImagePath));
        int newWidth = 400;
        int newHeight = 600;

        Image scaledImage = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);

        Graphics2D g2d = resizedImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2d.drawImage(scaledImage, 0, 0, null);

        Font font = new Font("Malgun Gothic", Font.BOLD, 20);
        g2d.setFont(font);
        FontMetrics fm = g2d.getFontMetrics();

        String[] lines = content.split("\n");
        int lineHeight = fm.getHeight();
        int blockHeight = lineHeight * lines.length;
        int startY = (newHeight - blockHeight) / 2 + fm.getAscent();

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            int lineWidth = fm.stringWidth(line);
            int x = (newWidth - lineWidth) / 2;
            int y = startY + i * lineHeight;

            g2d.setColor(Color.BLACK);
            g2d.drawString(line, x + 2, y + 2);
            g2d.setColor(Color.WHITE);
            g2d.drawString(line, x, y);
        }

        g2d.dispose();

        File output = new File(outputPath);
        ImageIO.write(resizedImage, "jpg", output);

        return output;
    }
}
