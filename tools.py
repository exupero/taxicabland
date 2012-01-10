from Tkinter import NW

import graphics as g


graphics = {}
c = None


def add_graphic(new_object, *args, **kwargs):
    new_object = new_object(*args, **kwargs)
    graphics[new_object.handle] = new_object
    return new_object


def under_cursor(x,y, *discount):
    '''
    Retrieves the objects under the cursor (within a certain margin).
    Returns a dictionary in which the keys are the available labels
    and the values are lists of which handles have that label.
    '''
    size = 2
    over_items = c.find_overlapping(
        x - size, y - size,
        x + size, y + size)

    if over_items == (1,): # only the grid was found
        return None

    over_items = list(over_items)

    for handle in discount:
        if handle in over_items:
            over_items.remove(handle)

    # Initialize the dictionary.
    items = {
        'current': [],
        'Background': [],
        'HelpText': [],
        'Button': [],

        'Point': [],
        'Line': [],
        'Circle': [],
        'Ellipse': [],
        'Midset': [],
        'Parabola': [],
        'Hyperbola': [],
        'Bisect': [],
        'Mindist': [],
    }

    for handle in over_items:
        tags = c.gettags(handle)

        for tag in tags:
            items[tag].append(handle)

    return items


class Tool(object):
    help_text_handle = None

    def set_help_text(self, text):
        if not self.help_text_handle:
            self.help_text_handle = c.create_text(10, 10, text=text, anchor=NW, fill='red', tags='HelpText')
        else:
            c.itemconfigure(self.help_text_handle, text=text)

    def activate(self):
        pass

    def deactivate(self):
        self.set_help_text('')

    def left_click(self, event):
        pass

    def left_drag(self, event):
        pass

    def left_release(self, event):
        pass

    def right_click(self, event):
        '''Removes an item.'''
        over_item = c.find_withtag('current')

        if over_item and over_item[0] != 1: # not the grid
            graphics[over_item[0]].delete()


class PointTool(Tool):
    items = None

    def activate(self):
        self.set_help_text("Click to create a point. Click and drag to move it.")

    def left_click(self, event):
        x, y = event.x, event.y
        items = self.items = under_cursor(x, y)

        if not items:
            add_graphic(g.Point, x, y)
        elif items['Point']:
            pass
        elif items['Line']:
            line_handle = items['Line'][0]
            line = graphics[line_handle]
            add_graphic(g.PointOnLine, line, x, y)
        else:
            add_graphic(g.Point, x, y)

    def left_drag(self, event):
        '''Moves a point.'''
        x, y = event.x, event.y
        items = self.items

        if items and items['Point']:
            point_handle = items['Point'][0]
            point = graphics[point_handle]
            point.set_coord(x, y)

    def left_release(self, event):
        self.items = None


class LineTool(Tool):
    end_point = curr_line = None

    def activate(self):
        self.set_help_text("Click and drag to create a line.")

    def deactivate(self):
        self.set_help_text('')
        self.end_point = self.curr_line = None

    def left_click(self, event):
        '''Creates a new line.'''
        x, y = event.x, event.y
        items = under_cursor(x, y)

        if not items:
            start_point = add_graphic(g.Point, x, y)
            end_point = self.end_point = add_graphic(g.Point, x, y)
            self.curr_line = add_graphic(g.Line, start_point, end_point)
        elif items['Point']:
            start_handle = items['Point'][0]
            start_point = graphics[start_handle]
            end_point = self.end_point = add_graphic(g.Point, x, y)
            self.curr_line = add_graphic(g.Line, start_point, end_point)
        else:
            start_point = add_graphic(g.Point, x, y)
            end_point = self.end_point = add_graphic(g.Point, x, y)
            self.curr_line = add_graphic(g.Line, start_point, end_point)

    def left_drag(self, event):
        '''Move the end of the line.'''
        if self.end_point:
            self.end_point.set_coord(event.x, event.y)

    def left_release(self, event):
        '''Finish creating the line.'''
        x, y = event.x, event.y
        items = under_cursor(x, y, self.end_point.handle, self.curr_line.handle)

        if items and items['Point']:
            point_handle = items['Point'][0]
            self.curr_line.change_parent(1, graphics[point_handle])
            self.end_point.delete()

        self.end_point = self.curr_line = None


