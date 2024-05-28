from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

def login_to_godaddy(driver):
    username = os.getenv('GODADDY_U')
    password = os.getenv('GODADDY_P')
    driver.get('https://sso.godaddy.com/?realm=idp&path=%2F&app=mya')
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "username")))
    driver.find_element(By.ID, "username").send_keys(username)
    driver.find_element(By.ID, "username").send_keys(Keys.RETURN)
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "password")))
    driver.find_element(By.ID, "password").send_keys(password)
    driver.find_element(By.ID, "password").send_keys(Keys.RETURN)
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "dashboard")))
