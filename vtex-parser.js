var fs = require('fs')
var replaceArray = [
    {
        regex: /<\s*vtex:contentPlaceHolder.*?>/g,
        str:   `<div class="box-banner">
                    <a href="">
                        <img width="" height="" alt="" src="" />
                    </a>
                </div>`
    },
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
       
        let newData = data.replace(/<\s*vtex:contentPlaceHolder.*?>/g,function(match){
            let rep = match.replace(`<vtex:contentPlaceHolder id="`,``);
            rep = rep.replace(`" />`,``);

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
    }
    
}