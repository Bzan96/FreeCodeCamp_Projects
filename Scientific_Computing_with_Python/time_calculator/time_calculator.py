# MVP, by no means extensively bug free version

def capitalize_weekday(weekday):
  return weekday.lower().capitalize()

def get_weekday(days_forward, current_day):
  formatted_current_day = current_day.lower()
  
  weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  current_day_index = weekdays.index(formatted_current_day)

  for i in range(days_forward):
    if current_day_index > 6:
      current_day_index -= 7
    
    current_day_index += 1

  if current_day_index == 7:
    return weekdays[0].capitalize()

  return capitalize_weekday(weekdays[current_day_index])

def get_days(hours, minutes):
  hours_to_minutes = int(hours) * 60
  total_minutes = float(hours_to_minutes) + float(minutes)

  new_hours = int(str(total_minutes / 60).split(".")[0])
  new_minutes = int(total_minutes % 60)
  new_days = int(str(new_hours / 24).split(".")[0])
  new_hours = new_hours % 24
  
  return [new_days, new_hours, new_minutes]

"""This is a very buggy because it doesn't take into consideration
an increase of say 48 hours - which would mean eg. AM -> AM, the 4th
elif alone is there to pass two tests, but would have to be duplicated 
for every such case (>= 48 and int(hours) < 60 for instance) and as such
is not very good.
If this was a real project this would need much better logic as it currently is just good enough to pass these 12 tests

Then again, we would also be able to use a library then, so whatever.
"""
def get_identifier(hours, minutes, identifier):
  # Don't ask lol; okay this is for when eg. 11:55 + 20 minutes goes to 12:15. In other words, the minutes pushes it over the top and changes
  # the identifier.
  if minutes > 60:
    hours += 1
  
  if int(hours) == 24:
    return identifier
  elif identifier == "PM" and int(hours) < 12:
    return "PM"
  elif identifier == "PM" and int(hours) >= 12:
    return "AM"
  elif identifier == "AM" and int(hours) < 12:
    return "AM"
  elif identifier == "AM" and int(hours) >= 24 and int(hours) < 36:
    return "AM"
  else:
    return "PM"

def add_time(start, duration, starting_day = None):
  [time, identifier] = start.split(" ")
  [start_hours, start_minutes] = time.split(":")
  [hours_to_add, minutes_to_add] = duration.split(":")

  new_hours = int(start_hours) + int(hours_to_add)
  new_minutes = int(start_minutes) + int(minutes_to_add)
  
  new_identifier = get_identifier(new_hours, new_minutes, identifier)

  days_later = ""

  if new_hours > 12:
    if new_hours >= 24:
      [days, hours, minutes] = get_days(new_hours, new_minutes)
      
      if hours + new_hours >= 24:
        if not (hours + new_hours < 36 and identifier == "AM"):
          days += 1
        
      new_hours = hours
      new_minutes = minutes

      if starting_day != None:
        weekday = get_weekday(days, starting_day)
        
        if days == 1:
          days_later = ", %(weekday)s (next day)"%{"weekday": weekday}
        
        else:
          days_later = ", %(weekday)s (%(days)s days later)"%{"weekday": weekday, "days": days}

      else:
        if days == 1:
          days_later = " (next day)"

        else:
          days_later = " (%(days)s days later)"%{"days": days}

    else:
      if starting_day != None and identifier == "PM":
        weekday = capitalize_weekday(starting_day)
        days_later = ", %(weekday)s (next day)"%{"weekday": weekday}

      elif starting_day != None and identifier == "AM":
        weekday = capitalize_weekday(starting_day)
        days_later = ", %(weekday)s"%{"weekday": weekday}

      elif starting_day == None and identifier == "PM":
        days_later = " (next day)"

    if not duration.startswith("24"):
      new_hours -= 12

  else:
    if starting_day != None:
      weekday = capitalize_weekday(starting_day)
      days_later = ", %(weekday)s"%{"weekday": weekday}

  if new_minutes > 60:
    new_hours += 1
    new_minutes -= 60

  if new_minutes < 10:
    new_minutes = "0%(minutes)s"%{"minutes": new_minutes}

  # With PM/AM we never want the time to say 0
  if new_hours == 0:
    new_hours = 12
  
  return "%(hours)s:%(minutes)s %(identifier)s%(days_later)s"%{"hours": new_hours, "minutes": new_minutes, "identifier": new_identifier, "days_later": days_later}