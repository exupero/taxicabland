from Tkinter import NW

import graphics as g

graphics = {}
c = None

def add_graphic(new_object, *args, **kwargs):
	"""Adds a graphic to the display."""
	
	# Instantiate the object.
	new_object = new_object(*args, **kwargs)
	
	# Add the new object's handle to the graphics dictionary
	graphics[new_object.handle] = new_object
	
	# Return the new instance.
	return new_object
	
def under_cursor(x,y, *discount):
	"""Retrieves the objects under the cursor (within a certain
	margin). Returns a dictionary in which the keys are the available
	labels and the values are lists of which handles have that label."""

	# The size of the margin around the cursor.
	size = 2
	# Get the items overlapping the box.
	over_items = c.find_overlapping(
		x - size, y - size,
		x + size, y + size)
		
	# If 1 is the only item the cursor is over, return None: that item
	# is the grid image.
	if (1,) == over_items: return None
	
	# Turn the tuple into a list.
	over_items = list(over_items)
	
	# Get rid of any items that the caller wanted to discount.
	for handle in discount: 
		if handle in over_items: over_items.remove(handle)
		
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
		'Mindist': []}
		
	# Go through the tag tuples.
	for handle in over_items:
		tags = c.gettags(handle)
		# Go through the tags.
		for tag in tags:
			# Add the item handle to the existing list in the dictionary.
			items[tag].append(handle)
			
	return items

	
class Tool:	
	"""Declares defaults for subclasses' methods."""
	
	help_text_handle = None

	def set_help_text(self, text):
		if not self.help_text_handle:
			self.help_text_handle = c.create_text(10,10, 
				text=text, anchor=NW, fill='red', tags='HelpText')
		else:
			c.itemconfigure(self.help_text_handle, text=text)
	
	def activate(self): pass
	
	def deactivate(self): 
		self.set_help_text('')
	
	def left_click(self, event): pass
		
	def left_drag(self, event): pass
	
	def left_release(self, event): pass
	
	def right_click(self, event):
		"""Removes an item."""
		
		# Get the item the cursor is over.
		over_item = c.find_withtag('current')
		# Make sure there actually is something under the cursor and make
		# sure it isn't the grid background.
		if over_item and over_item[0] != 1:
			# Call the object's delete method.
			graphics[over_item[0]].delete()


class PointTool(Tool):	
	items = None

	def activate(self):
		self.set_help_text("Click to create a point. Click and drag to move it.")
		
	def left_click(self, event):
		"""Defines the behavior of a left click when the Point Tool
		being used."""
		
		# Abbreviate the cursor's x and y.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = self.items = under_cursor(x,y)
		
		# First see if nothing was clicked on.
		def no_items():
			# Create a new point.
			add_graphic(g.Point, x,y)
			
		if not items:
			no_items()
			
		# Check for any points clicked on.
		elif items['Point']:
			pass
			
		# Check for any lines clicked on.
		elif items['Line']:
			# Get the first line handle.
			line_handle = items['Line'][0]
			# Get the instance tied to that handle.
			line = graphics[line_handle]
			# Make a new point on a line.
			add_graphic(g.PointOnLine, line, x,y)
			
		# In all other cases...
		else:
			no_items()

			
	def left_drag(self, event):
		"""Moves a point."""
		
		# Abbreviate the cursor's x and y.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = self.items
		
		# First see if nothing was clicked on.
		if not items:
			pass
			
		# Check for any points clicked on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			# Get the point's instance.
			point = graphics[point_handle]
			# Change the x,y coords of the point to those of the cursor.
			point.set_coord(x,y)
			
	def left_release(self, event):
		# Release the saved handles.
		self.items = None

	
