import numpy as np

def calculate(list):
  if len(list) < 9:
    raise ValueError("List must contain nine numbers.")

  matrix = np.array_split(list, 3)

  calculations = {
    "mean": [np.mean(matrix, axis=0).tolist(), np.mean(matrix, axis=1).tolist(), np.mean(list).tolist()],
    "variance": [np.var(matrix, axis=0).tolist(), np.var(matrix, axis=1).tolist(), np.var(list).tolist()],
    "standard deviation": [np.std(matrix, axis=0).tolist(), np.std(matrix, axis=1).tolist(), np.std(list).tolist()],
    "max": [np.amax(matrix, axis=0).tolist(), np.amax(matrix, axis=1).tolist(), np.amax(list).tolist()],
    "min": [np.amin(matrix, axis=0).tolist(), np.amin(matrix, axis=1).tolist(), np.amin(list).tolist()],
    "sum": [np.sum(matrix, axis=0).tolist(), np.sum(matrix, axis=1).tolist(), np.sum(list).tolist()]
  }
  
  return calculations