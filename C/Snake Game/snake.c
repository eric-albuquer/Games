#include <stdio.h>
#include <conio.h>
#include <stdlib.h>
#include <windows.h>
#include <time.h>
#include <math.h>
#include <omp.h>

#define WIDTH 20
#define HEIGHT 20
#define MAX_TAIL_LENGTH WIDTH *HEIGHT

enum eDirection
{
    LEFT,
    RIGHT,
    FRONT
};
enum eDirection dir;

typedef struct
{
    int x, y, fruitX, fruitY, score, dx, dy;
    int tailX[MAX_TAIL_LENGTH], tailY[MAX_TAIL_LENGTH];
    int nTail;
    enum eDirection dir;
    int gameover;
    int energy;
} GameState;

void Setup(GameState *state)
{
    state->gameover = 0;
    state->dir = FRONT;
    state->x = WIDTH / 2;
    state->y = HEIGHT / 2;
    state->fruitX = WIDTH / 2 - 3;
    state->fruitY = HEIGHT / 2;
    state->score = 0;
    state->dx = -1;
    state->dy = 0;
    state->nTail = 0;
    state->energy = MAX_TAIL_LENGTH;
}

void CopyGameState(const GameState *src, GameState *dest)
{
    dest->gameover = src->gameover;
    dest->dir = src->dir;
    dest->x = src->x;
    dest->y = src->y;
    dest->fruitX = src->fruitX;
    dest->fruitY = src->fruitY;
    dest->score = src->score;
    dest->dx = src->dx;
    dest->dy = src->dy;
    dest->nTail = src->nTail;
    dest->energy = src->energy;

    // Copiando os arrays tailX e tailY
    for (int i = 0; i < src->nTail; ++i)
    {
        dest->tailX[i] = src->tailX[i];
        dest->tailY[i] = src->tailY[i];
    }
}

int eat_itself(GameState *state, int dx, int dy)
{
    for (int i = 0; i < state->nTail; i++)
        if (state->tailX[i] == state->x + dx && state->tailY[i] == state->y + dy)
            return 1;
    return 0;
}

int inside_snake(GameState *state, int x, int y)
{
    if (x == state->x && y == state->y)
        return 1;
    for (int i = 0; i < state->nTail; i++)
        if (state->tailX[i] == x && state->tailY[i] == y)
            return 1;
    return 0;
}

void Draw(GameState *state)
{
    system("cls");
    for (int i = 0; i < WIDTH + 2; i++)
        printf("# ");
    printf("\n");

    for (int i = 0; i < HEIGHT; i++)
    {
        for (int j = 0; j < WIDTH; j++)
        {
            if (j == 0)
                printf("# ");
            if (i == state->y && j == state->x)
                printf("@ ");
            else if (i == state->fruitY && j == state->fruitX)
                printf("XX");
            else
            {
                int printTail = 0;
                for (int k = 0; k < state->nTail; k++)
                {
                    if (state->tailX[k] == j && state->tailY[k] == i)
                    {

                        if (k == state->nTail - 1)
                        {
                            printf("+ ");
                        }
                        else
                        {
                            switch (k % 14)
                            {
                            case 0:
                            case 1:
                                printf("o ");
                                break;
                            case 2:
                            case 3:
                                printf("O ");
                                break;
                            case 4:
                            case 5:
                                printf("0 ");
                                break;
                            case 6:
                            case 7:
                                printf("%c ", 207);
                                break;
                            case 8:
                            case 9:
                                printf("%c ", 157);
                                break;
                            case 10:
                            case 11:
                                printf("%c ", 169);
                                break;
                            case 12:
                            case 13:
                                printf("%c ", 184);
                                break;
                            default:
                                break;
                            }
                        }
                        printTail = 1;
                    }
                }
                if (!printTail)
                    printf("  ");
            }

            if (j == WIDTH - 1)
                printf("# ");
        }
        printf("\n");
    }

    for (int i = 0; i < WIDTH + 2; i++)
        printf("# ");
    printf("\n");
    printf("Score: %d\n", state->score);
    printf("Energy: %d\n", state->energy);
}

/*void Input()
{
    if (_kbhit())
    {
        switch (_getch())
        {
        case 'a':
            dir = LEFT;
            break;
        case 'd':
            dir = RIGHT;
            break;
        case 'w':
            dir = FRONT;
            break;
        case 'x':
            gameover = 1;
            break;
        }
    }
}*/

typedef struct
{
    int front;
    int left;
    int right;
} Actions;

