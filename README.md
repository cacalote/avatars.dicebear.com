# DiceBear Avatars API-Server

API-Server for [DiceBear Avatars](https://github.com/DiceBear/avatars).  
Check out our API-Server: <https://avatars.dicebear.com>


## Installation

### 1. Download

#### Using git

```
git clone https://github.com/DiceBear/avatars-server.git
```

#### Download archive

- [Master build](https://github.com/DiceBear/avatars-server/archive/master.zip)


### 2. Installation

```
cd avatars-server;
npm install;
```

### 3. Start server

```
npm start
```


## API Routes

### Documentation / Landingpage

```
GET /
```

### Avatars

```
GET /v1/:spriteSet/:seed/:size.png
```

```
:spriteSet => male|female
:seed => string|number
:size => 20 - 200 (px)
```

#### Examples

| Image                                                       | URL                         |
| ----------------------------------------------------------- | --------------------------  |
| ![](http://avatars.dicebear.com/v1/male/john-doe/100.png)   | /v1/male/john-doe/100.png   |
| ![](http://avatars.dicebear.com/v1/male/john-doe/60.png)    | /v1/male/john-doe/60.png    |
| ![](http://avatars.dicebear.com/v1/female/jane-doe/100.png) | /v1/female/jane-doe/100.png |
| ![](http://avatars.dicebear.com/v1/female/jane-doe/60.png)  | /v1/female/jane-doe/60.png  |
