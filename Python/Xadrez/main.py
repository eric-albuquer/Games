import pygame
import sys

WIDTH = 600
HEIGHT = 600

CELL_W = WIDTH / 8
CELL_H = HEIGHT / 8

class Piece:
    none = 0    

    pawn = 1
    rook = 2
    knight = 4
    bishop = 8
    queen = 16
    king = 32

    white = 64
    black = 128

    def isType(type, piece):
        return type & piece
    
    def isNone(piece):
        return not piece
    
background_img = pygame.image.load("./images/background.png")
background_img = pygame.transform.scale(background_img, (WIDTH, HEIGHT))
    
sumary = {
    Piece.pawn | Piece.white: pygame.image.load("./images/wp.png"),
    Piece.rook | Piece.white: pygame.image.load("./images/wr.png"),
    Piece.knight | Piece.white: pygame.image.load("./images/wn.png"),
    Piece.bishop | Piece.white: pygame.image.load("./images/wb.png"),
    Piece.queen | Piece.white: pygame.image.load("./images/wq.png"),
    Piece.king | Piece.white: pygame.image.load("./images/wk.png"),
    Piece.pawn | Piece.black: pygame.image.load("./images/bp.png"),
    Piece.rook | Piece.black: pygame.image.load("./images/br.png"),
    Piece.knight | Piece.black: pygame.image.load("./images/bn.png"),
    Piece.bishop | Piece.black: pygame.image.load("./images/bb.png"),
    Piece.queen | Piece.black: pygame.image.load("./images/bq.png"),
    Piece.king | Piece.black: pygame.image.load("./images/bk.png"),
}

for key in sumary:
    sumary[key] = pygame.transform.scale(sumary[key], (CELL_W, CELL_H))

class PreComputeMoves:
    rook_moves = []
    bishop_moves = []
    knight_moves = []
    queen_moves = []
    king_moves = []

    def compute_rook(self):
        for i in range(8):
            for j in range(8):
                
    
class Table:
    def __init__(self) -> None:
        self.board = [[Piece.none for _ in range(8)] for _ in range(8)]

        for i in range(8):
            for j in range(2):
                if j == 0:
                    self.board[1][i] = Piece.pawn | Piece.black
                else:
                    self.board[6][i] = Piece.pawn | Piece.white

        for i in range(2):
            if i == 0:
                color = Piece.black
                y = 0
            else:
                color = Piece.white
                y = 7

            self.board[y][0] = Piece.rook | color
            self.board[y][1] = Piece.knight | color
            self.board[y][2] = Piece.bishop | color
            self.board[y][3] = Piece.queen | color
            self.board[y][4] = Piece.king | color
            self.board[y][5] = Piece.bishop | color
            self.board[y][6] = Piece.knight | color
            self.board[y][7] = Piece.rook | color

    def move(self, x0, y0, x1, y1):
        if x0 == x1 and y0 == y1: return
        self.board[y1][x1] = self.board[y0][x0]
        self.board[y0][x0] = Piece.none

    def draw(self):
        # Initialize pygame
        pygame.init()

        start_pos = None
        end_pos = None

        button_pressed = False

        # Set up the display
        window_size = (WIDTH, HEIGHT)
        screen = pygame.display.set_mode(window_size)
        pygame.display.set_caption("Xadrez")

        # Main loop
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1 and not button_pressed:  # Verifica se o botão esquerdo foi pressionado
                    pos_mouse = pygame.mouse.get_pos()
                    button_pressed = True
                    
                    if start_pos:  # Se já temos a posição inicial
                        end_pos = (int(pos_mouse[0] / CELL_W), int(pos_mouse[1] / CELL_H))

                        self.move(*start_pos, *end_pos)
                        
                        # Resetar as variáveis após o segundo clique
                        start_pos = None
                        end_pos = None
                    else:
                        start_pos = (int(pos_mouse[0] / CELL_W), int(pos_mouse[1] / CELL_H))  # Define a posição inicial com o primeiro clique

            elif event.type == pygame.MOUSEBUTTONUP:
                button_pressed = False

            screen.blit(background_img, (0, 0))

            if start_pos:
                pygame.draw.rect(screen, (255, 255, 0), (start_pos[0] * CELL_W, start_pos[1] * CELL_H, CELL_W, CELL_H))

            for i in range(8):
                y = i * CELL_H
                for j in range(8):
                    x = j * CELL_W
                    piece_data = self.board[i][j]
                    if not Piece.isNone(piece_data):
                        screen.blit(sumary[piece_data], (x, y))

            
            # Update the display
            pygame.display.flip()

        # Quit pygame
        pygame.quit()
        sys.exit()


table = Table()

table.draw()
