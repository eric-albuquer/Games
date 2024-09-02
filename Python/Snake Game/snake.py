import numpy as np

class Snake:
    def __init__(self, x, y, size = 3, dx = 1, dy = 0) -> None:
        self.x: int = x
        self.y: int = y
        self.dx: int = dx
        self.dy: int = dy
        self.body = np.column_stack((np.full(size, x), np.arange(y, y - size, -1)))

    def move(self):
        head = self.body[0].copy()
        self.tail = self.body[-1].copy()

        self.body[1:] = self.body[:-1]

        head[0] += self.dx
        head[1] += self.dy
        self.body[0] = head

        self.x, self.y = self.body[0]
    
    def growth(self):
        self.body = np.vstack((self.body, self.tail))

    def eats_itself(self, dx=0, dy=0) -> bool:
        return np.any((self.x + dx == self.body[1:, 0]) & (self.y + dy == self.body[1:, 1]))

    def direction(self, dx, dy):
        if dx * dy == 0 and self.dx * dx == 0 and self.dy * dy == 0:
            self.dx = dx
            self.dy = dy

    def copy(self):
        snake = Snake(self.x, self.y, len(self.body), self.dx, self.dy)
        snake.body = self.body.copy()
        return snake
