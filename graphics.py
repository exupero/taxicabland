c = None


global current_color


ops = ('notify','change_parent','add_child','remove_child','become_child',
       'lower','select','deselect','delete')


def dist(a,b):
    def class_name(item): return item.__class__.__name__

    def point_point():
        ax, ay = a
        bx, by = b
        return abs(ax - bx) + abs(ay - by)

    def point_line(a,line):
        ax,ay = a
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
        return point_line(b,a)
    elif type(a) == type(()) and class_name(b) == 'Line':
        return point_line(a,b)


def find_intersection((a1,b1),(a2,b2)):
    a1x,a1y = a1
    b1x,b1y = b1
    a2x,a2y = a2
    b2x,b2y = b2

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

    return ix,iy


def find_intersect(a,b, depth, *bounds):
    if depth > 10 or abs(bounds[0] - bounds[2]) < 5 or abs(bounds[1] - bounds[3]) < 5:
        x = (x1 + x2) * .5
        y = (y1 + y2) * .5
        return x,y

    box = c.find_overlapping(*bounds)

    q1bounds = bounds[0], bounds[1], bounds[2]*.5, bounds[3]*.5
    q2bounds = bounds[2]*.5, bounds[1], bounds[2], bounds[3]*.5
    q3bounds = bounds[0], bounds[3]*.5, bounds[2]*.5, bounds[3]
    q4bounds = bounds[2]*.5, bounds[3]*.5, bounds[2], bounds[3]

    print box

    return None

    if a in box and b in box:
        result1 = find_intersect(a,b, depth+1, *q1bounds) # First quadrant
        result2 = find_intersect(a,b, depth+1, *q2bounds) # Second quadrant
        result3 = find_intersect(a,b, depth+1, *q3bounds) # Third quadrant
        result4 = find_intersect(a,b, depth+1, *q4bounds) # Fourth quadrant

        if result1: return result1
        if result2: return result2
        if result3: return result3
        if result4: return result4

    return None


def curr_color():
    colors = (
        '#00cc00', # Green
        '#3300ff', # Blue
        '#ff9900', # Orange
        '#ff33cc', # Pink
        '#00ffff', # Cyan
        )

    k = -1
    while True:
        k += 1
        k %= 5
        yield colors[k]

current_color = curr_color()


class Operations:
    def __init__(self, master):
        self.__children = []
        self.__master = master

    def notify(self):
        for child in self.__children:
            child.update()

    def change_parent(self, index, new_parent):
        # Abbr.
        master = self.__master

        # Remove the master from the old parent's children.
        master.parents[index].remove_child(master)

        # Set the master's parent index to be the new parent.
        master.parents[index] = new_parent
        # Add the master as the new parent's child.
        master.parents[index].add_child(master)

        # Update the object with the new parent.
        master.update()

    def add_child(self, child):
        self.__children.append(child)

    def remove_child(self, child):
        self.__children.remove(child)

    def become_child(self):
        master = self.__master

        for parent in master.parents:
            parent.add_child(master)

    def lower(self):
        master = self.__master

        # Lower the master.
        c.lower(master.handle)
        # Lower the grid.
        c.lower(1)

    def select(self):
        # For future implementation.
        pass

        for child in self.__children:
            child.select()

    def deselect(self):
        # For future implementation.
        pass

        for child in self.__children:
            child.deselect()

    def delete(self):
        master = self.__master

        c.delete(master.handle)

        for child in self.__children:
            child.delete()

        if hasattr(master, 'delete_extras'):
            getattr(master, 'delete_extras')()


class Point:
    size = 5

    new_specs = {
        'fill': 'red',
        'outline': 'black',
        'width': 2,
        'tags': 'Point'}

    selected_specs = {
        'outline': 'black'}

    unselected_specs = {
        'outline': ''}

    def __init__(self, x, y):
        self.handle = c.create_oval(0,0,0,0, **self.new_specs)

        self.__operations = Operations(self)
        self.parents = []
        self.coord = x,y

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def set_coord(self, x,y):
        self.coord = x,y
        self.update()

    def update(self):
        # Abbr.
        x,y = self.coord
        size = self.size

        # Update the drawing coordinates.
        c.coords(self.handle,
            x - size, y - size,
            x + size, y + size)

        # Raise.
        c.lift(self.handle)

        # Let the kids know what's going on.
        self.notify()


