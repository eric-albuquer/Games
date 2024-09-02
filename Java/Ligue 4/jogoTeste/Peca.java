package jogoTeste;

import java.awt.Image;
import java.awt.event.KeyEvent;

import javax.swing.ImageIcon;

public class Peca {

    public Image amarela;
    public Image vermelho;
    private int input;

    public void loadV() {
        ImageIcon referencia = new ImageIcon("res\\PecaV.jpg");
        vermelho = referencia.getImage();
        Image resizedImage = vermelho.getScaledInstance(86, 86, Image.SCALE_DEFAULT);
        ImageIcon resizedIcon = new ImageIcon(resizedImage);
        vermelho = resizedIcon.getImage();

    }

    public void loadA() {
        ImageIcon referencia = new ImageIcon("res\\PecaA.jpg");
        amarela = referencia.getImage();
        Image resizedImage = amarela.getScaledInstance(86, 86, Image.SCALE_DEFAULT);
        ImageIcon resizedIcon = new ImageIcon(resizedImage);
        amarela = resizedIcon.getImage();
    }

    public int getInput() {
        return this.input-1;
    }

    public void keyPressed(KeyEvent tecla) {
        int codigo = tecla.getKeyCode();

        if (codigo == KeyEvent.VK_1) {
            this.input = 1;
        }
        if (codigo == KeyEvent.VK_2) {
            this.input = 2;
        }
        if (codigo == KeyEvent.VK_3) {
            this.input = 3;
        }
        if (codigo == KeyEvent.VK_4) {
            this.input = 4;
        }
        if (codigo == KeyEvent.VK_5) {
            this.input = 5;
        }
        if (codigo == KeyEvent.VK_6) {
            this.input = 6;
        }
        if (codigo == KeyEvent.VK_7) {
            this.input = 7;
        }
    }

    public void keyRelease(KeyEvent tecla) {
        int codigo = tecla.getKeyCode();
        if (codigo == KeyEvent.VK_1) {
            this.input = 0;
        }
        if (codigo == KeyEvent.VK_2) {
            this.input = 0;
        }
        if (codigo == KeyEvent.VK_3) {
            this.input = 0;
        }
        if (codigo == KeyEvent.VK_4) {
            this.input = 0;
        }
        if (codigo == KeyEvent.VK_5) {
            this.input = 0;
        }
        if (codigo == KeyEvent.VK_6) {
            this.input = 0;
        }
        if (codigo == KeyEvent.VK_7) {
            this.input = 0;
        }
    }
}
