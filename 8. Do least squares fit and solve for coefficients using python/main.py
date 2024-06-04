import numpy as np
from scipy.linalg import lstsq

def estimate_coefficients(inputs):
    # Unpack the input list
    delta_h, delta_delta, delta, h, phi = inputs
    
    # Number of observations
    n = len(delta_h)
    
    # Design matrix
    A = np.zeros((2*n, 6))
    for i in range(n):
        sec_delta = 1 / np.cos(delta[i])
        tan_delta = np.tan(delta[i])
        cos_delta = np.cos(delta[i])
        sin_delta = np.sin(delta[i])
        sinh_delta = np.sinh(delta[i])
        sin_h = np.sin(h[i])
        cos_h = np.cos(h[i])
        sin_phi = np.sin(phi[i])
        cos_phi = np.cos(phi[i])
        
        A[2*i, :] = [
            1, 0, 
            sec_delta, tan_delta, 
            -cos_delta * tan_delta, sin_h * tan_delta
        ]
        A[2*i + 1, :] = [
            0, 1, 
            0, 0, 
            sinh_delta, cos_phi * cos_h * sin_delta - sin_phi * cos_delta
        ]
    
    # Right-hand side vector
    b = np.zeros(2*n)
    for i in range(n):
        b[2*i] = delta_h[i]
        b[2*i + 1] = delta_delta[i]
    
    # Least squares solution
    coef, _, _, _ = lstsq(A, b)
    
    return coef

# Example usage
delta_h = [1, 2, 3]  # Replace with your data
delta_delta = [1, 2, 3]  # Replace with your data
delta = [0.1, 0.2, 0.3]  # Replace with your data
h = [0.4, 0.5, 0.6]  # Replace with your data
phi = [0.7, 0.8, 0.9]  # Replace with your data

inputs = [delta_h, delta_delta, delta, h, phi]
coefficients = estimate_coefficients(inputs)
print(coefficients)