class PointOnLine:
    size = 5

    new_specs = {
        'fill': 'red',
        'outline': 'black',
        'width': 2,
        'tags': 'Point'}

    def __init__(self, line, x,y, position=None, locked=False):
        self.handle = c.create_oval(0,0,0,0, **self.new_specs)

        self.__operations = Operations(self)
        self.parents = [line]
        self.become_child()

        self.coord = x,y

        # See if a position was specified.
        if position:
            self.position = position

        # See if a position was not specified.
        elif not position:
            # Calculate the position.
            ax,ay = line.parents[0].coord
            bx,by = line.parents[1].coord
            if bx - ax:
                self.position = float(x - ax) / (bx - ax)
            elif by - ay:
                self.position = float(y - ay) / (by - ay)

        self.locked = locked

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def set_coord(self, x,y):
        self.coord = x,y
        self.update()

    def update(self):
        ax, ay = self.parents[0].parents[0].coord
        bx, by = self.parents[0].parents[1].coord
        x,y = self.coord

        # See if the point is locked to its place on the line.
        if self.locked:
            # The position stays the same.
            position = self.position

        # See if the point is not locked to its place on the line.
        elif not self.locked:
            # The position changes based on the new coordinates put in.
            if bx - ax and abs(float(by - ay) / (bx - ax)) <= 1:
                position = self.position = float(x - ax) / (bx - ax)
            elif by - ay and abs(float(bx - ax) / (by - ay)) <= 1:
                position = self.position = float(y - ay) / (by - ay)

            if position < 0:
                position = self.position = 0
            elif position > 1:
                position = self.position = 1

        x = ax + (bx - ax) * position
        y = ay + (by - ay) * position
        self.coord = x,y

        size = self.size

        c.lift(self.handle)

        c.coords(self.handle,
            x - size, y - size,
            x + size, y + size)

        self.notify()


class PointOfIntersection:
    size = 5

    new_specs = {
        'fill': 'red',
        'outline': 'blue',
        'width': 2,
        'tags': 'Point'}

    def __init__(self, (x,y), object1, object2):
        self.handle = c.create_oval(0,0,0,0, **self.new_specs)

        self.__operations = Operations(self)
        self.parents = [object1, object2]
        self.become_child()

        self.coord = x,y

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def update(self):
        a,b = self.parents
        size = self.size
        x,y = find_intersect(a.handle,b.handle, 0, 0,0, 2000,2000)

        c.coords(self.handle,
            x-size, y-size, x+size, y+size)

        c.lift(self.handle)

        self.notify()


class Line:
    new_specs = {
        'width': 2,
        'tags': 'Line'}

    selected_specs = {
        'fill': 'black'}

    unselected_specs = {
        'fill': 'black'}

    def __init__(self, a, b):
        self.handle = c.create_line(0,0,0,0, **self.new_specs)

        self.__operations = Operations(self)
        self.parents = [a,b]
        self.become_child()

        self.lower()

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def qualifies(self,x,y):
        a,b = self.__parents
        if a.x != b.x:
            slope = float(a.y - b.y) / (a.x - b.x)
            intercept = a.y - slope * a.x
            quality = abs(y - x * slope - intercept)
        else:
            quality = abs(x - a.x)

        return tuple(quality)

    def update(self):
        ax,ay = self.parents[0].coord
        bx,by = self.parents[1].coord

        c.coords(self.handle,
            ax, ay, bx, by)

        self.notify()


class Circle:
    new_specs = {
        'width': 2,
        'tags': 'Circle'}

    selected_specs = {
        'fill': 'black'}

    unselected_specs = {
        'fill': 'black'}

    def __init__(self, center_point, radius_point):
        self.handle = c.create_line(0,0,0,0, **self.new_specs)

        self.__operations = Operations(self)
        self.parents = [center_point, radius_point]
        self.radius = dist(*self.parents)
        self.become_child()

        self.lower()

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def quality(self, point):
        center = self.center.coord
        radius = self.radius.coord

        quality = dist(center,point) - dist(center,radius)

        return abs(quality)

    def update(self):
        cx, cy = self.parents[0].coord
        radius = self.radius = dist(self.parents[0].coord, self.parents[1].coord)

        c.coords(self.handle,
            cx - radius, cy,
            cx, cy - radius,
            cx + radius, cy,
            cx, cy + radius,
            cx - radius, cy)

        self.notify()


