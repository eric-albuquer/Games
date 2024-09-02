package Xadrez.move;

public class Castle extends Move{
	public int rookStart, rookEnd;

	public Castle(int startSquare, int endSquare, int rookStart, int rookEnd) {
		super(startSquare, endSquare);
		this.rookStart = rookStart;
		this.rookEnd = rookEnd;
	}

}
