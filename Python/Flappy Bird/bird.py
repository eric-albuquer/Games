class Bird:
    def __init__(self, x, y, radius, dy = 0) -> None:
        self.x = x
        self.y = y
        self.radius = radius
        self.dy = dy

    def jump(self, ay) -> None:
        self.dy = ay

    def update(self, g = 0.1) -> None:
        self.gravity(g)
        self.y += self.dy

    def gravity(self, g):
        self.dy += g
