import Tkinter as tk

import graphics
import tools


class Tool:
    __button_attrs = {
        'borderwidth': 1,
        'relief': tk.FLAT,
        'indicatoron': 0,
        'width': 8}

    def __init__(self, name, symbol, specific_tool):
        self.name = name
        self.symbol = symbol
        self.tool = specific_tool()

    def draw(self, master, frame):
        t = tk.Radiobutton(frame,
            text=self.symbol,
            variable=master.tool,
            value=self.tool,
            **self.__button_attrs)
        t.pack(side=tk.LEFT)
        t.bind('<Button-1>', master.change_tool)
        self.instance = t


class TaxicabGeometry:
    tool = None

    def __init__(self, master):
        self.toolbox = {
            'Point': Tool('Point', '.', tools.PointTool),
            'Line': Tool('Line', '/', tools.LineTool),
            'Circle': Tool('Circle', 'Circle', tools.CircleTool),
            'Ellipse': Tool('Ellipse', 'Ellipse', tools.EllipseTool),
            'Midpoint': Tool('Midpoint', 'Midpoint', tools.MidpointTool),
            'Midset': Tool('Midset', 'Midset', tools.MidsetTool),
            'Perp': Tool('Perpendicular', 'Perp', tools.PerpendicularTool),
            'Parallel': Tool('Parallel', '||', tools.ParallelTool),
            'Parabola': Tool('Parabola', 'Parabola', tools.ParabolaTool),
            'Hyperbola': Tool('Hyperbola', 'Hyperbola', tools.HyperbolaTool),
            'Angle Bisect': Tool('Angle Bisect', 'Bisect', tools.BisectTool),
            'Min Dist': Tool('Min Dist', 'Min Dist', tools.MindistTool)}

        tool_order = (
            'Point',
            'Line',
            'Circle',
            'Ellipse',
            'Midpoint',
            'Midset',
            'Perp',
            'Parallel',
            'Parabola',
            'Hyperbola',
            'Angle Bisect',
            'Min Dist',
        )

        master.title("Taxicab Geometry v1")

        frame = tk.Frame(master)
        frame.pack()

        # CANVAS
        wwidth = 800
        wheight = 600
        c = tk.Canvas(master,
            width=wwidth,
            height=wheight,
            bg='white')
        c.pack(side=tk.LEFT, fill=tk.BOTH, expand=1)
        self.c = tools.c = graphics.c = c

        self.make_grid()

        # TOOLBOX
        for tool in tool_order:
            self.toolbox[tool].draw(self, frame)

        self.tool = self.toolbox['Point']
        self.tool.instance.select()
        self.tool.tool.activate()

        # OTHER BUTTONS
        clear_canvas = tk.Button(
            frame,
            text='CLEAR',
            command=self.clear_canvas,
            borderwidth=1)
        help_button = tk.Button(
            frame,
            text='HELP',
            command=self.help_button,
            borderwidth=1)

        clear_canvas.pack(side=tk.LEFT, padx=10)
        help_button.pack(side=tk.LEFT, padx=10)

        # Event bindings.
        c.bind('<Button-1>', self.left_click)
        c.bind('<B1-Motion>', self.left_drag)
        c.bind('<ButtonRelease-1>', self.left_release)
        c.bind('<Button-3>', self.right_click)

    def left_click(self, event):
        getattr(self.tool.tool, 'left_click')(event)

    def left_drag(self, event):
        getattr(self.tool.tool, 'left_drag')(event)

    def left_release(self, event):
        getattr(self.tool.tool, 'left_release')(event)

    def right_click(self, event):
        getattr(self.tool.tool, 'right_click')(event)

    def change_tool(self, event):
        for tool in self.toolbox.values():
            if tool.instance == event.widget:
                self.tool.tool.deactivate()
                self.tool = tool
                self.tool.tool.activate()

    def make_grid(self):
        c = self.c

        try:
            self.grid_image = tk.PhotoImage(file='grid.gif')
        except:
            pass
        else:
            image = c.create_image(0, 0, anchor=tk.NW, image=self.grid_image, tags='Background')

    # Button methods.

    def clear_canvas(self):
        c = self.c

        object_types = (
            'Point',
            'Line',
            'Circle',
            'Ellipse',
            'Midset',
            'Perpendicular',
            'Parabola',
            'Hyperbola',
            'Bisect',
            'Mindist',
        )

        for object_type in object_types:
            c.delete(object_type)

        graphics.graphics = {}

    def hide_points(self):
        pass

    def help_button(self):
        help_frame = tk.Tk()
        help_frame.title('Taxicab Geometry v1 help')

        title = tk.Text(help_frame, borderwidth=0, height=5, wrap=tk.WORD)
        title.pack()

        title.insert(tk.END, 'TAXICAB GEOMETRY v1', 'title')

        scrollbar = tk.Scrollbar(help_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        text = tk.Text(help_frame, borderwidth=0, wrap=tk.WORD)
        text.pack(padx=5, pady=5)

        text.insert(tk.END, '\nHow to Use\n','h1')

        try:
            infile = open('README.rst','r')
        except:
            pass

        help_text = infile.read()
        infile.close()

        text.insert(tk.END, help_text, 'body')

        # Formatting.
        title.tag_config(
            'title',
            font=('Impact', 16),
            justify=tk.CENTER,
            spacing3=5)

        title.tag_config(
            'author',
            font=('Arial', 8),
            justify=tk.CENTER)

        text.tag_config(
            'h1',
            font=('Arial', 12),
            underline=True)

        text.tag_config(
            'h2',
            font=('Arial Black', 10))

        text.tag_config(
            'body',
            font=('Arial', 10))

        text.config(state=tk.DISABLED, yscrollcommand=scrollbar.set)
        scrollbar.config(command=text.yview)

        help_frame.mainloop()


if __name__ == "__main__":
    root = tk.Tk()
    tg = TaxicabGeometry(root)
    root.mainloop()
