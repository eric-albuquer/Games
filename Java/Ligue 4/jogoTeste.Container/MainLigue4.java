package jogoTeste.Container;

import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;

import jogoTeste.Tabuleiro;

public class MainLigue4 extends JFrame{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	JLabel labelJogadores;
	ImageIcon menu;
	
    public MainLigue4() {
        add(new Tabuleiro());
        setTitle("Ligue 4");
        setSize(1024, 768);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        this.setResizable(false);
        setLocationRelativeTo(null);
        setVisible(true);            
    }

    public static void main(String[] args) {
        new MainLigue4();
    }
}
