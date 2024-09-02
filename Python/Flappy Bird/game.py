from pipe import Pipe
from genetic import Genetic
import pygame, sys

colors = {
    "black": (0, 0, 0),
    "white": (255, 255, 255),
    "green": (0, 255, 0),
    "yellow": (255, 255, 0),
    "light_blue": (0, 100, 255)
}

class Game:
    def __init__(self, width, height, pipe_velocity, pipe_hole, bird_x, bird_radius, model_shape) -> None:
        self.width = width
        self.height = height
        self.bird_x = bird_x
        self.bird_radius = bird_radius
        self.pipe_velocity = pipe_velocity
        self.pipe_hole = pipe_hole
        self.score = 0
        self.best_score = 0
        self.genetic = Genetic(250, model_shape, bird_x, height / 2, bird_radius,  0.2)
        self.genetic.load_model("model")
        self.pipes = []

    def add_pipe(self):
        self.pipes.append(Pipe(self.width, 0, -self.pipe_velocity, 150, self.height, self.pipe_hole))

    def remove_pipe(self):
        self.pipes.pop(0)

    def move_pipes(self):
        for pipe in self.pipes:
            pipe.update()
            if pipe.x < 700 and pipe.x > 700 - abs(pipe.dx) - 1:
                self.add_pipe()
            elif pipe.x + pipe.width < self.bird_x - self.bird_radius and  pipe.x + pipe.width > self.bird_x - self.bird_radius - abs(pipe.dx) - 1:
                self.score += 1
            elif pipe.x + pipe.width < 0:
                self.remove_pipe()
            elif pipe.x + pipe.width < self.bird_x - self.bird_radius:
                pipe.active = False

    def next_pipe(self) -> Pipe:
        for pipe in self.pipes:
            if pipe.active:
                return pipe

    def colide(self, agent) -> bool:
        bird = agent.bird
        pipe = self.next_pipe()
        inside_x_pipe = bird.x + bird.radius > pipe.x and bird.x - bird.radius < pipe.x + pipe.width 
        inside_hole_y = bird.y - bird.radius > pipe.hole_y and bird.y + bird.radius < pipe.botton_y

        return inside_x_pipe and not inside_hole_y
    
    def inside_screen(self, agent) -> bool:
        bird = agent.bird
        return bird.y >= 0 and bird.y <= self.height
    
    def game_state(self, agent):
        bird = agent.bird
        pipe = self.next_pipe()
        return [
            bird.y / self.height,
            pipe.hole_y / self.height,
            pipe.botton_y / self.height,
            pipe.x / self.width,
        ]
    
    def choose_action(self, agent):
        action = agent.model.forward(self.game_state(agent))[0][0]
        if action > 0.5:
            agent.bird.jump(-8)
    
    def update_agent_bird(self, agent):
        agent.bird.update(g = 0.3)

    def restart(self):
        self.pipes = []
        self.score = 0
        self.add_pipe()
        self.genetic.next_gen()

    def update_best_score(self):
        self.best_score = self.score if self.score > self.best_score else self.best_score
    
    def main(self):
        pygame.init()

        initial_time = pygame.time.get_ticks()

        running = True
        self.add_pipe()
        while running:
            self.move_pipes()
            
            for agent in self.genetic.population:
                if agent.active:
                    if self.colide(agent) or not self.inside_screen(agent):
                        time = pygame.time.get_ticks()
                        agent.score = time - initial_time
                        agent.active = False

                    self.choose_action(agent)

                    self.update_agent_bird(agent)

            self.update_best_score()

            if self.genetic.alives() == 0:
                print(f"Score: {self.score}")
                print(f"Best score: {self.best_score}")
                initial_time = pygame.time.get_ticks()
                self.restart()

    def draw_nn(self, agent, screen, x, y, width, height):
        model = agent.model
        inputs = self.game_state(agent)
        weights_i_h = model.weights_input_hidden
        hidden = model.hidden_output[0]
        weights_h_o = model.weights_hidden_output
        output = model.output[0]

        import numpy as np

        def sigmoid(x):
            return 1 / (1 + np.exp(-x))

        def get_color(value):
            return (sigmoid(value) * 255, 0, 0)

        font = pygame.font.Font(None, 24)

        for idx, neuron in enumerate(inputs):
            for index, conection in enumerate(weights_i_h[idx]):
                pygame.draw.line(screen, get_color(conection), (x + width / 4, y + height / (len(inputs) + 1) * (idx + 1)), (x + width / 4 * 2, y + height / (len(hidden) + 1) * (index + 1)), 5)

            pygame.draw.circle(screen, colors["white"], (x + width / 4, y + height / (len(inputs) + 1) * (idx + 1)), 20)
            # Renderizar o texto
            text_surface = font.render(f"{round(neuron, 2)}", True, colors["black"])
            text_rect = text_surface.get_rect()
            text_rect.center = (x + width / 4, y + height / (len(inputs) + 1) * (idx + 1))
            
            # Blit do texto na tela
            screen.blit(text_surface, text_rect)

        for idx, neuron in enumerate(hidden):
            for index, conection in enumerate(weights_h_o[idx]):
                pygame.draw.line(screen, get_color(conection), (x + width / 4 * 2, y + height / (len(hidden) + 1) * (idx + 1)), (x + width / 4 * 3, y + height / (len(output) + 1) * (index + 1)), 5)
                
            pygame.draw.circle(screen, colors["white"], (x + width / 4 * 2, y + height / (len(hidden) + 1) * (idx + 1)), 20)
            # Renderizar o texto
            text_surface = font.render(f"{round(neuron, 2)}", True, colors["black"])
            text_rect = text_surface.get_rect()
            text_rect.center = (x + width / 4 * 2, y + height / (len(hidden) + 1) * (idx + 1))
            
            # Blit do texto na tela
            screen.blit(text_surface, text_rect)

        for idx, neuron in enumerate(output):
            pygame.draw.circle(screen, colors["white"], (x + width / 4 * 3, y + height / (len(output) + 1) * (idx + 1)), 20)
            # Renderizar o texto
            text_surface = font.render(f"{round(neuron, 2)}", True, colors["black"])
            text_rect = text_surface.get_rect()
            text_rect.center = (x + width / 4 * 3, y + height / (len(output) + 1) * (idx + 1))

            # Blit do texto na tela
            screen.blit(text_surface, text_rect)

    def get_alive(self):
        for agent in self.genetic.population:
            if agent.active:
                return agent

    def graphics(self):
        pygame.init()
        screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption("Flappy bird")

        initial_time = pygame.time.get_ticks()

        running = True
        self.add_pipe()
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()

            screen.fill(colors["light_blue"])

            self.move_pipes()

            for pipe in self.pipes:
                color = colors["white"]
                if pipe.active:
                    color = colors["green"]
                pygame.draw.rect(screen, color, (pipe.x, pipe.top_y, pipe.width, pipe.hole_y))
                pygame.draw.rect(screen, color, (pipe.x, pipe.botton_y, pipe.width, self.height - pipe.botton_y))
            
            for agent in self.genetic.population:
                if agent.active:
                    if self.colide(agent) or not self.inside_screen(agent):
                        time = pygame.time.get_ticks()
                        agent.score = time - initial_time
                        agent.active = False
                
                    pygame.draw.circle(screen, colors["yellow"], (agent.bird.x, agent.bird.y), agent.bird.radius)

                    self.choose_action(agent)

                    self.update_agent_bird(agent)

            self.update_best_score()

            font = pygame.font.SysFont(None, 30)
            text = font.render(f"Alives: {self.genetic.alives()}", True, colors["white"])
            screen.blit(text, (50, 100))

            text = font.render(f"Gen: {self.genetic.generation}", True, colors["white"])
            screen.blit(text, (50, 50))

            text = font.render(f"Score: {self.score}", True, colors["white"])
            screen.blit(text, (50, 150))

            text = font.render(f"Best score: {self.best_score}", True, colors["white"])
            screen.blit(text, (50, 200))

            if self.genetic.alives() == 0:
                initial_time = pygame.time.get_ticks()
                self.restart()
            else:
                self.draw_nn(self.get_alive(), screen, 1300, 0, 600, 500)

            pygame.display.flip()

#import n

game = Game(1920, 1000, 3, 300, 300, 25, (4, 4, 1))
            # (n.Linear(4,4),
            # n.Sigmoid(),

            # n.Linear(4,1),
            # n.Sigmoid()))
game.graphics()

#game.main()
