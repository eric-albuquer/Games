package Xadrez.move;

public class Move {
	public int startSquare, endSquare, startPiece, endPiece;
	
	public Move(int startSquare, int endSquare) {
		this.startSquare = startSquare;
		this.endSquare = endSquare;
	}
	
	public void setStartEndPiece(int startPiece, int endPiece) {
		this.startPiece = startPiece;
		this.endPiece = endPiece;
	}
}
