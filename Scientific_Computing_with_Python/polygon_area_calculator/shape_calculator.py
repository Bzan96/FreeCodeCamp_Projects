import math

def handle_undefined_values(height, width):
  if height == None and width == None:
    raise Exception("None", "height and width are not set.")
  
  elif height == None:
    raise Exception("None", "height is not set.")
  
  elif width == None:
    raise Exception("None", "width is not set.")

class Rectangle:
  def __init__(self, width, height):
    handle_undefined_values(height, width)
    
    self.width = width
    self.height = height

  def __str__(self):
    return "Rectangle(width=%(width)s, height=%(height)s)"%{
      "width": self.width,
      "height": self.height
    }
    
  def set_width(self, width):
    self.width = width

  def set_height(self, height):
    self.height = height

  def get_area(self):
    handle_undefined_values(self.height, self.width)
    
    return self.height * self.width

  def get_perimeter(self):
    handle_undefined_values(self.height, self.width)

    return (2 * self.width + 2 * self.height)

  def get_diagonal(self):
    handle_undefined_values(self.height, self.width)

    return ((self.width ** 2 + self.height ** 2) ** .5)

  def get_picture(self):
    handle_undefined_values(self.height, self.width)

    if self.width > 50 or self.height > 50:
      return "Too big for picture."

    horizontal = ["*"] * self.width
    picture = ""

    for row in range(self.height):
      for star in horizontal:
        picture += star

      picture += "\n"

    return picture
    
  def get_amount_inside(self, shape):
    horizontal = self.width / shape.width
    vertical = self.height / shape.height
    
    return math.floor(horizontal * vertical)

class Square(Rectangle):
  def __init__(self, side):
    super().__init__(side, side)

  def __str__(self):
    return "Square(side=%(side)s)"%{
      "side": self.width,
    }

  def set_side(self, side):
    self.height = side
    self.width = side

  def set_width(self, width):
    self.width = width
    self.height = width

  def set_height(self, height):
    self.height = height
    self.width = height