class Ellipse:
    new_specs = {
        'width': 2,
        'tags': 'Ellipse'}

    selected_specs = {
        'fill': 'black'}

    unselected_specs = {
        'fill': 'black'}

    tieline_specs = {
        'fill': 'green',
        'width': 1,
        'tags': 'Ellipse'}

    def __init__(self, focus1, focus2, k_point):
        self.handle = c.create_line(0,0,0,0, **self.new_specs)
        self.tielines = c.create_line(0,0,0,0, **self.tieline_specs)

        self.__operations = Operations(self)
        self.parents = [focus1, focus2, k_point]
        self.k = dist(focus1.coord, k_point.coord) + dist(focus2.coord, k_point.coord)
        self.become_child()

        # Lower the ellipse.
        c.lower(self.handle)
        c.lower(self.tielines)
        # Lower the grid.
        c.lower(1)

        self.update()

    def __getattr__(self, attr):
        if hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def quality(self, point):
        focus1, focus2, k = self.focus1, self.focus2, self.k

        quality = dist(focus1.coord, point) + dist(focus2.coord, point) - k

        return abs(quality)

    def update(self):
        f1x, f1y = f1 = self.parents[0].coord
        f2x, f2y = f2 = self.parents[1].coord
        k = self.k = dist(f1, self.parents[2].coord) + dist(f2, self.parents[2].coord)
        kx, ky = self.parents[2].coord

        distance_between = dist((f1x,f1y),(f2x,f2y))
        r = (k - distance_between) * .5

        if f1x <= f2x:
            x1 = f1x
            x2 = f2x
        else:
            x1 = f2x
            x2 = f1x

        if f1y <= f2y:
            y1 = f2y
            y2 = f1y
        else:
            y1 = f1y
            y2 = f2y

        c.coords(self.handle,
            x1 - r, y1,
            x1 - r, y2,
            x1, y2 - r,
            x2, y2 - r,
            x2 + r, y2,
            x2 + r, y1,
            x2, y1 + r,
            x1, y1 + r,
            x1 - r, y1)

        c.coords(self.tielines,
            f1x, f1y, kx, ky, f2x, f2y)

        self.notify()

    def delete_extras(self):
        c.delete(self.tielines)


