import re

def create_line(length):
  line = ""
  
  for i in range(length + 2):
    line += "-"
    
  return line

def calculate_answer(numbers, operator):
  if operator == "+":
    return numbers[0] + numbers[1]

  return numbers[0] - numbers[1]

def format_response_string(first, second, operator, line_length, answer = None):
  if answer != None:
    answer_with_spacing = ""
    # + 2 is to account for the space taken by the operator plus dividing space
    missing_spacing = line_length - len(str(answer)) + 2

    for i in range(missing_spacing):
      answer_with_spacing += " "

    answer_with_spacing += str(answer)
    
    return """  %(first)s
%(operator)s %(second)s
%(line)s
%(answer)s"""%{"first": first, "second": second, "operator": operator, "line": create_line(line_length), "answer": answer_with_spacing}
    
  return """  %(first)s
%(operator)s %(second)s
%(line)s"""%{"first": first, "second": second, "operator": operator, "line": create_line(line_length)}

def format_response(numbers, operator, with_answer = False):
  first_number_length = len(numbers[0])
  second_number_length = len(numbers[1])

  parsed_numbers = list(map(lambda num: int(num), numbers))
  answer = calculate_answer(parsed_numbers, operator)
  largest_number = max(parsed_numbers)
  largest_number_length = len(str(largest_number))
  
  if first_number_length == largest_number_length:
    first = numbers[0]
    second = ""

    for i in range(largest_number_length - second_number_length):
      second += " "

    second += numbers[1]

    if with_answer:
      return format_response_string(first, second, operator, largest_number_length, answer)
    
    return format_response_string(first, second, operator, largest_number_length)
    
  else:
    first = ""
    second = numbers[1]

    for i in range(largest_number_length - first_number_length):
      first += " "

    first += numbers[0]
    
    if with_answer:
      return format_response_string(first, second, operator, largest_number_length, answer)
    
    return format_response_string(first, second, operator, largest_number_length)

def arithmetic_arranger(problems, with_answer = False):
  space = "    "
  response = ["", "", "", ""]
  arranged_problems = ""
  error = ""
  
  if len(problems) > 5:
    error = "Error: Too many problems."

  for index, problem in enumerate(problems):
    [first_number, operator, second_number] = re.split(" ", problem)
    
    if operator not in ["+","-"]:
      error = "Error: Operator must be '+' or '-'."
      break

    if not first_number.isnumeric() or not second_number.isnumeric():
      error = "Error: Numbers must only contain digits."
      break

    if len(first_number) > 4 or len(second_number) > 4:
      error = "Error: Numbers cannot be more than four digits."
      break
    
    formatted_response = format_response((first_number, second_number), operator[0], with_answer)

    for idx, line in enumerate(formatted_response.splitlines()):
      response[idx] += line
      
      if index < len(problems) - 1:
        response[idx] += space

  if with_answer:
    arranged_problems = """%(first_line)s
%(second_line)s
%(divider)s
%(answer)s"""%{"first_line": response[0], "second_line": response[1], "divider": response[2], "answer": response[3]}

  else:
    arranged_problems = """%(first_line)s
%(second_line)s
%(divider)s"""%{"first_line": response[0], "second_line": response[1], "divider": response[2]}

  if len(error) > 0:
    return error
  
  return arranged_problems