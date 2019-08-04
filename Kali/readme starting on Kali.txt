For complete context-based help see the install documentation in the Install Instructions folder. 

Prerequisites:
Kali with Metasploit on it (should be default)
Install nmap for python 2.7: pip install python-nmap
(http://xael.org/norman/python/python-nmap/)

You need pymetasploit installed
pip install pymetasploit

Then the fixed version:
Install pymetasploit (from forked Miyaakson repo)
git clone https://github.com/xssninja/pymetasploit
Once you have the download change to the directory with setup.py and run this command line> python setup.py install

You also need the fixed msfrpcd library
You should be able to install it using: python msfrpcd.py install

Copy alexapwn6.py and it's compiled config to the directory of your choice. Just keep in mind you'll want it to be available and probably in the path.

---IMPORTANT:---
Open alexapwn6cfg.py edit the URLs to point to the PHP queue file locations.  Then COMPILE IT when you're done! See instructions on page 39 of Installation Instructions for more details. In short, you can edit the file as needed then save it and compile with: 
python -m py compile alexapwn6cfg.py
Once in .pyc format it will be automatically imported by Alexapwn6.py when it runs.

Keep in mind that whatever PHP server you run the Kali_Read.php and Kali2Alexa.php and AlexaRead.php
and Alexa2Kali.php files from needs to have a publicly reachable IP or domain so that your Alexa can
make calls from the cloud to reach it. Your Kali instance will also need to have external network access to
reach the site that you host your queue in.  
Also important is that your site will need to serve these files via HTTPS which means you either need to buy
a cert for your web site (usually about $200 / year) or get one free using Let'sEncrypt configuration. Some 
hosting sites make Let'sEncrypt configuration somewhat automated. I haven't had much luck with
GoDaddy and that, but it's been a while since I've tried.
When you edit the Alexapwn.py file NOTE: these two lines in the alexapwn.py file need to be changed to
point to the hosing URL of your files. 
urlfromAlexa = 'https://www.blah.co/Kali_Read.php'
urltoAlexa = 'https://www.blah.co/Kali2Alexa.php'
---

After installation of the libraries:
1) Open a terminal and run: msfrpcd -S -f -U msf -P test
** note that msfrpcd times out periodically as a motivator for buying the software **

2) Open a second terminal and run: python alexapwn.py
If you are debugging you can run: python -i alexapwn.py
** note, you may want to restart this when you restart your msfrpcd as it will reconnect
and it's assigned new temporary access tokens. Give msfrpcd about a 20 second head start
on coming up or you'll immediately get an error in alexapwn.py
If everything is in place the program will execute and wait for a command from Alexa without throwing an error.
To interrupt the program use Ctrl-C.

3) While you're working with MSFRPCd you'll find that it times out periodically. I believe it's hobbled
for the sake of helping you prefer Metasploit paid versions. I recommend if you're going to use this 
long term is to either script the startup of MSFRPCd so that it spins up before you need it, or go ahead
and invest in a great product and buy Metasploit because it's awesome.

Enjoy!
10rdV4d3r