class Midset:
    new_specs = {
        'fill': 'blue',
        'width': 2,
        'tags': 'Midset'}

    block_specs = {
        'fill': 'blue',
        'outline': '',
        'width': 2,
        'tags': 'Midset'}

    def __init__(self, a, b):
        self.handle = c.create_line(0,0,0,0, **self.new_specs)
        self.block1 = c.create_rectangle(0,0,0,0, **self.block_specs)
        self.block2 = c.create_rectangle(0,0,0,0, **self.block_specs)

        self.__operations = Operations(self)
        self.parents = [a,b]
        self.become_child()

        # Lower the midset.
        c.lower(self.handle)
        c.lower(self.block1)
        c.lower(self.block2)
        # Lower the grid.
        c.lower(1)

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def update(self):
        p1, p2 = self.parents
        midp = (p1.coord[0] + p2.coord[0])*.5, (p1.coord[1] + p2.coord[1])*.5

        k = dist(p1.coord, midp)

        def circle_points((cx,cy), radius):
            return (
                (cx + radius, cy), (cx - radius, cy),
                (cx, cy + radius), (cx, cy - radius))

        def find_closest(f1, f2):
            f1x,f1y = f1
            f2x,f2y = f2
            fdist = dist(f1,f2)

            # The circle points k from f1.
            f1c = ((f1x + k, f1y),(f1x, f1y + k),(f1x - k, f1y),(f1x, f1y - k))
            # The circle points k from f2.
            f2c = ((f2x + k, f2y),(f2x, f2y + k),(f2x - k, f2y),(f2x, f2y - k))

            # Find the two points x such that f1x == f2x.
            near_points = set(filter(
                lambda x: dist(f1,x) == dist(f2,x),
                f1c + f2c))

            return near_points

        def make_arms(ax,ay):
            step = .1
            test_points = ((ax + step, ay),(ax, ay + step),(ax - step, ay),(ax, ay - step))

            free_points = filter(
                lambda x:
                    dist(p1.coord,x) > dist(p1.coord,(ax,ay)) and \
                    dist(p2.coord,x) > dist(p2.coord,(ax,ay)),
                test_points)

            if len(free_points) == 1:
                bx,by = free_points[0]

                if bx < ax:
                    cx = 0
                elif bx > ax:
                    cx = 2000
                elif bx == ax:
                    cx = ax

                if by < ay:
                    cy = 0
                elif by > ay:
                    cy = 2000
                elif by == ay:
                    cy = ay

            elif len(free_points) == 2:
                b1x,b1y = free_points[0]
                b2x,b2y = free_points[1]

                if min(b1x,b2x) < ax:
                    cx = 0
                elif max(b1x,b2x) > ax:
                    cx = 2000
                elif b1x == ax and b2x == ax:
                    cx = ax

                if min(b1y,b2y) < ay:
                    cy = 0
                elif max(b1y,b2y) > ay:
                    cy = 2000
                elif b1y == ay and b2y == ay:
                    cy = ay

            return cx,cy

        def make_midset(f1, f2):
            # Make the middle segment.
            np = find_closest(f1.coord, f2.coord)
            if len(np) == 2:
                np1,np2 = np
                np1x,np1y = np1
                np2x,np2y = np2

                c.coords(self.handle, np1x,np1y, np2x,np2y)

                cx,cy = make_arms(np1x,np1y)
                dx,dy = make_arms(np2x,np2y)

                c.coords(self.block1,
                    np1x,np1y, cx,cy)

                c.coords(self.block2,
                    np2x,np2y, dx,dy)

        # The midset.
        make_midset(p1,p2)

        self.notify()

    def delete_extras(self):
        c.delete(self.block1)
        c.delete(self.block2)