class LineTool(Tool):
	end_point = curr_line = None
	
	def activate(self):
		self.set_help_text("Click and drag to create a line.")
		
	def deactivate(self):
		self.set_help_text('')
		self.end_point = self.curr_line = None
	
	def left_click(self, event):
		"""Creates a new line."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y)
		
		# First see if nothing was clicked on.
		def no_items():
			# Create a new start point.
			start_point = add_graphic(g.Point, x,y)
			# Create a new end point in the same place.
			end_point = self.end_point = add_graphic(g.Point, x,y)
			# Create a new line.
			self.curr_line = add_graphic(g.Line, start_point, end_point)
			
		if not items:
			no_items()
			
		# Check for points clicked on.
		elif items['Point']:
			# Get the first point's handle.
			start_handle = items['Point'][0]
			# Set the point as the start point.
			start_point = graphics[start_handle]
			# Create an end point in the same place.
			end_point = self.end_point = add_graphic(g.Point, x,y)
			# Create a new line.
			self.curr_line = add_graphic(g.Line, start_point, end_point)
			
		# In all other cases...
		else:
			no_items()
		
	def left_drag(self, event):
		"""Move the end of the line."""
	
		# Abbr.
		end_point = self.end_point

		# ('If' for safety reasons.)
		if end_point:
			# Update the end point's coordinates.
			end_point.set_coord(event.x, event.y)
		
	def left_release(self, event):
		"""Finish creating the line."""
		
		# Abbreviate the cursor's x and y.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y, self.end_point.handle, self.curr_line.handle)
		
		# First see if nothing was dropped on.
		def no_items():
			# Do nothing: the end point stays were it is.
			# (This clause for safety reasons.)
			pass

		if not items:
			no_items()
			
		# Check for any points dropped on.
		elif items['Point']:
			# Get the point's handle.
			point_handle = items['Point'][0]
			# Parent the line to the point.
			self.curr_line.change_parent(1, graphics[point_handle])
			# Delete the original end point.
			self.end_point.delete()
			
		# In all other cases...
		else:
			no_items()
			
		# Reset the current line.
		self.end_point = self.curr_line = None		
	
class CircleTool(Tool):
	radius_point = curr_circle = None
	
	def activate(self):
		self.set_help_text("Click and drag to create a circle.")
		
	def deactivate(self):
		self.set_help_text('')
		self.radius_point = self.curr_circle = None
	
	def left_click(self, event):
		"""Create the center and radius points of the circle."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y)
		
		# First see if nothing was clicked on.
		def no_items():
			# Create a new center point.
			center_point = add_graphic(g.Point, x,y)
			# Create a new radius point in the same place.
			radius_point = self.radius_point = add_graphic(g.Point, x,y)
			# Create a new circle.
			self.curr_circle = add_graphic(g.Circle, center_point, radius_point)

		if not items:
			no_items()
			
		# Check for points clicked on.
		elif items['Point']:
			# Get the first point's handle.
			center_handle = items['Point'][0]
			# Set the point as the center point.
			center_point = graphics[center_handle]
			# Create a radius point in the same place.
			radius_point = self.radius_point = add_graphic(g.Point, x,y)
			# Create a new circle.
			self.curr_circle = add_graphic(g.Circle, center_point, radius_point)
			
		# In all other cases:
		else:
			no_items()
		
	def left_drag(self, event):
		"""Move the circle's radius control point."""
		
		# Abbr.
		radius_point = self.radius_point
		
		# ('If' for safety reasons.)
		if radius_point:
			# Update the radius point's coordinates.
			radius_point.set_coord(event.x, event.y)
			
	def left_release(self, event):
		"""Finish creating the circle."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y, self.radius_point.handle, self.curr_circle.handle)
		
		# See if nothing was dropped on.
		def no_items():
			# Do nothing: the radius point stays where it is.
			# (This clause for safety reasons.)
			pass
		
		if not items:
			no_items()
			
		# See if a point was dropped on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			# Parent the circle to the point.
			self.curr_circle.change_parent(1, graphics[point_handle])
			# Delete the original radius point.
			self.radius_point.delete()
			
		# In all other cases...
		else:
			no_items()
				
		# Reset the tool.
		self.radius_point = self.curr_circle = None
			
class EllipseTool(Tool):
	f1 = f2 = k_point = curr_ellipse = None
	
	def activate(self):
		self.set_help_text("Click once, then click and drag to create an ellipse.")
		
	def deactivate(self):
		self.set_help_text('')
		self.f1 = self.f2 = self.k_point = self.curr_ellipse = None

	def left_click(self, event):
		"""Create the foci and k_point of the ellipse."""
	
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y)
		
		# See if nothing was clicked on.
		def no_items():
			# If there is no first focus...
			if not self.f1:
				# Make a new first focus.
				self.f1 = add_graphic(g.Point, x,y)
				
			# If there is no second focus...
			elif not self.f2:
				# Make a new second focus.
				f2 = self.f2 = add_graphic(g.Point, x,y)
				# Make a new k point in the same place.
				k_point = self.k_point = add_graphic(g.Point, x,y)
				# Make a new ellipse.
				self.curr_ellipse = add_graphic(g.Ellipse, self.f1, f2, k_point)

		if not items:
			no_items()
			
		# See if a point was clicked on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			
			# If there is no first focus...
			if not self.f1:
				# Make the point the first focus.
				self.f1 = graphics[point_handle]
				
			# If there is no second focus...
			elif not self.f2:
				# Make the point the second focus.
				f2 = self.f2 = graphics[point_handle]
				# Make a new k point in the same place.
				k_point = self.k_point = add_graphic(g.Point, x,y)
				# Make a new ellipse.
				self.curr_ellipse = add_graphic(g.Ellipse, self.f1, f2, k_point)
				
		# In all other cases...
		else:
			no_items()
		
	def left_drag(self, event):
		"""Move the k_point."""
		
		# Abbr.
		k_point = self.k_point
		
		# ('If' for safety reasons.)
		if k_point:
			# Update the k point's position.
			k_point.set_coord(event.x, event.y)
	
	def left_release(self, event):
		"""Finish the ellipse."""
		
		# Make sure the ellipse is ready to be finished.
		if self.k_point:
			# Abbr.
			x,y = event.x, event.y
			
			# Get the items under the cursor.
			items = under_cursor(x,y, self.k_point.handle, self.curr_ellipse.handle)
			
			# See if nothing was dropped on.
			def no_items():
				# Do nothing: the k point stays where it is.
				# (This clause for safety reasons.)
				pass

			if not items:
				no_items()
				
			# See if a point was dropped on.
			elif items['Point']:
				# Get the first point's handle.
				point_handle = items['Point'][0]
				# Parent the ellipse to the point.
				self.curr_ellipse.change_parent(2, graphics[point_handle])
				# Delete the original k point.
				self.k_point.delete()
			
			# In all other cases...
			else:
				no_items()
				
			# Reset the tool.
			self.f1 = self.f2 = self.k_point = self.curr_ellipse = None
		
		
class MidpointTool(Tool):
	def activate(self):
		self.set_help_text("Click a line to display its midpoint.")
		
	def left_click(self, event):
		"""Create a midpoint on the given line."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y)

		# See if nothing was clicked on.
		def no_items():
			# Do nothing.
			# (This clause for safety reasons.)
			pass

		if not items:
			no_items()
			
		# See if a line was clicked on.
		elif items['Line']:
			# Get the first line's handle.
			line_handle = items['Line'][0]
			# Create a point on the line at the halfway mark.
			mid_point = add_graphic(
				g.PointOnLine, graphics[line_handle], 
				x,y, .5, locked=True)
				
		# In all other cases...
		else:
			no_items()
		
