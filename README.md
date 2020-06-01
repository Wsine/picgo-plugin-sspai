# PicGo plugin for sspai

This repository is a [PicGo](https://github.com/PicGo/PicGo-Core) plugin implementation for conveniently and quickly uploading images to [SSPAI](sspai.com) website.

## How to install

1. Clone/Download this repository to PicGo configuration folder.

In windows, it's `C:\Users\<your username>\.picgo\`

In linux and mac, it's `~/.picgo/`

2. Create a folder named `node_modules` and make a soft link to this repository.
3. Edit `package.json` with dependencies.

```json
{
  "dependencies": {
    "picgo-plugin-sspai": "file:picgo-plugin-sspai"
  }
}
```

4. Edit `package-lock.json` like this.

```json
{
  "name": "picgo-plugins",
  "requires": true,
  "lockfileVersion": 1,
  "dependencies": {
    "picgo-plugin-sspai": {
      "version": "file:picgo-plugin-sspai"
    }
  }
}
```

The final structure should be like this.

```bash
~/.picgo > tree
.
├── config.json
├── node_modules
│   └── picgo-plugin-sspai <soft link>
├── package.json
├── package-lock.json
├── picgo.log
└── picgo-plugin-sspai
    ├── index.js
    ├── License
    ├── md5.min.js
    ├── package.json
    └── README.md
```

## How to config

Login in to your account in [sspai.com](sspai.com) website.

Press F12 to open the console and the type:

```javascript
document.cookie.split('; sspai_cross_token=').pop().split(';').shift()
```

Replace the `cross_token` with the return string in `config.json`

Example config file in PicGo.

```json
{
  "picBed": {
    "current": "sspai",
    "uploader": "sspai",
    "transformer": "base64",
    "sspai": {
      "cross_token": "<replace here>"
    }
  },
  "picgoPlugins": {
    "picgo-plugin-sspai": true
  }
}
```

That's all and enjoy !
