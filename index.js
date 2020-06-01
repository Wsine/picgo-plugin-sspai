const fs = require('fs')
const md5 = require('./md5.min')

const config = (ctx) => {
  let userConfig = ctx.getConfig('picBed.sspai')
  if (!userConfig) {
    userConfig = {}
  }
  const config = [
    {
      name: 'cross_token',
      type: 'input',
      default: userConfig.cross_token || '',
      required: true
    }
  ]
  return config
}

const generate_key = (filename) => {
  var d = new Date()
  var value = Math.floor(Math.random() * 10000000000000)
  var hash = md5(d.getTime() + value)
  var suffix = filename.split('.').pop()
  var key = d.getUTCFullYear() + '/'
          + (d.getUTCMonth() + 1) + '/'
          + d.getUTCDate() + '/'
          + hash + '.' + suffix
  return key
}

const handle = async (ctx) => {
  let cross_token = ctx.getConfig('picBed.sspai.cross_token')
  if (!cross_token) {
    throw new Error('Can\'t find sspai config')
  }
  try {
    const res = await ctx.Request.request({
      method: 'POST',
      url: 'https://go.sspai.com/api/v1/qiniu',
      headers: {
        'Authorization': 'Bearer ' + cross_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: 'nothing.png',
        type: 'article'
      })
    })
    const qiniu_token = JSON.parse(res).token

    let output = []
    const imgList = ctx.output
    for (let i in imgList) {
      const res = await ctx.Request.request({
        method: 'POST',
        url: 'https://up.qbox.me',
        formData: {
          token: qiniu_token,
          key: generate_key(imgList[i]),
          file: {
            value: fs.createReadStream(imgList[i]),
            options: {
              filename: imgList[i].split('\\').pop(),
              contentType: 'image/jpg'
            }
          }
        }
      })
      const body = JSON.parse(res)
      if (body.key) {
        output.push({
          fileName: imgList[i],
          width: body.w,
          height: body.h,
          extname: imgList[i].split('\\').pop(),
          url: 'https://cdn.sspai.com/' + body.key,
          imgUrl: 'https://cdn.sspai.com/' + body.key
        })
      } else {
        ctx.emit('notification', {
          title: '上传失败',
          body: res.body.msg
        })
        throw new Error('Upload failed')
      }
    }
    ctx.output = output

    return ctx
  } catch (err) {
    if (err.message !== 'Upload failed') {
      const error = JSON.parse(err.response.body)
      ctx.emit('notification', {
        title: '上传失败',
        body: error.error
      })
    }
    throw err
  }
}

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register('sspai', {
      handle,
      config: config
    })
  }
  return {
    uploader: 'sspai',
    register
  }
}