class CircleTool(Tool):
    radius_point = curr_circle = None

    def activate(self):
        self.set_help_text("Click and drag to create a circle.")

    def deactivate(self):
        self.set_help_text('')
        self.radius_point = self.curr_circle = None

    def left_click(self, event):
        '''Create the center and radius points of the circle.'''
        x, y = event.x, event.y
        items = under_cursor(x,y)

        if not items:
            center_point = add_graphic(g.Point, x,y)
            radius_point = self.radius_point = add_graphic(g.Point, x,y)
            self.curr_circle = add_graphic(g.Circle, center_point, radius_point)
        elif items['Point']:
            center_handle = items['Point'][0]
            center_point = graphics[center_handle]
            radius_point = self.radius_point = add_graphic(g.Point, x, y)
            self.curr_circle = add_graphic(g.Circle, center_point, radius_point)
        else:
            center_point = add_graphic(g.Point, x,y)
            radius_point = self.radius_point = add_graphic(g.Point, x,y)
            self.curr_circle = add_graphic(g.Circle, center_point, radius_point)

    def left_drag(self, event):
        '''Move the circle's radius control point.'''
        if self.radius_point:
            self.radius_point.set_coord(event.x, event.y)

    def left_release(self, event):
        '''Finish creating the circle.'''
        x, y = event.x, event.y

        # Get the items under the cursor.
        items = under_cursor(x, y, self.radius_point.handle, self.curr_circle.handle)

        if items and items['Point']:
            point_handle = items['Point'][0]
            self.curr_circle.change_parent(1, graphics[point_handle])
            self.radius_point.delete()

        self.radius_point = self.curr_circle = None


class EllipseTool(Tool):
    f1 = f2 = k_point = curr_ellipse = None

    def activate(self):
        self.set_help_text("Click once, then click and drag to create an ellipse.")

    def deactivate(self):
        self.set_help_text('')
        self.f1 = self.f2 = self.k_point = self.curr_ellipse = None

    def left_click(self, event):
        '''Create the foci and k_point of the ellipse.'''
        x, y = event.x, event.y
        items = under_cursor(x, y)

        if not items:
            if not self.f1:
                self.f1 = add_graphic(g.Point, x, y)

            elif not self.f2:
                f2 = self.f2 = add_graphic(g.Point, x, y)
                k_point = self.k_point = add_graphic(g.Point, x, y)
                self.curr_ellipse = add_graphic(g.Ellipse, self.f1, f2, k_point)
        elif items['Point']:
            point_handle = items['Point'][0]

            if not self.f1:
                self.f1 = graphics[point_handle]

            elif not self.f2:
                f2 = self.f2 = graphics[point_handle]
                k_point = self.k_point = add_graphic(g.Point, x,y)
                self.curr_ellipse = add_graphic(g.Ellipse, self.f1, f2, k_point)
        else:
            if not self.f1:
                self.f1 = add_graphic(g.Point, x, y)

            elif not self.f2:
                f2 = self.f2 = add_graphic(g.Point, x, y)
                k_point = self.k_point = add_graphic(g.Point, x, y)
                self.curr_ellipse = add_graphic(g.Ellipse, self.f1, f2, k_point)

    def left_drag(self, event):
        '''Move the k_point.'''
        if self.k_point:
            self.k_point.set_coord(event.x, event.y)

    def left_release(self, event):
        '''Finish the ellipse.'''
        if self.k_point:
            x, y = event.x, event.y
            items = under_cursor(x, y, self.k_point.handle, self.curr_ellipse.handle)

            if items and items['Point']:
                point_handle = items['Point'][0]
                self.curr_ellipse.change_parent(2, graphics[point_handle])
                self.k_point.delete()

            self.f1 = self.f2 = self.k_point = self.curr_ellipse = None


class MidpointTool(Tool):
    def activate(self):
        self.set_help_text("Click a line to display its midpoint.")

    def left_click(self, event):
        '''Create a midpoint on the given line.'''
        x, y = event.x, event.y
        items = under_cursor(x, y)

        if items and items['Line']:
            line_handle = items['Line'][0]
            mid_point = add_graphic(g.PointOnLine, graphics[line_handle], x, y, .5, locked=True)


class MidsetTool(Tool):
    p1 = p2 = None

    def activate(self):
        self.set_help_text("Click two points to display their midset.")

    def deactivate(self):
        self.set_help_text('')
        self.p1 = self.p2 = None

    def left_click(self, event):
        '''Create the midset of two points.'''
        items = under_cursor(event.x, event.y)

        if items and items['Point']:
            point_handle = items['Point'][0]

            if not self.p1:
                self.p1 = graphics[point_handle]

            elif not self.p2:
                self.p2 = graphics[point_handle]
                add_graphic(g.Midset, self.p1, self.p2)
                self.p1 = self.p2 = None


