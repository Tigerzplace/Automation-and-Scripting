from login import login_to_godaddy
from download_invoices import download_invoices
from utils import initialize_webdriver, cleanup

def main():
    driver = initialize_webdriver()
    try:
        login_to_godaddy(driver)
        download_invoices(driver)
    finally:
        cleanup(driver)

if __name__ == "__main__":
    main()
