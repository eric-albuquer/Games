package Xadrez;

import java.util.ArrayList;

import Xadrez.move.*;

public class Bot {
	
    static class Evaluation {
        float value;
        Move bestMove;

        Evaluation(float value, Move bestMove) {
            this.value = value;
            this.bestMove = bestMove;
        }
    }
    
    private static final float[][] pawnBonus = {
    	    { 0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f},
    	    { 0.5f,  0.5f,  0.5f, -0.5f, -0.5f,  0.5f,  0.5f,  0.5f},
    	    { 0.5f,  0.0f, -0.5f,  0.1f,  0.1f, -0.5f,  0.0f,  0.5f},
    	    { 0.0f,  0.0f,  0.0f,  1.0f,  1.0f,  0.0f,  0.0f,  0.0f},
    	    { 0.5f,  0.5f,  1.0f,  1.0f,  1.0f,  1.0f,  0.5f,  0.5f},
    	    { 1.0f,  1.0f,  1.0f,  1.0f,  1.0f,  1.0f,  1.0f,  1.0f},
    	    { 1.0f,  1.0f,  1.0f,  1.0f,  1.0f,  1.0f,  1.0f,  1.0f},
    	    { 0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f}
    	};
    
    private static final float[][] knightBonus = {
    	    {-1.0f, -0.5f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f, -1.0f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    { 0.0f,  0.0f,  0.5f,  0.5f,  0.5f,  0.5f,  0.0f,  0.0f},
    	    { 0.0f,  0.0f,  0.5f,  1.0f,  1.0f,  0.5f,  0.0f,  0.0f},
    	    { 0.0f,  0.0f,  0.5f,  1.0f,  1.0f,  0.5f,  0.0f,  0.0f},
    	    { 0.0f,  0.0f,  0.5f,  0.5f,  0.5f,  0.5f,  0.0f,  0.0f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-1.0f, -0.5f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f, -1.0f}
    	};
    
    private static final float[][] bishopBonus = {
    	    {-1.0f, -0.5f, -0.5f, -0.5f, -0.5f, -0.5f, -0.5f, -1.0f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-0.5f,  0.0f,  0.5f,  0.5f,  0.5f,  0.5f,  0.0f, -0.5f},
    	    {-0.5f,  0.5f,  0.5f,  1.0f,  1.0f,  0.5f,  0.5f, -0.5f},
    	    {-0.5f,  0.0f,  0.5f,  1.0f,  1.0f,  0.5f,  0.0f, -0.5f},
    	    {-0.5f,  0.5f,  0.5f,  0.5f,  0.5f,  0.5f,  0.5f, -0.5f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-1.0f, -0.5f, -0.5f, -0.5f, -0.5f, -0.5f, -0.5f, -1.0f}
    	};

    private static final float[][] rookBonus = {
    	    { 0.0f,  0.0f,  0.2f,  0.5f,  0.5f,  0.2f,  0.0f,  0.0f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    { 0.5f,  0.5f,  0.5f,  0.5f,  0.5f,  0.5f,  0.5f,  0.5f},
    	    { 0.0f,  0.0f,  0.2f,  0.5f,  0.5f,  0.2f,  0.0f,  0.0f}
    	};

    private static final float[][] queenBonus = {
    	    {-1.0f, -0.5f, -0.5f, -0.5f, -0.5f, -0.5f, -0.5f, -1.0f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-0.5f,  0.0f,  0.5f,  0.5f,  0.5f,  0.5f,  0.0f, -0.5f},
    	    {-0.5f,  0.5f,  0.5f,  1.0f,  1.0f,  0.5f,  0.5f, -0.5f},
    	    {-0.5f,  0.0f,  0.5f,  1.0f,  1.0f,  0.5f,  0.0f, -0.5f},
    	    {-0.5f,  0.5f,  0.5f,  0.5f,  0.5f,  0.5f,  0.5f, -0.5f},
    	    {-0.5f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f,  0.0f, -0.5f},
    	    {-1.0f, -0.5f, -0.5f, -0.5f, -0.5f, -0.5f, -0.5f, -1.0f}
    	};
    
    private static double distanceToCenter(int position) {
    	final double center = 3.5;
    	final int x = position % 8;
    	final int y = Math.floorDiv(position, 8);
    	final double deltaX = center - x;
    	final double deltaY = center - y;
    	return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }
    
    private static double kingsDistance() {
    	final int xWhite = Game.whiteKing % 8;
    	final int yWhite = Math.floorDiv(Game.whiteKing, 8);
    	final int xBlack = Game.blackKing % 8;
    	final int yBlack = Math.floorDiv(Game.blackKing, 8);
    	final double deltaX = xBlack - xWhite;
    	final double deltaY = yBlack - yWhite;
    	return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }

    public static float evaluate() {
        float evaluation = 0;
        float colorMaterial = 0;
        float oponentMaterial = 0;
        for (int i = 0; i < 64; i++) {
            int piece = Board.Square[i];
            int pieceColor = piece & 24;
            int color = pieceColor == Game.color ? 1 : -1;
            
            final int x = i % 8;
            final int y = Math.floorDiv(i, 8);
            final int yRelative = Piece.isColor(piece, Piece.Black) ? 7 - y : y;

            if (Piece.isType(piece, Piece.Pawn)) {
                evaluation += color * (1 + pawnBonus[yRelative][x]);
                if (color == 1) {
                	colorMaterial += 1;
                } else {
                	oponentMaterial += 1;
                }
            } else if (Piece.isType(piece, Piece.Knight)) {
                evaluation += color * (3 + knightBonus[yRelative][x]);
                if (color == 1) {
                	colorMaterial += 3;
                } else {
                	oponentMaterial += 3;
                }
            } else if (Piece.isType(piece, Piece.Bishop)) {
                evaluation += color * (3 + bishopBonus[yRelative][x] / 2);
                if (color == 1) {
                	colorMaterial += 3;
                } else {
                	oponentMaterial += 3;
                }
            } else if (Piece.isType(piece, Piece.Rook)) {
                evaluation += color * (5 + rookBonus[yRelative][x]);
                if (color == 1) {
                	colorMaterial += 5;
                } else {
                	oponentMaterial += 5;
                }
            } else if (Piece.isType(piece, Piece.Queen)) {
                evaluation += color * (9 + queenBonus[yRelative][x]);
                if (color == 1) {
                	colorMaterial += 9;
                } else {
                	oponentMaterial += 9;
                }
            }
        }
        float totalMaterial = colorMaterial + oponentMaterial;
        float endgameWeight = 1 - totalMaterial / 78; 
        
        evaluation += kingsDistance() * (1 - 2 * endgameWeight) / 5;

        return evaluation;
    }

    public static Evaluation search(int depth, float alpha, float beta) {
        if (depth == 0) return new Evaluation(evaluate(), null);

        ArrayList<Move> legalMoves = GenerateMoves.computeLegalMoves();

        if (legalMoves.size() == 0) {
            if (Game.kingInCheck) return new Evaluation(Float.NEGATIVE_INFINITY, null);
            return new Evaluation(0, null);
        }

        Move bestMove = null;

        for (Move move : legalMoves) {
            Game.move(move);
            Game.changeColor();
            float evaluation = -search(depth - 1, -beta, -alpha).value;
            Game.unmakeMove(move);
            Game.changeColor();

            if (evaluation >= beta) {
                return new Evaluation(beta, move);
            }

            if (evaluation > alpha) {
                alpha = evaluation;
                bestMove = move;
            }
        }
        return new Evaluation(alpha, bestMove);
    }

    // Método para obter o melhor movimento
    public static Move getBestMove(int depth) {
        Evaluation evaluation = search(depth, Float.NEGATIVE_INFINITY, Float.POSITIVE_INFINITY);
        return evaluation.bestMove;
    }
}
