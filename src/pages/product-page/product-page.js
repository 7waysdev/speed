import { BasePage } from '../base-page/base-page'

class ProductPage extends BasePage {

    /*
     * Init()
     * Called automatically when instanced
     */
    init(){
        console.log('works ');
    }

}

let product = new ProductPage('product');