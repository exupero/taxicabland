def dist(a, b):
    def class_name(item): 
        return item.__class__.__name__
    
    def point_point():
        ax, ay = a
        bx, by = b
        return abs(ax - bx) + abs(ay - by)
        
    def point_line(a,line):
        ax, ay = a
        # Calculate the distance between the point and the line horizontally and vertically.
        
        # Get the line's parents' positions.
        cx, cy = line.parents[0].coord
        dx, dy = line.parents[1].coord
        
        if cx - dx and cy - dy:
            # Calculate the slope and y-intercept of the line.
            slope = float(cy - dy) / (cx - dx)
            intercept = cy - slope * cx
            
            # Calculate the points on the line given the point not on the line.
            y = slope * ax + intercept
            x = (ay - intercept) / slope
            
            # Determine the distance between (x,ay) and (ax,ay), (ax,y) and (ax,ay).
            hdist = dist((x,ay),(ax,ay))
            vdist = dist((ax,y),(ax,ay))
            
            return min(hdist,vdist)
        elif not cx - dx:
            # The line is vertical, return the horizontal distance.
            return dist((cx,ay),(ax,ay))
        elif not cy - dy:
            # The line is horizontal, return the vertical distance.
            return dist((ax,cy),(ax,ay))
    
    # If both a and b are tuples (coordinate pairs)...
    if type(a) == type(()) and type(b) == type(()):
        return point_point()
    # If a is a line and b is coordinate or vice versa, pass the line to the point_line distance
    # function second.
    elif class_name(a) == 'Line' and type(b) == type(()):
        return point_line(b, a)
    elif type(a) == type(()) and class_name(b) == 'Line':
        return point_line(a, b)


def find_intersection((a1, b1), (a2, b2)):
    a1x, a1y = a1
    b1x, b1y = b1
    a2x, a2y = a2
    b2x, b2y = b2
    
    if a1x - b1x and a2x - b2x:
        m1 = float(a1y - b1y) / (a1x - b1x)
        int1 = a1y - m1 * a1x
        
        m2 = float(a2y - b2y) / (a2x - b2x)
        int2 = a2y - m2 * a2x

        if m1 - m2:
            ix = float(int2 - int1) / (m1 - m2)
            iy = m1 * ix + int1
        elif m1 == m2:
            return None
    elif a1x == b1x:
        m2 = float(a2y - b2y) / (a2x - b2x)
        int2 = a2y - m2 * a2x
    
        ix = a1x
        iy = m2 * ix + int2
    elif a2x == b2x:
        m1 = float(a1y - b1y) / (a1x - b1x)
        int1 = a1y - m1 * a1x
    
        ix = a2x
        iy = m1 * ix + int1

    return ix, iy
    

def find_intersect(a, b, depth, *bounds):
    if depth > 10 or abs(bounds[0] - bounds[2]) < 5 or abs(bounds[1] - bounds[3]) < 5:
        x = (x1 + x2) * .5
        y = (y1 + y2) * .5
        return x, y

    box = c.find_overlapping(*bounds)
    
    q1bounds = bounds[0], bounds[1], bounds[2]*.5, bounds[3]*.5
    q2bounds = bounds[2]*.5, bounds[1], bounds[2], bounds[3]*.5
    q3bounds = bounds[0], bounds[3]*.5, bounds[2]*.5, bounds[3]
    q4bounds = bounds[2]*.5, bounds[3]*.5, bounds[2], bounds[3]
    

def curr_color():
    colors = (
        '#00cc00', # Green
        '#3300ff', # Blue
        '#ff9900', # Orange
        '#ff33cc', # Pink
        '#00ffff') # Cyan
        
    k = -1
    while True:
        k += 1
        k %= 5
        yield colors[k]


current_color = curr_color()