class MidsetTool(Tool):
	p1 = p2 = None

	def activate(self):
		self.set_help_text("Click two points to display their midset.")
		
	def deactivate(self):
		self.set_help_text('')
		self.p1 = self.p2 = None

	def left_click(self, event):
		"""Create the midset of two points."""
		
		# Get the items under the cursor.
		items = under_cursor(event.x, event.y)
		
		# See if nothing was clicked on.
		def no_items():
			# Do nothing.
			# (This clause for safety reasons.)
			pass

		if not items:
			no_items()
			
		# See if a point was clicked on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			
			# If there is no first point...
			if not self.p1:
				# Set the point to be the first point.
				self.p1 = graphics[point_handle]
				
			# If there is no second point...
			elif not self.p2:
				# Set the point to be the second point.
				self.p2 = graphics[point_handle]
				# Create a new midset.
				add_graphic(g.Midset, self.p1, self.p2)
				# Reset the tool.
				self.p1 = self.p2 = None
				
		# In all other cases...
		else:
			no_items()
				

class PerpendicularTool(Tool):
	line = p = curr_perp = None
	
	def activate(self):
		self.set_help_text("Click a line and drag to display a perpendicular.")
		
	def deactivate(self):
		self.set_help_text('')
		self.line = self.p = self.curr_perp = None

	def left_click(self, event):
		"""Select the line and create the point of a perpendicular."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y)
		
		# If nothing was clicked on...
		def no_items():
			# Do nothing: user didn't click anything useful.
			# (This clause for safety.)
			pass
			
		# See if nothing was clicked on.
		if not items:
			no_items()
			
		# See if a line was clicked on.
		elif items['Line']:
			# Get the first line's handle.
			line_handle = items['Line'][0]
			# Use this line.
			line = self.line = graphics[line_handle]
			# Create a point for the perpendicular to go through.
			self.p = add_graphic(g.Point, x,y)
			# Create a new perpendicular.
			self.curr_perp = add_graphic(g.Perpendicular, line, self.p)
			
		# In all other cases:
		else:
			no_items()
			
	def left_drag(self, event):
		"""Move the point through which the perpendicular passes."""
		
		# Abbr.
		p = self.p
		
		# ('If' for safety.)
		if p:
			# Update the point's position.
			p.set_coord(event.x, event.y)
			
	def left_release(self, event):
		"""Finish creating the perpendicular."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y, self.p.handle)
		
		# When nothing is dropped on...
		def no_items():
			# Do nothing: leave the point where it is.
			pass
			
		# See if nothing was dropped on.
		if not items:
			no_items()
			
		# See if a point was dropped on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			# Set the perpendicular to use the point.
			self.curr_perp.change_parent(1, graphics[point_handle])
			# Delete the original point.
			self.p.delete()
			
		# In all other cases...
		else:
			no_items()
			
		# Reset the tool.
		self.line = self.p = self.curr_perp = None
	
	
