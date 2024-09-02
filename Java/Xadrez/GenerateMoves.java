package Xadrez;
import java.util.ArrayList;

import Xadrez.move.*;

public class GenerateMoves {
	private static int [] directionsVector = {8, -8, -1, 1, 7, -7, 9, -9};
	private static int [][] squaresToEdge = new int [64][8];
	private static int [][] knightMoves = new int [64][8];
	private static int [][] kingMoves = new int [64][8];
	public static ArrayList<Move> moves = new ArrayList<>();
	
	public GenerateMoves() {
		preComputeSquaresToEdge();
		preComputeKnightMoves();
		preComputeKingMoves();
	}
	
	private static void preComputeSquaresToEdge(){
		for (int i = 0; i < Board.ROWS; i++) {
			for (int j = 0; j < Board.COLS; j++) {
				int squareIdx = Board.getSquare(j, i);
				
				int toTop = 7 - i;
				int toBotton = i;
				int toLeft = j;
				int toRight = 7 - j;
				
				squaresToEdge[squareIdx][0] = toTop;
				squaresToEdge[squareIdx][1] = toBotton;
				squaresToEdge[squareIdx][2] = toLeft;
				squaresToEdge[squareIdx][3] = toRight;
				squaresToEdge[squareIdx][4] = Math.min(toTop, toLeft);
				squaresToEdge[squareIdx][5] = Math.min(toBotton, toRight);;
				squaresToEdge[squareIdx][6] = Math.min(toTop, toRight);;
				squaresToEdge[squareIdx][7] = Math.min(toBotton, toLeft);;
			}
		}
	}
	
	private static int knightCanMove(int x, int y) {
		final int z = Board.getSquare(x, y);
		return Board.insideBoardXY(x, y) ? z : -1;
	}
	
	private static void preComputeKnightMoves() {
		for (int i = 0; i < Board.ROWS; i++) {
			for (int j = 0; j < Board.COLS; j++) {
				int squareIdx = Board.getSquare(j, i);
				
				final int square1 = knightCanMove(j - 1, i - 2);
				final int square2 = knightCanMove(j - 2, i - 1);
				final int square3 = knightCanMove(j - 2, i + 1);
				final int square4 = knightCanMove(j - 1, i + 2);
				final int square5 = knightCanMove(j + 1, i + 2);
				final int square6 = knightCanMove(j + 2, i + 1);
				final int square7 = knightCanMove(j + 2, i - 1);
				final int square8 = knightCanMove(j + 1, i - 2);
				
				knightMoves[squareIdx][0] = square1;
				knightMoves[squareIdx][1] = square2;
				knightMoves[squareIdx][2] = square3;
				knightMoves[squareIdx][3] = square4;
				knightMoves[squareIdx][4] = square5;
				knightMoves[squareIdx][5] = square6;
				knightMoves[squareIdx][6] = square7;
				knightMoves[squareIdx][7] = square8;
			}
		}
	}
	
	private static void preComputeKingMoves() {
		for (int i = 0; i < Board.ROWS; i++) {
			for (int j = 0; j < Board.COLS; j++) {
				final int square = Board.getSquare(j, i);
				
				int index = 0;
				
				for (int k = -1; k <= 1; k++) {
					for (int w = -1; w <= 1; w++) {
						
						if (k == w && k == 0) continue;
						
						int target = -1;
						
						if (Board.insideBoardXY(j + w, i + k)) {
							target = Board.getSquare(j + w, i + k);
						}
						
						kingMoves[square][index] = target;
						
						index++;
					}
				}
			}
		}
	}
	
	public static ArrayList<Move> computeMoves() {
		moves = new ArrayList<>();
		
		for (int i = 0; i < 64; i++) {
			final int piece = Board.Square[i];
			
			if (Piece.isColor(piece, Game.color)) {
				if (Piece.isType(piece, Piece.King)){
					generateKingMoves(i);
					generateCastleMoves(i, piece);
				} else if (Piece.isType(piece, Piece.Knight)) {
					generateKnightMoves(i);
				} else if (Piece.isType(piece, Piece.Bishop) || Piece.isType(piece, Piece.Rook) || Piece.isType(piece, Piece.Queen)) {
					generateSlidingMoves(i, piece);
				} else if (Piece.isType(piece, Piece.Pawn)) {
					generatePawnMoves(i, piece);
				}
			}
		}
		return moves;
	}
	
