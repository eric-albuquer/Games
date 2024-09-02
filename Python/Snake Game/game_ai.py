from snake import Snake
from food import Food
import pygame
import numpy as np
from multiprocessing import Pool
from colors import rainbow_color

colors = {
    "white": (255, 255, 255),
    "black": (0, 0, 0),
    "red": (255, 0, 0),
    "blue": (0, 0, 255)
}

rotation_ccw = np.array([
            [0, 1],
            [-1, 0]
        ])
rotation_cw = np.array([
            [0, -1],
            [1, 0]
        ])

class Game:
    def __init__(self, width, height, cell_size = 20, update_time = 1) -> None:
        self.width: int = width // cell_size
        self.height: int = height // cell_size
        self.cell_size: int = cell_size
        self.update_time: int = update_time
        self.running = True
        self.score: int = 0
        self.energy: int = self.width * self.height

        self.table = np.zeros((self.width, self.height, 3), dtype=np.uint8)
        self.clear_table()

        self.snake = Snake(self.width // 2, self.height // 2, size = 3)
        self.food = self.gerate_food()

    def reset(self):
        self.running = True

        self.clear_table()

        self.snake = Snake(self.width // 2, self.height // 2, size = 3)
        self.food = self.gerate_food()
        self.energy: int = self.width * self.height

    def copy_state(self):
        game = Game(self.width * self.cell_size, self.height * self.cell_size)
        game.snake = self.snake.copy()
        game.food = Food(self.food.x, self.food.y)
        game.clear_table()

        return game

    def gerate_food(self):
        available_positions = np.where((self.table == colors["black"]).all(axis=2))
        idx = np.random.choice(len(available_positions[0]))
        x, y = available_positions[0][idx], available_positions[1][idx]
        return Food(x, y)
    
    def clear_table(self):
        self.table[:] = colors["black"]
    
    def put_food(self):
        self.table[self.food.x][self.food.y] = colors["red"]
    
    def put_snake(self):
        x, y = np.array(self.snake.body).T
        self.table[x, y] = np.array([rainbow_color(idx / len(self.snake.body)) for idx in range(len(self.snake.body))])

    def eat(self):
        return self.snake.x == self.food.x and self.snake.y == self.food.y
    
    def end_game(self) -> bool:
        horizontal = self.snake.x < self.width and self.snake.x >= 0
        vertical = self.snake.y < self.height and self.snake.y >= 0

        return self.snake.eats_itself() or not(horizontal and vertical) or self.energy == 0

    def update(self):
        if not self.end_game():
            self.clear_table()
            self.put_food()
            self.put_snake()
            self.snake.move()
            if self.eat():
                self.energy = self.width * self.height
                self.score += 1
                self.snake.growth()
                self.food = self.gerate_food()
            self.energy -= 1
        else:
            self.running = False

    def draw(self, screen):
        for i, row in enumerate(self.table):
            for j, col in enumerate(row):
                pygame.draw.rect(screen, col, (i * self.cell_size, j * self.cell_size, self.cell_size, self.cell_size), 0)

    def possible_actions(self):
        left = True
        right = True
        front = True
        vector = np.array([self.snake.dx, self.snake.dy])
        vector_ccw = np.dot(rotation_ccw, vector)
        vector_cw = np.dot(rotation_cw, vector)
        if (self.snake.x + self.snake.dx >= self.width) or (self.snake.x + self.snake.dx < 0) or (self.snake.y + self.snake.dy >= self.height) or (self.snake.y + self.snake.dy < 0) or self.snake.eats_itself(self.snake.dx, self.snake.dy):
            front = False
        if (self.snake.x + vector_ccw[0] >= self.width) or (self.snake.x + vector_ccw[0] < 0) or (self.snake.y + vector_ccw[1] >= self.height) or (self.snake.y + vector_ccw[1] < 0) or self.snake.eats_itself(*vector_ccw):
            left = False
        if (self.snake.x + vector_cw[0] >= self.width) or (self.snake.x + vector_cw[0] < 0) or (self.snake.y + vector_cw[1] >= self.height) or (self.snake.y + vector_cw[1] < 0) or self.snake.eats_itself(*vector_cw):
            right = False
        return left, right, front
    
    def choose_action(self):
        left, right, front = self.possible_actions()
        actions = []
        if left:
            actions.append(0)
        if right:
            actions.append(1)
        if front:
            actions.append(2)
        if len(actions) == 0:
            action = 2
        else:
            action = np.random.choice(actions)
        self.move(action)
        return action

    def move(self, direction):
        vector = np.array([self.snake.dx, self.snake.dy])
        if direction == 0:
            vector = np.dot(rotation_ccw, vector)
        elif direction == 1:
            vector = np.dot(rotation_cw, vector)
        self.snake.direction(*vector)

    def calculate_directions(self, _):
        game = self.copy_state()
        steps = 0
        score = game.score
        while game.running:
            if steps == 0:
                action = game.choose_action()
            else:
                game.choose_action()
            game.update()
            steps += 1
        value = (game.score - score) * (steps) ** (game.score / 66)
        return action, value

    def graphic(self):
        pygame.init()
        screen = pygame.display.set_mode((self.width * self.cell_size, self.height * self.cell_size))
        pygame.display.set_caption("Snake Game")
        clock = pygame.time.Clock()

        while self.running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False

            directions = [0, 0, 0]

            with Pool() as pool:
                results = pool.map(self.calculate_directions, range(200))
        
            for action, value in results:
                directions[action] += value

            left, right, front = self.possible_actions()
            direction = np.argmax(directions)
            if left and direction == 0 or right and direction == 1 or front and direction == 2:
                self.move(direction)
            else:
                self.choose_action()
            self.update()
            self.draw(screen)

            pygame.display.flip()
            clock.tick(144)

if __name__ == "__main__":
    game = Game(400, 400)
    game.graphic()
