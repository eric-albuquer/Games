function customNormalDistribution(x) {
    const mu = 3; // Média
    const sigma = 1.0; // Desvio padrão (ajuste conforme necessário)

    // Função de densidade de probabilidade da distribuição normal
    const pdf = 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));

    return pdf;
}

// Função para calcular a probabilidade cumulativa até um determinado ponto (CDF)
function cumulativeProbability(x) {
    let step = 0.01; // Passo para calcular a integral
    let totalProbability = 0;
    for (let i = -1; i <= x; i += step) {
        totalProbability += customNormalDistribution(i) * step;
    }
    return totalProbability;
}

// Gerador de número aleatório com base na probabilidade utilizando a inversão do CDF
function generateRandomNumber() {
    const targetProbability = Math.random(); // Probabilidade aleatória entre 0 e 1
    let x = -1;
    let cumulativeProb = 0;

    // Encontra o valor de x onde a probabilidade acumulada é igual ou maior que a aleatoriedade, excluindo o valor especificado
    while (cumulativeProb < targetProbability) {
        x += 0.001; // Incremento para buscar um valor onde a probabilidade acumulada seja igual ou maior que a aleatoriedade
        cumulativeProb = cumulativeProbability(x);
    }

    if (x < 0) {
        return 0
    } else if (x > 6) {
        return 6
    }
    return x;
}
