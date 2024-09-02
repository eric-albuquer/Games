import pygame
import sys
import random
from genetic import Genetic
import numpy as np

colors = {
    "WHITE": (255, 255, 255),
    "BLACK": (0, 0, 0),
}
    
class Ball:
    def __init__(self, x, y, velocity, radius, color) -> None:
        self.x = x
        self.y = y

        self.active = True

        self.rand_velocity(velocity)

        self.radius = radius
        self.color = color

    def set_pos(self, x, y):
        self.x = x
        self.y = y

    def rand_velocity(self, v_max):
        # A soma vetorial de dx + dy = v_max onde dx é pelo menos 2 / 3 do vetor v_max
        self.dx = (random.random() * v_max * 1 / 6 + v_max * 2 / 3) * random.choice([1, -1])
        self.dy = (v_max - abs(self.dx)) * random.choice([1, -1])

    def update(self):
        self.x += self.dx
        self.y += self.dy

    def bounce(self, axle):
        if axle == "horizontal":
            self.dy *= -1
        elif axle == "vertical":
            self.dx *= -1
    
class Racket:
    def __init__(self, x, y, width, height, color) -> None:
        # Convertendo as cordenadas centrais em cordenadas do pygame (superior esquerdo)
        self.x = x - width / 2
        self.y = y - height / 2

        self.width = width
        self.height = height
        self.color = color

        self.active = True

    def move(self, dy):
        self.y += dy

    def colide(self, x, y):
        # Verificando se a cordenada (x, y) está dentro da raquete
        if x >= self.x and x <= self.x + self.width:
            if y >= self.y and y <= self.y + self.height:
                return True
        return False
    
class Bot:
    def __init__(self, ball, racket) -> None:
        self.ball = ball
        self.racket = racket

    def best_pos(self):
        return self.ball.y + self.ball.radius
    
    def move(self):
        if self.racket.y + self.racket.height / 2 < self.best_pos():
            return 1
        elif self.racket.y + self.racket.height / 2 > self.best_pos():
            return - 1
        else: return 0

