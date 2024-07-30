# Setup MangoDB
## Introduction
MongoDB 4.4 is still required by some software even though it is now deprecated. With Ubuntu 20.04 going into the end of life in the near future, upgrading to the newer version of Ubuntu is becoming important for the security of your server in the future. However, MongoDB 4.4 does not support Ubuntu 22.04 natively. Fortunately, a workaround is possible, allowing you to run MongoDB 4.4 on your server.
## Prerequisites
Before beginning make sure to have these things completed:
- Installation of Ubuntu 22.04 server.
- A user with sudo access.
- Up to date package list.

This can be achieved using:
```bash
    udo apt update`
```

## Linux Installation
Begin by installing by Libssl 1.1 which is needed by MongoDB without it your will get an error.

As there is no install candidate on Ubuntu 22.04, we need to add the package to the package list.

This list from Ubuntu 20.04 contains the package we need.
```bash
    echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/focal-security.list
```
Next, we will need to update the package manager to include this package:
```bash
        sudo apt update
```
Now install the package:
```bash
    sudo apt-get install libssl1.1
```
After the installation has completed, remove the package list as it is no longer necessary.
```bash
    sudo rm /etc/apt/sources.list.d/focal-security.list
```
Now that the dependancy is installed, begin installing MongoDB 4.4.

First we need add another package list to the package manager in order to download Version 4.4 of MongoDB.

Add the MongoDB key:
```bash
    curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```
```bash
    Output:
   
    Warning: apt-key is deprecated. Manage keyring files in trusted.gpg.d instead (see apt-key(8)).
    OK
```
Add the package list:
```bash
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```
Update the package manager to incorparate the list:
```bash
    sudo apt-get update
```
Now install MongoDB 4.4:
```bash
    sudo apt-get install mongodb-org -y
```
Verify the installation alongside version:
```bash
    mongod --version
```
```bash
   Output:

    db version v4.4.29
    Build Info: {
        "version": "4.4.29",
        "gitVersion": "f4dda329a99811c707eb06d05ad023599f9be263",
        "openSSLVersion": "OpenSSL 1.1.1f  31 Mar 2020",
        "modules": [],
        "allocator": "tcmalloc",
        "environment": {
            "distmod": "ubuntu2004",
            "distarch": "x86_64",
            "target_arch": "x86_64"
        }
    }
```
Finally, start the service:
```bash
    sudo systemctl start mongod
    sudo systemctl enable mongod
    sudo systemctl status mongod
```
The output should look as follows
```bash
    Output:
    
    mongod.service - MongoDB Database Server
        Loaded: loaded (/lib/systemd/system/mongod.service; enabled; vendor preset: enabled)
        Active: active (running) since Fri 2024-06-28 23:52:35 CEST; 19s ago
        Docs: https://docs.mongodb.org/manual
    Main PID: 3438072 (mongod)
        Memory: 62.6M
            CPU: 926ms
        CGroup: /system.slice/mongod.service
                └─3438072 /usr/bin/mongod --config /etc/mongod.conf
```



## Clean Uninstall 
Stop MongoDB process:
```bash
    sudo service mongod stop
```
Completely remove the installed MongoDB packages:
```bash
    sudo apt-get purge mongodb-org*
```
Remove the data directories, MongoDB database(s), and log files:
```bash
    sudo rm -r /var/log/mongodb /var/lib/mongodb
```
To check if MongoDB is successfully uninstalled, type:
```bash
    service mongod status
```

- sudo apt remove mongodb
- sudo apt purge mongodb
- sudo apt autoremove

- Also remove the apt-key in Softawres Update.

## Install Mangoose
1. Update npm
```bash
    npm install -g npm
```
2. Clear npm cache
```bash
    npm cache clean --force
```
3. Use another npm registry
```bash
    pm install mongoose --registry=https://registry.npmjs.org/
```
4. Verifying the installation
Run the bot and verify that the database connects.

## Conclusion
With the successful installation of MongoDB 4.4 on Ubuntu 22.04, your be able to run software that has not updated to the latest version of MongoDB.

MongoDB 5 and later require AVX to run. You can check if your CPU supports AVX by doing:
```bash
    cat /proc/cpuinfo | grep avx
```
If you get any kind of output your CPU should support AVX, if not its either too old or if you are running inside a VM and your hypervisor isn't passing through your physical CPU flags.

That's why we downgraded to MongoDB 4 which still runs without AVX but is end of life.