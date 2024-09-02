from snake import Snake
from food import Food
import pygame
import numpy as np
from colors import rainbow_color

colors = {
    "white": (255, 255, 255),
    "black": (0, 0, 0),
    "red": (255, 0, 0),
    "blue": (0, 0, 255)
}

class Game:
    def __init__(self, width, height, cell_size = 20, update_time = 15) -> None:
        self.width: int = width // cell_size
        self.height: int = height // cell_size
        self.cell_size: int = cell_size
        self.update_time: int = update_time
        self.running = True

        self.table = np.zeros((self.width, self.height, 3), dtype=np.uint8)
        self.clear_table()

        self.snake: Snake = Snake(self.width // 2, self.height // 2, size = 3)
        self.food: Food = self.gerate_food()

    def gerate_food(self) -> Food:
        available_positions = np.where((self.table == colors["black"]).all(axis=2))
        idx = np.random.choice(len(available_positions[0]))
        x, y = available_positions[0][idx], available_positions[1][idx]
        return Food(x, y)
                
    def clear_table(self) -> None:
        self.table[:] = colors["black"]
    
    def put_food(self) -> None:
        self.table[self.food.x, self.food.y] = colors["red"]
    
    def put_snake(self) -> None:
        x, y = np.array(self.snake.body).T
        self.table[x, y] = np.array([rainbow_color(idx / len(self.snake.body)) for idx in range(len(self.snake.body))])

    def eat(self) -> bool:
        return self.snake.x == self.food.x and self.snake.y == self.food.y
    
    def end_game(self) -> bool:
        horizontal = self.snake.x < self.width and self.snake.x >= 0
        vertical = self.snake.y < self.height and self.snake.y >= 0

        return self.snake.eats_itself() or not(horizontal and vertical)

    def update(self) -> None:
        if not self.end_game():
            self.clear_table()
            self.put_food()
            self.put_snake()
            self.snake.move()
            if self.eat():
                self.snake.growth()
                self.food = self.gerate_food()
        else:
            self.running = False

    def draw(self, screen) -> None:
        for i, row in enumerate(self.table):
            for j, col in enumerate(row):
                pygame.draw.rect(screen, col, (i * self.cell_size, j * self.cell_size, self.cell_size, self.cell_size), 0)

    def graphic(self) -> None:
        pygame.init()
        screen = pygame.display.set_mode((self.width * self.cell_size, self.height * self.cell_size))
        pygame.display.set_caption("Snake Game")
        clock = pygame.time.Clock()

        frame = 0

        while self.running:
            frame += 1
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_UP:
                        self.snake.direction(0, -1)
                    elif event.key == pygame.K_DOWN:
                        self.snake.direction(0, 1)
                    elif event.key == pygame.K_LEFT:
                        self.snake.direction(-1, 0)
                    elif event.key == pygame.K_RIGHT:
                        self.snake.direction(1, 0)

            if frame % self.update_time == 0:
                screen.fill(colors["black"])
                self.update()
                self.draw(screen)

            pygame.display.flip()
            clock.tick(144)

game = Game(800, 800)
game.graphic()