class PerpendicularTool(Tool):
    line = p = curr_perp = None

    def activate(self):
        self.set_help_text("Click a line and drag to display a perpendicular.")

    def deactivate(self):
        self.set_help_text('')
        self.line = self.p = self.curr_perp = None

    def left_click(self, event):
        '''Select the line and create the point of a perpendicular.'''
        x, y = event.x, event.y
        items = under_cursor(x, y)

        if items and items['Line']:
            line_handle = items['Line'][0]
            line = self.line = graphics[line_handle]
            self.p = add_graphic(g.Point, x, y)
            self.curr_perp = add_graphic(g.Perpendicular, line, self.p)

    def left_drag(self, event):
        '''Move the point through which the perpendicular passes.'''
        if self.p:
            self.p.set_coord(event.x, event.y)

    def left_release(self, event):
        '''Finish creating the perpendicular.'''
        x, y = event.x, event.y
        items = under_cursor(x, y, self.p.handle)

        if items and items['Point']:
            point_handle = items['Point'][0]
            self.curr_perp.change_parent(1, graphics[point_handle])
            self.p.delete()

        self.line = self.p = self.curr_perp = None


class ParallelTool(Tool):
    line = p = curr_parallel = None

    def activate(self):
        self.set_help_text("Click a line and drag to display a parallel.")

    def deactivate(self):
        self.set_help_text('')
        self.line = self.p = self.curr_parallel = None

    def left_click(self, event):
        '''Select the line and create the point of a parallel.'''
        x, y = event.x, event.y
        items = under_cursor(x, y)

        if items and items['Line']:
            line_handle = items['Line'][0]
            line = self.line = graphics[line_handle]
            self.p = add_graphic(g.Point, x, y)
            self.curr_parallel = add_graphic(g.Parallel, line, self.p)

    def left_drag(self, event):
        '''Move the point through which the parallel passes.'''
        if self.p:
            self.p.set_coord(event.x, event.y)

    def left_release(self, event):
        '''Finish creating the parallel.'''
        if self.p:
            x, y = event.x, event.y
            items = under_cursor(x, y, self.p.handle)

            if items and items['Point']:
                point_handle = items['Point'][0]
                self.curr_parallel.change_parent(1, graphics[point_handle])
                self.p.delete()

            self.line = self.p = self.curr_parallel = None


class ParabolaTool(Tool):
    focus = directrix = curr_parabola = end_point = None

    def activate(self):
        self.set_help_text("Click once, then click and drag to create a parabola.")

    def deactivate(self):
        self.set_help_text('')
        self.focus = self.directrix = self.curr_parabola = self.end_point = None

    def left_click(self, event):
        '''Make a new parabola.'''
        x, y = event.x, event.y
        items = under_cursor(x, y)

        if not items:
            if not self.focus:
                self.focus = add_graphic(g.Point, x, y)

            elif not self.directrix:
                start_point = add_graphic(g.Point, x, y)
                end_point = self.end_point = add_graphic(g.Point, x, y)
                self.directrix = add_graphic(g.Line, start_point, end_point)
                self.curr_parabola = add_graphic(g.Parabola, self.focus, self.directrix)
        elif items['Point']:
            point_handle = items['Point'][0]

            if not self.focus:
                self.focus = graphics[point_handle]

            elif not self.directrix:
                start_point = graphics[point_handle]
                end_point = self.end_point = add_graphic(g.Point, x, y)
                self.directrix = add_graphic(g.Line, start_point, end_point)
                self.curr_parabola = add_graphic(g.Parabola, self.focus, self.directrix)
        elif items['Line']:
            line_handle = items['Line'][0]

            if not self.directrix:
                self.directrix = graphics[line_handle]
                self.curr_parabola = add_graphic(g.Parabola, self.focus, self.directrix)
        else:
            if not self.focus:
                self.focus = add_graphic(g.Point, x, y)

            elif not self.directrix:
                start_point = add_graphic(g.Point, x, y)
                end_point = self.end_point = add_graphic(g.Point, x, y)
                self.directrix = add_graphic(g.Line, start_point, end_point)
                self.curr_parabola = add_graphic(g.Parabola, self.focus, self.directrix)

    def left_drag(self, event):
        '''Move the end point of the directrix.'''
        if self.end_point:
            self.end_point.set_coord(event.x, event.y)

    def left_release(self, event):
        '''Finish the parabola.'''
        if self.focus and self.directrix:
            x, y = event.x, event.y

            if self.end_point:
                items = under_cursor(x, y, self.directrix.handle, self.end_point.handle)
            else:
                items = under_cursor(x, y, self.directrix.handle)

            if items and items['Point']:
                point_handle = items['Point'][0]
                self.curr_parabola.parents[1].change_parent(1, graphics[point_handle])
                self.end_point.delete()

            self.focus = self.directrix = self.curr_parabola = self.end_point = None


