import sys
import os
import time
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


options = Options()
options.add_argument("--headless")  # Run Chrome in headless mode
options.add_argument("--disable-gpu")  # Applicable to windows os only
options.add_argument("--no-sandbox")  # Bypass OS security model
options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems

# Check if command line argument is provided
if len(sys.argv) > 1:
  channel = sys.argv[1]
# Check if environment variable is set
elif 'URL' in os.environ:
  channel = os.environ['CHANNEL']
# Default to "https://translation.sennsolutions.com/ukr"
else:
  channel = "ukr"

num_tabs = int(sys.argv[2]) if len(sys.argv) > 2 else 30

url = f"https://translation.sennsolutions.com/{channel}"

options.add_argument("--use-fake-ui-for-media-stream")  # Enable fake UI for media stream
options.add_argument("--use-fake-device-for-media-stream")  # Use fake device for media stream (fake video)

driver = webdriver.Chrome(options=options)


load_times = []
load_times_dict = {}

for _ in range(num_tabs):
  start_time = time.time()
  url_custom = f"{url}#userInfo.displayName=test_{_}" # this doesn't work may be with a JWT token?
  print(f"Opening window {_ + 1}...url_custom: {url_custom}")
  driver.execute_script(f"window.open('');")
  # time.sleep(5)
  # print(driver.window_handles)
  driver.switch_to.window(driver.window_handles[-1])
  
  driver.get(url_custom)  # Load the URL in the new tab

  # Wait for the page to fully load
  # WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
  WebDriverWait(driver, 60).until(lambda driver: driver.execute_script('return document.readyState') == 'complete')

  
  # Inject a script to disable audio processing
  # driver.execute_script("config.disableAP = true;")
  
  end_time = time.time()
  
  # Simulate users randomicity
  delay = random.randint(30, 60)
  print(f"Waiting for {delay} seconds...")
  time.sleep(delay)
  
  time_taken = end_time - start_time
  tab_number = len(driver.window_handles)
  print(f"Opened tab {_}; {time_taken}")
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
  
close_test = input("Do you want to close the test? (y/n): ")
if close_test.lower() == "y":
  driver.quit()
