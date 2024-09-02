package jogoTeste;

public class Vencedor {
	
	private static int linhas = Mecanica.getLinhas();
	private static int colunas = Mecanica.getColunas();
	
	public boolean vencedor() {
		if(verificarVencedor() != ' ') {
			System.out.println("Jogador " + verificarVencedor() + " ganhou!");
			return true;
		}
		else{
		return false;
		}
	}
	 public static char verificarVencedor() {
	        // Verifica horizontal
	        for (int i = 0; i < linhas; i++) {
	            for (int j = 0; j < colunas - 3; j++) {
	                if (Mecanica.tabuleiro[i][j] != ' ' && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i][j + 1] && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i][j + 2]
	                        && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i][j + 3]) {
	                	return Mecanica.tabuleiro[i][j];
	                }
	            }
	        }

	        // Verifica vertical
	        for (int i = 0; i < linhas - 3; i++) {
	            for (int j = 0; j < colunas; j++) {
	                if (Mecanica.tabuleiro[i][j] != ' ' && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 1][j] && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 2][j]
	                        && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 3][j]) {
	                	return Mecanica.tabuleiro[i][j];
	                }
	            }
	        }

	        // Verifica diagonais (para baixo à direita)
	        for (int i = 0; i < linhas - 3; i++) {
	            for (int j = 0; j < colunas - 3; j++) {
	                if (Mecanica.tabuleiro[i][j] != ' ' && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 1][j + 1] && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 2][j + 2]
	                        && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 3][j + 3]) {
	                	return Mecanica.tabuleiro[i][j];
	                }
	            }
	        }

	        // Verifica diagonais (para baixo à esquerda)
	        for (int i = 0; i < linhas - 3; i++) {
	            for (int j = 3; j < colunas; j++) {
	                if (Mecanica.tabuleiro[i][j] != ' ' && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 1][j - 1] && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 2][j - 2]
	                        && Mecanica.tabuleiro[i][j] == Mecanica.tabuleiro[i + 3][j - 3]) {
	                	return Mecanica.tabuleiro[i][j];
	                }
	            }
	        }

	        // Se não houver vencedor, retorna espaço em branco
	        return ' ';
	    }
	}