class Perpendicular:
    new_specs = {
        'fill': 'blue',
        'width': 2,
        'tags': 'Midset'}

    block_specs = {
        'fill': 'blue',
        'outline': '',
        'width': 2,
        'tags': 'Midset'}

    def __init__(self, line, point):
        self.handle = c.create_line(0,0,0,0, **self.new_specs)
        self.block1 = c.create_rectangle(0,0,0,0, **self.block_specs)
        self.block2 = c.create_rectangle(0,0,0,0, **self.block_specs)

        self.__operations = Operations(self)
        self.parents = [line, point]
        self.become_child()

        # Lower the perpendicular.
        c.lower(self.handle)
        c.lower(self.block1)
        c.lower(self.block2)
        # Lower the grid.
        c.lower(1)

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def update(self):
        line, p = self.parents
        px,py = p.coord

        # Get the distance between the point and the line.
        pl_dist = dist((px,py), line)
        r = pl_dist + 50

        # Find the four points where the circle lines from p intersect the line.
        cp = (px + r,py),(px,py + r),(px - r,py),(px,py - r)
        intersections = []
        intersections.append(find_intersection((cp[0],cp[1]),(line.parents[0].coord, line.parents[1].coord)))
        intersections.append(find_intersection((cp[1],cp[2]),(line.parents[0].coord, line.parents[1].coord)))
        intersections.append(find_intersection((cp[2],cp[3]),(line.parents[0].coord, line.parents[1].coord)))
        intersections.append(find_intersection((cp[3],cp[0]),(line.parents[0].coord, line.parents[1].coord)))

        intersections = [intersection for intersection in intersections if intersection]

        def on_circle(point):
            d = round(dist(p.coord, point),1)
            radius = round(r,1)
            return d == radius

        # Get only the points on the circle radius r from p.
        intersections = filter(on_circle, intersections)

        if len(intersections) == 2:
            p1,p2 = intersections
            midp = (p1[0] + p2[0])*.5, (p1[1] + p2[1])*.5

            k = dist(p1, midp)

            def circle_points((cx,cy), radius):
                return (
                    (cx + radius, cy), (cx - radius, cy),
                    (cx, cy + radius), (cx, cy - radius))

            def find_closest(f1, f2):
                f1x,f1y = f1
                f2x,f2y = f2
                fdist = dist(f1,f2)

                # The circle points k from f1.
                f1c = ((f1x + k, f1y),(f1x, f1y + k),(f1x - k, f1y),(f1x, f1y - k))
                # The circle points k from f2.
                f2c = ((f2x + k, f2y),(f2x, f2y + k),(f2x - k, f2y),(f2x, f2y - k))

                # Find the two points x such that f1x == f2x.
                near_points = set(filter(
                    lambda x: dist(f1,x) == dist(f2,x),
                    f1c + f2c))

                return near_points

            def make_arms(ax,ay):
                step = .1
                test_points = ((ax + step, ay),(ax, ay + step),(ax - step, ay),(ax, ay - step))

                free_points = filter(
                    lambda x:
                        dist(p1,x) > dist(p1,(ax,ay)) and \
                        dist(p2,x) > dist(p2,(ax,ay)),
                    test_points)

                if len(free_points) == 1:
                    bx,by = free_points[0]

                    if bx < ax:
                        cx = 0
                    elif bx > ax:
                        cx = 2000
                    elif bx == ax:
                        cx = ax

                    if by < ay:
                        cy = 0
                    elif by > ay:
                        cy = 2000
                    elif by == ay:
                        cy = ay

                elif len(free_points) == 2:
                    b1x,b1y = free_points[0]
                    b2x,b2y = free_points[1]

                    if min(b1x,b2x) < ax:
                        cx = 0
                    elif max(b1x,b2x) > ax:
                        cx = 2000
                    elif b1x == ax and b2x == ax:
                        cx = ax

                    if min(b1y,b2y) < ay:
                        cy = 0
                    elif max(b1y,b2y) > ay:
                        cy = 2000
                    elif b1y == ay and b2y == ay:
                        cy = ay

                return cx,cy

            def make_midset(f1, f2):
                # Make the middle segment.
                np = find_closest(f1, f2)
                if len(np) == 2:
                    np1,np2 = np
                    np1x,np1y = np1
                    np2x,np2y = np2

                    c.coords(self.handle, np1x,np1y, np2x,np2y)

                    cx,cy = make_arms(np1x,np1y)
                    dx,dy = make_arms(np2x,np2y)

                    c.coords(self.block1,
                        np1x,np1y, cx,cy)

                    c.coords(self.block2,
                        np2x,np2y, dx,dy)

            # The midset.
            make_midset(p1,p2)

        self.notify()

    def delete_extras(self):
        c.delete(self.block1)
        c.delete(self.block2)


class Parallel:
    new_specs = {
        'fill': 'black',
        'width': 2,
        'tags': 'Line'}

    def __init__(self, line, point):
        self.handle = c.create_line(0,0,0,0, **self.new_specs)

        self.__operations = Operations(self)
        self.parents = [line, point]
        self.become_child()

        # Lower the parallel.
        self.lower()

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def update(self):
        line, point = self.parents
        l1,l2 = line.parents
        l1,l2 = l1.coord, l2.coord
        px,py = point.coord

        # If the line has a non-infinite slope...
        if l1[0] - l2[0]:
            slope = float(l1[1] - l2[1]) / (l1[0] - l2[0])
            intercept = py - slope * px

            # The two end points of the line.
            p1 = 0, intercept
            p2 = 2000, slope * 2000 + intercept

        # If the line is vertical....
        elif not l1[0] - l2[0]:
            p1 = px, 0
            p2 = px, 2000

        c.coords(self.handle,
            p1[0], p1[1], p2[0], p2[1])

        self.notify()


