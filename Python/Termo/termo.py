SIZE = 5

valid_words = []
top = 0
freq = [0 for _ in range(26)]

def evaluate(word):
    used = 0
    eval = 0
    for letter in word:
        char = ord(letter) - 97
        bit = 1 << char
        if not (used & bit):
            eval += freq[char]
            used |= bit

    return eval

def load_words(path):
    global top, valid_words, freq
    with open(path, "r") as file:
        text = file.read()
        lines = text.split("\n")

    for line in lines:
        if len(line) == SIZE:
            valid_words.append(line.lower())

    top = len(valid_words)
    
    for word in valid_words:
        for i in range(SIZE):
            freq[ord(word[i]) - 97] += 1

    valid_words.sort(key=lambda w: -evaluate(w))

def red(letter: str):
    """
    A palavra não possui esta letra
    """
    idx = 0
    global valid_words, top
    for i in range(top):
        word = valid_words[i]
        if not (letter in word):
            valid_words[idx] = word
            idx += 1

    top = idx

def yellow(letter: str, pos: int):
    """
    A palavra possui esta letra mas em outra posição
    """
    idx = 0
    global valid_words, top
    for i in range(top):
        word = valid_words[i]
        if (not (word[pos] == letter)) and letter in word:
            valid_words[idx] = word
            idx += 1

    top = idx

def green(letter: str, pos: int):
    """
    A palavra possui esta letra e já está na posição correta
    """
    idx = 0
    global valid_words, top
    for i in range(top):
        word = valid_words[i]
        if word[pos] == letter:
            valid_words[idx] = word
            idx += 1

    top = idx

def redList(*arr: list):
    """
    A palavra não possui estas letras
    """
    for letter in arr:
        red(letter)

def yellowList(*arr: list):
    """
    ('letra', idx)
    A palavra possui estas letras mas em outra posição
    """
    for letter, idx in arr:
        yellow(letter, idx)

def greenList(*arr: list):
    """
    ('letra', idx)
    A palavra possui estas letras e já estão na posição correta
    """
    for letter, idx in arr:
        green(letter, idx)

def showBestWords(size = 5):
    global valid_words
    min = size if size < top else top
    print(valid_words[:min])

if __name__ == "__main__":
    load_words("pt-br.txt")

    showBestWords()
