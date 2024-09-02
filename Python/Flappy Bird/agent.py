from bird import Bird
from nn import nn
#import n

class Agent:
    def __init__(self, model_shape, x, y, radius) -> None:
        self.model = nn(*model_shape)
        #self.model = n.Sequential(*model_shape)
        self.score = 0
        self.bird = Bird(x, y, radius)
        self.active = True
        self.initial_pos = x, y

    def restart(self):
        self.score = 0
        self.active = True
        self.bird.x, self.bird.y = self.initial_pos
