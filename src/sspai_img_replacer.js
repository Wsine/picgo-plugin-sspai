function get_sspai_access_token(phone, pwd) {
    return fetch("https://sspai.com/api/v1/user/phone/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "national_area_id": 1,
            "phone": phone,
            "password": pwd
        })
    }).then(res => res.json()).then(res => {
        return res.data.token;
    }).catch(err => {
        console.log(err);
    })
}

function get_qiniu_access_token(sspai_token) {
    return fetch("https://go.sspai.com/api/v1/qiniu", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + sspai_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "filename": "nothing.png",
            "type": "article"
        })
    }).then(res => res.json()).then(res => {
        return res.token;
    }).catch(err => {
        console.log(err);
    })
}

function download_image_from_origin(url) {
    return fetch(url).then(res => res.blob()).then(image => {
        return image;
    }).catch(err => {
        console.log(err);
    })
}

function generate_key(type) {
    var d = new Date();
    var value = Math.floor(Math.random() * 10000000000000);
    var hash = md5(d.getTime() + value);
    var suffix = type.split("/")[1];
    var key = d.getUTCFullYear() + "/" 
            + (d.getUTCMonth() + 1) + "/" 
            + d.getUTCDate() + "/" 
            + hash + "." + suffix;
    return key;
}

function upload_image_to_sspai(token, image) {
    var data = new FormData();
    data.append("token", token);
    data.append("file", image);
    data.append("key", generate_key(image.type));
    return fetch("https://up.qbox.me", {
        method: "POST",
        body: data
    }).then(res => res.json()).then(res => {
        var url = "https://cdn.sspai.com/" + res.key;
        return url;
    }).catch(err => {
        console.log(err);
    })
}

function download_text_as_file(text) {
    var filename = "result.md";
    var blob = new Blob([text], {type: "text/md"});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}