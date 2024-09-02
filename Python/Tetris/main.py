import random
import pygame
import sys
import numpy as np

WIDTH, HEIGHT = 1920, 1080
CELL_SIZE = 50
MARGIN = 1
#ROWS, COLS = HEIGHT // (CELL_SIZE + MARGIN), WIDTH // (CELL_SIZE + MARGIN)
ROWS, COLS = 20, 10

FPS = 144
FRAME_TIME = 200 # miliseconds
INPUT_UPDATE_TIME = 80

SCORE_BONUS = 0.8

# Cores
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
LIGHT_BLUE = (0, 156, 224)
DARK_BLUE = (0, 44, 166)
GREEN = (77, 186, 18)
RED = (218, 0, 8)
PINK = (177, 19, 136)
YELLOW = (250, 201, 41)
ORANGE = (215, 92, 0)
GRAY = (20, 20, 20)
BLUE = (0, 0, 255)
PURPLE = (82, 101, 178)
GOLD = (248, 221, 56)
LIGHT_GRAY = (60,60,60)

matrix = [[BLACK for row in range(ROWS)] for col in range(COLS)]

piece = [[0,0] for _ in range(4)]

static_parts = []

actual_color = LIGHT_BLUE

# for i in range(4):
#     for j in range(COLS - 1):
#         static_parts.append([j, 19 - i, GREEN])

score = 0

single = 0
double = 0
triple = 0
tetris = 0

class Statistics:
    def __init__(self):
        self.o = 0
        self.i = 0
        self.t = 0
        self.l = 0
        self.j = 0
        self.s = 0
        self.z = 0

    def get_total(self):
        total = self.o + self.i + self.t + self.l + self.j + self.s + self.z
        return total

    def add_piece(self, name):
        match name:
            case "O": self.o += 1
            case "I": self.i += 1
            case "T": self.t += 1
            case "L": self.l += 1
            case "J": self.j += 1
            case "S": self.s += 1
            case "Z": self.z += 1

    def get_value(self, name):
        match name:
            case "O": return (self.o * 100 / self.get_total(), self.o)
            case "I": return (self.i * 100 / self.get_total(), self.i) 
            case "T": return (self.t * 100 / self.get_total(), self.t) 
            case "L": return (self.l * 100 / self.get_total(), self.l) 
            case "J": return (self.j * 100 / self.get_total(), self.j) 
            case "S": return (self.s * 100 / self.get_total(), self.s) 
            case "Z": return (self.z * 100 / self.get_total(), self.z) 

statistcs = Statistics()

class Piece:
    def __init__(self, name, start_x, color, shape):
        self.name = name
        self.start_x = start_x
        self.shape = shape
        self.color = color

parts = [
    Piece("O", 4, YELLOW,
            [
            [0,0],
            [0,1],
            [1,0],
            [1,1],
            ]),
    
    Piece("I", 3, LIGHT_BLUE,
            [
            [0,0],
            [1,0],
            [2,0],
            [3,0],
            ]),

    Piece("L", 3, ORANGE,
            [
            [0,0],
            [1,0],
            [2,0],
            [0,1],
            ]),

    Piece("J", 3, DARK_BLUE,
            [
            [0,0],
            [1,0],
            [2,0],
            [2,1],
            ]),

    Piece("T", 3, PINK,
            [
            [0,0],
            [1,0],
            [2,0],
            [1,1],
            ]),

    Piece("S", 3, GREEN, 
            [
            [0,1],
            [1,1],
            [1,0],
            [2,0],
            ]),

    Piece("Z", 3, RED,
            [
            [0,0],
            [1,0],
            [1,1],
            [2,1],
            ])
]

next_piece = random.choice(parts)

def allow_rotation_side(array):
    for element in array:
        if element[0] < 0:
            return 1
        if element[0] >= COLS:
            return -1
    return 0

def allow_rotation(array):
    for element in array:
        if element[0] < 0 or element[0] >= COLS or element[1] < 0 or element[1] >= ROWS:
            return False
        for part in static_parts:
            if element[0] == part[0] and element[1] == part[1]:
                return False
    return True

