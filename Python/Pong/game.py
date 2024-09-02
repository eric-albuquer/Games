import pygame
import sys
import random
from nn import nn

colors = {
    "WHITE": (255, 255, 255),
    "BLACK": (0, 0, 0),
}
    
class Ball:
    def __init__(self, x, y, velocity, radius, color) -> None:
        self.x = x
        self.y = y

        self.rand_velocity(velocity)

        self.radius = radius
        self.color = color

    def set_pos(self, x, y):
        self.x = x
        self.y = y

    def rand_velocity(self, v_max):
        # A soma vetorial de dx + dy = v_max onde dx é pelo menos 2 / 3 do vetor v_max
        self.dx = (random.random() * v_max * 1 / 3 + v_max * 2 / 3) * random.choice([1, -1])
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

    def move(self, dy):
        self.y += dy

    def colide(self, x, y):
        # Verificando se a cordenada (x, y) está dentro da raquete
        if x >= self.x and x <= self.x + self.width:
            if y >= self.y and y <= self.y + self.height:
                return True
        return False

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
        self.ball = Ball(self.width / 2, self.height / 2, ball_velocity, 10, colors["WHITE"])
        self.racket_right = Racket(self.width - 20, self.height / 2, 20, 120, colors["WHITE"])
        self.racket_left = Racket(20, self.height / 2, 20, 120, colors["WHITE"])

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
        if self.ball.y <= 0 or self.ball.y >= self.height:
            self.ball.bounce("horizontal")

        # Verificando se a bola colidio com a raquete e invertendo seus vetores de movimento
        for i in range(int(abs(self.ball.dx))):
            if self.ball.dx < 0:
                direction = -1
            else:
                direction = 1

            if self.racket_left.colide(self.ball.x - self.ball.radius + i * direction, self.ball.y) or self.racket_right.colide(self.ball.x + self.ball.radius + i * direction, self.ball.y):
                self.ball.dx *= 1 + self.ball_aceleration
                self.ball.dy *= 1 + self.ball_aceleration
                self.ball.bounce("vertical")

    def show_menssage(self):
        self.screen.blit(pygame.font.Font(None, 100).render(f"{self.score_left}", True, colors["WHITE"]),
                        (self.width / 2 - 100, 0))
        
        self.screen.blit(pygame.font.Font(None, 100).render(f"{self.score_right}", True, colors["WHITE"]),
                        (self.width / 2 + 70, 0))
        
    def show_objects(self):
        for i in range(self.height):
            if (i - 12) % 50 == 0:
                pygame.draw.line(self.screen, colors["WHITE"], (self.width / 2, i), (self.width / 2, i + 25), 10)

        # pygame.draw.line(self.screen, colors["WHITE"], (self.width / 2, 0), (self.width / 2, self.height), 3)

        pygame.draw.rect(self.screen, self.racket_left.color, 
                        pygame.Rect(self.racket_left.x, self.racket_left.y, self.racket_left.width, self.racket_left.height))

        pygame.draw.rect(self.screen, self.racket_right.color, 
                        pygame.Rect(self.racket_right.x, self.racket_right.y, self.racket_right.width, self.racket_right.height))

        pygame.draw.circle(self.screen, self.ball.color, (self.ball.x, self.ball.y), self.ball.radius)

    def main(self):
        self.show_objects()
        self.show_menssage()
        
        self.score()

        self.colide()

        self.ball.update()

    def inputs(self):
        left_dy, right_dy = 0, 0

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        keys = pygame.key.get_pressed()

        if keys[pygame.K_UP]:
            right_dy = -self.racket_velocity
        elif keys[pygame.K_DOWN]:
            right_dy = self.racket_velocity
            
        if keys[pygame.K_w]:
            left_dy = -self.racket_velocity
        elif keys[pygame.K_s]:
            left_dy = self.racket_velocity

        def move_racket(racket, move):
            if racket.y >= 0 and racket.y + racket.height <= self.height:
                racket.move(move)
            elif racket.y < 0 and move > 0:
                racket.move(move)
            elif racket.y + racket.height > self.height and move < 0:
                racket.move(move)

        move_racket(self.racket_left, left_dy)
        move_racket(self.racket_right, right_dy)

    def draw(self):
        while True:
            self.screen.fill(colors["BLACK"])

            self.inputs()

            self.main()

            pygame.display.flip()
            pygame.time.Clock().tick(self.fps)

game = Game(1920, 1080, 60, 12, 0.01, 15)

game.create_pygame()
game.draw()
