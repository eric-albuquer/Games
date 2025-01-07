class Grass{
    constructor(x, y, z){
        return new Cube(x, y, z, 1, new Color(62, 95, 54), new Color(64, 42, 26), new Color(99, 69, 48), new Color(113, 81, 57), new Color(74, 52, 36), new Color(54, 37, 25))
    }
}

class Stone{
    constructor(x, y, z){
        return new Cube(x, y, z, 1, new Color(104, 104, 104), new Color(128, 128, 128), new Color(114, 114, 114), new Color(75, 75, 75), new Color(56, 56, 56), new Color(77, 77, 77))
    }
}