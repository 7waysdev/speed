var fs = require('fs');
var ignoreReplace = [/\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/,
    /\.woff(\?.*)?$/, /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/]

module.exports = {

    localHtml : function () {

        return (req,res,next) => {

          //  let result = req.url.test(ignoreReplace)

            //console.log(result);

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
                    let i = /class=\"home\"/g.test(data);
                    if(i) {
                        data = "<html>:D</html>";
                    }
                }
                res.write = write
                res.end = end
                res.end(data, encoding);
            }
            next()

          
        }
    }
}