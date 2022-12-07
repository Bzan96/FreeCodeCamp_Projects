def format_with_decimals(amount):
  amount = str(amount)
  
  if "." in amount:
    decimal_length = len(amount.split(".")[1])

    if decimal_length == 2:
      return amount

    return amount + "0"

  return amount + ".00"

class Category:
  def __init__(self, title):
    self.title = title
    self.ledger = []

  def __str__(self):
    display = []
    
    display.append("%(title)s"%{ "title": self.title.center(30, "*") })
    for item in self.ledger:
      amount_with_decimals = format_with_decimals(item["amount"])
      amount_length = len(str(amount_with_decimals))
      description_length = len(item["description"]) if len(item["description"]) <= 23 else 23
      spacing = "".center(30 - amount_length - description_length, " ")
      
      display.append("%(description)s%(spacing)s%(amount)s"%{ 
        "description": item["description"][0:23],
        "spacing": spacing,
        "amount": amount_with_decimals
      })

    display.append("Total: %(balance)s"%{
      "balance": self.get_balance()
    })

    return "\n".join(display)
    
  def deposit(self, amount, description = ""):
    self.ledger.append({ "amount": amount, "description": description })
  
  def withdraw(self, amount, description = ""):
    withdrawal_was_made = False
    has_funds = self.check_funds(amount)
      
    if has_funds:
      self.ledger.append({ "amount": amount * -1, "description": description })
      withdrawal_was_made = True

    return withdrawal_was_made
    
  
  def get_balance(self):
    balance = 0
    
    for item in self.ledger:
      balance += item['amount']
      
    return balance
  
  def transfer(self, amount, category):
    transfer_took_place = False
    has_funds = self.check_funds(amount)

    if has_funds:
      self.withdraw(amount, "Transfer to %(category)s"%{ "category": category.title })
      category.ledger.append({
        "amount": amount,
        "description": "Transfer from %(category)s"%{ "category": self.title }
      })

      transfer_took_place = True
      
    return transfer_took_place
  
  def check_funds(self, amount):
    funds = self.get_balance();
    
    return funds >= amount


def create_divider(number_of_categories):
  divider = "-"

  for i in range(number_of_categories):
    divider += "---"

  return divider

def create_category_title_column(category):
  title = []
  
  for letter in category:
    title.append(letter)

  return title

def join_category_names(names):
  max_word_length = len(max(names, key=len))
  rows = ["     "] * max_word_length

  index = 0
  for name in names:
    for i in range(max_word_length):
      if index < len(name):
        rows[index] += name[i]
        rows[index] += "  "
      else:
        rows[index] += "   "

      if index == max_word_length - 1:
        index = 0
      else:
        index += 1

  return "\n".join(rows)

def create_spend_chart(categories):
  categories_with_withdrawal = []
  withdrawals = []
  total_withdrawal = 0
  percentages_with_category = []
  category_names = []
  # Controller used in loop on bottom to print out 'o':s
  fill_line = []

  for category in categories:
    withdrawal_total = 0

    for entry in category.ledger:
      # < 0 is a withdrawal
      if entry["amount"] < 0:
        withdrawal_total += entry["amount"]
        total_withdrawal += entry["amount"]

    category_names.append(create_category_title_column(category.title))
    fill_line.append({ category.title: False })
    
    categories_with_withdrawal.append({
      "category": category.title,
      "withdrawal_total": withdrawal_total
    })

    withdrawals.append(withdrawal_total)

  for category in categories_with_withdrawal:
    percentages_with_category.append({
      "category": category["category"],
      # Round the percentage to a full number
      "percentage": round(float(category["withdrawal_total"]) / total_withdrawal * 100)
    })
  
  heading = "Percentage spent by category\n"
  divider = create_divider(len(categories)) + "\n"
  reversed_base_chart = ["100| ", " 90| ", " 80| ", " 70| ", " 60| ", " 50| ", " 40| ", " 30| ", " 20| ", " 10| ", "  0| "]
  base_chart = []
  
  for index, line in enumerate(reversed_base_chart):
    base_chart.append(line)
    
    for placement, item in enumerate(percentages_with_category):
      # The '0' line will always be filled, we could even pre-fill it,
      # except we don't know the number of categories
      if index == len(reversed_base_chart) - 1:
        base_chart[index] += "o  "
      
      # This could actually work for both 100 and 1X percentages
      if len(str(item["percentage"])) > 1 and str(item["percentage"])[0] == str(len(reversed_base_chart) - index):
        fill_line[placement][item["category"]] = True

      if fill_line[placement][item["category"]]:
        base_chart[index - 1] += "o  "
      else:
        if index - 1 >= 0:
          base_chart[index - 1] += "   "

  full_chart = heading + "\n".join(base_chart) + "\n    " + divider + join_category_names(category_names)

  return full_chart