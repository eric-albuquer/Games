package Xadrez.move;

public class Promotion extends Move{
	
	public int promotedPiece;
	
	public Promotion(int startSquare, int endSquare, int promotedPiece) {
		super(startSquare, endSquare);
		this.promotedPiece = promotedPiece;
	}
}
