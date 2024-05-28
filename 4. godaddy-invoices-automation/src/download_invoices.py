from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

def download_invoices(driver):
    driver.get("https://account.godaddy.com/orders")
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, "qa-order-list-item")))
    invoice_links = driver.find_elements(By.XPATH, "//div[contains(@class, 'qa-order-list-item')]//div[contains(@class, 'order-title')]")
    receipt_ids = [link.text.replace('#', '').strip() for link in invoice_links]
    for receipt_id in receipt_ids:
        download_invoice(driver, receipt_id)

def download_invoice(driver, receipt_id):
    invoice_url = f"https://account.godaddy.com/orders/receipt/{receipt_id}"
    driver.get(invoice_url)
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, "order-action-tray")))
    driver.execute_script('window.print();')