	public static boolean[] updateKingStatus() {
		Game.changeColor();
		ArrayList<Move> allMoves = computeMoves();
		final int kingSquare = Game.color == Piece.White ? Game.blackKing : Game.whiteKing;
		final int castleVector = Game.color == Piece.White ? 0 : 56;
		
		boolean captureKing = false;
		boolean canShortCastle = true;
		boolean canLongCastle = true;
		
		for (Move move : allMoves) {
			if (move.endSquare == kingSquare) {
				captureKing = true;
				break;
			} else if (move.endSquare == 5 + castleVector || move.endSquare == 6 + castleVector) {
				canShortCastle = false;
			} else if (move.endSquare == 3 + castleVector || move.endSquare == 2 + castleVector) {
				canLongCastle = false;
			}
		}
		Game.changeColor();
		boolean [] kingStatus = {captureKing, canShortCastle, canLongCastle};
	
		return kingStatus;
	}
	
	public static ArrayList<Move> computeLegalMoves() {
		boolean [] kingStatus = updateKingStatus();
		Game.kingInCheck = kingStatus[0];
		Game.canShortCastle = kingStatus[1];
		Game.canLongCastle = kingStatus[2];
		
		ArrayList<Move> allMoves = computeMoves();
		ArrayList<Move> legalMoves = new ArrayList<>();
		
		for (Move move : allMoves) {
			Game.move(move);
			Game.changeColor();
			final int kingSquare = Game.color == Piece.White ? Game.blackKing : Game.whiteKing;
			ArrayList<Move> oponentResponses = computeMoves();
			
			boolean captureKing = false;
			for (Move response : oponentResponses) {
				if (response.endSquare == kingSquare) {
					captureKing = true;
					break;
				}
			}
			
			if (!captureKing) {
				legalMoves.add(move);
			}
			Game.unmakeMove(move);
			Game.changeColor();
			
			moves = legalMoves;
		}
		
		return moves;
	}
	
	private static void generateSlidingMoves(int square, int piece) {
		final int startIndex = Piece.isType(piece, Piece.Bishop) ? 4 : 0;
		final int endIndex = Piece.isType(piece, Piece.Rook) ? 4 : 8;
		
		for (int direction = startIndex; direction < endIndex; direction++) {
			for (int n = 0; n < squaresToEdge[square][direction]; n++) {
				
				final int target = square + directionsVector[direction] * (n + 1);
				final int targetPiece = Board.Square[target];
				
				if (Piece.isColor(targetPiece, Game.color)) break;
				
				moves.add(new Move(square, target));
				
				if (Piece.isColor(targetPiece, Game.oponentColor)) break;
			}
		}
	}
	
	private static void generateKingMoves(int square) {
		for (int i = 0; i < 8; i++) {
			final int target = kingMoves[square][i];
			if (target == -1) continue;
			
			final int targetPiece = Board.Square[target];
			
			if (!Piece.isColor(targetPiece, Game.color)) {
				moves.add(new Move(square, target));
			}
		}
	}
	
	private static void generateKnightMoves(int square) {
		for (int i = 0; i < 8; i++) {
			final int target = knightMoves[square][i];
			if (target == -1) continue;
			
			final int targetPiece = Board.Square[target];
			
			if (!Piece.isColor(targetPiece, Game.color)) {
				moves.add(new Move(square, target));
			}
		}
	}
	
	private static void addPromotionMoves(int square, int target) {
		moves.add(new Promotion(square, target, Piece.Queen | Game.color));
		moves.add(new Promotion(square, target, Piece.Rook | Game.color));
		moves.add(new Promotion(square, target, Piece.Bishop | Game.color));
		moves.add(new Promotion(square, target, Piece.Knight | Game.color));
	}
	
