# Xhr-upload-progress Network Interrupt Issue

This repo is used to describe the strange behavior of xhr upload progress.

Check this issue [Wrong upload progress when network interrupts · Issue #361 · whatwg/xhr (github.com)](https://github.com/whatwg/xhr/issues/361).


## Problem

[We can monitor the xhr upload progress with `loaded` and `total`.](https://stackoverflow.com/questions/76976/how-to-get-progress-from-xmlhttprequest/3694435#3694435)

[XMLHttpRequest Upload Standard (whatwg.org)](https://xhr.spec.whatwg.org/#xmlhttprequestupload)

However, if network error occures  during the upload, the `loaded` grows fastly and reach `total`, which is out of my expect.

## How to reproduce

```
npm install
npm run demo
```

Chrome open http://localhost:3000/

F12 go to devtool, network pannel.

Set network to 'Slow 3G' (this makes sure the upload progress will not terminate too quickly)

 ![image-20221110230734859](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/image-20221110230734859.png)

Go to main page and choose a large file(10M or larger) and click the upload button, it will make a XMLHttpRequest to upload the file.

Set the network to 'Offliine' before the request finish.

![image-20221110231531542](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/image-20221110231531542.png)

Then go to console pannel, check the output.

![image-20221110232527031](https://raw.githubusercontent.com/weihongliang233/My-Markdown-Figures/master/image-20221110232527031.png)

In this picture, the network offline happens at about 0.8%, after the offline event, the transfered part grows fastly and reach 100%. Then the error was catched.

Below is my code.

```js
var file = document.getElementById("uploadfile");
var fd = new FormData();
fd.append("upload", file.files[0]);


client.upload.addEventListener("progress", (e) => {
    console.log(`Current Transfer: ${e.loaded/e.total*100}%`);
});
client.addEventListener("error", (e) => {
    console.log('Error Occured')
})
client.open("post", '/fileupload', true);
client.setRequestHeader("Content-Type", "multipart/form-data");
client.send(fd);
```

## Similar issue

[Wrong upload progress event raising · Issue #127 · whatwg/xhr (github.com)](https://github.com/whatwg/xhr/issues/127)

[javascript - XMLHttpRequest wrong progress - Stack Overflow](https://stackoverflow.com/questions/42516195/xmlhttprequest-wrong-progress)

## Discuss

 The [documentation](https://xhr.spec.whatwg.org/#suggested-names-for-events-using-the-progressevent-interface) mentions that the error event will be dispatched "After the last progress has been dispatched", which means the progress `loaded/total` will grow to 100% even if the network interrupts. 

If someone builds a progress bar indicating the upload progress and then the network interrupts, then the progress bar will immediately grow to 100%. I think it is quite a strange behavior. 

My expect: Network interrupts, the upload progress terminates immediately, the `loaded` immediately stop growing and stuck to current value, then the error event occurs.

Could anyone explain why the `loaded/total` is designed to grow to 100% even if the network interrupts? And how can i build a progress bar which will stuck immediately when the network interrupts.

