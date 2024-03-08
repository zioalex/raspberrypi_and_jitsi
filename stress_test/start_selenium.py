import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.firefox_profile import FirefoxProfile
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


options = Options()
options.headless = False

profile = FirefoxProfile()
profile.set_preference("media.navigator.permission.disabled", True)
profile.set_preference("media.navigator.streams.fake", True)
profile.set_preference("browser.tabs.remote.autostart", True)  # Configure browser to open multiple tabs without limit

options.profile = profile

driver = webdriver.Firefox(options=options)

url = "https://translation.sennsolutions.com/ukr"
num_tabs = 30
load_times = []
load_times_dict = {}

for _ in range(num_tabs):
  start_time = time.time()
  driver.execute_script(f"window.open('');")
  # time.sleep(5)
  
  driver.switch_to.window(driver.window_handles[-1])
  driver.get(url)  # Load the URL in the new tab

  # Wait for the page to fully load
  WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
  
  # Inject a script to disable audio processing
  driver.execute_script("config.disableAP = true;")
  
  end_time = time.time()
  time_taken = end_time - start_time
  tab_number = len(driver.window_handles)
  print(f"Opened tab {tab_number}; {time_taken}")
  if tab_number in load_times_dict:
    load_times_dict[tab_number] += time_taken
  else:
    load_times_dict[tab_number] = time_taken

total_load_time = sum(load_times_dict.values())
average_load_time = total_load_time / len(load_times_dict)
max_key = max(load_times_dict, key=load_times_dict.get)
min_key = min(load_times_dict, key=load_times_dict.get)
median_key = sorted(load_times_dict, key=load_times_dict.get)[len(load_times_dict) // 2]

print(f"Average load time across all tabs: {average_load_time} seconds")
print(f"Maximum load time: {load_times_dict[max_key]} seconds at {max_key}")
print(f"Minimum load time: {load_times_dict[min_key]} seconds at {min_key}")
print(f"Median load time: {load_times_dict[median_key]} seconds at {median_key}")

timeout = 300
print(f"Waiting for {timeout/60} minutes...")
for remaining_time in range(timeout, 0, -1):
  print(f"Countdown: {remaining_time} seconds", end="\r")
  time.sleep(1)
driver.quit()
