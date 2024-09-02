package Xadrez;
import java.util.ArrayList;

import Xadrez.move.Castle;
import Xadrez.move.Enpassant;
import Xadrez.move.Move;
import Xadrez.move.Promotion;

public class Game {
	public static int color = Piece.White;
	public static int oponentColor = Piece.Black;
	
	public static boolean canShortCastle = true;
	public static boolean canLongCastle = true;
	
	public static boolean kingInCheck = false;
	public static int whiteKing = 4;
	public static int blackKing = 60;
	
	public static ArrayList<Move> moves = new ArrayList<>();
	
	public Game() {
		new Board();
		new GenerateMoves();
	}
	
	public static void move(Move move) {
		final int startPiece = Board.Square[move.startSquare];
		int targetPiece = Board.Square[move.endSquare];
		
		Board.Square[move.startSquare] = Piece.None;
		Board.Square[move.endSquare] = startPiece | Piece.Moved;
		
		if (Piece.isType(startPiece, Piece.King)) {
			if (Piece.isColor(startPiece, Piece.White)) {
				whiteKing = move.endSquare;
			} else {
				blackKing = move.endSquare;
			}
		}
		
		if (move instanceof Enpassant) {
			final int dx = move.endSquare % 8 - move.startSquare % 8;
			targetPiece = Board.Square[move.startSquare + dx];
			Board.Square[move.startSquare + dx] = Piece.None;
		} else if (move instanceof Promotion) {
			Promotion promotionMove = (Promotion) move;
			int promotedPiece = promotionMove.promotedPiece;
			Board.Square[move.endSquare] = promotedPiece | Piece.Moved;
		} else if (move instanceof Castle) {
			Castle castle = (Castle) move;
			final int rook = Board.Square[castle.rookStart];
			Board.Square[castle.rookStart] = Piece.None;
			Board.Square[castle.rookEnd] = rook | Piece.Moved;
		}
		
		move.setStartEndPiece(startPiece, targetPiece);
		
		moves.add(move);
	}
	
	public static void unmakeMove(Move move) {
		Board.Square[move.startSquare] = move.startPiece;
		
		if (Piece.isType(move.startPiece, Piece.King)) {
			if (Piece.isColor(move.startPiece, Piece.White)) {
				whiteKing = move.startSquare;
			} else {
				blackKing = move.startSquare;
			}
		}
		
		if (move instanceof Enpassant) {
			final int dx = move.endSquare % 8 - move.startSquare % 8;
			Board.Square[move.startSquare + dx] = move.endPiece;
			Board.Square[move.endSquare] = Piece.None;
		} else if (move instanceof Castle) {
			Castle castle = (Castle) move;
			final int color = Piece.isColor(castle.startPiece, Piece.White) ? Piece.White : Piece.Black;
			Board.Square[castle.endSquare] = castle.endPiece;
			Board.Square[castle.rookStart] = Piece.Rook | color;
			Board.Square[castle.rookEnd] = Piece.None;
		} else {
			Board.Square[move.endSquare] = move.endPiece;
		}
	}
	
	public static int totalMoves(int depth) {
		if (depth == 0) return 1;
		
		int moves = 0;
		ArrayList<Move> allMoves = new ArrayList<>(GenerateMoves.computeLegalMoves());
		
		for (Move move : allMoves) {
			move(move);
			changeColor();
			moves += totalMoves(depth - 1);
			unmakeMove(move);
			changeColor();
		}
		
		return moves;
	}
	
	public static void changeColor() {
		if (color == Piece.White) {
			color = Piece.Black;
			oponentColor = Piece.White;
		} else {
			color = Piece.White;
			oponentColor = Piece.Black;
		}
	}
	
	public static Move getLastMove() {
		return moves.get(moves.size() - 1);
	}
}
