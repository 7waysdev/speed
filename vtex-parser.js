var fs = require('fs')
var replaceArray = [
    {
        regex: /<\s*vtex.cmc:newsletterOptIn.*?>/g,
        str:   `<div class="newsletter" id="NewsLetter_594549">
                    <h3 class="newsletter-title">novidades</h3>
                    <fieldset>
                    <p>Receba novidades e promoções por email:</p>
                    <input id="newsletterClientName" onfocus="newsSelect(this,'Digite seu nome');" onblur="newsLeave(this,'Digite seu nome');" class="newsletter-client-name" value="Digite seu nome" size="20" type="text" name="newsClientName">
                    <input id="newsletterClientEmail" onfocus="newsSelect(this,'Digite seu e-mail');" onblur="newsLeave(this,'Digite seu e-mail');" class="newsletter-client-email" value="Digite seu e-mail" size="20" type="text" name="newsletterClientEmail">
                    <input id="newsletterButtonOK" class="btn-ok newsletter-button-ok" value="ok" type="button" name="newsletterButtonOK" onclick="newsButtonClick('NewsLetter_594549')">
                    <input id="newsletterLoading" type="hidden" class="newsletter-loading" value="Processando...">
                    <input id="newsletterSuccess" type="hidden" class="newsletter-success" value="Obrigado por se cadastrar na Loja Exemplo!">
                    <input id="newsletterSuccess2" type="hidden" class="newsletter-success2" value="Em breve entraremos em contato com você para oferecer as melhores promoções.">
                    <input id="newsletterError" type="hidden" class="newsletter-error" value="
                    Encontramos um erro no cadastro de suas informações.<br />Por favor, tente novamente!
                    ">
                    <input id="newsInternalPage" type="hidden" value="_teste_">
                    <input id="newsInternalPart" type="hidden" value="newsletter">
                    <input id="newsInternalCampaign" type="hidden" value="newsletter:opt-in">
                    </fieldset>
                    <span class="rt"></span>
                    <span class="rb"></span>
                    <span class="lb"></span>
                    <span class="lt"></span>
                </div>`
    },
    {
        regex:  /<\s*vtex.cmc:departmentLinks.*?>/g,
        str: `<ul class="menu">
                <li class="menu-plugins"><a href="http://vtex.vtexcommercestable.com.br/plugins">Plugins</a></li>
                <li class="menu-departamento-exemplo"><a href="http://vtex.vtexcommercestable.com.br/departamento-exemplo">Departamento Exemplo</a></li>
            </ul>`
    },
    {
        regex: /<\s*vtex.cmc:departmentNavigator.*?>/g, 
        str: `<div class="menu-departamento"><span class="rt"></span><span class="rb"></span>
                <h3 class="plugins"><span></span><a class="menu-item-texto" href="http://vtex.vtexcommercestable.com.br/plugins">Plugins</a></h3>
                <ul class="plugins"></ul>
                <h3 class="departamento-exemplo even"><span></span><a class="menu-item-texto" href="http://vtex.vtexcommercestable.com.br/departamento-exemplo">Departamento Exemplo</a></h3>
                <ul class="departamento-exemplo even">
                    <li><a href="http://vtex.vtexcommercestable.com.br/departamento-exemplo/vestuario">Vestuario</a></li>
                    <li><a href="http://vtex.vtexcommercestable.com.br/departamento-exemplo/eletronicos">Eletronicos</a></li>
                    <li><a href="http://vtex.vtexcommercestable.com.br/departamento-exemplo/acessorios">Acessorios</a></li>
                </ul>
                <div class="brandFilter">
                    <h3>Marcas</h3>
                    <ul>
                        <li><a href="http://vtex.vtexcommercestable.com.br/marca-exemplo">Marca Exemplo</a></li>
                    </ul>
                </div>
            </div>`
    },
    {
        regex:  /<\s*vtex.cmc:ProductImage.*?>/g, 
        str:   `<div class="apresentacao">
                    <div id="setaThumbs"></div>
                    <div id="show">
                        <div id="include">
                            <div id="image" productIndex="0">
                                <img productIndex="0" width="100%" class=id="image-main" class="sku-rich-image-main" src="http://www.placehold.it/300" alt="bomba" title="bomba" />
                            </div>
                        </div>
                        <ul class="thumbs"> 
                            <li>
                                <a id='botaoZoom' href='javascript:void(0);' title='Zoom' rel='http://www.placehold.it/300' zoom=''>
                                    <img src='http://www.placehold.it/300' title='bomba' alt='bomba'/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>`
    },
    {
        regex: /<\s*vtex.cmc:productReference.*?>/g, 
        str: "#XXXXX" 
    },
    {
        regex: /<\s*vtex.cmc:brandName.*?>/g, 
        str: "MARCA"

    },
    {
        regex: /<\s*vtex.cmc:productName.*?>/g,
        srt: "Product Name"
    },
    {
        regex: /<\s*vtex.cmc:productDescriptionShort.*?>/g,
        str:   `<div class="productDescription">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>`
    },
    {
        regex: /<\s*vtex.cmc:ProductDescription.*?>/g,
        str:   `<div class="productDescription">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </div>`
    }
]

module.exports = {

    parseSubTemplates : function(data) {

        let newData = data.replace(/<\s*vtex:template.*?>/g,function(match){

            let rep = match.replace(`<vtex:template id="`,``);
            rep = rep.replace(`" />`,``);
            let html = '';
            
            try {
                let fileContent = fs.readFileSync(`src/sub-templates/${rep}.html`);
                html = fileContent.toString();
            } catch(err){
                html = '';
                return html;
            }

            return html;
        });

        return newData;
    },

    parsePlaceholders : function(data){
       
        console.log("parsePlaceHolders");
        let newData = data.replace(/<\s*vtex:contentPlaceHolder.*?>/g,function(match){

            console.log("match");
            console.log(match);

            let rep = match.replace(`<vtex:contentPlaceHolder id="`,``);
            rep = rep.replace(`" />`,``);

            console.log(rep);
            let html = '';

            try {
                let fileContent = fs.readFileSync(`src/placeholders/${rep}.html`);
                html = fileContent.toString();
            } catch(err){
                html = '';
                return html;
            }

            return html;
        });

        return newData;
    },

    parseVtexCmc : function(html){

        let newHtml = html;
        for(let i = 0; i < replaceArray.length; i++){
            newHtml = newHtml.replace(replaceArray[i].regex,replaceArray[i].str);
            console.log(replaceArray[i].regex);
        }
        
        newHtml = newHtml.replace(/<\s*vtex.cmc.*?>/g,'');

        return newHtml;
    }
    
}