class ParallelTool(Tool):
	line = p = curr_parallel = None
	
	def activate(self):
		self.set_help_text("Click a line and drag to display a parallel.")
		
	def deactivate(self):
		self.set_help_text('')
		self.line = self.p = self.curr_parallel = None

	def left_click(self, event):
		"""Select the line and create the point of a parallel."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y)
		
		# What to do if nothing is clicked on.
		def no_items():
			# Do nothing: the user didn't click anything useful.
			pass
			
		# See if nothing was clicked on.
		if not items:
			no_items()
			
		# See if a line was clicked on.
		elif items['Line']:
			# Get the first line's handle.
			line_handle = items['Line'][0]
			# Use this line.
			line = self.line = graphics[line_handle]
			# Create a point for the parallel to go through.
			self.p = add_graphic(g.Point, x,y)
			# Create a new parallel.
			self.curr_parallel = add_graphic(g.Parallel, line, self.p)
			
		# In all other cases...
		else:
			no_items()
			
	def left_drag(self, event):
		"""Move the point through which the parallel passes."""
		
		# Abbr.
		p = self.p
		
		# ('If' for safety.)
		if p:
			# Update the point's position.
			p.set_coord(event.x, event.y)
			
	def left_release(self, event):
		"""Finish creating the parallel."""
		
		if self.p:
			# Abbr.
			x,y = event.x, event.y
			
			# Get the items under the cursor.
			items = under_cursor(x,y, self.p.handle)
			
			# When nothing is dropped on...
			def no_items():
				# Do nothing: the point stays where it is.
				pass
				
			# See if nothing was dropped on.
			if not items:
				no_items()
				
			# See if a point was dropped on.
			elif items['Point']:
				# Get the first point's handle.
				point_handle = items['Point'][0]
				# Set the perpendicular to use the point.
				self.curr_parallel.change_parent(1, graphics[point_handle])
				# Delete the original point.
				self.p.delete()
				
			# In all other cases...
			else:
				no_items()
				
			# Reset the tool.
			self.line = self.p = self.curr_parallel = None
	

class ParabolaTool(Tool):
	focus = directrix = curr_parabola = end_point = None
	
	def activate(self):
		self.set_help_text("Click once, then click and drag to create a parabola.")

	def deactivate(self):
		self.set_help_text('')
		self.focus = self.directrix = self.curr_parabola = self.end_point = None

	def left_click(self, event):
		"""Make a new parabola."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items under the cursor.
		items = under_cursor(x,y)
		
		# See if nothing was clicked on.
		def no_items():
			# If no focus...
			if not self.focus:
				# Create a new point to be the focus.
				self.focus = add_graphic(g.Point, x,y)
				
			# If no directrix...
			elif not self.directrix:
				# Create a new starting point for the directrix.
				start_point = add_graphic(g.Point, x,y)
				# Create a new ending point in the same place.
				end_point = self.end_point = add_graphic(g.Point, x,y)
				# Create a new line.
				self.directrix = add_graphic(g.Line, start_point, end_point)
				# Create a new parabola.
				self.curr_parabola = add_graphic(g.Parabola, self.focus, self.directrix)
		
		if not items:
			no_items()
		
		# See if a point was clicked on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			
			# If no focus...
			if not self.focus:
				# Use this point as the focus.
				self.focus = graphics[point_handle]
				
			# If no directrix...
			elif not self.directrix:
				# Use this point as the starting point.
				start_point = graphics[point_handle]
				# Create a new ending point in the same place.
				end_point = self.end_point = add_graphic(g.Point, x,y)
				# Create a new line.
				self.directrix = add_graphic(g.Line, start_point, end_point)
				# Create a new parabola.
				self.curr_parabola = add_graphic(g.Parabola, self.focus, self.directrix)
				
		# See if a line was clicked on.
		elif items['Line']:
			# Get the first line's handle.
			line_handle = items['Line'][0]
			
			# If no directrix...
			if not self.directrix:
				# Use this line as the directrix
				self.directrix = graphics[line_handle]
				# Create a new parabola.
				self.curr_parabola = add_graphic(g.Parabola, self.focus, self.directrix)
			
		# In all other cases...
		else:
			no_items()
			
	def left_drag(self, event):
		"""Move the end point of the directrix."""
		
		# Abbr.
		end_point = self.end_point
		
		# ('If' for safety reasons.)
		if end_point:
			# Move the end point of the directrix.
			end_point.set_coord(event.x, event.y)
			
	def left_release(self, event):
		"""Finish the parabola."""
	
		# Make sure the parabola is ready to be finished.
		if self.focus and self.directrix:
			# Abbr.
			x,y = event.x, event.y
			
			# Get the items under the cursor.
			if self.end_point:
				items = under_cursor(x,y, self.directrix.handle, self.end_point.handle)
			else:
				items = under_cursor(x,y, self.directrix.handle)
			
			# See if nothing was dropped on.
			def no_items():
				# Do nothing: the directrix end point stays where it is.
				# (This clause for safety reasons.)
				pass

			if not items:
				no_items()
				
			# See if a point was dropped on.
			elif items['Point']:
				# Get the first point's handle.
				point_handle = items['Point'][0]
				# Set the point to be the directrix's end point.
				self.curr_parabola.parents[1].change_parent(1, graphics[point_handle])
				# Delete the original end_point.
				self.end_point.delete()
					
			# In all other cases...
			else:
				no_items()
				
			# Reset the tool.
			self.focus = self.directrix = self.curr_parabola = self.end_point = None
	