class HyperbolaTool(Tool):
    f1 = f2 = k_point = curr_hyperbola = None

    def activate(self):
        self.set_help_text("Click once, then click and drag to create a hyperbola.")

    def deactivate(self):
        self.set_help_text('')
        self.f1 = self.f2 = self.k_point = self.curr_hyperbola = None

    def left_click(self, event):
        '''Create a hyperbola.'''
        x, y = event.x, event.y
        items = under_cursor(x, y)

        if not items:
            if not self.f1:
                self.f1 = add_graphic(g.Point, x,y)

            elif not self.f2:
                f2 = self.f2 = add_graphic(g.Point, x,y)
                k_point = self.k_point = add_graphic(g.Point, x,y)
                self.curr_hyperbola = add_graphic(g.Hyperbola, self.f1, f2, k_point)
        elif items['Point']:
            point_handle = items['Point'][0]

            if not self.f1:
                self.f1 = graphics[point_handle]

            elif not self.f2:
                f2 = self.f2 = graphics[point_handle]
                k_point = self.k_point = add_graphic(g.Point, x,y)
                self.curr_hyperbola = add_graphic(g.Hyperbola, self.f1, f2, k_point)
        else:
            if not self.f1:
                self.f1 = add_graphic(g.Point, x,y)

            elif not self.f2:
                f2 = self.f2 = add_graphic(g.Point, x,y)
                k_point = self.k_point = add_graphic(g.Point, x,y)
                self.curr_hyperbola = add_graphic(g.Hyperbola, self.f1, f2, k_point)

    def left_drag(self, event):
        '''Moves the k point of the hyperbola.'''
        if self.k_point:
            self.k_point.set_coord(event.x, event.y)

    def left_release(self, event):
        '''Finishes the hyperbola.'''
        if self.f1 and self.f2 and self.k_point:
            x, y = event.x, event.y
            items = under_cursor(x, y, self.k_point.handle)

            if items and items['Point']:
                point_handle = items['Point'][0]
                self.curr_hyperbola.change_parent(2, graphics[point_handle])
                self.k_point.delete()

            self.f1 = self.f2 = self.k_point = self.curr_hyperbola = None


class BisectTool(Tool):
    r1 = v = r2 = None

    def activate(self):
        self.set_help_text(
            "Click a point on one ray, then click the vertex of the " + \
            "angle, then click a point on second ray to create an " + \
            "angle bisector.")

    def deactivate(self):
        self.set_help_text('')
        self.r1 = self.v = self.r2 = None

    def left_click(self, event):
        '''Pick points that form an angle.'''
        items = under_cursor(event.x, event.y)

        if items and items['Point']:
            point_handle = items['Point'][0]

            if not self.r1:
                self.r1 = graphics[point_handle]
            elif not self.v:
                self.v = graphics[point_handle]
            elif not self.r2:
                self.r2 = graphics[point_handle]

    def left_release(self, event):
        '''Finish the angle.'''
        if self.r1 and self.v and self.r2:
            add_graphic(g.Bisect, self.r1, self.v, self.r2)
            self.r1 = self.v = self.r2 = None


class MindistTool(Tool):
    loci = []

    def activate(self):
        self.set_help_text(
            "Click points one at a time, then click 'Finish' to find " + \
            "the location of minimum distance to those points.")

        self.finish_button = c.create_rectangle(7,40, 80,62, fill='red', width=2, tags='Button')
        self.finish_text = c.create_text(10,40, text='FINISH', anchor=NW, fill='black', font=('Arial','16'), tags='Button')

    def deactivate(self):
        self.set_help_text('')
        self.loci = []

    def deactivate(self):
        c.delete(self.finish_button)
        c.delete(self.finish_text)

        # Reset the help text.
        c.itemconfigure(self.help_text_handle, text='')

    def left_click(self, event):
        '''Select points to find the minimum distance from.'''
        items = under_cursor(event.x, event.y)

        if items and items['Point']:
            point_handle = items['Point'][0]
            self.loci.append(graphics[point_handle])
        elif items['Button']:
            add_graphic(g.Mindist, self.loci)
            self.loci = []
