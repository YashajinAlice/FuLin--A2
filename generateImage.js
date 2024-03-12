const Canvas = require("canvas")
const Discord = require("discord.js")
const background = "https://cdn.discordapp.com/attachments/1198617751489622027/1216437705471426612/welcome.png?ex=660062e5&is=65edede5&hm=4533a761b7f3e0e8fbc66f7ee666d240aa8965ebd6ce7436a125cf70827d5ca4&"

const dim = {
    height: 576,
    width: 1024,
    margin: 50
}

const av = {
    size: 256,
    x: 630, // x 軸位置也相應地調整
    y: 120  // y 軸位置也相應地調整
}

const generateImage = async (member) => {
    let username = member.user.username
    let discrim = member.user.discriminator
    let memberCount = member.guild.memberCount
    let avatarURL = member.user.displayAvatarURL({format: "png", dynamic: false, size: av.size})

    const canvas = Canvas.createCanvas(dim.width, dim.height)
    const ctx = canvas.getContext("2d")

    // draw in the background
    const backimg = await Canvas.loadImage(background)
    ctx.drawImage(backimg, 0, 0)
/*

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    roundRect(ctx, dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin, 20);
*/
    const avimg = await Canvas.loadImage(avatarURL)
    ctx.save()
    ctx.beginPath()
    ctx.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(avimg, av.x, av.y)
    ctx.restore()
    
        // 繪製成員數量
        ctx.fillStyle = "white"
        ctx.font = "30px Cubic 11";
        var text = "您是第 " + memberCount + " 位蒞臨酒館的客官！";
        var textWidth = ctx.measureText(text).width;
        ctx.fillText(text, 750 - textWidth / 2, 530);
    
/*
    // write in text
    ctx.fillStyle = "white"

*/


    // 繪製使用者名稱

    ctx.fillStyle = "white";
    ctx.font = "50px Cubic 11";
    var text = username;
    var textWidth = ctx.measureText(text).width;
    ctx.fillText(text, 750 - textWidth / 2, 450);
    

/*
    // draw in to the server
    ctx.font = "50px Cubic 11"
    ctx.fillText("憂傷酒館 閻羅王分店", dim.width / 2, dim.height - dim.margin - 130)
*/
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png")
    return attachment
}





/*
//黑色矩形切出圓角
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.fill();
}

*/


module.exports = generateImage