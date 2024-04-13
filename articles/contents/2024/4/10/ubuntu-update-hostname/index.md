# [Ubuntu 22.04] 使用 hostnamectl 修改主機名稱

在 Ubuntu 13 以前的版本，只能透過修改 `/etc/hostname` + 使用 `hostname` 指令才能修改主機名稱。
在 Ubuntu 13 以後的版本可以透過 `hostnamectl` 的修改主機名稱，且不需要重新啟動系統。

```bash
hostnamectl [OPTIONS...] COMMAND ...

Query or change system hostname.

Commands:
  status                 Show current hostname settings
  hostname [NAME]        Get/set system hostname
  icon-name [NAME]       Get/set icon name for host
  chassis [NAME]         Get/set chassis type for host
  deployment [NAME]      Get/set deployment environment for host
  location [NAME]        Get/set location for host

Options:
  -h --help              Show this help
     --version           Show package version
     --no-ask-password   Do not prompt for password
  -H --host=[USER@]HOST  Operate on remote host
  -M --machine=CONTAINER Operate on local container
     --transient         Only set transient hostname
     --static            Only set static hostname
     --pretty            Only set pretty hostname
     --json=pretty|short|off
                         Generate JSON output

See the hostnamectl(1) man page for details.
```

將主機名稱更改為 u22-1：
```bash
sudo hostnamectl set-hostname u22-1
```

這時候不會立即產生變化，可以使用 `hostnamectl status` 查看有沒有成功
```bash
 Static hostname: u22-1
       Icon name: computer-vm
         Chassis: vm
      Machine ID: 0b3111f00b824a9392a78ba8f2b408ef
         Boot ID: 6bd6a8b76f2c43bf908f71a53f03ab7a
  Virtualization: oracle
Operating System: Ubuntu 22.04.4 LTS
          Kernel: Linux 5.15.0-102-generic
    Architecture: x86-64
 Hardware Vendor: innotek GmbH
  Hardware Model: VirtualBox
  ```

重新啟動後即可發現主機名稱已經修改成功！