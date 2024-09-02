import numpy as np

class nn:
    def relu(self, x):
        return np.maximum(0, x)
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
    
    def linear(self, x):
        return x

    def __init__(self, input_size, hidden_size, output_size) -> None:
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        self.weights_input_hidden = np.random.randn(input_size, hidden_size)
        self.bias_hidden = np.zeros((1, hidden_size))
        self.weights_hidden_output = np.random.randn(hidden_size, output_size)
        self.bias_output = np.zeros((1, output_size))

    def forward(self, input_data):
        input_data = np.array(input_data)
        self.hidden_output = self.sigmoid(np.dot(input_data, self.weights_input_hidden) + self.bias_hidden)
        
        self.output = self.sigmoid(np.dot(self.hidden_output, self.weights_hidden_output) + self.bias_output)
        
        return self.output
    
    def forward_max(self, input_data):
        input_data = np.array(input_data)
        predicted = self.forward(input_data)
        return np.argmax(predicted)
    
    def mutate(self, rate, lr = 1):
        def mutate_value(x):
            if np.random.rand() < rate:
                return x + np.random.rand() * lr - lr / 2
            return x
        
        self.weights_input_hidden = mutate_value(self.weights_input_hidden)
        self.weights_hidden_output = mutate_value(self.weights_hidden_output)

        self.bias_hidden = mutate_value(self.bias_hidden)
        self.bias_output = mutate_value(self.bias_output)

    def copy(self):
        copy_model = nn(self.input_size, self.hidden_size, self.output_size)

        copy_model.weights_input_hidden = np.copy(self.weights_input_hidden)
        copy_model.weights_hidden_output = np.copy(self.weights_hidden_output)

        copy_model.bias_hidden = np.copy(self.bias_hidden)
        copy_model.bias_output = np.copy(self.bias_output)

        return copy_model
    
    def save(self, name="model"):
        np.savez(f"{name}.npz",
                 weights_input_hidden=self.weights_input_hidden,
                 bias_hidden=self.bias_hidden,
                 weights_hidden_output=self.weights_hidden_output,
                 bias_output=self.bias_output)
        
    def load(self, name="model"):
        data = np.load(f"{name}.npz")
        self.weights_input_hidden = data['weights_input_hidden']
        self.bias_hidden = data['bias_hidden']
        self.weights_hidden_output = data['weights_hidden_output']
        self.bias_output = data['bias_output']

        print(f"{name}.npz loaded")