Actions possibleActions(GameState *state)
{
    Actions actions;

    actions.front = 1;
    actions.left = 1;
    actions.right = 1;

    int nextXFront = state->x + state->dx;
    int nextYFront = state->y + state->dy;
    if (nextXFront >= WIDTH || nextXFront < 0 || nextYFront >= HEIGHT || nextYFront < 0 || eat_itself(state, state->dx, state->dy) == 1)
        actions.front = 0;

    int leftDx = state->dy;
    int leftDy = -state->dx;
    int nextXLeft = state->x + leftDx;
    int nextYLeft = state->y + leftDy;
    if (nextXLeft >= WIDTH || nextXLeft < 0 || nextYLeft >= HEIGHT || nextYLeft < 0 || eat_itself(state, leftDx, leftDy) == 1)
        actions.left = 0;

    int rightDx = -state->dy;
    int rightDy = state->dx;
    int nextXRight = state->x + rightDx;
    int nextYRight = state->y + rightDy;
    if (nextXRight >= WIDTH || nextXRight < 0 || nextYRight >= HEIGHT || nextYRight < 0 || eat_itself(state, rightDx, rightDy) == 1)
        actions.right = 0;

    return actions;
}

void move(GameState *state, int move)
{
    switch (move)
    {
    case 0:
        state->dir = FRONT;
        break;
    case 1:
        state->dir = LEFT;
        break;
    case 2:
        state->dir = RIGHT;
        break;
    default:
        break;
    }
}

int chooseMove(GameState *state)
{
    Actions actions = possibleActions(state);

    int available[3];
    int idx = 0;

    if (actions.front == 1)
    {
        available[idx] = 0;
        idx += 1;
    }
    if (actions.left == 1)
    {
        available[idx] = 1;
        idx += 1;
    }
    if (actions.right == 1)
    {
        available[idx] = 2;
        idx += 1;
    }

    if (idx > 0)
    {
        int randomIndex = rand() % idx;
        int chosenAction = available[randomIndex];
        return chosenAction;
    }
    return -1;
}

void Logic(GameState *state)
{
    int prevX = state->tailX[0];
    int prevY = state->tailY[0];
    int prev2X, prev2Y;
    state->tailX[0] = state->x;
    state->tailY[0] = state->y;
    for (int i = 1; i < state->nTail; i++)
    {
        prev2X = state->tailX[i];
        prev2Y = state->tailY[i];
        state->tailX[i] = prevX;
        state->tailY[i] = prevY;
        prevX = prev2X;
        prevY = prev2Y;
    }
    int lastDx = state->dx;
    int lastDy = state->dy;
    switch (state->dir)
    {
    case LEFT:
        state->dx = lastDy;
        state->dy = -lastDx;
        state->dir = FRONT;
        break;
    case RIGHT:
        state->dx = -lastDy;
        state->dy = lastDx;
        state->dir = FRONT;
        break;
    default:
        break;
    }

    state->x += state->dx;
    state->y += state->dy;

    if (state->x >= WIDTH || state->x < 0 || eat_itself(state, 0, 0) == 1 || state->y >= HEIGHT || state->y < 0 || state->energy <= 0)
        state->gameover = 1;

    if (state->x == state->fruitX && state->y == state->fruitY)
    {
        state->energy = MAX_TAIL_LENGTH;
        state->score += 1;
        state->nTail++;
        int x = rand() % WIDTH;
        int y = rand() % HEIGHT;
        while (inside_snake(state, x, y))
        {
            x = rand() % WIDTH;
            y = rand() % HEIGHT;
        }

        state->fruitX = x;
        state->fruitY = y;
    }
    state->energy -= 1;
}

int monteCarlos(GameState *state, int clones)
{
    double actions[3] = {0.0, 0.0, 0.0};

    #pragma omp parallel for
    for (int i = 0; i < clones; i++)
    {
        GameState child;
        CopyGameState(state, &child);

        int action = -2;
        int score = child.score;
        int steps = 0;
        while (!child.gameover)
        {
            if (action == -2)
            {
                action = chooseMove(&child);
                move(&child, action);
            }
            else
            {
                move(&child, chooseMove(&child));
            }
            Logic(&child);

            steps += 1;
        }

        actions[action] += (child.score - score) * (double)pow(steps, (double)state->score / 133);
    }
    int max_idx = 0;
    for (int i = 0; i < 3; i++)
    {
        if (actions[i] > actions[max_idx])
            max_idx = i;
    }
    if (actions[max_idx] <= 0.0)
        return -1;
    return max_idx;
}

int main()
{
    srand(time(NULL));
    GameState main;
    Setup(&main);

    while (!main.gameover)
    {
        Draw(&main);
        int action = monteCarlos(&main, 30000);
        if (action == -1)
        {
            move(&main, chooseMove(&main));
        }
        else
        {
            move(&main, action);
        }
        Logic(&main);
    }

    return 0;
}
