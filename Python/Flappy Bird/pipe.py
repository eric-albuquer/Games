from numpy.random import rand

class Pipe:
    def __init__(self, x, y, dx, width, height, hole_size) -> None:
        self.x = x
        self.width = width
        self.top_y = y
        self.dx = dx
        self.hole_y = rand() * (height - hole_size)
        self.botton_y = self.hole_y + hole_size
        self.active = True

    def update(self) -> None:
        self.x += self.dx
