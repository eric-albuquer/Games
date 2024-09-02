def red(x):
    if (x >= 0 and x <= 1/6) or (x >= 5/6 and x <= 1):
        return 1
    elif x >= 1/6 and x <= 2/6:
        return 2 - 6 * x
    elif x >= 4/6 and x <= 5/6:
        return -4 + 6 * x
    return 0

def green(x):
    if x >= 1/6 and x <= 3/6:
        return 1
    elif x >= 0 and x <= 1/6:
        return 6 * x
    elif x >= 3/6 and x <= 4/6:
        return 4 - 6 * x
    return 0

def blue(x):
    if x >= 3/6 and x <= 5/6:
        return 1
    elif x >= 2/6 and x <= 3/6:
        return -2 + 6 * x
    elif x >= 5/6 and x <= 1:
        return 6 - 6 * x
    return 0

def rainbow_color(x, rgb = True, cicle = True):
    if not cicle:
        x *= 5/6
    r, g, b = red(x), green(x), blue(x)
    if rgb:
        return (r * 255, g * 255, b * 255)
    return (r, g, b)