class Parabola:
    new_specs = {
        'fill': 'blue',
        'width': 2,
        'tags': 'Parabola'}

    def __init__(self, focus, directrix):
        self.handle = c.create_line(0,0,0,0, **self.new_specs)

        self.__operations = Operations(self)
        self.parents = [focus, directrix]
        self.become_child()

        self.lower()

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def update(self):
        focus, directrix = self.parents
        fx,fy = focus.coord
        d1x,d1y = directrix.parents[0].coord
        d2x,d2y = directrix.parents[1].coord

        mdist = dist((fx,fy),directrix) * .5
        mpoints = (fx + mdist,fy),(fx - mdist,fy),(fx,fy + mdist),(fx,fy - mdist)
        mpoint = filter(lambda x: round(dist((fx,fy),x),1) == round(dist(x,directrix),1), mpoints)
        if mpoint: mx,my = mpoint[0]

        line1 = (fx,fy),(fx + 1, fy + 1)
        line2 = (fx,fy),(fx + 1, fy - 1)
        d = (d1x,d1y),(d2x,d2y)

        int1 = find_intersection(line1,d)
        int2 = find_intersection(line2,d)

        if int1 and int2:
            t1x,t1y = int1
            t2x,t2y = int2
        elif int1 and not int2:
            t1x,t1y = int1
            t2x,t2y = mx,my
        elif not int1 and int2:
            t1x,t1y = mx,my
            t2x,t2y = int2

        int1_points = (t1x,fy),(fx,t1y)
        int2_points = (t2x,fy),(fx,t2y)

        int1 = filter(
            lambda x: round(dist(x,directrix),1) == round(dist(x,(fx,fy)),1),
            int1_points)
        int2 = filter(
            lambda x: round(dist(x,directrix),1) == round(dist(x,(fx,fy)),1),
            int2_points)
        if int1: t1x,t1y = int1[0]
        if int2: t2x,t2y = int2[0]

        # Determine the extreme points.
        far1_points = (t1x - 2000,t1y),(t1x + 2000,t1y),(t1x,t1y - 2000),(t1x,t1y + 2000)
        far2_points = (t2x - 2000,t2y),(t2x + 2000,t2y),(t2x,t2y - 2000),(t2x,t2y + 2000)

        far1 = filter(
            lambda x: round(dist(x,directrix),1) == round(dist(x,(fx,fy)),1),
            far1_points)
        far2 = filter(
            lambda x: round(dist(x,directrix),1) == round(dist(x,(fx,fy)),1),
            far2_points)

        if far1: far1x,far1y = far1[0]
        if far2: far2x,far2y = far2[0]

        if int1 and int2 and far1 and far2:
            c.coords(self.handle,
                far1x,far1y, t1x,t1y, mx,my, t2x,t2y, far2x,far2y)

        self.notify()


