import numpy as np
import random

class nn:
    def relu(self, x):
        return np.maximum(0, x)
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def __init__(self, input_size, hidden_size, output_size) -> None:
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        self.weights_input_hidden = np.random.randn(input_size, hidden_size)
        self.bias_hidden = np.zeros((1, hidden_size))
        self.weights_hidden_hidden2 = np.random.randn(hidden_size, hidden_size)
        self.bias_hidden2 = np.zeros((1, hidden_size))
        self.weights_hidden_output = np.random.randn(hidden_size, output_size)
        self.bias_output = np.zeros((1, output_size))

    def forward(self, input_data):
        hidden_layer_input = np.dot(input_data, self.weights_input_hidden) + self.bias_hidden
        hidden_layer_output = self.relu(hidden_layer_input)

        hidden_layer2_input = np.dot(hidden_layer_output, self.weights_hidden_hidden2) + self.bias_hidden2
        hidden_layer2_output = self.relu(hidden_layer2_input)

        output_layer_input = np.dot(hidden_layer2_output, self.weights_hidden_output) + self.bias_output
        predicted_output = self.sigmoid(output_layer_input)

        return predicted_output
    
    def mutate(self, rate, lr = 1):
        def mutate_value(x):
            if random.random() < rate:
                return x + random.random() * lr - lr / 2
            return x
        
        self.weights_input_hidden = mutate_value(self.weights_input_hidden)
        self.weights_hidden_hidden2 = mutate_value(self.weights_hidden_hidden2)
        self.weights_hidden_output = mutate_value(self.weights_hidden_output)

        self.bias_hidden2 = mutate_value(self.bias_hidden2)
        self.bias_hidden = mutate_value(self.bias_hidden)
        self.bias_output = mutate_value(self.bias_output)

    def copy(self):
        copy_model = nn(self.input_size, self.hidden_size, self.output_size)

        copy_model.weights_input_hidden = np.copy(self.weights_input_hidden)
        copy_model.weights_hidden_hidden2 = np.copy(self.weights_hidden_hidden2)
        copy_model.weights_hidden_output = np.copy(self.weights_hidden_output)

        copy_model.bias_hidden = np.copy(self.bias_hidden)
        copy_model.bias_hidden2 = np.copy(self.bias_hidden2)
        copy_model.bias_output = np.copy(self.bias_output)

        return copy_model
    
    def save(self, name="model.npz"):
        np.savez(name,
                 weights_input_hidden=self.weights_input_hidden,
                 bias_hidden=self.bias_hidden,
                 weights_hidden_hidden2=self.weights_hidden_hidden2,
                 bias_hidden2=self.bias_hidden2,
                 weights_hidden_output=self.weights_hidden_output,
                 bias_output=self.bias_output)
        
    def load(self, name="model.npz"):
        dados = np.load(name)
        self.weights_input_hidden = dados['weights_input_hidden']
        self.bias_hidden = dados['bias_hidden']
        self.weights_hidden_hidden2 = dados['weights_hidden_hidden2']
        self.bias_hidden2 = dados['bias_hidden2']
        self.weights_hidden_output = dados['weights_hidden_output']
        self.bias_output = dados['bias_output']
