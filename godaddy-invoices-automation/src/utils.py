from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import os
from dotenv import load_dotenv

load_dotenv()

def initialize_webdriver():
    download_dir = os.path.join(os.getcwd(), 'invoices')
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)
    chrome_options = webdriver.ChromeOptions()
    prefs = {"download.default_directory": download_dir}
    chrome_options.add_experimental_option("prefs", prefs)
    if not os.getenv('SHOW_WINDOW', 'False').lower() in ('true', '1'):
        chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    service = Service(executable_path='path_to_chromedriver')
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def cleanup(driver):
    driver.quit()
