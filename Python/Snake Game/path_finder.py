import numpy as np
import time

def show(matrix):
    for row in matrix:
        for cell in row:
            print(str(cell).zfill(2),  end="|")
        print()
    print("==================")

def distances(x1, y1, x2, y2, matrix):
    rows = len(matrix)
    cols = len(matrix[0])
    distance = np.full((rows, cols), -1)
    if matrix[y1][x1] == 1:
        return distance
    
    distance[y1, x1] = 0
    stack = [(x1, y1)]
    
    while stack:
        x, y = stack.pop(0)
        
        if x == x2 and y == y2:
            return distance
        
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nx = x + dx
            ny = y + dy
            if 0 <= nx < rows and 0 <= ny < cols and matrix[ny][nx] == 0 and distance[ny][nx] == -1:
                distance[ny][nx] = distance[y][x] + 1
                stack.append((nx, ny))
    
    return distance
    
def path_finder(x1, y1, x2, y2, matrix):
    rows = len(matrix)
    cols = len(matrix[0])
    distance = distances(x2, y2, x1, y1, matrix)
    x, y = x1, y1  
    path = [(x, y)]

    print(distance)

    if distance[y1, x1] == -1:
        return []

    if distance[y2, x2] == -1:
        return []
    
    while not (x == x2 and y == y2):
        dist = distance[y, x]
    
        for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nx = x + dx
            ny = y + dy
            if 0 <= nx < cols and 0 <= ny < rows and distance[ny, nx] != -1:
                n_dist = distance[ny, nx]
                if n_dist < dist:
                    x, y = nx, ny
                    path.append((x, y))
                    break
    return path

matrix = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]
    
show(matrix)
print(path_finder(0,0,3,3,matrix))