class Hyperbola:
    mid_specs = {
        'fill': 'blue',
        'width': 2,
        'tags': 'Hyperbola'}

    arm_specs = {
        'fill': 'blue',
        'outline': '',
        'tags': 'Hyperbola'}

    tieline_specs = {
        'fill': 'green',
        'width': 1,
        'tags': 'Hyperbola'}

    def __init__(self, f1, f2, k_point):
        self.handle = c.create_oval(0,0,0,0)
        self.mid_handles = [
            c.create_line(0,0,0,0, **self.mid_specs),
            c.create_line(0,0,0,0, **self.mid_specs)]

        self.arm_handles = [
            c.create_rectangle(0,0,0,0, **self.arm_specs),
            c.create_rectangle(0,0,0,0, **self.arm_specs),
            c.create_rectangle(0,0,0,0, **self.arm_specs),
            c.create_rectangle(0,0,0,0, **self.arm_specs)]
        self.tielines = c.create_line(0,0,0,0, **self.tieline_specs)

        self.__operations = Operations(self)
        self.parents = [f1,f2,k_point]
        self.become_child()

        # Lower the hyperbola.
        c.lower(self.handle)
        [c.lower(handle) for handle in self.mid_handles]
        [c.lower(handle) for handle in self.arm_handles]
        c.lower(self.tielines)
        # Lower the grid.
        c.lower(1)

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def update(self):
        focus1, focus2, k_point = self.parents
        k = dist(focus1.coord, k_point.coord) - dist(focus2.coord, k_point.coord)

        # Make the tielines.
        c.coords(self.tielines,
            focus1.coord[0], focus1.coord[1],
            k_point.coord[0], k_point.coord[1],
            focus2.coord[0], focus2.coord[1])

        def circle_points((cx,cy), radius):
            return (
                (cx + radius, cy), (cx - radius, cy),
                (cx, cy + radius), (cx, cy - radius))

        def find_closest(f1, f2):
            f1x,f1y = f1
            f2x,f2y = f2
            fdist = dist(f1,f2)
            a = (fdist - k) * .5
            b = fdist - a

            # The circle points b from f1.
            f1c = ((f1x + b, f1y),(f1x, f1y + b),(f1x - b, f1y),(f1x, f1y - b))
            # The circle points a from f2.
            f2c = ((f2x + a, f2y),(f2x, f2y + a),(f2x - a, f2y),(f2x, f2y - a))

            # Find the two points x such that f1x + f2x = f1f2
            near_points = set(filter(
                lambda x: dist(f1,x) + dist(f2,x) == dist(f1,f2),
                f1c + f2c))

            return near_points

        def make_arms(ax,ay):
            step = .1
            test_points = ((ax + step, ay),(ax, ay + step),(ax - step, ay),(ax, ay - step))

            free_points = filter(
                lambda x:
                    dist(focus1.coord,x) > dist(focus1.coord,(ax,ay)) and \
                    dist(focus2.coord,x) > dist(focus2.coord,(ax,ay)),
                test_points)

            if len(free_points) == 1:
                bx,by = free_points[0]

                if bx < ax:
                    cx = 0
                elif bx > ax:
                    cx = 2000
                elif bx == ax:
                    cx = ax

                if by < ay:
                    cy = 0
                elif by > ay:
                    cy = 2000
                elif by == ay:
                    cy = ay

            elif len(free_points) == 2:
                b1x,b1y = free_points[0]
                b2x,b2y = free_points[1]

                if min(b1x,b2x) < ax:
                    cx = 0
                elif max(b1x,b2x) > ax:
                    cx = 2000
                elif b1x == ax and b2x == ax:
                    cx = ax

                if min(b1y,b2y) < ay:
                    cy = 0
                elif max(b1y,b2y) > ay:
                    cy = 2000
                elif b1y == ay and b2y == ay:
                    cy = ay

            return cx,cy

        def make_hyperbola(f1, f2, number):
            # Make the middle segment.
            np = find_closest(f1.coord, f2.coord)
            if len(np) == 2:
                np1,np2 = np
                np1x,np1y = np1
                np2x,np2y = np2

                c.coords(self.mid_handles[number], np1x,np1y, np2x,np2y)

                cx,cy = make_arms(np1x,np1y)
                dx,dy = make_arms(np2x,np2y)

                c.coords(self.arm_handles[2*number],
                    np1x,np1y, cx,cy)

                c.coords(self.arm_handles[2*number+1],
                    np2x,np2y, dx,dy)

        # The first hyperbola.
        make_hyperbola(focus1, focus2, 0)
        # The second hyperbola.
        make_hyperbola(focus2, focus1, 1)

        self.notify()

    def delete_extras(self):
        c.delete(*self.mid_handles)
        c.delete(*self.arm_handles)
        c.delete(self.tielines)


