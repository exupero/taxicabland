class Shape(object):
    pass


class PointOnLine(Shape):
    def set_position(self, line, x, y):
        ax, ay = line.parents[0].coord
        bx, by = line.parents[1].coord
        
        if bx - ax:
            self.position = float(x - ax) / (bx - ax)
        elif by - ay:
            self.position = float(y - ay) / (by - ay)

    def update(self):

