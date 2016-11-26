# FinalSourgrape

포트 리다이렉트 하는 법

sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080

sudo service iptables save