class Game:
    def __init__(self, width, height, fps, ball_velocity, ball_aceleration, racket_velocity) -> None:
        self.width = width
        self.height = height
        self.fps = fps

        self.racket_velocity = racket_velocity
        self.ball_velocity = ball_velocity
        self.ball_aceleration = ball_aceleration

        self.score_left = 0
        self.score_right = 0

        # Definindo as características dos objetos
        #self.racket_right = Racket(self.width - 20, self.height / 2, 20, 120, colors["WHITE"])
        # self.ball = Ball(self.width / 2, self.height / 2, ball_velocity, 10, colors["WHITE"])
        # self.racket_left = Racket(20, self.height / 2, 20, 120, colors["WHITE"])

        #self.bot = Bot(self.ball, self.racket_right)
        #self.ai = AI(self.ball, self.racket_left, width, height)

        self.genetic = Genetic(100, 0.1, 1, (3, 16, 2))
        self.genetic.load("model.npz")

        self.racket_bots = []
        self.racket_ai = []
        self.balls = []

        self.bots = []

        self.color = []

        for _ in self.genetic.population:
            racket_ai = Racket(20, self.height / 2, 20, 120, colors["WHITE"])
            racket_bot = Racket(self.width - 20, self.height / 2, 20, 120, colors["WHITE"])
            ball = Ball(self.width / 2, self.height / 2, ball_velocity, 10, colors["WHITE"])
            bot = Bot(ball, racket_bot)

            self.color.append((random.random() * 255, random.random() * 255, random.random() * 255))
            self.racket_bots.append(racket_bot)
            self.racket_ai.append(racket_ai)
            self.balls.append(ball)
            self.bots.append(bot)

    def create_pygame(self):
        pygame.init()
        self.screen = pygame.display.set_mode((self.width, self.height))

    def reset_ball(self):
            # Movendo a bola para o centro da tela e definindo uma nova velocidade
            self.ball.set_pos(self.width / 2, self.height / 2)
            self.ball.rand_velocity(self.ball_velocity)

    def score(self):
        # Verificando se a bola saiu horizontalmente da tela
        if self.ball.x <= 0 or self.ball.x >= self.width:
            if self.ball.x <= 0:
                self.score_right += 1
            elif self.ball.x >= self.width:
                self.score_left += 1
            self.reset_ball()

    def colide(self):
        # Verificando se a bola colidiu com as bordas horizontais
        for i in range(len(self.racket_ai)):

            if self.balls[i].y <= 0 or self.balls[i].y >= self.height:
                self.balls[i].bounce("horizontal")

            colide = False

            # Verificando se a bola colidio com a raquete e invertendo seus vetores de movimento
            for j in range(int(abs(self.balls[i].dx))):
                if self.balls[i].dx < 0:
                    direction = -1
                else:
                    direction = 1

                if self.racket_ai[i].colide(self.balls[i].x - self.balls[i].radius + j * direction, self.balls[i].y) :
                    self.balls[i].dx *= 1 + self.ball_aceleration
                    self.balls[i].dy *= 1 + self.ball_aceleration
                    self.balls[i].bounce("vertical")
                    colide = True

                elif self.racket_bots[i].colide(self.balls[i].x + self.balls[i].radius + j * direction, self.balls[i].y):
                    self.balls[i].dx *= 1 + self.ball_aceleration
                    self.balls[i].dy *= 1 + self.ball_aceleration
                    self.balls[i].bounce("vertical")

            if colide:
                self.genetic.population[i].score += 1

    def get_actives(self):
        actives = 0
        for ball in self.balls:
            if ball.active:
                actives += 1

        return actives

    def show_menssage(self):
        self.screen.blit(pygame.font.Font(None, 100).render(f"Best score: {self.genetic.get_best_score()}", True, colors["WHITE"]),
                        (self.width / 2 - 500, 0))
        
        self.screen.blit(pygame.font.Font(None, 100).render(f"Actives: {self.get_actives()}", True, colors["WHITE"]),
                        (self.width / 2 + 70, 0))
        
        self.screen.blit(pygame.font.Font(None, 100).render(f"Gen: {self.genetic.generation}", True, colors["WHITE"]),
                        (self.width / 2 - 100 , self.height - 100))
        
    def show_objects(self):
        for i in range(self.height):
            if (i - 12) % 50 == 0:
                pygame.draw.line(self.screen, colors["WHITE"], (self.width / 2, i), (self.width / 2, i + 25), 1)

        # pygame.draw.line(self.screen, colors["WHITE"], (self.width / 2, 0), (self.width / 2, self.height), 3)
                
        for i in range(len(self.genetic.population)):
            if self.balls[i].active:

                pygame.draw.rect(self.screen, self.color[i], 
                                pygame.Rect(self.racket_ai[i].x, self.racket_ai[i].y, self.racket_ai[i].width, self.racket_ai[i].height))

                pygame.draw.rect(self.screen, self.color[i], 
                                pygame.Rect(self.racket_bots[i].x, self.racket_bots[i].y, self.racket_bots[i].width, self.racket_bots[i].height))

                pygame.draw.circle(self.screen, self.color[i], (self.balls[i].x, self.balls[i].y), self.balls[i].radius)

    def end_gen(self):
        alive = 0
        for ball in self.balls:
            if ball.x > 0 and ball.x < self.width:
                alive += 1
        if alive > 0:
            return False
        return True
    
    def restart(self):
        self.genetic.next_gen()

        self.racket_bots = []
        self.racket_ai = []
        self.balls = []

        self.bots = []

        for _ in self.genetic.population:
            racket_ai = Racket(20, self.height / 2, 20, 120, colors["WHITE"])
            racket_bot = Racket(self.width - 20, self.height / 2, 20, 120, colors["WHITE"])
            ball = Ball(self.width / 2, self.height / 2, self.ball_velocity, 10, colors["WHITE"])
            bot = Bot(ball, racket_bot)

            self.racket_bots.append(racket_bot)
            self.racket_ai.append(racket_ai)
            self.balls.append(ball)
            self.bots.append(bot)

    def kill(self, index):
        self.balls[index].active = False
        self.racket_ai[index].active = False
        self.racket_bots[index].active = False
        self.bots[index].active = False

        self.genetic.population[index].model.active = False

    def main(self):
        self.show_objects()
        self.show_menssage()
        
        # self.score()

        self.colide()

        for ball in enumerate(self.balls):
            if ball[1].x > 0 and ball[1].x < self.width:
                ball[1].update()
            else:
                self.kill(ball[0]) 

        if self.end_gen():
            self.restart()

    def inputs(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        def move_racket(racket, move):
            if racket.y >= 0 and racket.y + racket.height <= self.height:
                racket.move(move)
            elif racket.y < 0 and move > 0:
                racket.move(move)
            elif racket.y + racket.height > self.height and move < 0:
                racket.move(move)

        
        for model in enumerate(self.genetic.population):
            if model[1].active:
                
                data = np.array([[self.balls[model[0]].x / self.width, self.balls[model[0]].y / self.height, (self.racket_ai[model[0]].y + self.racket_ai[model[0]].height / 2) / self.height]])
                output = model[1].model.forward(data)[0]
                output = 1 if np.argmax(output) == 1 else -1
                dy = self.racket_velocity * output

                move_racket(self.racket_ai[model[0]], dy)

        for bot in enumerate(self.bots):
            dy = self.racket_velocity * bot[1].move()
            
            move_racket(self.racket_bots[bot[0]], dy)

        # self.racket_left.y = self.bot.best_pos() - self.racket_left.height / 2

        # move_racket(self.racket_left, left_dy)
        # move_racket(self.racket_right, right_dy)

    def draw(self):
        while True:
            self.screen.fill(colors["BLACK"])

            self.inputs()

            self.main()

            pygame.display.flip()
            pygame.time.Clock().tick(self.fps)

game = Game(1920, 1080, 144, 15, 0.005, 10)

game.create_pygame()
game.draw()
