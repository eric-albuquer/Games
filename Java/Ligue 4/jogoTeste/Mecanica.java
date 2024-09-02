package jogoTeste;

public class Mecanica {
    public static final int LINHAS = 6;
    public static final int COLUNAS = 7;

    static char[][] tabuleiro = new char[LINHAS][COLUNAS];

    private char cor;
    private int pontuacaoA, pontuacaoV;

    public Mecanica(Peca peca) {
        preencherTabuleiro();
    }
    
    public char trocarCor() {
        if (cor == 'O') {
            this.cor = 'X';
            return cor;
        }
        this.cor = 'O';
        return cor;
    }

    public char getCor() {
        if (this.cor == 'O') {
            return 'X';
        }
        return 'O';
    }
    
    public void pontuacao() {
    	if(Vencedor.verificarVencedor() == 'X') {
    		pontuacaoV++;
    	}
    	if(Vencedor.verificarVencedor() == 'O') {
    		pontuacaoA++;
    	}
    }

    public void preencherTabuleiro() {
        for (int y = 0; y < LINHAS; y++) {
            for (int x = 0; x < COLUNAS; x++) {
                tabuleiro[y][x] = ' ';
            }
        }
    }

    public void addPeca(int coluna) throws PosicaoInvalidaException {
       if(coluna >=0 && coluna < COLUNAS) {
    	   for (int y = LINHAS - 1; y >= 0; y--) {
           	
               if (tabuleiro[y][coluna] == ' ') {
                   tabuleiro[y][coluna] = trocarCor();
                   break;
               }
           	
           } 
       }   	
       else throw new PosicaoInvalidaException("Coluna invalida");
    }

    public char getTabuleiro(int y, int x) {
        return tabuleiro[y][x];
    }
    
    public static int getLinhas() {
		return LINHAS;
	}

	public static int getColunas() {
		return COLUNAS;
	}
	
	char getCorInvertida() {
		if(cor == 'X') {
			return 'O';
		}
		else  {
			return 'X';			
		}
	}
	
	public void ligue4TurboMaluco(int coluna) {
		
		if(Tabuleiro.isAtivarTurbo()==true) {
		for (int i = LINHAS-1; i >=0; i--) {
	        if (tabuleiro[i][coluna] == ' ') {
	            tabuleiro[i][coluna] = getCor();
	            
	            
	            if(tabuleiro[i][coluna] != ' ') {
	            if(coluna!=6 && coluna!=0 && i!=0 && i!=5) {
	            if(Robo.random()>=4) {
	            	if (tabuleiro[i][coluna+1] != ' ')
	            	tabuleiro[i][coluna+1] = getCor();
	            	}
	            if(Robo.random()>4) {
	            	if (tabuleiro[i+1][coluna+1] != ' ')
		            tabuleiro[i+1][coluna+1] = getCor();
		            }
	            if(Robo.random()>4) {
	            	if (tabuleiro[i-1][coluna+1] != ' ')
		            tabuleiro[i-1][coluna+1] = getCor();
		            }
	            if(Robo.random()>4) {
	            	if (tabuleiro[i][coluna-1] != ' ')
		            tabuleiro[i][coluna-1] = getCor();
		            }
	            if(Robo.random()>4) {
	            	if (tabuleiro[i+1][coluna-1] != ' ')
		            tabuleiro[i+1][coluna-1] = getCor();
		            }
	            if(Robo.random()>4) {
	            	if (tabuleiro[i-1][coluna-1] != ' ')
		            tabuleiro[i-1][coluna-1] = getCor();
		            }
	            if(Robo.random()>4) {
	            	if (tabuleiro[i+1][coluna] != ' ')
		            tabuleiro[i+1][coluna] = getCor();
		            }
	            if(Robo.random()>4) {
	            	if (tabuleiro[i-1][coluna] != ' ')
		            tabuleiro[i-1][coluna] = getCor();
		            }
	            }
	            }
	            
	          break;
	          }         	        
	    }
		}
		else {
			try {
				addPeca(coluna);
			} catch (PosicaoInvalidaException e) {
				System.err.println("Coluna invalida");				
			}
			
		}
		trocarCor();
		}

	public int getPontuacaoV() {
		return pontuacaoV;
	}

	public int getPontuacaoA() {
		return pontuacaoA;
	}
}
