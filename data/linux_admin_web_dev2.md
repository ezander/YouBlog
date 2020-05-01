Part 1 of this series explored the Linux command line basics necessary for working with the Linux operating system. We covered working with files and directories as well as handling packages. Part 2 will concentrate on commands needed to deploy, connect to, interact with, and maintain web servers.

## Working With Linux: Deploying and Maintaining a Web Server

Deploying a web server on Linux is very straightforward; almost anyone can do it by following an online guide. However, being responsible for a web server involves additional work. Some of the tasks involved are described below.

## Setting Up an Apache Web Server and Working with Processes

First, we’ll look at installing an Apache web server on a Centos 7 machine. To do this, use the “yum install httpd” command (“httpd” is the package name for the Centos distributions). You will need to confirm the installation by pressing “y”. You might need to prepend all the commands with “sudo” in order to have the proper permissions to work with processes; alternately, you can work as the root user. 

After the setup is complete, check the Apache process by issuing “sudo systemctl status httpd”.

Linux 2 image 1

The above screenshot shows that the process has not been started yet, so get it going with “sudo systemctl start httpd”.

Linux 2 image 2

Now that your Apache server is running, you can open the browser and try to open the website being served. You will need to know the IP address to do this. If you don’t already have it, “curl icanhazip.com” will return your public IP address. When you open that address, you will see the following page:

Linux 2 image 3

This process is a basic setup that will get your web server up and running. Later on, you might want to look into setting up virtual hosts.

If, for any reason, you need to restart your Apache server (which might be necessary after updating your web server configuration), you can do so with “sudo systemctl restart httpd”. You can stop it with “sudo systemctl stop httpd”.

Apache is running as one of the many processes on your server. When you need to look at these processes, the “top” command will show you a list of them, including process ID, the user that is running the process, the command that has been used to run the process, CPU and memory usage, and other useful details that might come in very handy for troubleshooting later on.

Linux 2 image 4

## Making SSH Connections to a Web Server

As a Linux administrator, “ssh” is one of those commands you can’t live without. It uses the SSH (Secure Shell) protocol to provide a secure, encrypted connection between the two different hosts. You will find yourself employing it frequently to connect to a remote server. It can also be used to generate key pairs or securely transfer files.

A very simple example of the “ssh” command is “ssh root@33.205.107.72”, which will initiate a connection to the remote host on the IP 33.205.107.72 as a root user. Before you are allowed to connect, you will be prompted for a password for that user. Alternatively, you can use the ssh key (if it is already set up on the remote machine) and the “-i” flag. The command “ssh -i privateKey root@33.205.107.72” would look for the matching public key within the root user’s authorized key file and allow access.

## Interacting with a Web Server

Often, you will need to interact with a web server, whether you want to copy some data to or from it or simply query some information. Two of the tools used to do this are “scp” and “curl.”

## Secure Data Copy Using “scp”

The “scp” command is used to securely copy data (by relying on SSH protocol) from one location to another—most likely between a local system and the remote web server. Both the password and the data itself is encrypted in this process.

To use this command properly, you have to input the user and the address of the host for the source of the file you want to copy as well as the user and the host for the destination where you want to copy the file to. The command will look like this: “scp user@sourceHost:file user@destinationHost:file”.

Some of the most common flags you can use here are “-P”, which is used to set the SSH port for the remote host (if you are not using the default 22), and “-r”, which recursively copies data (when you want to copy the entire directory structure).

An alternative to using “scp” is using “rsync”. In addition to copying the file, it checks for timestamps and file sizes as well. This makes sure that the data is copied only when necessary.


## Interacting with a Web Server Using “curl”

CURL (Client URL) is a tool for sending or receiving data using the URL syntax. It has various use cases, including querying an HTTP header, using a proxy, storing and sending cookies, making a POST request with desired parameters, and downloading and uploading files.

Using just “curl www.example.com” will give you the content of the URL. If you use the “-I” flag, (e.g., “curl -I www.example.com”), you will query the HTTP headers of the URL instead. When the “-L” flag is used, curl will follow any redirection by redoing the request.

To download a file using curl, you can use “-o” or “-O” flags. The latter command saves the file under the same name and in the current working directory, while the former allows you to specify the name and the destination to which you will download the file.

If you want to make a POST request using specific parameters, use “curl –data ‘parameter1=foo&parameter2=bar’ https://www.example.com/info.php”.

## Maintaining a Web Server

A common task is making sure that the web server’s disk is not full, since this situation can lead to the entire server working very slowly or even crashing. A disk can fill when your logs quickly accumulate. To find out what is going on, use the “df -h” command. The “-h” flag stands for “human readable,” and it shows the sizes of files using common formats. 

Linux 2 image 5

In the above example, our web server has just been deployed, and there is very little disk usage. You can also see here whether or not the root volume (which is often the one you want to focus on) has reached its limit. The root volume is always mounted under “/”, as seen in the last column.

Additionally, you might need to know which directory or subdirectory is taking up space on your web server. Most of the time, the culprit is /var/log, the location where logs are stored, but other locations can use substantial storage space as well. A very useful command in this situation is “du -sh *”, which you should run from the root directory.

Linux 2 image 6


This command will list all of the directories and their disk usage. When you see a directory that is consuming a lot of storage, you can “cd” into it and issue the command again until you find the subdirectory that is responsible for the problem.

And, if you do have issues with logs taking up too much space, you might want to look into the “logrotate” tool, which allows you to effectively manage log files on Linux. By default, you will find the logs in the “/var/log/httpd” subdirectory.

## Linux Admin and Media Temple

In today’s market, DevOps is becoming the new norm, and one must understand both operational and developmental skill sets to succeed. At Media Temple, many of our products either require or could use practical knowledge of Linux administration in order to get the most out of them. For instance, knowing how to install an Apache web server is essential for our DV Developer product if you intend to use it to host your website. Having a good knowledge on SSH connections to a web server can help you improve workflows and introduce automations to all of our products such as DV Managed (VPS hosting), Managed WordPress, Grid (shared hosting), and Managed Services for AWS. Lastly, understanding how to use a “scp” command or “curl” will also enable you to efficiently and securely send and receive data across our products.

Media Temple does offer an Advanced Support subscription service where technical experts can manage Linux administration for clients who either do not know how to work with it or prefer not to.


In this two-part series on Linux administration for web developers, you have seen some of the commands you are most likely to use on a daily basis. And while these are only the basics, and there is certainly a lot more to learn about Linux administration, they are enough to help you get the job done. Of course, for those of you that want to do more than simply complete a task, this article should serve as a stepping stone to advanced commands and bleeding edge DevOps tools.