class HyperbolaTool(Tool):
	f1 = f2 = k_point = curr_hyperbola = None
	
	def activate(self):
		self.set_help_text("Click once, then click and drag to create a hyperbola.")
		
	def deactivate(self):
		self.set_help_text('')
		self.f1 = self.f2 = self.k_point = self.curr_hyperbola = None
	
	def left_click(self, event):
		"""Create a hyperbola."""
		
		# Abbr.
		x,y = event.x, event.y
		
		# Get the items unde the cursor.
		items = under_cursor(x,y)
		
		# See if nothing was clicked on.
		def no_items():
			# If no first focus...
			if not self.f1:
				# Create a new point as the first focus.
				self.f1 = add_graphic(g.Point, x,y)
				
			# If no second focus...
			elif not self.f2:
				# Create a new point as the second focus.
				f2 = self.f2 = add_graphic(g.Point, x,y)
				# Create a k point in the same place.
				k_point = self.k_point = add_graphic(g.Point, x,y)
				# Create a new hyperbola.
				self.curr_hyperbola = add_graphic(g.Hyperbola, self.f1, f2, k_point)
			
		if not items:
			no_items()
			
		# See if a point was clicked on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			
			# If no first focus...
			if not self.f1:
				# Make the point the first focus.
				self.f1 = graphics[point_handle]
				
			# If no second focus...
			elif not self.f2:
				# Make the point the second focus.
				f2 = self.f2 = graphics[point_handle]
				# Make a k point in the same place.
				k_point = self.k_point = add_graphic(g.Point, x,y)
				# Create a new hyperbola.
				self.curr_hyperbola = add_graphic(g.Hyperbola, self.f1, f2, k_point)
			
		# In all other cases...
		else:
			no_items()
			
	def left_drag(self, event):
		"""Moves the k point of the hyperbola."""
		
		# Abbr.
		k_point = self.k_point
		
		# ('If' for safety.)
		if k_point:
			# Update the k point's position.
			k_point.set_coord(event.x, event.y)
			
	def left_release(self, event):
		"""Finishes the hyperbola."""
		
		# Make sure everything is ready.
		if self.f1 and self.f2 and self.k_point:
			# Abbr.
			x,y = event.x, event.y
			
			# Get the items under the cursor.
			items = under_cursor(x,y, self.k_point.handle)
			
			# If nothing was dropped on...
			def no_items():
				# Do nothing: the k point stays were it is.
				# (This clause for safety.)
				pass
				
			# See if nothing was dropped on.
			if not items:
				no_items()
				
			# See if a point was dropped on.
			elif items['Point']:
				# Get the first point's handle.
				point_handle = items['Point'][0]
				# Make this point the k point for the hyperbola.
				self.curr_hyperbola.change_parent(2, graphics[point_handle])
				# Delete the old k point.
				self.k_point.delete()
				
			# In all other cases...
			else:
				no_items()
				
			# Reset the tool.
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
		"""Pick points that form an angle."""
	
		# Get the items under the cursor.
		items = under_cursor(event.x, event.y)
		
		# If nothing was clicked on.
		def no_items():
			# Do nothing: don't let the user invent points.
			# (This clause for safety.)
			pass
		
		# See if nothing was clicked on.
		if not items:
			no_items()
		
		# See if a point was clicked on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			
			# If no r1...
			if not self.r1:
				self.r1 = graphics[point_handle]
				
			# If no v...
			elif not self.v:
				self.v = graphics[point_handle]
				
			# If no r2...
			elif not self.r2:
				self.r2 = graphics[point_handle]
			
		# In all other cases...
		else:
			no_items()
			
	def left_release(self, event):
		"""Finish the angle."""
		
		# If all the parts have been selected...
		if self.r1 and self.v and self.r2:
			# Create a new angle bisector.
			add_graphic(g.Bisect, self.r1, self.v, self.r2)
			
			self.r1 = self.v = self.r2 = None


