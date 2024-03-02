import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.firefox_profile import FirefoxProfile

options = Options()
options.headless = False

profile = FirefoxProfile()
profile.set_preference("media.navigator.permission.disabled", True)
profile.set_preference("media.navigator.streams.fake", True)

options.profile = profile

driver = webdriver.Firefox(options=options)

url = "https://translation.sennsolutions.com/ukr"
num_tabs = 30
load_times = []

for _ in range(num_tabs):
  start_time = time.time()
  driver.execute_script(f"window.open('{url}');")
  time.sleep(5)
  driver.switch_to.window(driver.window_handles[-1])
  end_time = time.time()
  load_times.append(end_time - start_time)

print(f"Average load time for {num_tabs} tabs: {sum(load_times) / len(load_times)} seconds")

time.sleep(300)
driver.quit()
