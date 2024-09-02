package Xadrez;

public class Board {
	public static int[] Square = new int[64];;
	public static final int COLS = 8;
	public static final int ROWS = 8;
	
	public Board() {
		initTable();
	}
	
	private static void initTable() {
		for (int i = 0; i < 8; i++) {
			Square[i + 8] = Piece.Pawn | Piece.White;
			Square[48 + i] = Piece.Pawn | Piece.Black;
		}
		
		for (int i = 0; i < 2; i++) {
			int color = i == 0 ? Piece.White : Piece.Black;
			int position = i == 0 ? 0 : 56;
			
			Square[position + 0] = color | Piece.Rook;
			Square[position + 1] = color | Piece.Knight;
			Square[position + 2] = color | Piece.Bishop;
			Square[position + 3] = color | Piece.Queen;
			Square[position + 4] = color | Piece.King;
			Square[position + 5] = color | Piece.Bishop;
			Square[position + 6] = color | Piece.Knight;
			Square[position + 7] = color | Piece.Rook;
		}
		
		for (int i = 2; i < 5; i++) {
			for (int j = 0; j < 8; j++) {
				Square[i * 8 + j] = Piece.None;
			}
		}
	}
	
	public static boolean insideBoardXY(int x, int y) {
		return x >= 0 && x < COLS && y >= 0 && y < ROWS;
	}
	
	public static int getXY(int x, int y) {
		int square = y * 8 + x;
		return Square[square];
	}
	
	public static int getSquare(int x, int y) {
		return y * 8 + x;
	}
}