class MindistTool(Tool):
	loci = []
	
	def activate(self):
		self.set_help_text(
			"Click points one at a time, then click 'Finish' to find " + \
			"the location of minimum distance to those points.")
			
		# Create the Finish button.
		self.finish_button = c.create_rectangle(7,40, 80,62,
			fill='red', width=2, tags='Button')
		self.finish_text = c.create_text(10,40, text='FINISH', 
			anchor=NW, fill='black', font=('Arial','16'), tags='Button')
		
	def deactivate(self):
		self.set_help_text('')
		self.loci = []

	def deactivate(self):
		# Destroy the Finish button.
		c.delete(self.finish_button)
		c.delete(self.finish_text)
		
		# Reset the help text.
		c.itemconfigure(self.help_text_handle, text='')
	
	def left_click(self, event):
		"""Select points to find the minimum distance from."""
		
		# Get the items under the cursor.
		items = under_cursor(event.x, event.y)
		
		# If nothing was clicked on...
		def no_items():
			# Do nothing: the user hasn't clicked anything useful.
			# (This clause for safety.)
			pass
			
		# See if nothing was clicked on.
		if not items:
			no_items()
			
		# See if a point was clicked on.
		elif items['Point']:
			# Get the first point's handle.
			point_handle = items['Point'][0]
			# Add this point to the loci.
			self.loci.append(graphics[point_handle])
			
		# See if the button was clicked on.
		elif items['Button']:
			# Create a mindist.
			add_graphic(g.Mindist, self.loci)
			# Reset the tool.
			self.loci = []
			
		# In all other cases...
		else:
			no_items()