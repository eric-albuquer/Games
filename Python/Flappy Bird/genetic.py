from agent import Agent

class Genetic:
    def __init__(self, population_size, model_shape, x, y, radius, mutation_rate = 0.1) -> None:
        self.population = [Agent(model_shape, x, y, radius) for _ in range(population_size)]
        self.mutation_rate = mutation_rate
        self.generation = 0

    def alives(self):
        alives = 0
        for agent in self.population:
            if agent.active:
                alives += 1

        return alives

    def best_agent(self) -> Agent:
        best_score = float("-inf")
        best_agent = self.population[0]
        for agent in self.population:
            if agent.score > best_score:
                best_score = agent.score
                best_agent = agent

        return best_agent
    
    def next_gen(self):
        self.generation += 1
        best_agent = self.best_agent()
        best_model = best_agent.model.copy()
        for agent in self.population:
            agent.model = best_model.copy()
            agent.model.mutate(self.mutation_rate)
            agent.restart()
        self.population[0].model = best_model.copy()
        self.population[0].model.save()

    def load_model(self, model_path):
        model = self.population[0].model
        model.load(model_path)
        for agent in self.population:
            agent.model = model.copy()
            agent.model.mutate(self.mutation_rate)
        self.population[0].model = model.copy()
        
