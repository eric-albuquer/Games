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
        self.width: int = width
        self.height: int = height
        self.cell_size: int = cell_size
        self.update_time: int = update_time
        self.running = True
        self.steps = 0

        self.table = np.zeros((self.width, self.height, 3), dtype=np.uint8)
        self.clear_table()
        self.table_directions()

        self.snake: Snake = Snake(self.width // 2, self.height // 2, size = 3)
        self.food: Food = self.gerate_food()

    def table_directions(self) -> None:
        self.directions = np.zeros((self.width, self.height, 2), dtype=int)
        for i in range(self.width):
            for j in range(self.height):
                if i % 2 == 0:
                    if j % 2 == 0:
                        self.directions[i, j] = [-1, 1]
                    else:
                        self.directions[i, j] = [1, 1]
                else:
                    if j % 2 == 0:
                        self.directions[i, j] = [-1, -1]
                    else:
                        self.directions[i, j] = [1, -1]

    def path_finder(self):
        rows = len(self.table)
        cols = len(self.table[0])
        distances = np.full((rows, cols), -1, dtype=int)
        distances[self.food.y][self.food.x] = 0
        stack = [(self.food.x, self.food.y)]

        while stack:
            x, y = stack.pop(0)

            if x == self.snake.x and y == self.snake.y:
                return distances

            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nx = x + dx
                ny = y + dy
                if 0 <= nx < cols and 0 <= ny < rows and distances[ny][nx] == -1 and (tuple(self.table[ny][nx]) == colors["black"] or (self.snake.x == nx and self.snake.y == ny)):
                    distances[ny][nx] = distances[y][x] + 1
                    stack.append((nx, ny))

        return distances

    def possible_actions(self):
        left = True
        right = True
        front = True
        vector = np.array([self.snake.dx, self.snake.dy])
        vector_ccw = np.dot(rotation_ccw, vector)
        vector_cw = np.dot(rotation_cw, vector)
        if (self.snake.x + self.snake.dx >= self.width) or (self.snake.x + self.snake.dx < 0) or (self.snake.y + self.snake.dy >= self.height) or (self.snake.y + self.snake.dy < 0) or self.snake.eats_itself(self.snake.dx, self.snake.dy) or ((self.directions[self.snake.x, self.snake.y, 0] != self.snake.dx) and (self.directions[self.snake.x, self.snake.y, 1] != self.snake.dy)):
            front = False
        if (self.snake.x + vector_ccw[0] >= self.width) or (self.snake.x + vector_ccw[0] < 0) or (self.snake.y + vector_ccw[1] >= self.height) or (self.snake.y + vector_ccw[1] < 0) or self.snake.eats_itself(*vector_ccw) or ((self.directions[self.snake.x, self.snake.y, 0] != vector_ccw[0]) and (self.directions[self.snake.x, self.snake.y, 1] != vector_ccw[1])):
            left = False
        if (self.snake.x + vector_cw[0] >= self.width) or (self.snake.x + vector_cw[0] < 0) or (self.snake.y + vector_cw[1] >= self.height) or (self.snake.y + vector_cw[1] < 0) or self.snake.eats_itself(*vector_cw) or ((self.directions[self.snake.x, self.snake.y, 0] != vector_cw[0]) and (self.directions[self.snake.x, self.snake.y, 1] != vector_cw[1])):
            right = False
        return left, right, front
    
    def move(self, direction):
        vector = np.array([self.snake.dx, self.snake.dy])
        if direction == 0:
            vector = np.dot(rotation_ccw, vector)
        elif direction == 1:
            vector = np.dot(rotation_cw, vector)
        self.snake.direction(*vector)

    def distance(self, x1, y1, x2, y2):
        return np.sqrt(np.power(x2 - x1, 2) + np.power(y2 - y1, 2))

    def choose_action(self):
        vector = np.array([self.snake.dx, self.snake.dy])
        vector_ccw = np.dot(rotation_ccw, vector)
        vector_cw = np.dot(rotation_cw, vector)
        left, right, front = self.possible_actions()
        # distances = self.path_finder()
        # s_value = distances[self.snake.y][self.snake.x]
        # best = False
        actions = []
        if left:
            pos = self.snake.x + vector_ccw[0], self.snake.y + vector_ccw[1]
            dist = self.distance(self.food.x, self.food.y, *pos)
            # if 0 <= pos[0] < self.width and 0 <= pos[1] < self.height:
            #     n_value = distances[pos[1], pos[0]]
            #     best = -1 < n_value < s_value
            actions.append((0, dist))
        if right:
            pos = self.snake.x + vector_cw[0], self.snake.y + vector_cw[1]
            dist = self.distance(self.food.x, self.food.y, *pos)
            # if 0 <= pos[0] < self.width and 0 <= pos[1] < self.height:
            #     n_value = distances[pos[1], pos[0]]
            #     best = -1 < n_value < s_value
            actions.append((1, dist))
        if front:
            pos = self.snake.x + vector[0], self.snake.y + vector[1]
            dist = self.distance(self.food.x, self.food.y, *pos)
            # if 0 <= pos[0] < self.width and 0 <= pos[1] < self.height:
            #     n_value = distances[pos[1], pos[0]]
            #     best = -1 < n_value < s_value
            actions.append((2, dist))

        action = -1
        # path_action = [elem for elem in actions if elem[2]]
        # if path_action:
        #     actions_idx = [elem[0] for elem in path_action]
        #     selected_index = np.random.choice(actions_idx)
        #     action = selected_index
        if action == -1:
            actions = np.array(actions, dtype=int)
            min_dist = np.where(actions[:, 1] == np.min(actions[:, 1]))[0]
            idx = np.random.choice(min_dist)
            action = actions[idx, 0]

        self.move(action)

    def gerate_food(self) -> Food:
        available_positions = np.where((self.table == colors["black"]).all(axis=2))
        idx = np.random.choice(len(available_positions[0]))
        x, y = available_positions[0][idx], available_positions[1][idx]
        return Food(x, y)
    
    def clear_table(self) -> None:
        self.table[:] = colors["black"]
    
    def put_food(self) -> None:
        self.table[self.food.x, self.food.y] = colors["white"]
    
    def put_snake(self) -> None:
        x, y = np.array(self.snake.body).T
        self.table[x, y] = np.array([rainbow_color(idx / (len(self.snake.body) - 1), cicle=False) for idx in range(len(self.snake.body))])

    def eat(self) -> bool:
        return self.snake.x == self.food.x and self.snake.y == self.food.y
    
    def end_game(self) -> bool:
        horizontal = self.snake.x < self.width and self.snake.x >= 0
        vertical = self.snake.y < self.height and self.snake.y >= 0

        return self.snake.eats_itself() or not(horizontal and vertical)

    def update(self) -> None:
        if len(self.snake.body) < self.width * self.height - 1:
            if not self.end_game():
                self.steps += 1
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
            if frame % self.update_time == 0:
                screen.fill(colors["black"])
                self.choose_action()
                self.update()
                self.draw(screen)
                #print(self.steps)

            pygame.display.flip()

game = Game(20, 20)
game.graphic()
