from nn import nn

class Model:
    def __init__(self, model, score) -> None:
        self.model = model
        self.score = score
        self.active = True
    
class Genetic:
    def __init__(self, population_size, mutate_rate, lr, model_shape) -> None:
        self.population = [Model(nn(model_shape[0], model_shape[1], model_shape[2]), 0) for _ in range(population_size)]

        self.mutate_rate = mutate_rate
        self.lr = lr

        self.generation = 1

    def load(self, name):
        self.population[0].model.load()
        self.population[0].score = 100000
        self.next_gen()
        self.generation = 1

    def best_model(self):
        best_model = self.population[0]
        best_score = 0
        for model in self.population:
            if model.score > best_score and model.score > 1:
                best_model = model
                best_score = model.score

        return best_model
    
    def next_gen(self):
        self.generation += 1
        best_model = self.best_model().model
        best_model.save()
        for model in self.population:
            model.model = best_model.copy()
            model.model.mutate(self.mutate_rate, self.lr)

            model.score = 0
            model.active = True

        self.population[0].model = best_model.copy()
    
    def get_best_score(self):
        best_score = 0
        for model in self.population:
            if model.score > best_score:
                best_score = model.score
        
        return best_score