	private static void generatePawnMoves(int square, int piece) {
		final int x = square % 8;
		final int y = Math.floorDiv(square, 8);
		
		if (Piece.isColor(piece, Piece.White)) {
			if (y < 7 && Board.getXY(x, y + 1) == Piece.None) { 
				final int target = Board.getSquare(x, y + 1);
				if (y == 6) {
					addPromotionMoves(square, target);
				}
				else if (y == 1 && Board.getXY(x, y + 2) == Piece.None) {
					final int target2squares = Board.getSquare(x, y + 2);
					moves.add(new Move(square, target2squares));
				} else {
					moves.add(new Move(square, target));
				}
			}
			if (x < 7 && Piece.isColor(Board.getXY(x + 1, y + 1), Game.oponentColor)) {
				final int target = Board.getSquare(x + 1, y + 1);
				if (y == 6) {
					addPromotionMoves(square, target);
				} else {
					moves.add(new Move(square, target));
				}
			}
			if (x > 0 && Piece.isColor(Board.getXY(x - 1, y + 1), Game.oponentColor)) {
				final int target = Board.getSquare(x - 1, y + 1);
				if (y == 6) {
					addPromotionMoves(square, target);
				} else {
					moves.add(new Move(square, target));
				}
			}
			if (y == 4) {
				Move lastMove = Game.getLastMove();
				final boolean lastMovePawn = Piece.isType(Board.Square[lastMove.endSquare], Piece.Pawn);
				final boolean twoSquares = Math.abs(lastMove.endSquare - lastMove.startSquare) == 16;
				final boolean sameY = Math.floorDiv(lastMove.endSquare, 8) == y;
				
				if (lastMovePawn && twoSquares && sameY) {
					if (lastMove.endSquare == square + 1) {
						moves.add(new Enpassant(square, square + 9));
					} else if (lastMove.endSquare == square - 1) {
						moves.add(new Enpassant(square, square + 7));
					}
				}
			}
		} else {
			if (y > 0 && Board.getXY(x, y - 1) == Piece.None) { 
				final int target = Board.getSquare(x, y - 1);
				if (y == 1) {
					addPromotionMoves(square, target);
				}
				else if (y == 6 && Board.getXY(x, y - 2) == Piece.None) {
					final int target2squares = Board.getSquare(x, y - 2);
					moves.add(new Move(square, target2squares));
				} else {
					moves.add(new Move(square, target));
				}
			}
			if (x < 7 && Piece.isColor(Board.getXY(x + 1, y - 1), Game.oponentColor)) {
				final int target = Board.getSquare(x + 1, y - 1);
				if (y == 1) {
					addPromotionMoves(square, target);
				} else if (y > 1){
					moves.add(new Move(square, target));
				}
			}
			if (x > 0 && Piece.isColor(Board.getXY(x - 1, y - 1), Game.oponentColor)) {
				final int target = Board.getSquare(x - 1, y - 1);
				if (y == 1) {
					addPromotionMoves(square, target);
				} else if (y > 1) {
					moves.add(new Move(square, target));
				}
			}
			if (y == 3) {
				Move lastMove = Game.getLastMove();
				final boolean lastMovePawn = Piece.isType(Board.Square[lastMove.endSquare], Piece.Pawn);
				final boolean twoSquares = Math.abs(lastMove.endSquare - lastMove.startSquare) == 16;
				final boolean sameY = Math.floorDiv(lastMove.endSquare, 8) == y;
				
				if (lastMovePawn && twoSquares && sameY) {
					if (lastMove.endSquare == square + 1) {
						moves.add(new Enpassant(square, square - 7));
					} else if (lastMove.endSquare == square - 1) {
						moves.add(new Enpassant(square, square - 9));
					}
				}
			}
		}
	}
	
	private static void generateCastleMoves(int square, int piece) {
		if (Piece.wasMoved(piece) || Game.kingInCheck) return;
		
		final int rookRight = Board.Square[square + 3];
		final int rookLeft = Board.Square[square - 4];
		
		boolean shortCastle = Game.canShortCastle && !Piece.wasMoved(rookRight) && !Piece.isType(rookRight, Piece.None);
		boolean longCastle = Game.canLongCastle && !Piece.wasMoved(rookLeft) && !Piece.isType(rookLeft, Piece.None);

		if (shortCastle) {
			for (int i = 1; i <= 2; i++) {
				if (Board.Square[square + i] != Piece.None) {
					shortCastle = false;
					break;
				}
			}
		}
		if (longCastle) {
			for (int i = 1; i <= 3; i++) {
				if (Board.Square[square - i] != Piece.None) {
					longCastle = false;
					break;
				}
			}
		}
		
		if (shortCastle) moves.add(new Castle(square, square + 2, square + 3, square + 1));
		if (longCastle) moves.add(new Castle(square, square - 2, square - 4, square - 1));
	}
}
