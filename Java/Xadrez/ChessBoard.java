package Xadrez;

import javax.swing.*;

import Xadrez.move.*;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class ChessBoard extends JPanel {

    private static final int BOARD_SIZE = 8; // Tamanho do tabuleiro 8x8
    private static final int TILE_SIZE = 80; // Tamanho de cada quadrado do tabuleiro
    
    private static final Color CHESS_WHITE = new Color(235, 236, 208); // Cor clara (ex: bege claro)
    private static final Color CHESS_BLACK = new Color(115, 149, 82);   // Cor escura (ex: marrom claro)
    
    private static Timer timer;
    
    private Map<Integer, Image> pieceImagesMap = new HashMap<>();
    
    public ChessBoard() {
        loadPieceImages();
    }
    
    private void loadPieceImages() {
        try {
            pieceImagesMap.put(Piece.Black | Piece.Rook, ImageIO.read(new File("images/br.png")));
            pieceImagesMap.put(Piece.Black | Piece.Knight, ImageIO.read(new File("images/bn.png")));
            pieceImagesMap.put(Piece.Black | Piece.Bishop, ImageIO.read(new File("images/bb.png")));
            pieceImagesMap.put(Piece.Black | Piece.Queen, ImageIO.read(new File("images/bq.png")));
            pieceImagesMap.put(Piece.Black | Piece.King, ImageIO.read(new File("images/bk.png")));
            pieceImagesMap.put(Piece.Black | Piece.Pawn, ImageIO.read(new File("images/bp.png")));
            pieceImagesMap.put(Piece.White | Piece.Rook, ImageIO.read(new File("images/wr.png")));
            pieceImagesMap.put(Piece.White | Piece.Knight, ImageIO.read(new File("images/wn.png")));
            pieceImagesMap.put(Piece.White | Piece.Bishop, ImageIO.read(new File("images/wb.png")));
            pieceImagesMap.put(Piece.White | Piece.Queen, ImageIO.read(new File("images/wq.png")));
            pieceImagesMap.put(Piece.White | Piece.King, ImageIO.read(new File("images/wk.png")));
            pieceImagesMap.put(Piece.White | Piece.Pawn, ImageIO.read(new File("images/wp.png")));
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Erro ao carregar as imagens das peças.");
        }
    }
    
    private void drawGame(Graphics g) {
        for (int row = 0; row < BOARD_SIZE; row++) {
            for (int col = 0; col < BOARD_SIZE; col++) {
                if ((row + col) % 2 == 1) {
                    g.setColor(CHESS_WHITE);
                } else {
                    g.setColor(CHESS_BLACK);
                }
                g.fillRect(col * TILE_SIZE, (7 - row) * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                // Desenhar a peça usando o dicionário
                int piece = Board.getXY(col, row);
                if (piece != Piece.None) {
                    piece &= 31;
                    Image pieceImage = pieceImagesMap.get(piece);
                    g.drawImage(pieceImage, col * TILE_SIZE, (7 - row) * TILE_SIZE, TILE_SIZE, TILE_SIZE, this);
                }
            }
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        this.drawGame(g);	
        Move bestMove = new Bot().search(4, Float.NEGATIVE_INFINITY, Float.POSITIVE_INFINITY).bestMove;
        System.out.println(Bot.evaluate());
        Game.move(bestMove);
        Game.changeColor();
    }

    @Override
    public Dimension getPreferredSize() {
        return new Dimension(BOARD_SIZE * TILE_SIZE, BOARD_SIZE * TILE_SIZE);
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Xadrez");
        ChessBoard chessBoard = new ChessBoard();
        new Game();
        GenerateMoves.computeLegalMoves();
        
        frame.add(chessBoard);
        frame.pack();
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null); // Centralizar a janela na tela
        frame.setVisible(true);
        
        // Atualizar o frame 15 vezes por segundo
        timer = new Timer(1000, e -> chessBoard.repaint());
        timer.start();
    }
}
