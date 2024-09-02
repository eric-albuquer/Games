package jogoTeste;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.Timer;

public class Tabuleiro extends JPanel implements ActionListener{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Image imgTabuleiro;
    private Image j;
    private Image menu;
    private Image creditos;
    
    private Peca peca = new Peca();
    private Mecanica m = new Mecanica(peca);
    private Timer timer;
    
    
    private JButton startButton;
    private JButton backButton;
    private JButton jogadoresButton;
    private JButton creditosButton;
    private JButton turboButton;
    private JButton jogarNovamenteButton;
    private JButton voltarAoMenuButton;
    
    private int pontuacaoA;
	private int pontuacaoV;
    private boolean numeroJogadores = false;
    private static boolean ativarTurbo = false;

    public Tabuleiro() {
    	
    	
    	ImageIcon menu = new ImageIcon("res\\Menu.png");
        this.menu = menu.getImage();
    	
        ImageIcon referencia = new ImageIcon("res\\Tabuleiro2.jpg");
        imgTabuleiro = referencia.getImage();
        Image resizedImage = imgTabuleiro.getScaledInstance(701, 602, Image.SCALE_DEFAULT);
        ImageIcon resizedIcon = new ImageIcon(resizedImage);
        imgTabuleiro = resizedIcon.getImage();
        
        ImageIcon j = new ImageIcon("res\\J.png");
        this.j = j.getImage();
        
        ImageIcon creditos = new ImageIcon("res\\Creditos.png");
        this.creditos = creditos.getImage();

        peca.loadV();
        peca.loadA();
        
        
        setFocusable(true);
        addKeyListener(new TecladoAdapter());
        setLayout(null);
        
        timer = new Timer(5, this);
        timer.start();
        
        startButton = new JButton("Iniciar");  
        startButton.setBackground(Color.GREEN);
        startButton.setFont(new Font("Arial", Font.BOLD, 60));
        startButton.setBounds(6, 325, 235, 80);
        startButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	gameState = GameState.JOGANDO;
            	startButton.setVisible(false);
            	creditosButton.setVisible(false);
            	jogadoresButton.setVisible(false); 
            	turboButton.setVisible(false); 
            	requestFocusInWindow();
                
            }
        });
        add(startButton);

        backButton = new JButton("Voltar");
        backButton.setBounds(908, 0, 100, 50);
        backButton.setVisible(false);
        backButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            gameState = GameState.MENU;
            startButton.setVisible(true);
        	creditosButton.setVisible(true);
        	jogadoresButton.setVisible(true); 
        	turboButton.setVisible(true);
        	backButton.setVisible(false);
            }
        });
        add(backButton);
        
        jogadoresButton = new JButton("Jogadores");  
        jogadoresButton.setBackground(Color.GREEN);
        jogadoresButton.setFont(new Font("Arial", Font.BOLD, 60));
        jogadoresButton.setBounds(10, 127, 391, 80);
        jogadoresButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	numeroJogadores = !numeroJogadores;    
            	requestFocusInWindow();       
                
            }
        });
        add(jogadoresButton);
        
        creditosButton = new JButton("Creditos");  
        creditosButton.setBackground(Color.GREEN);
        creditosButton.setFont(new Font("Arial", Font.BOLD, 60));
        creditosButton.setBounds(7, 416, 305, 80);
        creditosButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {    
            	requestFocusInWindow();       
            	gameState = GameState.CREDITOS;
            	startButton.setVisible(false);
            	creditosButton.setVisible(false);
            	jogadoresButton.setVisible(false); 
            	turboButton.setVisible(false); 
            }
        });
        add(creditosButton);
        
        turboButton = new JButton("Turbo Maluco");  
        turboButton.setBackground(Color.GREEN);
        turboButton.setFont(new Font("Arial", Font.BOLD, 60));
        turboButton.setBounds(7, 229, 497, 80);
        turboButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {    
            	requestFocusInWindow();       
                ativarTurbo = !ativarTurbo;
            }
        });
        add(turboButton);
        
        jogarNovamenteButton = new JButton("Jogar novamente");  
        jogarNovamenteButton.setBackground(Color.GREEN);
        jogarNovamenteButton.setFont(new Font("Arial", Font.BOLD, 20));
        jogarNovamenteButton.setBounds(808, 0, 200, 50);
        jogarNovamenteButton.setVisible(false);
        jogarNovamenteButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {    
            	requestFocusInWindow();       
            	m.preencherTabuleiro();
            	jogarNovamenteButton.setVisible(false);
            	timer.start();
            }
        });
        add(jogarNovamenteButton);
        
        voltarAoMenuButton = new JButton("Voltar pro menu");  
        voltarAoMenuButton.setBackground(Color.GREEN);
        voltarAoMenuButton.setFont(new Font("Arial", Font.BOLD, 20));
        voltarAoMenuButton.setBounds(808, 678, 200, 50);
        voltarAoMenuButton.setVisible(false);
        voltarAoMenuButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {                	
            	requestFocusInWindow();
            	
            	timer.start();
            	jogarNovamenteButton.setVisible(false);
            	m.preencherTabuleiro();
            	voltarAoMenuButton.setVisible(false); 
            	startButton.setVisible(true);
            	creditosButton.setVisible(true);
            	jogadoresButton.setVisible(true); 
            	turboButton.setVisible(true);
            	gameState = GameState.MENU;
            }
        });
        add(voltarAoMenuButton);
    }
    
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D graficos = (Graphics2D) g;  
        
        if (gameState == GameState.JOGANDO) {
        	    
        	graficos.setColor(Color.gray);
            graficos.fillRect(0, 0, 1024, 768);
            graficos.drawImage(imgTabuleiro, 155, 0, null);
                                  
            if(Vencedor.verificarVencedor() != ' ') {
            	String vencedor = null;
            	
            	if(Vencedor.verificarVencedor() == 'O') {vencedor = "amarelo"; pontuacaoA++;}
            	if(Vencedor.verificarVencedor() == 'X') {vencedor = "vermelho"; pontuacaoV++;}
            	
            	graficos.setColor(Color.black);
            	graficos.setFont(new Font("Arial", Font.BOLD, 60));           	
            	 
            	graficos.drawString("Jogador " + vencedor + " ganhou", 140, 680);
            	
            	jogarNovamenteButton.setVisible(true);
            	
            	graficos.setColor(Color.black);
                graficos.setFont(new Font("Arial", Font.BOLD, 20));
                graficos.drawString("Jogador vermelho: " + pontuacaoV + " pontos", 200, 620);
                graficos.drawString("Jogador amarelo: " + pontuacaoA + " pontos", 550, 620);
            	timer.stop();
       
            }
            voltarAoMenuButton.setVisible(true);
            	 for (int y = 0; y < 6; y++) {
                     for (int x = 0; x < 7; x++) {
                         if (m.getTabuleiro(y, x) == 'X') {
                             graficos.drawImage(peca.vermelho, (int) ((x * 98.5)+167), (int) ((y * 98.5)+12), null);
                         } else if (m.getTabuleiro(y, x) == 'O') {
                             graficos.drawImage(peca.amarela, (int) ((x * 98.5)+167), (int) ((y * 98.5)+12), null);
                         }
                     }
                 } 
        } else if(gameState == GameState.MENU){
        	
            graficos.drawImage(menu, 0, 0, null);
            
            if(pontuacaoA > 0 || pontuacaoV > 0) {
            	 graficos.setColor(Color.black);
                 graficos.setFont(new Font("Arial", Font.BOLD, 40));
                 graficos.drawString("Vermelho: " + pontuacaoV, 10, 550);
                 graficos.drawString("Amarelo: " + pontuacaoA, 10, 600);
            }
           
            if(numeroJogadores) {
            	graficos.drawImage(j, 615, 140, null);
            
            }
            else { 
            	graficos.drawImage(j, 465, 140, null);  
            }
            if(ativarTurbo) {
            	graficos.drawImage(j, 548, 249, null);
            }
        }
        else if(gameState == GameState.CREDITOS) {
        	backButton.setVisible(true);
        	graficos.drawImage(creditos, 0, 0, null);
        }
    }

    public static boolean isAtivarTurbo() {
		return ativarTurbo;
	}

	public void actionPerformed(ActionEvent e) {
        repaint();  
    }

    private class TecladoAdapter extends KeyAdapter {
        @Override
        public void keyPressed(KeyEvent e) {
        	try {
        	if(gameState == GameState.JOGANDO) {
        		if(numeroJogadores) {
        			peca.keyPressed(e);
        			if(ativarTurbo) {
        				m.ligue4TurboMaluco(peca.getInput());
        			}
        			else {
        				m.addPeca(peca.getInput());
        			} 
        		}
        		else {
        			if(m.getCor() == 'O') {
        				if(ativarTurbo) {
            				m.ligue4TurboMaluco(Robo.random());
            			}
            			else {
            				m.addPeca(Robo.random());
            			} 
        			}
        			
        			peca.keyPressed(e);
        			if(ativarTurbo) {
        				m.ligue4TurboMaluco(peca.getInput());
        			}
        			else {
        				m.addPeca(peca.getInput());
        			}                                  
        		}
            
        	}
        	} catch (PosicaoInvalidaException e1) {
        		System.err.println("Coluna invalida");
        	}
        }

        @Override
        public void keyReleased(KeyEvent e) {
            peca.keyRelease(e);
        }
    }
    
	private enum GameState {
	    MENU, JOGANDO, CREDITOS
	}

	private GameState gameState = GameState.MENU;
}
