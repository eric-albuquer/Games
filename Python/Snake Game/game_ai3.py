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

        self.snake: Snake = Snake(self.width // 2, self.height // 2, size = 5)
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

    def distance(self, x, y):
        distances = np.full((self.width, self.height), -1, dtype=int)
        
        distances[x][y] = 0
        stack = [(x, y)]

        while stack:
            x, y = stack.pop(0)

            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nx = x + dx
                ny = y + dy
                if 0 <= nx < self.width and 0 <= ny < self.height and distances[nx][ny] == -1 and ((tuple(self.table[nx][ny]) == colors["black"]) or (tuple(self.table[nx][ny]) == colors["white"])):
                    distances[nx][ny] = distances[x][y] + 1
                    stack.append((nx, ny))

        return distances
    
    def path_finder(self, x1, y1, x2, y2):

        if not (0 <= x1 < self.width and 0 <= y1 < self.height):
            return []

        distance = self.distance(x2, y2)
        x, y = x1, y1  
        path = [(x, y)]

        if distance[x1, y1] == -1 or distance[x2, y2] == -1:
            return []
        
        while not (x == x2 and y == y2):
            dist = distance[x, y]
        
            for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                nx = x + dx
                ny = y + dy
                if 0 <= nx < self.width and 0 <= ny < self.height and distance[nx, ny] != -1:
                    n_dist = distance[nx, ny]
                    if n_dist < dist:
                        x, y = nx, ny
                        path.append((x, y))
                        break
        return path

    def possible_actions(self):
        left = True
        right = True
        front = True
        vector = np.array([self.snake.dx, self.snake.dy])
        vector_ccw = np.dot(rotation_ccw, vector)
        vector_cw = np.dot(rotation_cw, vector)
        if (self.snake.x + self.snake.dx >= self.width) or (self.snake.x + self.snake.dx < 0) or (self.snake.y + self.snake.dy >= self.height) or (self.snake.y + self.snake.dy < 0) or self.snake.eats_itself(*vector) or not self.path_finder(self.snake.x + vector[0], self.snake.y + vector[1], self.snake.body[-1, 0], self.snake.body[-1, 1]):
            front = False
        if (self.snake.x + vector_ccw[0] >= self.width) or (self.snake.x + vector_ccw[0] < 0) or (self.snake.y + vector_ccw[1] >= self.height) or (self.snake.y + vector_ccw[1] < 0) or self.snake.eats_itself(*vector_ccw) or not self.path_finder(self.snake.x + vector_ccw[0], self.snake.y + vector_ccw[1], self.snake.body[-1, 0], self.snake.body[-1, 1]):
            left = False
        if (self.snake.x + vector_cw[0] >= self.width) or (self.snake.x + vector_cw[0] < 0) or (self.snake.y + vector_cw[1] >= self.height) or (self.snake.y + vector_cw[1] < 0) or self.snake.eats_itself(*vector_cw) or not self.path_finder(self.snake.x + vector_cw[0], self.snake.y + vector_cw[1], self.snake.body[-1, 0], self.snake.body[-1, 1]):
            right = False
        return left, right, front
    
    def move(self, direction):
        vector = np.array([self.snake.dx, self.snake.dy])
        if direction == 0:
            vector = np.dot(rotation_ccw, vector)
        elif direction == 1:
            vector = np.dot(rotation_cw, vector)
        self.snake.direction(*vector)

    def choose_action(self):
        vector = np.array([self.snake.dx, self.snake.dy])
        vector_ccw = np.dot(rotation_ccw, vector)
        vector_cw = np.dot(rotation_cw, vector)
        left, right, front = self.possible_actions()
        distances = self.distance(self.food.x, self.food.y)
        actions = []
        if left:
            pos = self.snake.x + vector_ccw[0], self.snake.y + vector_ccw[1]
            if 0 <= pos[0] < self.width and 0 <= pos[1] < self.height:
                n_value = distances[*pos]
            actions.append((0, n_value))
        if right:
            pos = self.snake.x + vector_cw[0], self.snake.y + vector_cw[1]
            if 0 <= pos[0] < self.width and 0 <= pos[1] < self.height:
                n_value = distances[*pos]
            actions.append((1, n_value))
        if front:
            pos = self.snake.x + vector[0], self.snake.y + vector[1]
            if 0 <= pos[0] < self.width and 0 <= pos[1] < self.height:
                n_value = distances[*pos]
            actions.append((2, n_value))

        action = -1

        # Encontrar o menor valor para o segundo índice
        menor_valor = min(actions, key=lambda x: x[1])[1]

        # Filtrar as ações com o menor valor para o segundo índice
        acoes_com_menor_valor = [acao for acao in actions if acao[1] == menor_valor]

        # Sortear uma ação entre aquelas com o menor valor para o segundo índice
        acao_sorteada = np.random.choice(len(acoes_com_menor_valor))
        action = acoes_com_menor_valor[acao_sorteada][0]

        if action == -1:
            actions_idx = [elem[0] for elem in actions]
            act = np.random.choice(actions_idx)
            action = act
            print("aqui")

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
        # x, y = np.array(self.snake.body).T
        # self.table[x, y] = np.array([rainbow_color(idx / (len(self.snake.body) - 1), cicle=False) for idx in range(len(self.snake.body))])
        color = (0, 0, 255)
        total = len(self.snake.body) - 1
        for idx, part in enumerate(self.snake.body):
            x, y = part
            self.table[x, y] = (idx / total * 255, idx / total * 255, (total - idx) / total * 255)

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
                self.snake.move()
                self.clear_table()
                self.put_food()
                self.put_snake()
 
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
                print(self.steps)

            pygame.display.flip()
            #clock.tick(10)

game = Game(20, 20)
game.graphic()