def rotate(orientation):
    dx_min = 100
    dx_max = -100
    dy_min = 100
    dy_max = -100

    for position in piece:
        if position[0] < dx_min:
            dx_min = position[0]
        if position[0] > dx_max:
            dx_max = position[0]
        if position[1] < dy_min:
            dy_min = position[1]
        if position[1] > dy_max:
            dy_max = position[1]

    rotation_matrix = np.array([
    [0,1],
    [-1,0]
    ])

    new_parts = []

    center = round((dx_min + dx_max) / 2), round((dy_min + dy_max) / 2)

    for position in piece:
        x = position[0] - center[0]
        y = position[1] - center[1]

        if orientation:
            point = np.transpose(rotation_matrix).dot([x,y])
        else:
            point = rotation_matrix.dot([x,y])

        new_y = dy_max if dy_max - dy_min <= 2 else center[1]
        x = int(point[0] + center[0])
        y = int(point[1] + new_y)
        new_parts.append([x, y])

    x = allow_rotation_side(new_parts)
    for element in new_parts:
        element[0] += x

    if allow_rotation(new_parts):
        for position in enumerate(piece):
            position[1][0] = new_parts[position[0]][0]
            position[1][1] = new_parts[position[0]][1]

def insert(part, x, y = 0):
    for position in enumerate(part):
        piece[position[0]][0] = x + position[1][0]
        piece[position[0]][1] = y + position[1][1]

def erase():
    for row in range(ROWS):
        for col in range(COLS):
            matrix[col][row] = BLACK

def choose(choosed):
    global actual_color, next_piece
    shape = choosed.shape
    x = choosed.start_x
    actual_color = choosed.color
    insert(shape, x)
    statistcs.add_piece(choosed.name)
    next_piece = random.choice(parts)

def check_floor(y):
    if y == 19: return True
    return False

def check_colide(x, y):
    if y < 19:
        for piece in static_parts:
            if piece[0] == x and piece[1] == y + 1:
                return True
    return False

def freeze():
    for position in piece:
        static_parts.append([position[0], position[1], actual_color])
    choose(next_piece)
    global FRAME_TIME
    if FRAME_TIME >= 0.8:
        FRAME_TIME -= 0.01

def colision():
    for position in piece:
        if check_floor(position[1]) or check_colide(position[0], position[1]):
            freeze()
            return True
    return False

def fall():
    if not colision():
        for position in piece:
            position[1] += 1
    
def update():
    for position in piece:
        matrix[position[0]][position[1]] = actual_color
    for position in static_parts:
        matrix[position[0]][position[1]] = position[2]

def check_boarder(x, dx, y):
    if x + dx >= COLS or x + dx < 0: return True
    for part in static_parts:
        if x + dx == part[0] and y == part[1]:
            return True
    return False

def move_part(dx):
    for position in piece:
        if check_boarder(position[0], dx, position[1]):
            return
    for position in piece:
        position[0] += dx

def fall_static_parts(y):
    for part in static_parts:
        if part[1] < y:
            part[1] += 1

def erase_line(y):
    parts = []
    for part in static_parts:
        if part[1] == y:
            parts.append(part)
    for part in parts:
        static_parts.remove(part)

def set_score(rows):
    if rows > 0:
        global single, double, triple, tetris, score

        match rows:
            case 1: single += 1
            case 2: double += 1
            case 3: triple += 1
            case 4: tetris += 1

        sound = pygame.mixer.Sound('./sounds/score4.wav')
        sound.set_volume(50)
        sound.play()

        score += rows**2 * SCORE_BONUS

def verify_line():
    count = 0
    rows = []
    for row in range(ROWS):
        for part in static_parts:
            if part[1] == row:
                count += 1
        if count < 10:
            count = 0
        else:
            rows.append(row)
            count = 0
    
    for row in rows:
        erase_line(row)
        fall_static_parts(row)
    
    set_score(len(rows))

def game_over():
    for position in static_parts:
        if position[0] > 3 and position[0] < 6 and position[1] == 0:
            return True
    return False

