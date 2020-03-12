import Element from './elements.js';
import { createCanvas } from '../common/util.js';
import imageManager from '../common/imageManager';
import computeLayout                   from 'css-layout';

let fntText = `info face="fnt_nuber_Star_Proficiency" size=32 bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1
common lineHeight=60 base=26 scaleW=66 scaleH=81 pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0
page id=0 file="fnt_nuber_Star_Proficiency.png"
chars count=12
char id=48 x=17 y=28 width=16 height=26 xoffset=0 yoffset=34 xadvance=16 page=0 chnl=0 letter="0"
char id=49 x=51 y=0 width=11 height=26 xoffset=0 yoffset=34 xadvance=11 page=0 chnl=0 letter="1"
char id=50 x=34 y=54 width=15 height=26 xoffset=0 yoffset=34 xadvance=15 page=0 chnl=0 letter="2"
char id=51 x=50 y=27 width=15 height=26 xoffset=0 yoffset=34 xadvance=15 page=0 chnl=0 letter="3"
char id=52 x=34 y=0 width=16 height=26 xoffset=0 yoffset=34 xadvance=16 page=0 chnl=0 letter="4"
char id=53 x=17 y=0 width=16 height=27 xoffset=0 yoffset=34 xadvance=16 page=0 chnl=0 letter="5"
char id=54 x=0 y=54 width=16 height=26 xoffset=0 yoffset=34 xadvance=16 page=0 chnl=0 letter="6"
char id=55 x=34 y=27 width=15 height=26 xoffset=0 yoffset=34 xadvance=15 page=0 chnl=0 letter="7"
char id=56 x=0 y=27 width=16 height=26 xoffset=0 yoffset=34 xadvance=16 page=0 chnl=0 letter="8"
char id=57 x=0 y=0 width=16 height=26 xoffset=0 yoffset=34 xadvance=16 page=0 chnl=0 letter="9"
char id=32 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=16 page=0 chnl=0 letter=" "
char id=9 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=128 page=0 chnl=0 letter="	"

kernings count=0`

/**
 * http://www.angelcode.com/products/bmfont/doc/file_format.html
 */
class BitMapFont {
    constructor(src) {
        this.parseConfig(fntText)
        this.texture = imageManager.loadImage('https://res.wx.qq.com/wechatgame/product/webpack/userupload/20200312/fnt_nuber_Star_Proficiency.png', () => {
            console.log(this.texture)
        })
    }

    parseConfig(fntText) {
        fntText = fntText.split("\r\n").join("\n");
        let lines = fntText.split("\n");
        let charsCount = this.getConfigByKey(lines[3], "count");

        let chars = {};
        for (let i= 4; i < 4 + charsCount; i++) {
            let charText = lines[i];
            let letter = String.fromCharCode(this.getConfigByKey(charText, "id"));
            let c = {};
            chars[letter] = c;
            c["x"] = this.getConfigByKey(charText, "x");
            c["y"] = this.getConfigByKey(charText, "y");
            c["w"] = this.getConfigByKey(charText, "width");
            c["h"] = this.getConfigByKey(charText, "height");
            c["offX"] = this.getConfigByKey(charText, "xoffset");
            c["offY"] = this.getConfigByKey(charText, "yoffset");
            c["xadvance"] = this.getConfigByKey(charText, "xadvance");
        }

        console.log(chars)

        return chars;
    }

    getConfigByKey(configText, key){
        let itemConfigTextList = configText.split(" ");

        for (let i = 0 , length = itemConfigTextList.length; i < length; i++) {
            let itemConfigText = itemConfigTextList[i];
            if (key === itemConfigText.substring(0, key.length)) {
                let value = itemConfigText.substring(key.length + 1);
                return parseInt(value);
            }
        }

        return 0;
    }
}

/*new BitMapFont()*/

export default class BitMapText extends Element {
    constructor(opts) {
        let {
            style={},
            props={},
            idName='',
            className='',
            value=''
        } = opts
        super({
            props,
            idName,
            className,
            style,
        });

        this.type = "BitMapText";
        this.ctx  = null;
        this.valuesrc = value;
        this.renderBoxes = []

        Object.defineProperty(this, "value", {
            get : function() {
                return this.valuesrc;
            },
            set : function(newValue){
                if ( newValue !== this.valuesrc) {
                    this.valuesrc = newValue;

                    this.emit('repaint');
                }
            },
            enumerable   : true,
            configurable : true
        });
    }

    insert(ctx, box) {
        this.renderBoxes.push({ ctx, box });

        this.render(ctx, box)
    }

    repaint() {
        this.renderBoxes.forEach( item => {
            this.render(item.ctx, item.box);
        });
    }


    render(ctx, layoutBox) {
        ctx.save();

        const box = layoutBox || this.layoutBox;
        const style = this.style;

        console.log(box, style)

        this.style.width = 200;
        let tree = {
            style: this.parent.style,
            children: [
                {
                    style: this.style
                }
            ]
        }

        computeLayout(tree)
        console.log(1, this.parent)
        console.log(2, this)
        console.log(3, tree)
    }
}