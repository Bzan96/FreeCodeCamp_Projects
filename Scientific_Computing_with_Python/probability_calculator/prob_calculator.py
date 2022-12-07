import copy
import random
# Consider using the modules imported above.

class Hat:
  def __init__(self, **kwargs):
    self.contents = []
    self.original_list = []

    for key, value in kwargs.items():
      self.contents.extend([key] * value)

    self.original_list = copy.copy(self.contents)

  def draw(self, number_of_draws):
    self.contents = copy.copy(self.original_list)
    
    if number_of_draws >= len(self.contents):
      return self.contents

    drawn_balls = []
      
    for i in range(number_of_draws):
      ball = random.choice(self.contents)
      self.contents.remove(ball)
      drawn_balls.append(ball)

    return drawn_balls

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
  times_achieved = 0
  
  for i in range(num_experiments):
    drawn_balls = hat.draw(num_balls_drawn)
    comparable_dictionary = dict.fromkeys(drawn_balls, 0)

    for ball in drawn_balls:
      comparable_dictionary[ball] += 1

    controller = 0
    
    for ball in expected_balls:
      for comparison_ball in comparable_dictionary:
        if ball == comparison_ball and comparable_dictionary[comparison_ball] >= expected_balls[ball]:
          controller += 1

    if controller == len(expected_balls):
      times_achieved += 1

  return times_achieved / num_experiments
