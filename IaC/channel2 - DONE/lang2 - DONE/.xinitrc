# Works with vncserver
set -x
exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>/tmp/xinitrc_lang2.out 2>&1

export DISPLAY=:20
# Start the D-Bus session
if test -z "$DBUS_SESSION_BUS_ADDRESS" ; then
     eval `dbus-launch --sh-syntax --exit-with-session`
     echo "D-Bus per-session daemon address is: $DBUS_SESSION_BUS_ADDRESS"                
fi

exec icewm-session&
export PATH=/home/lang2/.local/bin:/home/lang2/.nvm/versions/node/v18.15.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin

xsetroot -solid grey
export XKL_XMODMAP_DISABLE=1

xset s off
xset s noblank

# Cleanup the logs folder - can we improve this with a better logrotate?
echo "FS clean up"
#(sudo /usr/local/sbin/cleanup_fs.sh 30 /var/log/ |sudo tee /root/file_deleted&)

echo "Check the FS"
available=$(df / --output=pcent| tail -1| tr -d "%")
#[ "$available" -le 20 ] && xterm -e "figlet -f banner 001 Call the support ; sleep 15; exit"

echo "Pulse config"
logger "Pulse config"
#sleep 30 # ADD to check when jitsi is ready
pulseaudio -D -vvv --start # something is starting pulseaudio before this one. -k is needed to restart it

#pacmd load-module module-null-sink sink_name=recording sink_properties=device.description=recording &
#pacmd load-module module-combine-sink sink_name=combined sink_properties=device.description=combined slaves=recording,alsa_output.usb-Creative_Technology_Ltd_Sound_Blaster_Play__3_00252407-00.analog-stereo &
#pacmd load-module module-loopback source=alsa_input.usb-Creative_Technology_Ltd_Sound_Blaster_Play__3_00252407-00.analog-stereo sink=recording &

env > /home/lang2/pa_list
pactl list short sources >> /home/lang2/pa_list

echo "Start the Backend app"
#cd /home/lang2/jitsi_gemeinde_backend
#npm start &
#sleep 3

# Try to set Chromium to a normal start
sed -si 's/exit_type\":\"Crashed/exit_type\":\"none/' ~/.config/chromium/Default/Preferences

echo "Start chromium Kiosk"
/usr/bin/chromium --app=http://translation.sennsolutions.com/eng # --app=http://localhost:5000 # --kiosk
exec xterm
