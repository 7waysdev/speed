var fs = require('fs')
var cheerio = require('cheerio');
var parser = require('./vtex-parser')

var ignoreReplace = [/\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/,
    /\.woff(\?.*)?$/, /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/]


var localFilesMap = [{
    regex: /class=\"home\"/g,
    local: 'home.html'
},
{
    regex: /class=\"product\"/g,
    local: 'product.html'
},
{
    regex: /class=\"department\"/g,
    local: 'department.html'
},
{
    regex: /class=\"category\"/g,
    local: 'category.html'
}]

module.exports = {

    localHtml : function (secureUrl) {

        return (req,res,next) => {

          //  let result = req.url.test(ignoreReplace)

            //console.log(result);
            proxiedStatusCode = null
            proxiedHeaders = null
          
            /*
            res.writeHead = (statusCode, headers) =>{
                proxiedStatusCode = statusCode
                proxiedHeaders = headers
            }*/

            if(ignoreReplace.some(rx => rx.test(req.url))){
                return next();
            }

            let data = ''
            let write = res.write
            let end = res.end

            res.write = function(chunk){
                data += chunk
            }

            res.end = function(chunk, encoding){
                if(chunk){
                    data += chunk
                }
                    

                if(data){
                    
                    for( let i = 0; i < localFilesMap.length; i++){
                        var patt = new RegExp(localFilesMap[i].regex);
                        let hasClass = patt.test(data);

                        if(hasClass) {
                            
                            let fileContent = fs.readFileSync(`src/templates/${localFilesMap[i].local}`);
                            let html = fileContent.toString();

                            html= html.replace(/<\s*vtex.cmc.*?>/g,'');
                            html= html.replace(/<\s*vtex:metaTags.*?>/g,'');
                         
                            let newData = parser.parseSubTemplates(html);
                            newData = parser.parsePlaceholders(newData);
                         
                            $ = cheerio.load(data);
                            $('body').html(newData);
                            data =  $.html();
                        }
                    }

                }
                res.write = write
                res.end = end

                /*
                if(proxiedStatusCode && proxiedHeaders)
                    proxiedHeaders['content-length'] = Buffer.byteLength(data)
                if(secureUrl)
                    delete proxiedHeaders['content-security-policy']*/
                res.end(data, encoding);
            }
            next()
        }
    }
}