class Bisect:
    new_specs = {
        'fill': 'blue',
        'width': 2,
        'tags': 'Bisect'}

    def __init__(self, r1, v, r2):
        self.handle = c.create_line(0,0,0,0, **self.new_specs)

        self.__operations = Operations(self)
        self.parents = [r1, v, r2]
        self.become_child()

        self.lower()

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def update(self):
        r1, v, r2 = self.parents
        r1, v, r2 = r1.coord, v.coord, r2.coord

        def angle(source, ray):
            sx, sy = source
            rx, ry = ray

            radius = dist(source, ray)
            xshort = radius - abs(rx - sx)
            arc_len = 2*xshort
            circumference = 8 * radius
            if circumference:
                angle = 360 * float(arc_len) / circumference

            if rx > sx and ry > sy:
                # In quadrant 1
                return angle
            elif rx < sx and ry > sy:
                # In quadrant 2
                return 180 - angle
            elif rx < sx and ry < sy:
                # In quadrant 3
                return 180 + angle
            elif rx > sx and ry < sy:
                # In quadrant 4
                return 360 - angle
            elif rx == sx and ry > sy:
                return 90
            elif rx == sx and ry < sy:
                return 270
            elif rx > sx and ry == sy:
                return 0
            elif rx < sx and ry == sy:
                return 180

        def arc_angle(angle):
            # Get rid of extra rotations.
            angle %= 360

            # An arbitrary radius.
            r = 2000

            def acute_angle(angle):
                # angle / 360 = arc length / circumference (circumference is 8r)
                # (.00277777 = 1/360)
                arc_len = float(angle) * 8 * r * .00277777
                # Right-isosceles triangle with hypotenuse taxi
                # length arc_len. Legs are taxi/Euclidean length
                # arc_len / 2.
                return arc_len * .5

            if angle > 0 and angle < 90:
                xshort = acute_angle(angle)
                x = r - xshort
                y = xshort
            elif angle > 90 and angle < 180:
                xshort = acute_angle(180 - angle)
                x = -r + xshort
                y = xshort
            elif angle > 180 and angle < 270:
                xshort = acute_angle(angle - 180)
                x = -r + xshort
                y = -xshort
            elif angle > 270 and angle < 360:
                xshort = acute_angle(360 - angle)
                x = r - xshort
                y = -xshort
            elif angle == 0:
                x,y = r,0
            elif angle == 90:
                x,y = 0,r
            elif angle == 180:
                x,y = -r,0
            elif angle == 270:
                x,y = 0,-r

            return x,y

        angle1 = angle(v,r1)
        angle2 = angle(v,r2)
        bisect  = (angle1 + angle2) * .5

        if abs(angle1 - angle2) > 180:
            bisect += 180

        x,y = arc_angle(bisect)

        sx,sy = v
        x += sx
        y += sy

        c.coords(self.handle,
            sx, sy, x,y)

        self.notify()


class Mindist:
    new_area = {
        'stipple': 'gray50',
        'width': 0,
        'tags': 'Mindist'}

    new_spot = {
        'outline': '',
        'tags': 'Mindist'}

    def __init__(self, points):
        color = current_color.next()

        # If there are an even number of points...
        if not len(points) % 2:
            self.new_area['fill'] = color
            self.handle = c.create_rectangle(0,0,0,0, **self.new_area)

        # If there are an odd number of points...
        elif len(points) % 2:
            self.new_spot['fill'] = color
            self.handle = c.create_oval(0,0,0,0, **self.new_spot)

        self.__operations = Operations(self)
        self.parents = points
        self.become_child()

        for parent in self.parents:
            c.itemconfigure(parent.handle, fill=color)

        self.lower()

        self.update()

    def __getattr__(self, attr):
        if attr in ops and hasattr(self.__operations, attr):
            return getattr(self.__operations, attr)
        else:
            raise AttributeError, attr

    def update(self):
        xs = [parent.coord[0] for parent in self.parents]
        ys = [parent.coord[1] for parent in self.parents]

        xs.sort()
        ys.sort()

        xmid = int(len(xs) * .5)
        ymid = int(len(ys) * .5)

        # If there are an even number of points...
        if not len(self.parents) % 2:
            # Get the middle two points.
            xmid = [xs[xmid-1], xs[xmid]]
            ymid = [ys[ymid-1], ys[ymid]]

            if abs(xmid[1] - xmid[0]) < 4:
                xmid[0] -= 2
                xmid[1] += 2

            if abs(ymid[1] - ymid[0]) < 4:
                ymid[0] -= 2
                ymid[1] += 2

            c.coords(self.handle,
                xmid[0],ymid[0], xmid[1],ymid[1])

        # If there are an odd number of points...
        elif len(self.parents) % 2:
            xmid = xs[xmid]
            ymid = ys[ymid]

            size = 3
            c.coords(self.handle,
                xmid - size, ymid - size, xmid + size, ymid + size)

        self.notify()

    def delete(self):
        # Change the parents' colors back to red.
        for parent in self.parents:
            c.itemconfigure(parent.handle, fill='red')

        self.__operations.delete()