def draw():
    update()
    pygame.draw.rect(screen, WHITE, (1920 // 3 - 1, 40 - 1, (CELL_SIZE + MARGIN) * COLS + 1, (CELL_SIZE + MARGIN) * ROWS + 1))
    for col in range(COLS):
        for row in range(ROWS):
            x = col * (CELL_SIZE + MARGIN)
            y = row * (CELL_SIZE + MARGIN)
            color = matrix[col][row]
            pygame.draw.rect(screen, color, (x + 1920 // 3, y + 40, CELL_SIZE, CELL_SIZE))

def draw_piece(piece, x, y, size):
    shape = piece.shape
    color = piece.color
    for position in shape:
        pygame.draw.rect(screen, WHITE, (x + (position[0] * (size + MARGIN)) - MARGIN, y + (position[1] * (size + MARGIN)) - MARGIN, size + 2 * MARGIN, size + 2 * MARGIN))
        pygame.draw.rect(screen, color, (x + (position[0] * (size + MARGIN)), y + (position[1] * (size + MARGIN)), size, size))

def create_menssage(size, text, color, position):
    message = pygame.font.Font(None, size).render(text, True, color)
    screen.blit(message, position)

def messages():
    pygame.draw.rect(screen, GRAY, (1920 * 3 // 5 + 3, 39, 250, 680))
    pygame.draw.rect(screen, LIGHT_GRAY, (1920 * 3 // 5 + 13, 39 + 10, 230, 660))

    pygame.draw.rect(screen, GRAY, (1920 * 1 // 5, 39, 250, 680))
    pygame.draw.rect(screen, LIGHT_GRAY, (1920 * 1 // 5 + 10, 39 + 10, 230, 660))

    create_menssage(60, f"Score: {round(score)}", GOLD, (1920 * 1 // 5 + 40, CELL_SIZE + 3))
    create_menssage(60, f"Single: {single}", ORANGE, (1920 * 1 // 5 + 40, 4 * CELL_SIZE + 3))
    create_menssage(60, f"Double: {double}", RED, (1920 * 1 // 5 + 40, 7 * CELL_SIZE + 3))
    create_menssage(60, f"Triple: {triple}", GREEN, (1920 * 1 // 5 + 40, 10 * CELL_SIZE + 3))
    create_menssage(60, f"Tetris: {tetris}", PINK, (1920 * 1 // 5 + 40, 13 * CELL_SIZE + 3))

    draw_piece(parts[0], 1920 * 3 // 5 + CELL_SIZE, CELL_SIZE + 3, CELL_SIZE / 2)
    create_menssage(60, f"{statistcs.get_value("O")[1]}", YELLOW, (1920 * 3 // 5 + 4 * CELL_SIZE, CELL_SIZE + 3))
    
    draw_piece(parts[1], 1920 * 3 // 5 + CELL_SIZE, 3 * CELL_SIZE + 3, CELL_SIZE / 2)
    create_menssage(60, f"{statistcs.get_value("I")[1]}", LIGHT_BLUE, (1920 * 3 // 5 + 4 * CELL_SIZE, 3 * CELL_SIZE + 3))

    draw_piece(parts[2], 1920 * 3 // 5 + CELL_SIZE, 5 * CELL_SIZE + 3, CELL_SIZE / 2)
    create_menssage(60, f"{statistcs.get_value("L")[1]}", ORANGE, (1920 * 3 // 5 + 4 * CELL_SIZE, 5 * CELL_SIZE + 3))

    draw_piece(parts[3], 1920 * 3 // 5 + CELL_SIZE, 7 * CELL_SIZE + 3, CELL_SIZE / 2)
    create_menssage(60, f"{statistcs.get_value("J")[1]}", DARK_BLUE, (1920 * 3 // 5 + 4 * CELL_SIZE, 7 * CELL_SIZE + 3))

    draw_piece(parts[4], 1920 * 3 // 5 + CELL_SIZE, 9 * CELL_SIZE + 3, CELL_SIZE / 2)
    create_menssage(60, f"{statistcs.get_value("T")[1]}", PINK, (1920 * 3 // 5 + 4 * CELL_SIZE, 9 * CELL_SIZE + 3))
    
    draw_piece(parts[5], 1920 * 3 // 5 + CELL_SIZE, 11 * CELL_SIZE + 3, CELL_SIZE / 2)
    create_menssage(60, f"{statistcs.get_value("S")[1]}", GREEN, (1920 * 3 // 5 + 4 * CELL_SIZE, 11 * CELL_SIZE + 3))

    draw_piece(parts[6], 1920 * 3 // 5 + CELL_SIZE, 13 * CELL_SIZE + 3, CELL_SIZE / 2)
    create_menssage(60, f"{statistcs.get_value("Z")[1]}", RED, (1920 * 3 // 5 + 4 * CELL_SIZE, 13 * CELL_SIZE + 3))

    pygame.draw.rect(screen, GRAY, (1920 * 1 // 5, CELL_SIZE * 14, 250, 250))
    draw_piece(next_piece, 1920 * 1 // 5 + CELL_SIZE + 10, 15.7 * CELL_SIZE, CELL_SIZE * 0.8)

pygame.init()

screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.FULLSCREEN)
pygame.display.set_caption("Tetris")

class Button:
    def __init__(self, x, y, width, height, font_size, font_text, color, background_color, margin = 10):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.font_size = font_size
        self.font_text = font_text
        self.color = color
        self.background_color = background_color
        self.margin = margin

        self.button_rect = pygame.Rect(x, y, width, height)
        self.button_text = pygame.font.Font(None, font_size).render(font_text, True, color)

    def get_text(self):
        return self.button_text
    
    def get_rect(self):
        return self.button_rect
    
    def pressed(self):
        return self.button_rect.collidepoint(event.pos)
    
    def draw(self):
        pygame.draw.rect(screen, WHITE, pygame.Rect(self.x - self.margin, self.y - self.margin, self.width + 2 * self.margin, self.height + 2 * self.margin))
        pygame.draw.rect(screen, self.background_color, self.button_rect)
        screen.blit(self.button_text, (self.button_rect.centerx - self.button_text.get_width() // 2, self.button_rect.centery - self.button_text.get_height() // 2))

choose(random.choice(parts))

frame = 0

pygame.mixer.init()
pygame.mixer.music.load("./music/tetris_song.mp3")
pygame.mixer.music.set_endevent(pygame.USEREVENT)
pygame.mixer.music.play()

button_left = Button(100, HEIGHT / 2, 200, 200, 90, "Left", PURPLE, YELLOW)
button_right = Button(WIDTH - 430, HEIGHT / 2, 200, 200, 90, "Right", PURPLE, YELLOW)
button_down = Button(WIDTH - 730, HEIGHT / 2 + 300, 200, 200, 90, "Down", PURPLE, YELLOW)
button_rotate_clockwise = Button(100, HEIGHT / 2 + 300, 200, 200, 90, "Rotate", PURPLE, YELLOW)
button_rotate_counter_clockwise = Button(WIDTH - 430, HEIGHT / 2 + 300, 200, 200, 90, "Rotate", PURPLE, YELLOW)

clock = pygame.time.Clock()

time_pressed = 0

# Loop principal
while True:
    frame += 1
    screen.fill(PURPLE)
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.mixer.quit()
            pygame.quit()
            sys.exit()
        elif event.type == pygame.USEREVENT:
            pygame.mixer.music.play()
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                pygame.mixer.quit()
                pygame.quit()   
                sys.exit()
            elif event.key == pygame.K_a:
                rotate(True)
            elif event.key == pygame.K_d:
                rotate(False)
            elif event.key == pygame.K_LEFT:
                move_part(-1)
                time_pressed = pygame.time.get_ticks()
            elif event.key == pygame.K_RIGHT:
                move_part(1)
                time_pressed = pygame.time.get_ticks()
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if button_left.pressed():
                move_part(-1)
            elif button_right.pressed():
                move_part(1)
            elif button_down.pressed():
                fall()
            elif button_rotate_clockwise.pressed():
                rotate(True)
            elif button_rotate_counter_clockwise.pressed():
                rotate(False)

    keys = pygame.key.get_pressed()
    current_time = pygame.time.get_ticks()
    if current_time - time_pressed > INPUT_UPDATE_TIME:
        if keys[pygame.K_DOWN]:
            fall()
        elif keys[pygame.K_LEFT]:
            move_part(-1)
        elif keys[pygame.K_RIGHT]:
            move_part(1)

        time_pressed = current_time

    if not game_over():
        erase()
        if frame % int(FRAME_TIME / 1000 * FPS) == 0:        
            fall()
            verify_line()

        draw()
        messages()
    else:
        draw()
        messages()
        message = pygame.font.Font(None, 130).render(f"GAME OVER", True, RED)
        screen.blit(message, (1920 // 3, 1080 // 2))

    button_left.draw()
    button_right.draw()
    button_down.draw()
    button_rotate_clockwise.draw()
    button_rotate_counter_clockwise.draw()

    pygame.display.flip()
    pygame.time.Clock().tick(FPS)
