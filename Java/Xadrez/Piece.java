package Xadrez;

public class Piece {
	public static final int None = 0;
	public static final int King = 1;
	public static final int Pawn = 2;
	public static final int Rook = 3;
	public static final int Knight = 4;
	public static final int Bishop = 5;
	public static final int Queen = 6;
	
	public static final int White = 8;
	public static final int Black = 16;
	
	public static final int Moved = 32;
	
	public static boolean isType(int piece, int pieceType) {
		piece &= 7;
		return piece == pieceType;
	}
	
	public static boolean isColor(int piece, int pieceColor) {
		piece &= 24;
		return piece == pieceColor;
	}
	
	public static boolean wasMoved(int piece) {
		piece &= Piece.Moved;
		return piece == Piece.Moved;
	}
}
